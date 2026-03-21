// Hierarchical exploration data
const topics = {
  computer: {
    model: "/assets/models/pc.glb",
    title: "Computer Hardware",
    cat: "System View",
    desc: "A complete desktop PC system. Its modular architecture is unique, allowing components like the GPU and RAM to be easily upgraded to continuously scale performance.",
    parts: [
      "CPU",
      "GPU",
      "RAM",
      "Storage",
      "Power Supply",
      "Cooling System",
      "Motherboard"
    ],
    detailed: {
      "CPU": "/assets/models/cpu.glb",
      "GPU": "/assets/models/gpu.glb",
      "RAM": "/assets/models/ram.glb",
      "Storage": "/assets/models/storage.glb",
      "Power Supply": "/assets/models/power_supply.glb",
      "Cooling System": "/assets/models/liquid_cooler.glb",
      "Motherboard": "/assets/models/motherboard/motherboard.glb"
    }
  },

  motherboard: {
    model: "/assets/models/motherboard/motherboard.glb",
    title: "Motherboard",
    cat: "Component View",
    desc: "The main printed circuit board. It uniquely acts as the central nervous system of the computer, providing data pathways that perfectly sync the CPU, RAM, and peripherals.",
    parts: ["USB Ports"],
    detailed: {
      "USB Ports": "/assets/models/motherboard/usb_ports.glb"
    }
  },
  
  heart: {
    model: "/assets/models/human_heart/beating-heart.glb",
    title: "Human Heart",
    cat: "Biological System",
    desc: "The central pump of the circulatory system. It is uniquely driven by its own internal electrical pacing system, allowing it to beat autonomously and continuously for a lifetime without conscious thought.",
    parts: ["Left Ventricle", "Right Ventricle", "Atrium", "Valves"],
    detailed: {
      "Left Ventricle": "/assets/models/human_heart/left_ventricle.glb",
      "Right Ventricle": "/assets/models/human_heart/right_ventricle.glb"
    }
  },

  atom: {
    model: "/assets/models/atom/atom.glb",
    title: "Carbon Atom",
    cat: "Atomic Level",
    desc: "The fundamental building block of all known life. Its unique tetravalent electron structure allows it to powerfully form four stable covalent bonds, making geometrically endless molecular variations possible.",
    parts: ["Nucleus", "Electrons", "Orbitals"],
    detailed: {
      "Nucleus": "/assets/models/atom/nucleus.glb",
      "Electrons": "/assets/models/atom/electrons.glb"
    }
  }
};

// Export to window for global access
window.topics = topics;
