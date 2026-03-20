// Hierarchical exploration data
const topics = {
  computer: {
    model: "/assets/models/pc.glb",
    title: "Computer Hardware",
    cat: "System View",
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
    parts: ["USB Ports"],
    detailed: {
      "USB Ports": "/assets/models/motherboard/usb_ports.glb"
    }
  },
  
  heart: {
    model: "/assets/models/heart.glb",
    title: "Human Heart",
    cat: "Biological System",
    parts: ["L. Ventricle", "R. Ventricle", "Aorta"],
    detailed: {}
  },

  atom: {
    model: "/assets/models/atom.glb",
    title: "Carbon Atom",
    cat: "Atomic Level",
    parts: ["Nucleus", "L Shell (4e)"],
    detailed: {}
  }
};

// Export to window for global access
window.topics = topics;
