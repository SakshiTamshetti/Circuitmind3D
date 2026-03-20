import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let currentModel;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function initViewer() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 0, 5);

    const mount = document.getElementById('viewport-mount');
    if (!mount) {
        console.error("Viewport mount not found!");
        return;
    }

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth || window.innerWidth, mount.clientHeight || window.innerHeight);
    mount.innerHTML = ''; 
    mount.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    window.addEventListener('resize', () => {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
    });

    animate();
}
window.initViewer = initViewer;

export function loadModel(path) {
    const loader = new GLTFLoader();
    console.log("Attempting to load model from:", path);

    const onModelLoaded = (gltf) => {
        if (currentModel) scene.remove(currentModel);

        const innerModel = gltf.scene;

        // Calculate original box to find the center
        const box = new THREE.Box3().setFromObject(innerModel);
        const center = box.getCenter(new THREE.Vector3());
        
        // Shift inner model so its visual center is at (0, 0, 0)
        innerModel.position.sub(center);

        // Put it in a wrapper
        currentModel = new THREE.Group();
        currentModel.add(innerModel);

        // SCALE based on original box size
        const size = box.getSize(new THREE.Vector3()).length();
        const targetScale = 3 / size;
        
        // Start from scale 0 for animation
        currentModel.scale.set(0, 0, 0);
        scene.add(currentModel);

        // Animate up
        if (window.gsap) {
            gsap.to(currentModel.scale, {
                x: targetScale, y: targetScale, z: targetScale,
                duration: 0.8,
                ease: "power3.out"
            });
        } else {
            currentModel.scale.setScalar(targetScale);
        }

        // CAMERA AUTO FIT
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        if (controls) {
            controls.target.set(0, 0, 0);
            controls.update();
        }

        console.log("MODEL LOADED ✅", path);

        const objInfo = document.getElementById('objInfo');
        if (objInfo) objInfo.textContent = path.split('/').pop();
    };

    if (currentModel && window.gsap) {
        // Animate out current model before loading new one
        gsap.to(currentModel.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                loader.load(path, onModelLoaded, undefined, (err) => console.error("MODEL LOAD ERROR ❌", err));
            }
        });
    } else {
        loader.load(path, onModelLoaded, undefined, (err) => console.error("MODEL LOAD ERROR ❌", err));
    }
}
window.loadModel = loadModel;

function highlightObject(obj) {
    if (!obj || !obj.isMesh) return;
    
    // Original color backup
    if (!obj.material._originalEmissive) {
        obj.material._originalEmissive = obj.material.emissive ? obj.material.emissive.getHex() : 0x000000;
    }
    
    // Highlight effect
    if (obj.material.emissive) {
        obj.material.emissive.setHex(0x3b82f6); // Scientific Blue
        setTimeout(() => {
            obj.material.emissive.setHex(obj.material._originalEmissive);
        }, 1200);
    }
}

function zoomToObject(obj) {
    if (!obj || !controls) return;

    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

    cameraZ *= 2.2; // Perspective factor

    // Update target and zoom
    controls.target.copy(center);
    camera.position.set(center.x, center.y, center.z + cameraZ);
    camera.lookAt(center);
    controls.update();
}

window.highlightObject = highlightObject;
window.zoomToObject = zoomToObject;

window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (!currentModel) return;

    const intersects = raycaster.intersectObjects(currentModel.children, true);

    if (intersects.length > 0) {
        const clicked = intersects[0].object;
        let partName = clicked.name;

        if (!partName || partName.toLowerCase().includes("mesh")) {
            partName = clicked.parent?.name || "Unknown Part";
        }

        console.log("Clicked:", partName);

        // Fast UX: Zoom + Explain
        window.zoomToObject(clicked);
        window.highlightObject(clicked);

        if (window.handlePartClick) {
            window.handlePartClick(partName);
        }
    }
});

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}
