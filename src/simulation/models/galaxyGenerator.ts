import { createSeededRandom, gaussianRandom } from '@/utils/math';
import { kelvinToRGB } from '@/utils/colorTemperature';
import type { QualityPresetConfig } from '@/types/simulation';

export interface GeneratedGalaxyBuffers {
  starCount: number;
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  angularVelocities: Float32Array;
  phases: Float32Array;
  populationTypes: Float32Array;
  protoOffsets: Float32Array;

  dustAndHiiCount: number;
  nebulaPositions: Float32Array;
  nebulaColors: Float32Array;
  nebulaSizes: Float32Array;
  nebulaAngularVelocities: Float32Array;
  nebulaOpacities: Float32Array;
}

/**
 * Computes realistic Milky Way flat rotation curve angular velocity Omega(R) = V_c(R) / R
 * Approximating Sofue (2020) & Eilers et al. (2019) rotation curve in normalized rad / time-unit.
 */
function computeGalacticAngularVelocity(radiusKpc: number): number {
  const r = Math.max(0.18, radiusKpc);
  // Rise steeply in inner 0.5 kpc, bar bump around 2 kpc, flat ~232 km/s out to 20 kpc
  const vCircularNorm =
    0.95 * (1.0 - Math.exp(-r / 0.85)) + 0.22 * Math.exp(-Math.pow((r - 1.6) / 1.1, 2.0));
  return (vCircularNorm * 1.45) / Math.pow(r + 0.45, 0.82);
}

/**
 * Generates astrophysically informed 3D Milky Way particle buffers:
 * - Triaxial Box/Peanut Galactic Bar (~28 deg orientation to Sun-GC line)
 * - Central Nuclear Star Cluster & Inner Bulge
 * - 4 Primary Logarithmic Spiral Arms (Scutum-Centaurus, Perseus, Sagittarius-Carina, Norma-Outer)
 * - Local Orion Spur passing near [0, 0.02, 8.178]
 * - Thin & Thick Exponential Disks
 * - Metal-poor Spherical/Oblate Stellar Halo
 * - Interstellar Dust Extinction Lanes & Crimson/Cyan HII Emission Nebulae
 */
