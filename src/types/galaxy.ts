export type ScienceProvenanceType =
  | 'Observational Data'
  | 'Scientific Simulation Data'
  | 'Procedural Model'
  | 'Simplified Physics Demo';

export type StellarPopulation =
  | 'bulge'
  | 'bar'
  | 'thin_disk'
  | 'thick_disk'
  | 'spiral_arm'
  | 'young_cluster'
  | 'halo';

export type SpiralArmName =
  | 'Perseus Arm'
  | 'Scutum-Centaurus Arm'
  | 'Sagittarius-Carina Arm'
  | 'Norma-Outer Arm'
  | 'Orion Spur';

export interface StarParticle {
  id: number;
  position: [number, number, number]; // Galactocentric [x, y, z] in scene units (1 unit = 1 kpc)
  velocity: [number, number, number]; // Orbital velocity [vx, vy, vz] in km/s
  color: [number, number, number]; // Normalized RGB [0..1]
  size: number;
  temperature: number; // Effective temperature in Kelvin
  luminosity: number; // Relative to L_sun
  population: StellarPopulation;
  regionId?: string;
}

export interface GalacticRegion {
  id: string;
  name: string;
  subtitle: string;
  category:
    | 'Galactic Core'
    | 'Spiral Structure'
    | 'Local Universe'
    | 'Outer Structure';
  provenance: ScienceProvenanceType;
  position: [number, number, number]; // Galactocentric coordinates in kpc (X, Y=vertical, Z)
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  distanceFromCenterKpc: number;
  distanceFromCenterLy: number;
  distanceFromSunKpc: number;
  dominantStellarPopulation: string;
  starFormationActivity: 'Extreme' | 'High' | 'Moderate' | 'Low' | 'Quiescent';
  estimatedMassSolar: string;
  summary: string;
  astrophysicalSignificance: string;
  observationalEvidence: string;
  keyMetrics: {
    label: string;
    value: string;
    unit?: string;
  }[];
  accentColor: string;
}

export interface GaiaStarRecord {
  id: string;
  designation: string;
  commonName: string;
  spectralType: string;
  distanceLy: number;
  distancePc: number;
  galactocentricPosKpc: [number, number, number];
  absMagnitude: number;
  temperatureK: number;
  radialVelocityKms: number;
  properMotionMasYr: [number, number];
  notes: string;
}
