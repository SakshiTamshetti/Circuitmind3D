/* ═══ data.js — component data & model metadata ═════════════
   COMP_DATA: per-model component list shown in the right panel.
   PD:        per-model spec rows, perf bars, and display info.

   TO ADD A NEW MODEL:
     1. Add an entry to COMP_DATA:
          COMP_DATA.MyModel = [
            { name: 'Part A', desc: '...', specs: [{k:'Key',v:'Val'}] }
          ];
     2. Add an entry to PD:
          PD.MyModel = {
            title: 'My Model — Subtitle',
            cat: 'Category · Sub',
            catFull: 'Category',
            ico: 'i-cpu',
            s: ['spec1','spec2','spec3','spec4','spec5'],
            chips: COMP_DATA.MyModel,
            obj: '100 faces · 200 verts',
            perf: [80, 90]   // or null to hide bars
          };
     3. Add a sidebar .aitem in index.html (viewer sidebar).
     4. Add the key to selModelMap in model.js.
═══════════════════════════════════════════════════════════ */

var COMP_DATA = {
  CPU: [
    {
      name: 'P-Cores',
      desc: 'Performance Cores are large out-of-order superscalar execution units with deep 19-stage pipelines, hyperthreading, and large private L2 caches. Optimised for single-threaded, latency-critical workloads like gaming and professional applications.',
      specs: [{ k: 'Count', v: '8 cores' }, { k: 'L2 Cache', v: '2 MB each' }, { k: 'Pipeline', v: '19-stage OOO' }, { k: 'TDP share', v: '~8W each' }]
    },
    {
      name: 'E-Cores',
      desc: 'Efficiency Cores are compact in-order execution cores grouped in clusters of four sharing an L2 cache. They consume up to 4× less power per operation than P-cores, handling background tasks and parallel workloads efficiently.',
      specs: [{ k: 'Count', v: '16 cores' }, { k: 'Cluster size', v: '4 cores' }, { k: 'Shared L2', v: '4 MB/cluster' }, { k: 'TDP share', v: '~2W each' }]
    },
    {
      name: 'Ring Bus',
      desc: 'The Ring Bus is the internal interconnect linking all CPU cores, the LLC, memory controller, and PCIe interface. It operates at ring-stop clock frequency and provides the primary data highway between all execution units and I/O.',
      specs: [{ k: 'Width', v: '32 bytes/cycle' }, { k: 'Frequency', v: '~3.5 GHz' }, { k: 'Latency', v: '~40 cycles' }, { k: 'Stops', v: 'One per core tile' }]
    },
    {
      name: 'LLC',
      desc: 'The Last Level Cache (L3) is the largest and slowest on-die cache, shared among all cores. It acts as a staging area between per-core caches and main memory, dramatically reducing DRAM accesses for working sets that fit within it.',
      specs: [{ k: 'Size', v: '36 MB total' }, { k: 'Access latency', v: '~40 cycles' }, { k: 'Associativity', v: '12-way' }, { k: 'Line size', v: '64 bytes' }]
    },
    {
      name: 'IMC',
      desc: 'The Integrated Memory Controller manages all CPU–DRAM communication. It handles timing, refresh cycles, error correction, and supports dual-channel DDR5 configurations for maximum bandwidth.',
      specs: [{ k: 'Channels', v: '2 (dual-channel)' }, { k: 'Type', v: 'DDR5-5600' }, { k: 'Max bandwidth', v: '89.6 GB/s' }, { k: 'ECC', v: 'Optional' }]
    },
    {
      name: 'PCIe Gen5',
      desc: 'The PCIe 5.0 controller connects the CPU to high-bandwidth devices such as discrete GPUs and NVMe SSDs. Each lane operates at 32 GT/s, doubling PCIe 4.0 bandwidth for next-generation storage and GPU performance.',
      specs: [{ k: 'Lanes', v: '16 (GPU) + 4 (M.2)' }, { k: 'Per-lane BW', v: '4 GB/s' }, { k: 'x16 BW', v: '64 GB/s bidirectional' }, { k: 'Version', v: 'PCIe 5.0' }]
    }
  ],

  GPU: [
    {
      name: 'SM Array',
      desc: 'Streaming Multiprocessors are the primary compute units. Each SM contains CUDA cores, tensor cores, RT cores, registers, shared memory, and warp schedulers, executing thousands of threads in parallel through SIMT execution.',
      specs: [{ k: 'SM count', v: '128 SMs' }, { k: 'CUDA cores/SM', v: '128' }, { k: 'Total CUDA', v: '16384' }, { k: 'Tensor cores/SM', v: '4' }]
    },
    {
      name: 'L2 Cache',
      desc: 'The GPU L2 cache is a large unified cache shared across all SMs. In Ada Lovelace it reaches 96 MB, reducing VRAM round-trips and improving throughput for cache-friendly workloads like inference and rasterisation.',
      specs: [{ k: 'Size', v: '96 MB' }, { k: 'Bandwidth', v: '~8 TB/s' }, { k: 'Partitions', v: '12 slices' }, { k: 'Line size', v: '128 bytes' }]
    },
    {
      name: 'GDDR6X',
      desc: 'GDDR6X uses PAM4 signalling to achieve 21 Gbps per pin — double the effective bandwidth of standard GDDR6. The 384-bit memory bus yields over 1 TB/s aggregate bandwidth.',
      specs: [{ k: 'Capacity', v: '24 GB' }, { k: 'Bus width', v: '384-bit' }, { k: 'Speed', v: '21 Gbps/pin' }, { k: 'Bandwidth', v: '1008 GB/s' }]
    },
    {
      name: 'ROPs',
      desc: 'Render Output Units perform final rendering pipeline stages: antialiasing, alpha blending, depth/stencil operations, and writing pixels to the framebuffer. More ROPs means higher pixel fill rates.',
      specs: [{ k: 'Count', v: '176 ROPs' }, { k: 'Pixel fill rate', v: '443.5 GP/s' }, { k: 'Operations', v: 'MSAA, alpha, depth' }, { k: 'Output', v: '4K @ 120Hz+' }]
    },
    {
      name: 'PCIe x16',
      desc: 'The PCIe edge connector plugs the GPU into the motherboard. PCIe 4.0 x16 provides 64 GB/s of bidirectional bandwidth for CPU–GPU command submission and data transfers.',
      specs: [{ k: 'Version', v: 'PCIe 4.0 x16' }, { k: 'Bandwidth', v: '64 GB/s bidir' }, { k: 'Connector', v: 'Gold-plated 82-pin' }, { k: 'Power pins', v: '8+8 PCIe' }]
    }
  ],

  Motherboard: [
    {
      name: 'VRM Array',
      desc: 'The Voltage Regulator Module converts 12V ATX power to the precise sub-1V required by the CPU, using multi-phase buck converters with digital PWM control for clean, stable delivery under rapid load transients.',
      specs: [{ k: 'Phases', v: '20+2+1' }, { k: 'Input', v: '12V ATX EPS' }, { k: 'Output', v: '0.7–1.35V' }, { k: 'Control', v: 'Digital PWM' }]
    },
    {
      name: 'Chipset',
      desc: 'The Intel Z790 PCH manages I/O functions: USB, SATA, additional PCIe lanes, and audio codec. It connects to the CPU via a high-speed DMI 4.0 x8 link, acting as the secondary routing hub for peripheral bandwidth.',
      specs: [{ k: 'Model', v: 'Intel Z790' }, { k: 'CPU link', v: 'DMI 4.0 x8' }, { k: 'USB ports', v: '14x USB 3.2 Gen2' }, { k: 'SATA', v: '8x SATA III' }]
    },
    {
      name: 'PCIe Slots',
      desc: 'PCIe expansion slots accommodate GPUs, capture cards, and NICs. The primary x16 slot runs directly from the CPU at PCIe 5.0; secondary slots route through the chipset at PCIe 4.0.',
      specs: [{ k: 'Primary slot', v: 'PCIe 5.0 x16' }, { k: 'Secondary', v: 'PCIe 4.0 x16 (x4)' }, { k: 'M.2 slots', v: '5x (PCIe 5.0/4.0)' }, { k: 'Bifurcation', v: 'BIOS-configurable' }]
    },
    {
      name: 'M.2 Slots',
      desc: 'M.2 slots accept NVMe SSDs connecting directly to the CPU or chipset via PCIe. The top slot runs at PCIe 5.0 for up to 14 GB/s sequential read performance.',
      specs: [{ k: 'Slots', v: '5x M.2' }, { k: 'Top slot', v: 'PCIe 5.0 x4 = 14GB/s' }, { k: 'Format', v: '2242/2260/2280/22110' }, { k: 'Protocol', v: 'NVMe 2.0 / SATA' }]
    },
    {
      name: 'I/O Shield',
      desc: 'The rear I/O panel provides external connectivity: USB-A, USB-C Thunderbolt 4, 2.5G LAN, audio jacks, HDMI/DisplayPort for integrated graphics, and a BIOS FlashBack button.',
      specs: [{ k: 'LAN', v: '2.5 GbE Intel i226' }, { k: 'USB', v: '4x USB 3.2 Gen2' }, { k: 'USB-C', v: '1x Thunderbolt 4' }, { k: 'Audio', v: '7.1 Realtek ALC4082' }]
    }
  ],

  RAM: [
    {
      name: 'DRAM Array',
      desc: 'The DRAM cell array is the core storage matrix. Each cell consists of a transistor and capacitor storing a single bit, organised in banks and bank groups for parallelism, accessed via row/column address strobe signalling.',
      specs: [{ k: 'Architecture', v: '16Gb B-die' }, { k: 'Bank groups', v: '4' }, { k: 'Banks/group', v: '4' }, { k: 'Burst length', v: 'BL16' }]
    },
    {
      name: 'SPD/PMIC',
      desc: 'The SPD chip stores the module timing profile and XMP/EXPO overclocking data. The PMIC regulates on-module voltages and handles power sequencing, a new requirement introduced with DDR5.',
      specs: [{ k: 'SPD', v: '256-byte EEPROM' }, { k: 'Protocol', v: 'I2C / DDR5' }, { k: 'PMIC', v: 'Renesas RG3012' }, { k: 'Voltages', v: 'VDD, VDDQ, VPP' }]
    },
    {
      name: 'Heat Spreader',
      desc: 'The aluminium heat spreader dissipates heat generated by DRAM cells at high operating frequencies. High-speed DDR5-6000+ kits generate significant heat, making the spreader essential for preventing thermal throttling.',
      specs: [{ k: 'Material', v: 'Aluminium alloy' }, { k: 'Height', v: '44mm (with spreader)' }, { k: 'TDP', v: '~4W per module' }, { k: 'Finish', v: 'Matte black anodised' }]
    },
    {
      name: 'Gold Contacts',
      desc: 'The 288 gold-plated edge contacts make electrical connection with the DDR5 DIMM socket. Gold provides excellent corrosion resistance and low contact resistance for reliable high-frequency signalling.',
      specs: [{ k: 'Pin count', v: '288 pins' }, { k: 'Pitch', v: '0.85mm' }, { k: 'Material', v: 'Gold over nickel' }, { k: 'Notch', v: 'Keyed for DDR5' }]
    },
    {
      name: 'On-die ECC',
      desc: 'DDR5 introduces mandatory on-die ECC at the DRAM die level. It corrects single-bit errors within each memory burst before data reaches the IMC, improving reliability compared to DDR4.',
      specs: [{ k: 'Type', v: 'Single-bit correction' }, { k: 'Scope', v: 'Per memory burst' }, { k: 'Overhead', v: '~3% capacity' }, { k: 'Standard', v: 'JEDEC DDR5 mandatory' }]
    }
  ],

  Heart: [
    {
      name: 'L. Ventricle',
      desc: "The left ventricle is the heart's main pumping chamber, ejecting oxygenated blood into the aorta at ~120 mmHg systolic pressure. Its thick myocardial wall (8–12mm) withstands the high-pressure systemic circulation.",
      specs: [{ k: 'Wall thickness', v: '8–12 mm' }, { k: 'Volume (EDV)', v: '~130 mL' }, { k: 'Ejection fraction', v: '55–70%' }, { k: 'Output', v: '~5 L/min rest' }]
    },
    {
      name: 'R. Ventricle',
      desc: 'The right ventricle pumps deoxygenated blood into the pulmonary artery at low pressure (~25 mmHg), driving blood to the lungs for oxygenation. Its thinner wall reflects the lower resistance of the pulmonary circuit.',
      specs: [{ k: 'Wall thickness', v: '3–5 mm' }, { k: 'Pressure', v: '25/5 mmHg' }, { k: 'Volume', v: '~130 mL' }, { k: 'Circuit', v: 'Pulmonary' }]
    },
    {
      name: 'Aorta',
      desc: "The aorta is the body's largest artery, carrying oxygenated blood from the left ventricle. Its elastic walls buffer the pulse wave and distribute blood to the ascending, arch, and descending segments.",
      specs: [{ k: 'Diameter', v: '2.5–3.5 cm' }, { k: 'Wall layers', v: '3 (intima/media/adventitia)' }, { k: 'Peak pressure', v: '~120 mmHg' }, { k: 'Flow', v: '~5 L/min' }]
    },
    {
      name: 'SA Node',
      desc: "The sinoatrial node is the heart's natural pacemaker, generating spontaneous electrical impulses at 60–100 bpm at rest. It initiates each heartbeat by triggering a depolarisation wave across the atria.",
      specs: [{ k: 'Location', v: 'Right atrium (superior)' }, { k: 'Rate', v: '60–100 bpm rest' }, { k: 'Cell type', v: 'Autorhythmic (If current)' }, { k: 'Output', v: 'Electrical impulse' }]
    },
    {
      name: 'AV Node',
      desc: 'The atrioventricular node sits at the atria–ventricle boundary, introducing a 120–200ms conduction delay that allows atrial contraction to complete before ventricular systole begins.',
      specs: [{ k: 'Location', v: 'Interatrial septum' }, { k: 'Delay', v: '120–200 ms' }, { k: 'Intrinsic rate', v: '40–60 bpm (backup)' }, { k: 'Function', v: 'Gatekeeper + delay' }]
    }
  ],

  Atom: [
    {
      name: 'Nucleus',
      desc: 'The carbon-12 nucleus contains 6 protons and 6 neutrons tightly bound by the strong nuclear force. Its diameter is ~5 femtometres — roughly 100,000 times smaller than the surrounding electron cloud.',
      specs: [{ k: 'Protons', v: '6' }, { k: 'Neutrons', v: '6' }, { k: 'Charge', v: '+6e' }, { k: 'Diameter', v: '~5 fm' }]
    },
    {
      name: 'K Shell (2e)',
      desc: "The innermost electron shell (n=1) holds exactly 2 electrons in the 1s orbital. Fully filled in carbon, this shell contributes to the atom's core charge but not its bonding behaviour.",
      specs: [{ k: 'Shell', v: 'n = 1' }, { k: 'Electrons', v: '2' }, { k: 'Orbital', v: '1s' }, { k: 'Energy', v: '−288 eV' }]
    },
    {
      name: 'L Shell (4e)',
      desc: "The second shell (n=2) holds carbon's 4 valence electrons across the 2s and 2p orbitals. These enable carbon's unique tetravalent bonding — forming up to 4 simultaneous covalent bonds.",
      specs: [{ k: 'Shell', v: 'n = 2' }, { k: 'Electrons', v: '4 (valence)' }, { k: 'Orbitals', v: '2s² 2p²' }, { k: 'Bond capacity', v: '4 covalent bonds' }]
    },
    {
      name: 'Probability Cloud',
      desc: 'The electron probability cloud (orbital) represents where electrons are most likely to be found. Quantum mechanics describes electrons as wave functions — cloud density corresponds to probability of location, not a definite orbit.',
      specs: [{ k: 'Model', v: 'Quantum mechanical' }, { k: 'Shape', v: 's=sphere, p=dumbbell' }, { k: 'Basis', v: 'Schrödinger equation' }, { k: 'Surface', v: '90% probability' }]
    }
  ]
};