export function generateMilkyWayBuffers(preset: QualityPresetConfig): GeneratedGalaxyBuffers {
  const rng = createSeededRandom(4202026);
  const totalStars = preset.starCount + preset.haloStarCount;

  const positions = new Float32Array(totalStars * 3);
  const colors = new Float32Array(totalStars * 3);
  const sizes = new Float32Array(totalStars);
  const angularVelocities = new Float32Array(totalStars);
  const phases = new Float32Array(totalStars);
  const populationTypes = new Float32Array(totalStars);
  const protoOffsets = new Float32Array(totalStars * 3);

  // Bar orientation angle ~28 degrees relative to Sun-GC axis (+Z axis)
  const barAngle = (28 * Math.PI) / 180;
  const cosBar = Math.cos(barAngle);
  const sinBar = Math.sin(barAngle);

  // Four main spiral arm base angles and weights (Scutum-Centaurus & Perseus stronger)
  const arms = [
    { baseAngle: barAngle, pitchTan: Math.tan((12.1 * Math.PI) / 180), weight: 0.30, tight: 0.42 }, // Scutum-Centaurus
    { baseAngle: barAngle + Math.PI, pitchTan: Math.tan((11.6 * Math.PI) / 180), weight: 0.28, tight: 0.44 }, // Perseus
    { baseAngle: barAngle + Math.PI * 0.52, pitchTan: Math.tan((12.0 * Math.PI) / 180), weight: 0.22, tight: 0.48 }, // Sagittarius-Carina
    { baseAngle: barAngle + Math.PI * 1.52, pitchTan: Math.tan((11.8 * Math.PI) / 180), weight: 0.20, tight: 0.52 }, // Norma-Outer
  ];

  // Generate several clumpy protogalactic sub-halo centers for Early Structure Formation morphing
  const protoCenters: [number, number, number][] = [
    [0.0, 0.0, 0.0],
    [3.8, 2.4, -2.9],
    [-4.2, -1.9, 3.4],
    [1.9, -3.1, 4.5],
    [-2.8, 2.8, -4.1],
    [5.2, -0.8, 1.8],
  ];

  for (let i = 0; i < totalStars; i++) {
    const i3 = i * 3;
    const u = rng();

    let x = 0;
    let y = 0;
    let z = 0;
    let popType = 1; // 0=bulge/bar, 1=disk, 2=spiral_arm, 3=young_ob, 4=halo
    let tempK = 5500;
    let size = 1.0;

    if (i >= preset.starCount) {
      // 1. STELLAR HALO & GLOBULAR STREAM POPULATION (type 4)
      popType = 4;
      const rHalo = 2.0 + Math.pow(rng(), 1.65) * 21.0;
      const theta = rng() * Math.PI * 2;
      const cosPhi = 2.0 * rng() - 1.0;
      const sinPhi = Math.sqrt(Math.max(0, 1.0 - cosPhi * cosPhi));
      x = rHalo * sinPhi * Math.cos(theta);
      y = rHalo * cosPhi * 0.72; // Slightly oblate halo
      z = rHalo * sinPhi * Math.sin(theta);

      tempK = 3800 + rng() * 2400; // Ancient metal-poor K/G giants
      size = 0.75 + rng() * 0.85;
    } else if (u < 0.24) {
      // 2. CENTRAL NUCLEAR BULGE & TRIAXIAL BOX/PEANUT BAR (type 0)
      popType = 0;
      const isNuclearCore = rng() < 0.34;
      if (isNuclearCore) {
        const rCore = Math.pow(rng(), 1.8) * 1.65;
        const theta = rng() * Math.PI * 2;
        const zCore = gaussianRandom(rng, 0, 0.32 * (1.0 - rCore / 2.2));
        x = rCore * Math.cos(theta);
        z = rCore * Math.sin(theta);
        y = zCore;
        tempK = 3400 + rng() * 3200;
        size = 1.15 + rng() * 1.4;
      } else {
        // Triaxial Box/Peanut Bar along major axis L_bar ~ 4.6 kpc
        const barAlong = gaussianRandom(rng, 0, 2.05);
        const barPerp = gaussianRandom(rng, 0, 0.72);
        // Box/Peanut vertical X-shape thickening around |barAlong| ~ 1.8 kpc
        const peanutHeight = 0.28 + 0.22 * Math.exp(-Math.pow((Math.abs(barAlong) - 1.65) / 0.95, 2.0));
        const barVert = gaussianRandom(rng, 0, peanutHeight);

        x = barAlong * sinBar + barPerp * cosBar;
        z = barAlong * cosBar - barPerp * sinBar;
        y = barVert;

        tempK = 3200 + rng() * 2600; // Warm golden/orange K & M giants
        size = 0.95 + rng() * 1.15;
      }
    } else if (u < 0.76) {
      // 3. GRAND-DESIGN LOGARITHMIC SPIRAL ARMS + ORION SPUR (type 2 & 3)
      const isOrionSpur = rng() < 0.085;
      if (isOrionSpur) {
        // Local Orion Spur segment curving past [0, 0, 8.18]
        const spurT = (rng() - 0.5) * 0.85; // angular arc around +Z axis (angle ~ pi/2)
        const baseR = 8.18 * Math.exp(spurT * 0.21);
        const scatterR = gaussianRandom(rng, 0, 0.38);
        const r = Math.max(5.8, baseR + scatterR);
        const angle = Math.PI * 0.5 + spurT + gaussianRandom(rng, 0, 0.045);

        x = r * Math.cos(angle);
        z = r * Math.sin(angle);
        y = gaussianRandom(rng, 0, 0.14);
      } else {
        // Pick one of the 4 main spiral arms by weight
        const armRoll = rng();
        let acc = 0;
        let chosenArm = arms[0];
        for (const arm of arms) {
          acc += arm.weight;
          if (armRoll <= acc) {
            chosenArm = arm;
            break;
          }
        }

        // Radius from bar end (~2.6 kpc) out to ~15.5 kpc
        const r = 2.4 + Math.pow(rng(), 0.92) * 13.2;
        const spiralWindAngle = Math.log(r / 2.4) / chosenArm.pitchTan;
        const armWidthAngle = (chosenArm.tight / Math.sqrt(r * 0.45)) * gaussianRandom(rng, 0, 1.0);
        const theta = chosenArm.baseAngle + spiralWindAngle + armWidthAngle;

        x = r * Math.sin(theta);
        z = r * Math.cos(theta);

        // Outer disk mild S-warp beyond R > 11 kpc
        const warp = r > 10.5 ? Math.sin(theta * 1.0) * Math.pow((r - 10.5) * 0.14, 1.5) : 0.0;
        const scaleHeight = 0.12 + 0.015 * r;
        y = gaussianRandom(rng, 0, scaleHeight) + warp;
      }

      // 26% of spiral arm stars are hot young OB/A stars (type 3)
      if (rng() < 0.26) {
        popType = 3;
        tempK = 9500 + rng() * 22000; // Brilliant Stellar Blue / Cyan-White
        size = 1.25 + rng() * 1.75;
      } else {
        popType = 2;
        tempK = 4200 + rng() * 4800; // F/G/K spiral backbone
        size = 0.85 + rng() * 1.1;
      }
    } else {
      // 4. EXPONENTIAL THIN & THICK INTER-ARM STELLAR DISK (type 1)
      popType = 1;
      const r = 1.2 + Math.pow(rng(), 0.85) * 14.8;
      const theta = rng() * Math.PI * 2;
      const isThickDisk = rng() < 0.28;
      const scaleHeight = isThickDisk ? 0.48 + 0.025 * r : 0.18 + 0.012 * r;

      x = r * Math.cos(theta);
      z = r * Math.sin(theta);
      y = gaussianRandom(rng, 0, scaleHeight);

      tempK = isThickDisk ? 3500 + rng() * 2200 : 4100 + rng() * 3600;
      size = 0.72 + rng() * 0.95;
    }

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    const [rCol, gCol, bCol] = kelvinToRGB(tempK);
    // Boost golden warmth in bulge/bar and sapphire/cyan clarity in young spiral stars
    if (popType === 0) {
      colors[i3] = Math.min(1.0, rCol * 1.05);
      colors[i3 + 1] = gCol * 0.92;
      colors[i3 + 2] = bCol * 0.76;
    } else if (popType === 3) {
      colors[i3] = rCol * 0.88;
      colors[i3 + 1] = Math.min(1.0, gCol * 0.98);
      colors[i3 + 2] = Math.min(1.0, bCol * 1.12);
    } else {
      colors[i3] = rCol;
      colors[i3 + 1] = gCol;
      colors[i3 + 2] = bCol;
    }

    sizes[i] = size;
    const rad = Math.hypot(x, z);
    angularVelocities[i] = computeGalacticAngularVelocity(rad);
    phases[i] = rng();
    populationTypes[i] = popType;

    // Assign protogalactic clump offset for Early Structure Formation stage
    const clump = protoCenters[i % protoCenters.length];
    protoOffsets[i3] = clump[0] + gaussianRandom(rng, 0, 1.8);
    protoOffsets[i3 + 1] = clump[1] + gaussianRandom(rng, 0, 1.8);
    protoOffsets[i3 + 2] = clump[2] + gaussianRandom(rng, 0, 1.8);
  }

  // 5. GENERATE INTERSTELLAR DUST LANES & IONIZED HII NEBULAE
  const dustAndHiiCount = preset.dustCloudCount + preset.hiiRegionCount;
  const nebulaPositions = new Float32Array(dustAndHiiCount * 3);
  const nebulaColors = new Float32Array(dustAndHiiCount * 3);
  const nebulaSizes = new Float32Array(dustAndHiiCount);
  const nebulaAngularVelocities = new Float32Array(dustAndHiiCount);
  const nebulaOpacities = new Float32Array(dustAndHiiCount);

  for (let j = 0; j < dustAndHiiCount; j++) {
    const j3 = j * 3;
    const isHii = j >= preset.dustCloudCount;
    const chosenArm = arms[j % arms.length];

    const r = 2.0 + Math.pow(rng(), 0.95) * 11.8;
    const spiralWindAngle = Math.log(Math.max(1.1, r / 2.2)) / chosenArm.pitchTan;
    // Dust lanes concentrate along the inner concave edge of spiral arms
    const innerEdgeOffset = isHii ? gaussianRandom(rng, 0, 0.14) : -0.08 + gaussianRandom(rng, 0, 0.16);
    const theta = chosenArm.baseAngle + spiralWindAngle + innerEdgeOffset;

    const nx = r * Math.sin(theta);
    const nz = r * Math.cos(theta);
    const ny = gaussianRandom(rng, 0, isHii ? 0.09 : 0.14);

    nebulaPositions[j3] = nx;
    nebulaPositions[j3 + 1] = ny;
    nebulaPositions[j3 + 2] = nz;

    if (isHii) {
      // H-alpha crimson/magenta or OIII cyan star-forming knots
      const isCyanOIII = rng() < 0.38;
      if (isCyanOIII) {
        nebulaColors[j3] = 0.35;
        nebulaColors[j3 + 1] = 0.78;
        nebulaColors[j3 + 2] = 0.98;
      } else {
        nebulaColors[j3] = 0.92;
        nebulaColors[j3 + 1] = 0.32;
        nebulaColors[j3 + 2] = 0.58;
      }
      nebulaSizes[j] = 3.2 + rng() * 4.5;
      nebulaOpacities[j] = 0.055 + rng() * 0.065;
    } else {
      // Soft sapphire-amber interstellar diffuse glow & dust lane scattering
      const isCoreGlow = r < 3.6;
      if (isCoreGlow) {
        nebulaColors[j3] = 0.85;
        nebulaColors[j3 + 1] = 0.62;
        nebulaColors[j3 + 2] = 0.36;
      } else {
        nebulaColors[j3] = 0.26;
        nebulaColors[j3 + 1] = 0.44;
        nebulaColors[j3 + 2] = 0.78;
      }
      nebulaSizes[j] = 5.5 + rng() * 7.5;
      nebulaOpacities[j] = 0.022 + rng() * 0.032;
    }

    nebulaAngularVelocities[j] = computeGalacticAngularVelocity(r);
  }

  return {
    starCount: totalStars,
    positions,
    colors,
    sizes,
    angularVelocities,
    phases,
    populationTypes,
    protoOffsets,
    dustAndHiiCount,
    nebulaPositions,
    nebulaColors,
    nebulaSizes,
    nebulaAngularVelocities,
    nebulaOpacities,
  };
}
