import type { ScienceProvenanceType } from './galaxy';

export type ActiveObservatoryMode =
  | 'overview'
  | 'regions'
  | 'planets'
  | 'evolution'
  | 'gravity'
  | 'supernova'
  | 'dark-matter'
  | 'data';

export type QualityTier = 'Low' | 'Medium' | 'High' | 'Ultra';

export interface QualityPresetConfig {
  tier: QualityTier;
  label: string;
  starCount: number;
  dustCloudCount: number;
  hiiRegionCount: number;
  haloStarCount: number;
  pixelRatioMax: number;
  enableVolumetricGlow: boolean;
  description: string;
}

export interface EvolutionStage {
  id: string;
  index: number;
  cosmicTimeGyr: number; // 0.4 Gyr to 13.8 Gyr
  lookbackTimeGyr: number;
  redshift: number;
  title: string;
  subtitle: string;
  provenance: ScienceProvenanceType;
  description: string;
  physicalProcesses: string[];
  parameters: {
    diskFlattening: number; // 0 (clumpy spheroid) -> 1 (thin disk)
    spiralContrast: number; // 0 -> 1.3
    barStrength: number; // 0 -> 1
    starFormationRateSolarYr: number; // e.g. 25 M_sun/yr at peak -> 1.65 M_sun/yr today
    turbulenceDispersion: number; // velocity dispersion scale
    gasFraction: number; // 0.85 -> 0.12
    coreCompactness: number;
    youngBlueFraction: number;
  };
}

export interface GravityParticle {
  id: number;
  position: [number, number, number]; // in kpc
  velocity: [number, number, number]; // in kpc / Myr (or normalized orbital units)
  acceleration: [number, number, number];
  mass: number; // in 10^6 M_sun
  color: string;
  trail: [number, number, number][];
}

export interface GravityLabConfig {
  centralMassSolarPow10: number; // in 10^10 M_sun (default 1.8)
  initialVelocityScale: number; // 0.3 to 1.8 (1.0 = circular Keplerian/flat rotation speed)
  timeStep: number;
  isPaused: boolean;
  showVelocityVectors: boolean;
  showTrails: boolean;
  softeningLength: number;
  potentialModel: 'Keplerian Point' | 'Miyamoto-Nagai + NFW Halo';
}

export interface SupernovaState {
  isActive: boolean;
  progress: number; // 0 to 1
  explosionEnergyFoe: number; // 1 foe = 10^51 erg
  ambientDensityCm3: number; // atoms / cm^3
  shockRadiusPc: number;
  shockVelocityKms: number;
  temperatureMK: number;
  phase: 'Free Expansion' | 'Sedov-Taylor Adiabatic' | 'Radiative Snowplow' | 'ISM Mixing';
  originPosition: [number, number, number];
}

export interface SimulationMetadata {
  id: string;
  name: string;
  category: ScienceProvenanceType;
  institutionOrSource: string;
  publicationYear: number;
  spatialResolution: string;
  baryonicMassResolution: string;
  cosmologyModel: string;
  summary: string;
  fidelityNote: string;
  referenceUrl: string;
}

export interface SimulationSnapshotState {
  timestampGyr: number;
  activeStageId: string;
  totalStellarMassSolar: string;
  starFormationRate: number;
  rotationSpeedAtSunKms: number;
}

export interface SimulationProvider {
  readonly id: string;
  readonly name: string;
  readonly provenance: ScienceProvenanceType;
  readonly description: string;
  getMetadata(): SimulationMetadata;
  getSnapshotState(cosmicTimeGyr: number): SimulationSnapshotState;
}