/* ── MODEL METADATA ──────────────────────────────────────────
   s[]   → 5 spec row values mapped to #sp1–#sp5
   perf  → [singleThread%, multiThread%] or null to hide bars
   obj   → geometry string — update from your loaded geometry:
           document.getElementById('objInfo').textContent = '...'
─────────────────────────────────────────────────────────── */
var PD = {
  CPU: {
    title: 'Intel Core i9 \u2014 Die Map',
    cat: 'Hardware \u00B7 CPU',
    catFull: 'Hardware',
    ico: 'i-cpu',
    s: ['Intel 7 (10nm)', '10 Billion', '257 mm\u00B2', '125W', '24C / 32T'],
    chips: COMP_DATA.CPU,
    obj: '312 faces \u00B7 624 verts',
    perf: [97, 89]
  },
  GPU: {
    title: 'NVIDIA Ada \u2014 GA102',
    cat: 'Hardware \u00B7 GPU',
    catFull: 'Hardware',
    ico: 'i-gpu',
    s: ['TSMC 4N', '76.3B', '608 mm\u00B2', '350W', '16384 CUDA'],
    chips: COMP_DATA.GPU,
    obj: '580 faces \u00B7 1160 verts',
    perf: [88, 99]
  },
  Motherboard: {
    title: 'ATX Z790 Motherboard',
    cat: 'Hardware \u00B7 PCB',
    catFull: 'Hardware',
    ico: 'i-mb',
    s: ['FR-4 Substrate', 'LGA 1700', 'DDR5-7800', 'PCIe 5.0', '10L Stack'],
    chips: COMP_DATA.Motherboard,
    obj: '840 faces \u00B7 1680 verts',
    perf: [85, 72]
  },
  RAM: {
    title: 'DDR5-6000 DIMM',
    cat: 'Hardware \u00B7 Memory',
    catFull: 'Hardware',
    ico: 'i-ram',
    s: ['Samsung B-die', '32 GB', '6000 MT/s', '30-38-38', '1.35V'],
    chips: COMP_DATA.RAM,
    obj: '244 faces \u00B7 488 verts',
    perf: [92, 78]
  },
  Heart: {
    title: 'Human Heart \u2014 Anatomy',
    cat: 'Biology \u00B7 Cardiology',
    catFull: 'Biology',
    ico: 'i-heart',
    s: ['Adult Human', '~300g mass', '~5 L/min', '72 bpm avg', '4 chambers'],
    chips: COMP_DATA.Heart,
    obj: '1240 faces \u00B7 2480 verts',
    perf: null
  },
  Atom: {
    title: 'Carbon Atom \u2014 C-12',
    cat: 'Chemistry \u00B7 Atomic',
    catFull: 'Chemistry',
    ico: 'i-atom',
    s: ['C-12 Isotope', '6 Protons', '6 Neutrons', '2+4 Electrons', '12.011 u'],
    chips: COMP_DATA.Atom,
    obj: '160 faces \u00B7 320 verts',
    perf: null
  }
};
