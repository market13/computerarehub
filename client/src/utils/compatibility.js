/**
 * Compatibility verification engine for custom PC builds
 */

export function checkCompatibility(build) {
  const issues = [];
  const warnings = [];
  const info = [];

  const { cpu, motherboard, ram, gpu, psu, case: cabinet, cooler } = build;

  // 1. CPU & Motherboard Socket Check
  if (cpu && motherboard) {
    const cpuSocket = cpu.specs?.socket;
    const mbSocket = motherboard.specs?.socket;

    if (cpuSocket && mbSocket && cpuSocket !== "Unknown" && mbSocket !== "Unknown") {
      if (cpuSocket.toLowerCase() !== mbSocket.toLowerCase()) {
        issues.push({
          type: "critical",
          title: "CPU & Motherboard Socket Incompatible",
          message: `The CPU requires socket ${cpuSocket}, but the motherboard is socket ${mbSocket}. They cannot be physically installed together.`
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
          type: "critical",
          title: "RAM Generation Incompatible",
          message: `The motherboard requires ${mbRamType} memory, but selected RAM is ${ramType}. RAM slots are keyed differently.`
        });
      } else {
        info.push(`Memory matches ${ramType} motherboard slot standard.`);
      }
    }
  }

  // 3. Motherboard Form Factor & Cabinet Check
  if (motherboard && cabinet) {
    const mbForm = motherboard.specs?.form_factor; // e.g. ATX, Micro-ATX, Mini-ITX, E-ATX
    const supported = cabinet.specs?.supported_motherboards || ["ATX", "Micro-ATX", "Mini-ITX"];

    if (mbForm && supported.length > 0) {
      const isSupported = supported.some(s => s.toLowerCase() === mbForm.toLowerCase());
      if (!isSupported) {
        issues.push({
          type: "critical",
          title: "Motherboard Form Factor Exceeds Cabinet",
          message: `The case supports [${supported.join(", ")}], but selected motherboard is ${mbForm}. It will not fit in the case mounting points.`
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
        type: "critical",
        title: "GPU Exceeds Case Clearance",
        message: `Graphics card length is ${gpuLength}mm, exceeding the cabinet's max clearance of ${maxClearance}mm.`
      });
    } else if (gpuLength > maxClearance - 20) {
      warnings.push({
        type: "warning",
        title: "Tight GPU Clearance",
        message: `Graphics card (${gpuLength}mm) fits with very tight clearance (${maxClearance}mm max). Ensure front fans don't obstruct.`
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
        type: "critical",
        title: "Insufficient Power Supply Wattage",
        message: `System estimated consumption is ~${estimatedWattage}W, but the PSU provides only ${psuWatts}W. This will cause shutdowns under gaming load.`
      });
    } else if (psuWatts < recommended) {
      warnings.push({
        type: "warning",
        title: "Low PSU Headroom",
        message: `System draws ~${estimatedWattage}W. For GPU transient power spikes, at least ${recommended}W is recommended. Selected: ${psuWatts}W.`
      });
    } else {
      info.push(`PSU (${psuWatts}W) provides excellent headroom over estimated ~${estimatedWattage}W load.`);
    }
  }

  // 6. CPU Cooler TDP dissipation
  if (cpu && cooler) {
    const cpuTdp = cpu.specs?.tdp || 65;
    const coolerTdp = cooler.specs?.tdp_rating || 180;

    if (cpuTdp > coolerTdp) {
      warnings.push({
        type: "warning",
        title: "Cooler Thermal Headroom Warning",
        message: `CPU TDP is ${cpuTdp}W under sustained boost, which is near or above cooler dissipation rating (${coolerTdp}W). Consider a 360mm AIO for lower temps.`
      });
    }
  }

  return {
    isCompatible: issues.length === 0,
    issues,
    warnings,
    info,
    estimatedWattage
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
    const title = (gpu.title || "").toLowerCase();
    if (title.includes("4090")) baseScore = 100;
    else if (title.includes("4080") || title.includes("7900 xtx")) baseScore = 92;
    else if (title.includes("4070 ti") || title.includes("7900 xt")) baseScore = 84;
    else if (title.includes("4070") || title.includes("7800 xt")) baseScore = 76;
    else if (title.includes("4060 ti") || title.includes("7700 xt")) baseScore = 65;
    else if (title.includes("4060") || title.includes("7600")) baseScore = 55;
    else if (title.includes("3060") || title.includes("6600")) baseScore = 45;
  }

  return {
    esportsFps: Math.min(480, Math.round(baseScore * 4.2 + 80)),      // CS2 / Valorant / Apex
    aaa1080pFps: Math.min(240, Math.round(baseScore * 2.1 + 45)),     // Cyberpunk / COD Ultra
    aaa1440pFps: Math.min(180, Math.round(baseScore * 1.6 + 30)),     // 1440p High
    aaa4kFps: Math.min(140, Math.round(baseScore * 1.1 + 15)),        // 4K Ray Tracing
    score: baseScore
  };
}

export function findCompatibleDefaultBuild(data) {
  if (!data) return null;
  const cpus = (data.cpu || []).filter(c => c.vendor !== 'PC Build' && !(c.title || '').toLowerCase().includes('custom pc build'));
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
    const matchingMbs = motherboards.filter(m => m.specs?.socket && m.specs.socket.toLowerCase() === cpuSocket.toLowerCase());
    for (const candidateMb of matchingMbs) {
      const mbRamType = candidateMb.specs?.ram_type;
      const matchingRams = rams.filter(r => r.specs?.ram_type && r.specs.ram_type.toUpperCase() === mbRamType?.toUpperCase());
      if (matchingRams.length === 0) continue;
      const candidateRam = matchingRams[0];

      const mbForm = candidateMb.specs?.form_factor;
      const matchingCases = cases.filter(c => {
        const supp = c.specs?.supported_motherboards || ['ATX', 'Micro-ATX', 'Mini-ITX'];
        return !mbForm || supp.some(s => s.toLowerCase() === mbForm.toLowerCase());
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
        monitor: candidateMonitor
      };

      const estWatts = calculateWattage(draftBuild);
      const matchingPsus = psus.filter(p => (p.specs?.wattage || 650) >= estWatts * 1.2);
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
