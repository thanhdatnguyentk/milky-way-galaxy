export const KPC_TO_LIGHT_YEARS = 3261.563777;
export const PC_TO_LIGHT_YEARS = 3.261563777;
export const SUN_GALACTOCENTRIC_DISTANCE_KPC = 8.178; // GRAVITY Collaboration (2019)
export const SUN_GALACTOCENTRIC_DISTANCE_LY = Math.round(
  SUN_GALACTOCENTRIC_DISTANCE_KPC * KPC_TO_LIGHT_YEARS
); // ~26,673 ly
export const MILKY_WAY_DIAMETER_KPC = 32.0; // Stellar disk ~30-32 kpc (~105,000 ly)
export const LOCAL_CIRCULAR_VELOCITY_KMS = 232.8; // km/s at R_0

export function kpcToLy(kpc: number): number {
  return kpc * KPC_TO_LIGHT_YEARS;
}

export function formatDistanceKpcAndLy(kpc: number): string {
  if (kpc < 0.01) {
    const pc = kpc * 1000;
    const ly = pc * PC_TO_LIGHT_YEARS;
    return `${pc.toFixed(1)} pc (${ly.toFixed(1)} ly)`;
  }
  const ly = kpc * KPC_TO_LIGHT_YEARS;
  return `${kpc.toFixed(2)} kpc (${Math.round(ly).toLocaleString()} ly)`;
}

export function getScaleViewLabel(cameraDistanceKpc: number): {
  level: string;
  scaleBarKpc: number;
  scaleBarLy: string;
} {
  if (cameraDistanceKpc > 36) {
    return {
      level: 'Intergalactic Overview',
      scaleBarKpc: 10,
      scaleBarLy: '32,600 ly',
    };
  }
  if (cameraDistanceKpc > 16) {
    return {
      level: 'Full Galactic Disk',
      scaleBarKpc: 5,
      scaleBarLy: '16,300 ly',
    };
  }
  if (cameraDistanceKpc > 6) {
    return {
      level: 'Spiral Arm Sector',
      scaleBarKpc: 2,
      scaleBarLy: '6,520 ly',
    };
  }
  if (cameraDistanceKpc > 1.8) {
    return {
      level: 'Stellar Neighborhood',
      scaleBarKpc: 0.5,
      scaleBarLy: '1,630 ly',
    };
  }
  return {
    level: 'Sub-Parsec / Core Detail',
    scaleBarKpc: 0.1,
    scaleBarLy: '326 ly',
  };
}
