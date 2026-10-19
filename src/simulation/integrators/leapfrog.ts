import type { GravityLabConfig, GravityParticle } from '@/types/simulation';

const GRAVITATIONAL_CONSTANT_SCALED = 4.3009; // Normalized kpc / (10^10 M_sun) orbital units

/**
 * Computes gravitational acceleration vector a(x, y, z) at position pos
 * Supports:
 * 1. Softened Keplerian Central Potential
 * 2. Composite Miyamoto-Nagai Disk + NFW Dark Matter Halo + Central Bulge Potential
 */
export function computeAcceleration(
  pos: [number, number, number],
  config: GravityLabConfig
): [number, number, number] {
  const [x, y, z] = pos;
  const eps2 = config.softeningLength * config.softeningLength;
  const r2 = x * x + y * y + z * z + eps2;
  const r = Math.sqrt(r2);

  // Central bulge + SMBH point-like softened attraction
  const gmCentral = GRAVITATIONAL_CONSTANT_SCALED * config.centralMassSolarPow10;
  const invR3 = 1.0 / (r2 * r);

  let ax = -gmCentral * x * invR3;
  let ay = -gmCentral * y * invR3;
  let az = -gmCentral * z * invR3;

  if (config.potentialModel === 'Miyamoto-Nagai + NFW Halo') {
    // Miyamoto-Nagai axisymmetric disk + NFW halo contribution keeping outer rotation curve flat
    const R2 = x * x + z * z;
    const aDisk = 3.0; // scale length kpc
    const bDisk = 0.35; // scale height kpc
    const zTerm = Math.sqrt(y * y + bDisk * bDisk);
    const denom = Math.pow(R2 + Math.pow(aDisk + zTerm, 2), 1.5);
    const gmDisk = gmCentral * 1.65;

    ax += (-gmDisk * x) / denom;
    az += (-gmDisk * z) / denom;
    ay += (-gmDisk * y * (aDisk + zTerm)) / (zTerm * denom);

    // NFW Dark Matter Halo term: M_halo(<r) proportional to ln(1 + r/r_s) - (r/r_s)/(1 + r/r_s)
    const rScale = 14.0; // kpc
    const u = r / rScale;
    const nfwMassFactor = Math.log(1.0 + u) - u / (1.0 + u);
    const gmHalo = gmCentral * 3.2 * nfwMassFactor * invR3;

    ax += -gmHalo * x;
    ay += -gmHalo * y;
    az += -gmHalo * z;
  }

  return [ax, ay, az];
}

/**
 * Symplectic Velocity Verlet / Leapfrog step for test-particle orbital integration
 */
export function stepLeapfrogParticles(
  particles: GravityParticle[],
  config: GravityLabConfig,
  maxTrailPoints = 95
): GravityParticle[] {
  if (config.isPaused) return particles;
  const dt = config.timeStep;

  return particles.map((p) => {
    const [ax0, ay0, az0] = computeAcceleration(p.position, config);

    // Half-step velocity kick
    const vxHalf = p.velocity[0] + 0.5 * ax0 * dt;
    const vyHalf = p.velocity[1] + 0.5 * ay0 * dt;
    const vzHalf = p.velocity[2] + 0.5 * az0 * dt;

    // Full-step position drift
    const nextPos: [number, number, number] = [
      p.position[0] + vxHalf * dt,
      p.position[1] + vyHalf * dt,
      p.position[2] + vzHalf * dt,
    ];

    // New acceleration at drifted position
    const [ax1, ay1, az1] = computeAcceleration(nextPos, config);

    // Complete second half-step velocity kick
    const nextVel: [number, number, number] = [
      vxHalf + 0.5 * ax1 * dt,
      vyHalf + 0.5 * ay1 * dt,
      vzHalf + 0.5 * az1 * dt,
    ];

    const updatedTrail = [...p.trail, nextPos];
    if (updatedTrail.length > maxTrailPoints) {
      updatedTrail.shift();
    }

    return {
      ...p,
      position: nextPos,
      velocity: nextVel,
      acceleration: [ax1, ay1, az1],
      trail: updatedTrail,
    };
  });
}

/**
 * Creates a default set of test orbital bodies across inner bulge, solar circle, and inclined halo stream
 */
export function createInitialGravityParticles(config: GravityLabConfig): GravityParticle[] {
  const radii = [2.4, 4.2, 6.2, 8.18, 10.5, 13.0];
  const palette = ['#F8C98B', '#7AA8FF', '#67E8F9', '#34D399', '#A78BFA', '#F59E0B'];

  return radii.map((r, idx) => {
    const angle = (idx * Math.PI) / 3;
    const x = r * Math.cos(angle);
    const z = r * Math.sin(angle);
    const y = idx === 4 ? 1.35 : 0.0; // Inclined halo stream orbit for particle #5

    const [ax, , az] = computeAcceleration([x, y, z], config);
    const radialAccel = Math.hypot(ax, az);
    const vCircular = Math.sqrt(Math.max(0.1, r * radialAccel)) * config.initialVelocityScale;

    // Tangent vector in counter-clockwise galactic rotation
    const vx = -Math.sin(angle) * vCircular;
    const vz = Math.cos(angle) * vCircular;
    const vy = idx === 4 ? 0.35 : 0.0;

    return {
      id: idx + 1,
      position: [x, y, z],
      velocity: [vx, vy, vz],
      acceleration: [ax, 0, az],
      mass: 1.0,
      color: palette[idx % palette.length],
      trail: [[x, y, z]],
    };
  });
}
