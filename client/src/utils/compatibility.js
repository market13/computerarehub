/**
 * Compatibility verification engine for custom PC builds
 * Includes comprehensive socket, RAM generation, slot count, capacity,
 * form factor, GPU clearance, PSU wattage, 12VHPWR, M.2 slots, and BIOS generation checks.
 */

/**
 * Extracts RAM stick count and capacity in GB from title or specs
 */
function parseRamSpecs(ram) {
  if (!ram) return { sticks: 1, capacityGb: 16 };
  const title = (ram.title || '').toUpperCase();
  const specs = ram.specs || {};

  let sticks = specs.sticks || 1;
  if (/2X(?:8|16|32|64)GB|KIT OF 2|\(2X/i.test(title)) sticks = 2;
  else if (/4X(?:8|16|32|64)GB|KIT OF 4|\(4X/i.test(title)) sticks = 4;

  let capacityGb = specs.capacity_gb || 16;
  const capMatch = title.match(/(\d+)\s*GB/);
  if (capMatch) {
    const rawNum = parseInt(capMatch[1], 10);
    // If it says 2x16GB, total capacity is 32GB
    if (/2X16GB/i.test(title)) capacityGb = 32;
    else if (/2X32GB/i.test(title)) capacityGb = 64;
    else if (/2X8GB/i.test(title)) capacityGb = 16;
    else if (/4X16GB/i.test(title)) capacityGb = 64;
    else if (/4X32GB/i.test(title)) capacityGb = 128;
    else capacityGb = rawNum;
  }

  return { sticks, capacityGb };
}

/**
 * Extracts motherboard RAM slot count and max capacity in GB
 */
function parseMotherboardRamLimits(mb) {
  if (!mb) return { slots: 4, maxCapacityGb: 128 };
  const title = (mb.title || '').toUpperCase();
  const formFactor = (mb.specs?.form_factor || '').toUpperCase();

  let slots = mb.specs?.ram_slots || 4;
  if (formFactor.includes('MINI-ITX') || formFactor.includes('ITX')) {
    slots = 2;
  } else if (/H410|H510|H610|A320|A520|A620|H81|H110/i.test(title)) {
    // Most entry-level budget boards have 2 RAM slots
    slots = mb.specs?.ram_slots || 2;
  }

  let maxCapacityGb = mb.specs?.max_ram_gb || (slots === 2 ? 64 : 128);
  if (/DDR5/i.test(mb.specs?.ram_type || title)) {
    maxCapacityGb = slots === 2 ? 96 : 192;
  }

  return { slots, maxCapacityGb };
}

export function checkCompatibility(build) {
  const issues = [];
  const warnings = [];
  const info = [];

  const { cpu, motherboard, ram, gpu, psu, case: cabinet, cooler, storage } = build;

  // 1. CPU & Motherboard Socket Check
  if (cpu && motherboard) {
    const cpuSocket = cpu.specs?.socket;
    const mbSocket = motherboard.specs?.socket;

    if (cpuSocket && mbSocket && cpuSocket !== 'Unknown' && mbSocket !== 'Unknown') {
      if (cpuSocket.toLowerCase() !== mbSocket.toLowerCase()) {
        issues.push({
          type: 'critical',
          title: 'CPU & Motherboard Socket Incompatible',
          message: `The CPU requires socket ${cpuSocket}, but the motherboard is socket ${mbSocket}. They cannot be physically installed together.`,
        });
      } else {
        info.push(`CPU & Motherboard match socket ${cpuSocket}.`);
      }
    }
  }

  // 2. Motherboard & RAM Generation Check
  if (motherboard && ram) {
    const mbRamType = motherboard.specs?.ram_type;
    const ramType = ram.specs?.ram_type;

    if (mbRamType && ramType) {
      if (mbRamType.toUpperCase() !== ramType.toUpperCase()) {
        issues.push({
          type: 'critical',
          title: 'RAM Generation Incompatible',
          message: `The motherboard requires ${mbRamType} memory, but selected RAM is ${ramType}. RAM slots are keyed differently.`,
        });
      } else {
        info.push(`Memory matches ${ramType} motherboard slot standard.`);
      }
    }

    // 2a. RAM Slot Count vs Stick Count
    const { sticks: ramStickCount, capacityGb: totalRamGb } = parseRamSpecs(ram);
    const { slots: mbRamSlots, maxCapacityGb: mbMaxRamGb } = parseMotherboardRamLimits(motherboard);

    if (ramStickCount > mbRamSlots) {
      issues.push({
        type: 'critical',
        title: 'RAM Sticks Exceed Motherboard Slots',
        message: `Selected RAM package requires ${ramStickCount} DIMM slots, but this motherboard only has ${mbRamSlots} RAM slots.`,
      });
    }

    // 2b. Total RAM Capacity vs Motherboard Max
    if (totalRamGb > mbMaxRamGb) {
      warnings.push({
        type: 'warning',
        title: 'RAM Capacity Exceeds Motherboard Maximum',
        message: `Selected RAM total capacity (${totalRamGb}GB) exceeds this motherboard's rated maximum memory of ${mbMaxRamGb}GB.`,
      });
    }
  }

  // 3. Motherboard Form Factor & Cabinet Check
  if (motherboard && cabinet) {
    const mbForm = motherboard.specs?.form_factor; // e.g. ATX, Micro-ATX, Mini-ITX, E-ATX
    const supported = cabinet.specs?.supported_motherboards || ['ATX', 'Micro-ATX', 'Mini-ITX'];

    if (mbForm && supported.length > 0) {
      const isSupported = supported.some((s) => s.toLowerCase() === mbForm.toLowerCase());
      if (!isSupported) {
        issues.push({
          type: 'critical',
          title: 'Motherboard Form Factor Exceeds Cabinet',
          message: `The case supports [${supported.join(', ')}], but selected motherboard is ${mbForm}. It will not fit in the case mounting points.`,
        });
      }
    }
  }

  // 4. GPU Length & Cabinet Clearance Check
  if (gpu && cabinet) {
    const gpuLength = gpu.specs?.length_mm || 280;
    const maxClearance = cabinet.specs?.max_gpu_length || 360;

    if (gpuLength > maxClearance) {
      issues.push({
        type: 'critical',
        title: 'GPU Exceeds Case Clearance',
        message: `Graphics card length is ${gpuLength}mm, exceeding the cabinet's max clearance of ${maxClearance}mm.`,
      });
    } else if (gpuLength > maxClearance - 20) {
      warnings.push({
        type: 'warning',
        title: 'Tight GPU Clearance',
        message: `Graphics card (${gpuLength}mm) fits with very tight clearance (${maxClearance}mm max). Ensure front fans don't obstruct.`,
      });
    }
  }

  // 5. Total Wattage & PSU Calculation
  const estimatedWattage = calculateWattage(build);
  if (psu) {
    const psuWatts = psu.specs?.wattage || 650;
    const recommended = Math.ceil(estimatedWattage * 1.3); // 30% headroom for transients

    if (psuWatts < estimatedWattage) {
      issues.push({
        type: 'critical',
        title: 'Insufficient Power Supply Wattage',
        message: `System estimated consumption is ~${estimatedWattage}W, but the PSU provides only ${psuWatts}W. This will cause shutdowns under gaming load.`,
      });
    } else if (psuWatts < recommended) {
      warnings.push({
        type: 'warning',
        title: 'Low PSU Headroom',
        message: `System draws ~${estimatedWattage}W. For GPU transient power spikes, at least ${recommended}W is recommended. Selected: ${psuWatts}W.`,
      });
    } else {
      info.push(`PSU (${psuWatts}W) provides excellent headroom over estimated ~${estimatedWattage}W load.`);
    }

    // 5a. 12VHPWR / ATX 3.0 Power Cable Check for Modern High-Power GPUs
    if (gpu) {
      const gpuTitle = (gpu.title || '').toUpperCase();
      const connectorStr = (gpu.specs?.power_connectors || '').toUpperCase();
      const isHighPower12V = /RTX\s*40(?:70\s*TI|70\s*SUPER|80|90)/i.test(gpuTitle) || connectorStr.includes('12V');

      if (isHighPower12V) {
        const psuTitle = (psu.title || '').toUpperCase();
        const isAtx30 = psu.specs?.pcie_12vhpwr || /ATX\s*3\.0|PCIE\s*5\.0|12VHPWR|12V-2X6/i.test(psuTitle);

        if (!isAtx30) {
          warnings.push({
            type: 'warning',
            title: '12VHPWR / 12V-2x6 Cable Adapter Required',
            message: `This GPU uses the high-power 12VHPWR / 12V-2x6 connector. Selected PSU is not native ATX 3.0; verify your GPU bundle includes the PCIe 8-pin adapter.`,
          });
        } else {
          info.push('Native 12VHPWR / PCIe 5.0 high-power GPU cable verified.');
        }
      }

      // 5b. Manufacturer Minimum Recommended PSU Check
      if (gpu.specs?.recommended_psu) {
        const minPsu = Number(gpu.specs.recommended_psu);
        if (psuWatts < minPsu && psuWatts >= estimatedWattage) {
          warnings.push({
            type: 'warning',
            title: 'Below GPU Manufacturer Recommended PSU',
            message: `The manufacturer of ${gpu.specs.chipset || 'this graphics card'} recommends at least a ${minPsu}W power supply for safe power spikes. Selected: ${psuWatts}W.`,
          });
        }
      }
    }
  }

  // 6. M.2 NVMe Slot Availability on Motherboard
  if (storage && motherboard) {
    const storageTitle = (storage.title || '').toUpperCase();
    const isM2Nvme = /NVME|M\.2/i.test(storageTitle) || storage.specs?.interface === 'M.2 NVMe';

    if (isM2Nvme) {
      const mbTitle = (motherboard.title || '').toUpperCase();
      const hasNoM2 = /H81|G41|H61\b|945G/i.test(mbTitle);

      if (hasNoM2) {
        issues.push({
          type: 'critical',
          title: 'Motherboard Lacks M.2 NVMe Slot',
          message: `Selected storage is an M.2 NVMe SSD, but this legacy motherboard only features 2.5" SATA interfaces. A 2.5" SATA SSD or PCIe adapter is required.`,
        });
      }
    }
  }

  // 7. BIOS Version Compatibility Warning (Older Boards with Newer CPUs)
  if (cpu && motherboard) {
    const cpuTitle = (cpu.title || '').toUpperCase();
    const mbTitle = (motherboard.title || '').toUpperCase();

    // AMD Ryzen 5000 on B450 / A320 / X470
    if (/RYZEN\s*(?:5\s*5[56]00|7\s*5[78]00|9\s*59[05]0)/i.test(cpuTitle) && /B450|A320|X470/i.test(mbTitle)) {
      warnings.push({
        type: 'warning',
        title: 'Motherboard BIOS Update May Be Required',
        message: `Pairing a Ryzen 5000-series processor with an AMD 400-series board may require a BIOS update prior to initial boot. Computer Care provides free in-store BIOS flashing.`,
      });
    }

    // Intel 13th / 14th Gen on 600-Series Boards (H610, B660, Z690)
    if (/I[3579]-(?:13|14)\d{3}/i.test(cpuTitle) && /H610|B660|Z690|H670/i.test(mbTitle)) {
      warnings.push({
        type: 'warning',
        title: 'Intel 13th/14th Gen BIOS Update Required',
        message: `This 13th/14th Gen Intel CPU on a 600-series motherboard may require a BIOS update before posting. We flash the latest microcode at Computer Care.`,
      });
    }
  }

  // 8. CPU Cooler TDP dissipation
  if (cpu && cooler) {
    const cpuTdp = cpu.specs?.tdp || 65;
    const coolerTdp = cooler.specs?.tdp_rating || 180;

    if (cpuTdp > coolerTdp) {
      warnings.push({
        type: 'warning',
        title: 'Cooler Thermal Headroom Warning',
        message: `CPU TDP is ${cpuTdp}W under sustained boost, which is near or above cooler dissipation rating (${coolerTdp}W). Consider a 360mm AIO for lower temps.`,
      });
    }
  }

  return {
    isCompatible: issues.length === 0,
    issues,
    warnings,
    info,
    estimatedWattage,
  };
}

export function calculateWattage(build) {
  let watts = 60; // Base motherboard, chipset, fans, and RGB draw

  if (build.cpu) {
    watts += (build.cpu.specs?.tdp || 65) + 30; // Boost margin
  }
  if (build.gpu) {
    watts += build.gpu.specs?.tdp || 180;
  }
  if (build.ram) {
    watts += 15;
  }
  if (build.storage) {
    watts += 10;
  }
  if (build.cooler) {
    watts += build.cooler.specs?.radiator_size ? 25 : 10;
  }
  if (build.case_fan) {
    watts += 15; // ARGB & high-RPM chassis fans
  }
  return watts;
}

export function calculateGamingScores(build) {
  const gpu = build.gpu;

  let baseScore = 30; // Entry

  if (gpu) {
    const title = (gpu.title || '').toLowerCase();
    if (title.includes('4090')) baseScore = 100;
    else if (title.includes('4080') || title.includes('7900 xtx')) baseScore = 92;
    else if (title.includes('4070 ti') || title.includes('7900 xt')) baseScore = 84;
    else if (title.includes('4070') || title.includes('7800 xt')) baseScore = 76;
    else if (title.includes('4060 ti') || title.includes('7700 xt')) baseScore = 65;
    else if (title.includes('4060') || title.includes('7600')) baseScore = 55;
    else if (title.includes('3060') || title.includes('6600')) baseScore = 45;
  }

  return {
    esportsFps: Math.min(480, Math.round(baseScore * 4.2 + 80)), // CS2 / Valorant / Apex
    aaa1080pFps: Math.min(240, Math.round(baseScore * 2.1 + 45)), // Cyberpunk / COD Ultra
    aaa1440pFps: Math.min(180, Math.round(baseScore * 1.6 + 30)), // 1440p High
    aaa4kFps: Math.min(140, Math.round(baseScore * 1.1 + 15)), // 4K Ray Tracing
    score: baseScore,
  };
}

export function findCompatibleDefaultBuild(data) {
  if (!data) return null;
  const cpus = (data.cpu || []).filter(
    (c) => c.vendor !== 'PC Build' && !(c.title || '').toLowerCase().includes('custom pc build')
  );
  const motherboards = data.motherboard || [];
  const rams = data.ram || [];
  const cases = data.case || [];
  const gpus = data.gpu || [];
  const psus = data.psu || [];
  const coolers = data.cooler || [];
  const storages = data.storage || [];
  const fans = data.case_fan || [];
  const monitors = data.monitor || [];

  // Prefer modern gaming processors first (AM5 or LGA1700), sorted by performance/price
  const sortedCpus = [...cpus].sort((a, b) => {
    const aIsModern = a.specs?.socket === 'AM5' || a.specs?.socket === 'LGA1700';
    const bIsModern = b.specs?.socket === 'AM5' || b.specs?.socket === 'LGA1700';
    if (aIsModern && !bIsModern) return -1;
    if (!aIsModern && bIsModern) return 1;
    return (b.price || 0) - (a.price || 0);
  });

  for (const candidateCpu of sortedCpus) {
    const cpuSocket = candidateCpu.specs?.socket;
    if (!cpuSocket) continue;

    // Find motherboards matching socket
    const matchingMbs = motherboards.filter(
      (m) => m.specs?.socket && m.specs.socket.toLowerCase() === cpuSocket.toLowerCase()
    );
    for (const candidateMb of matchingMbs) {
      const mbRamType = candidateMb.specs?.ram_type;
      const matchingRams = rams.filter(
        (r) => r.specs?.ram_type && r.specs.ram_type.toUpperCase() === mbRamType?.toUpperCase()
      );
      if (matchingRams.length === 0) continue;
      const candidateRam = matchingRams[0];

      const mbForm = candidateMb.specs?.form_factor;
      const matchingCases = cases.filter((c) => {
        const supp = c.specs?.supported_motherboards || ['ATX', 'Micro-ATX', 'Mini-ITX'];
        return !mbForm || supp.some((s) => s.toLowerCase() === mbForm.toLowerCase());
      });
      if (matchingCases.length === 0) continue;
      const candidateCase = matchingCases[0];

      const candidateGpu = gpus[0] || null;
      const candidateCooler = coolers[0] || null;
      const candidateStorage = storages[0] || null;
      const candidateFan = fans[0] || null;
      const candidateMonitor = monitors[0] || null;

      const draftBuild = {
        cpu: candidateCpu,
        motherboard: candidateMb,
        ram: candidateRam,
        case: candidateCase,
        gpu: candidateGpu,
        cooler: candidateCooler,
        storage: candidateStorage,
        case_fan: candidateFan,
        monitor: candidateMonitor,
      };

      const estWatts = calculateWattage(draftBuild);
      const matchingPsus = psus.filter((p) => (p.specs?.wattage || 650) >= estWatts * 1.2);
      const candidatePsu = matchingPsus[0] || psus[0] || null;
      draftBuild.psu = candidatePsu;

      const compat = checkCompatibility(draftBuild);
      if (compat.isCompatible) {
        return draftBuild;
      }
    }
  }

  return null;
}
