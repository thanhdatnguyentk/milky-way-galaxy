export type CameraControlMode = 'orbit' | 'free-flight' | 'autopilot';

export type ScaleViewLevel =
  | 'Intergalactic Overview'
  | 'Galactic Disk'
  | 'Spiral Arm Sector'
  | 'Local Stellar Neighborhood'
  | 'Galactic Core Close-Up';

export interface CameraPreset {
  id: string;
  name: string;
  subtitle: string;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export interface GuidedTourStop {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  regionId: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  durationSeconds: number;
  narrative: string;
  scientificCallout: string;
  scaleLabel: string;
}
