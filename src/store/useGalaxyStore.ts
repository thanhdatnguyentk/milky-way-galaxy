import { create } from 'zustand';
import type {
  ActiveObservatoryMode,
  GravityLabConfig,
  GravityParticle,
  QualityTier,
  SupernovaState,
} from '@/types/simulation';
import type { CameraControlMode } from '@/types/camera';
import { GALAXY_REGION_MAP } from '@/data/galaxyRegions';
import { CAMERA_PRESETS, GUIDED_TOUR_STOPS } from '@/data/cameraPresets';
import { detectRecommendedQualityTier } from '@/utils/devicePerformance';
import { createInitialGravityParticles } from '@/simulation/integrators/leapfrog';

interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  transitionId: number;
}

interface GuidedTourState {
  isActive: boolean;
  isPlaying: boolean;
  currentStopIndex: number;
  stopProgress: number; // 0 to 1
}

interface GalaxyStoreState {
  hasDismissedHero: boolean;
  activeMode: ActiveObservatoryMode;
  selectedRegionId: string | null;
  hoveredRegionId: string | null;

  cameraControlMode: CameraControlMode;
  cameraPose: CameraPose;
  cameraDistanceKpc: number;

  qualityTier: QualityTier;
  fps: number;
  rotationSpeedMultiplier: number;
  showRegionMarkers: boolean;
  showSolarBeacon: boolean;
  showDustLanes: boolean;
  showStarLabels: boolean;

  // Evolution timeline state
  evolutionStageIndex: number;
  isEvolutionPlaying: boolean;

  // Dark Matter Halo state
  showDarkMatterHalo: boolean;
  darkMatterOpacity: number;
  includeDarkMatterInCurve: boolean;

  // Gravity Lab state
  gravityConfig: GravityLabConfig;
  gravityParticles: GravityParticle[];

  // Supernova Feedback state
  supernova: SupernovaState;

  // Guided Tour state
  tour: GuidedTourState;

  // Actions
  setDismissedHero: (dismissed: boolean) => void;
  setActiveMode: (mode: ActiveObservatoryMode) => void;
  selectRegion: (regionId: string | null, flyTo?: boolean) => void;
  setHoveredRegion: (regionId: string | null) => void;
  setCameraControlMode: (mode: CameraControlMode) => void;
  flyToPose: (position: [number, number, number], target: [number, number, number]) => void;
  applyCameraPreset: (presetId: string) => void;
  resetCameraOverview: () => void;
  setCameraDistanceKpc: (dist: number) => void;

  setQualityTier: (tier: QualityTier) => void;
  setFps: (fps: number) => void;
  setRotationSpeedMultiplier: (speed: number) => void;
  toggleRegionMarkers: () => void;
  toggleDustLanes: () => void;
  locateSun: () => void;
  exploreGalacticCenter: () => void;

  // Evolution actions
  setEvolutionStageIndex: (index: number) => void;
  toggleEvolutionPlay: () => void;

  // Dark Matter actions
  setShowDarkMatterHalo: (show: boolean) => void;
  setDarkMatterOpacity: (opacity: number) => void;
  setIncludeDarkMatterInCurve: (include: boolean) => void;

  // Gravity Lab actions
  updateGravityConfig: (partial: Partial<GravityLabConfig>) => void;
  setGravityParticles: (particles: GravityParticle[]) => void;
  spawnGravityParticle: () => void;
  resetGravityLab: () => void;

  // Supernova actions
  triggerSupernova: (origin?: [number, number, number]) => void;
  stepSupernovaProgress: (dtSeconds: number) => void;
  resetSupernova: () => void;

  // Guided Tour actions
  startGuidedTour: () => void;
  pauseGuidedTour: () => void;
  resumeGuidedTour: () => void;
  nextTourStop: () => void;
  prevTourStop: () => void;
  exitGuidedTour: () => void;
  tickGuidedTour: (dtSeconds: number) => void;
}

const initialGravityConfig: GravityLabConfig = {
  centralMassSolarPow10: 1.8,
  initialVelocityScale: 1.0,
  timeStep: 0.035,
  isPaused: false,
  showVelocityVectors: true,
  showTrails: true,
  softeningLength: 0.35,
  potentialModel: 'Miyamoto-Nagai + NFW Halo',
};

export const useGalaxyStore = create<GalaxyStoreState>((set, get) => ({
  hasDismissedHero: false,
  activeMode: 'overview',
  selectedRegionId: null,
  hoveredRegionId: null,

  cameraControlMode: 'orbit',
  cameraPose: {
    position: [0, 17.5, 25.5],
    target: [0, 0, 0],
    transitionId: 1,
  },
  cameraDistanceKpc: 30.9,

  qualityTier: detectRecommendedQualityTier(),
  fps: 60,
  rotationSpeedMultiplier: 1.0,
  showRegionMarkers: true,
  showSolarBeacon: true,
  showDustLanes: true,
  showStarLabels: true,

  evolutionStageIndex: 6, // Present Epoch (13.8 Gyr)
  isEvolutionPlaying: false,

  showDarkMatterHalo: false,
  darkMatterOpacity: 0.55,
  includeDarkMatterInCurve: true,

  gravityConfig: initialGravityConfig,
  gravityParticles: createInitialGravityParticles(initialGravityConfig),

  supernova: {
    isActive: false,
    progress: 0,
    explosionEnergyFoe: 1.2,
    ambientDensityCm3: 1.0,
    shockRadiusPc: 0.0,
    shockVelocityKms: 0,
    temperatureMK: 0,
    phase: 'Free Expansion',
    originPosition: [3.6, 0.0, 5.6], // Sagittarius-Carina star-forming complex by default
  },

  tour: {
    isActive: false,
    isPlaying: false,
    currentStopIndex: 0,
    stopProgress: 0,
  },

  setDismissedHero: (dismissed) => set({ hasDismissedHero: dismissed }),

  setActiveMode: (mode) => {
    const state = get();
    const updates: Partial<GalaxyStoreState> = {
      activeMode: mode,
      hasDismissedHero: true,
    };

    if (mode === 'dark-matter') {
      updates.showDarkMatterHalo = true;
      updates.cameraPose = {
        position: [15.5, 14.0, 21.0],
        target: [0, 0, 0],
        transitionId: state.cameraPose.transitionId + 1,
      };
    } else if (mode === 'gravity') {
      updates.cameraPose = {
        position: [0, 20.0, 14.5],
        target: [0, 0, 0],
        transitionId: state.cameraPose.transitionId + 1,
      };
    } else if (mode === 'supernova') {
      const origin = state.supernova.originPosition;
      updates.cameraPose = {
        position: [origin[0] + 2.8, origin[1] + 1.8, origin[2] + 3.4],
        target: origin,
        transitionId: state.cameraPose.transitionId + 1,
      };
    }

    set(updates);
  },

  selectRegion: (regionId, flyTo = true) => {
    if (!regionId) {
      set({ selectedRegionId: null });
      return;
    }
    const region = GALAXY_REGION_MAP[regionId];
    if (!region) return;

    const state = get();
    set({
      selectedRegionId: regionId,
      hasDismissedHero: true,
      cameraControlMode: state.tour.isActive ? 'autopilot' : 'orbit',
      ...(flyTo
        ? {
            cameraPose: {
              position: region.cameraPosition,
              target: region.cameraTarget,
              transitionId: state.cameraPose.transitionId + 1,
            },
          }
        : {}),
    });
  },

  setHoveredRegion: (regionId) => set({ hoveredRegionId: regionId }),

  setCameraControlMode: (mode) =>
    set((state) => ({
      cameraControlMode: mode,
      hasDismissedHero: true,
      tour: mode !== 'autopilot' ? { ...state.tour, isActive: false, isPlaying: false } : state.tour,
    })),

  flyToPose: (position, target) =>
    set((state) => ({
      cameraPose: {
        position,
        target,
        transitionId: state.cameraPose.transitionId + 1,
      },
    })),

  applyCameraPreset: (presetId) => {
    const preset = CAMERA_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    set((state) => ({
      hasDismissedHero: true,
      cameraControlMode: 'orbit',
      tour: { ...state.tour, isActive: false, isPlaying: false },
      cameraPose: {
        position: preset.position,
        target: preset.target,
        transitionId: state.cameraPose.transitionId + 1,
      },
    }));
  },

  resetCameraOverview: () =>
    set((state) => ({
      selectedRegionId: null,
      cameraControlMode: 'orbit',
      tour: { ...state.tour, isActive: false, isPlaying: false },
      cameraPose: {
        position: [0, 17.5, 25.5],
        target: [0, 0, 0],
        transitionId: state.cameraPose.transitionId + 1,
      },
    })),

  setCameraDistanceKpc: (dist) => set({ cameraDistanceKpc: dist }),

  setQualityTier: (tier) => set({ qualityTier: tier }),
  setFps: (fps) => set({ fps }),
  setRotationSpeedMultiplier: (speed) => set({ rotationSpeedMultiplier: speed }),
  toggleRegionMarkers: () => set((s) => ({ showRegionMarkers: !s.showRegionMarkers })),
  toggleDustLanes: () => set((s) => ({ showDustLanes: !s.showDustLanes })),

  locateSun: () => {
    const solar = GALAXY_REGION_MAP['solar-neighborhood'];
    const state = get();
    set({
      hasDismissedHero: true,
      activeMode: 'regions',
      selectedRegionId: 'solar-neighborhood',
      showSolarBeacon: true,
      cameraControlMode: 'orbit',
      tour: { ...state.tour, isActive: false, isPlaying: false },
      cameraPose: {
        position: solar.cameraPosition,
        target: solar.cameraTarget,
        transitionId: state.cameraPose.transitionId + 1,
      },
    });
  },

  exploreGalacticCenter: () => {
    const sgrA = GALAXY_REGION_MAP['sagittarius-a-star'];
    const state = get();
    set({
      hasDismissedHero: true,
      activeMode: 'regions',
      selectedRegionId: 'sagittarius-a-star',
      cameraControlMode: 'orbit',
      tour: { ...state.tour, isActive: false, isPlaying: false },
      cameraPose: {
        position: sgrA.cameraPosition,
        target: sgrA.cameraTarget,
        transitionId: state.cameraPose.transitionId + 1,
      },
    });
  },

  setEvolutionStageIndex: (index) =>
    set({
      evolutionStageIndex: Math.max(0, Math.min(6, index)),
    }),

  toggleEvolutionPlay: () => set((s) => ({ isEvolutionPlaying: !s.isEvolutionPlaying })),

  setShowDarkMatterHalo: (show) => set({ showDarkMatterHalo: show }),
  setDarkMatterOpacity: (opacity) => set({ darkMatterOpacity: opacity }),
  setIncludeDarkMatterInCurve: (include) => set({ includeDarkMatterInCurve: include }),

  updateGravityConfig: (partial) =>
    set((state) => ({
      gravityConfig: { ...state.gravityConfig, ...partial },
    })),

  setGravityParticles: (particles) => set({ gravityParticles: particles }),

  spawnGravityParticle: () => {
    const state = get();
    const count = state.gravityParticles.length;
    if (count >= 24) return;
    const r = 2.2 + Math.random() * 11.5;
    const angle = Math.random() * Math.PI * 2;
    const x = r * Math.cos(angle);
    const z = r * Math.sin(angle);
    const y = (Math.random() - 0.5) * 1.4;

    const vBase =
      Math.sqrt((4.3009 * state.gravityConfig.centralMassSolarPow10) / Math.max(0.5, r)) *
      state.gravityConfig.initialVelocityScale *
      (0.85 + Math.random() * 0.35);

    const vx = -Math.sin(angle) * vBase;
    const vz = Math.cos(angle) * vBase;
    const vy = (Math.random() - 0.5) * 0.25;

    const colors = ['#67E8F9', '#7AA8FF', '#F8C98B', '#34D399', '#A78BFA', '#F59E0B'];
    const newParticle: GravityParticle = {
      id: Date.now() + count,
      position: [x, y, z],
      velocity: [vx, vy, vz],
      acceleration: [0, 0, 0],
      mass: 0.8 + Math.random() * 1.5,
      color: colors[count % colors.length],
      trail: [[x, y, z]],
    };

    set({
      gravityParticles: [...state.gravityParticles, newParticle],
    });
  },

  resetGravityLab: () =>
    set((state) => ({
      gravityParticles: createInitialGravityParticles(state.gravityConfig),
    })),

  triggerSupernova: (origin) => {
    const state = get();
    const targetOrigin = origin ?? state.supernova.originPosition;
    set({
      hasDismissedHero: true,
      activeMode: 'supernova',
      supernova: {
        ...state.supernova,
        isActive: true,
        progress: 0.01,
        shockRadiusPc: 1.2,
        shockVelocityKms: 9800,
        temperatureMK: 85.0,
        phase: 'Free Expansion',
        originPosition: targetOrigin,
      },
      cameraPose: {
        position: [targetOrigin[0] + 2.5, targetOrigin[1] + 1.5, targetOrigin[2] + 3.0],
        target: targetOrigin,
        transitionId: state.cameraPose.transitionId + 1,
      },
    });
  },

  stepSupernovaProgress: (dtSeconds) => {
    const { supernova } = get();
    if (!supernova.isActive) return;

    const nextProgress = supernova.progress + dtSeconds * 0.085;
    if (nextProgress >= 1.0) {
      set({
        supernova: {
          ...supernova,
          isActive: false,
          progress: 1.0,
          phase: 'ISM Mixing',
          shockVelocityKms: 45,
          temperatureMK: 0.4,
        },
      });
      return;
    }

    // Analytical Sedov-Taylor scaling: R_s ~ (E / rho)^(1/5) * t^(2/5)
    const energyScale = Math.pow(
      supernova.explosionEnergyFoe / Math.max(0.1, supernova.ambientDensityCm3),
      0.2
    );
    const radiusPc = 48.0 * energyScale * Math.pow(nextProgress, 0.45);
    const velocityKms = Math.round(
      9500 * Math.pow(1.0 - nextProgress * 0.88, 2.4) + 65
    );
    const tempMK = Number((90.0 * Math.pow(1.0 - nextProgress * 0.85, 2.1) + 0.5).toFixed(1));

    let phase: SupernovaState['phase'] = 'Free Expansion';
    if (nextProgress > 0.16 && nextProgress <= 0.62) {
      phase = 'Sedov-Taylor Adiabatic';
    } else if (nextProgress > 0.62 && nextProgress <= 0.88) {
      phase = 'Radiative Snowplow';
    } else if (nextProgress > 0.88) {
      phase = 'ISM Mixing';
    }

    set({
      supernova: {
        ...supernova,
        progress: nextProgress,
        shockRadiusPc: Number(radiusPc.toFixed(1)),
        shockVelocityKms: velocityKms,
        temperatureMK: tempMK,
        phase,
      },
    });
  },

  resetSupernova: () =>
    set((state) => ({
      supernova: {
        ...state.supernova,
        isActive: false,
        progress: 0,
        shockRadiusPc: 0,
        shockVelocityKms: 0,
        temperatureMK: 0,
        phase: 'Free Expansion',
      },
    })),

  startGuidedTour: () => {
    const firstStop = GUIDED_TOUR_STOPS[0];
    const state = get();
    set({
      hasDismissedHero: true,
      activeMode: 'overview',
      selectedRegionId: firstStop.regionId,
      cameraControlMode: 'autopilot',
      showDarkMatterHalo: false,
      tour: {
        isActive: true,
        isPlaying: true,
        currentStopIndex: 0,
        stopProgress: 0,
      },
      cameraPose: {
        position: firstStop.cameraPosition,
        target: firstStop.cameraTarget,
        transitionId: state.cameraPose.transitionId + 1,
      },
    });
  },

  pauseGuidedTour: () =>
    set((state) => ({
      tour: { ...state.tour, isPlaying: false },
    })),

  resumeGuidedTour: () =>
    set((state) => ({
      tour: { ...state.tour, isPlaying: true },
    })),

  nextTourStop: () => {
    const state = get();
    const nextIdx = (state.tour.currentStopIndex + 1) % GUIDED_TOUR_STOPS.length;
    const stop = GUIDED_TOUR_STOPS[nextIdx];
    set({
      selectedRegionId: stop.regionId,
      showDarkMatterHalo: stop.id === 'stop-6-dark-matter-halo',
      tour: {
        ...state.tour,
        currentStopIndex: nextIdx,
        stopProgress: 0,
      },
      cameraPose: {
        position: stop.cameraPosition,
        target: stop.cameraTarget,
        transitionId: state.cameraPose.transitionId + 1,
      },
    });
  },

  prevTourStop: () => {
    const state = get();
    const prevIdx =
      (state.tour.currentStopIndex - 1 + GUIDED_TOUR_STOPS.length) % GUIDED_TOUR_STOPS.length;
    const stop = GUIDED_TOUR_STOPS[prevIdx];
    set({
      selectedRegionId: stop.regionId,
      showDarkMatterHalo: stop.id === 'stop-6-dark-matter-halo',
      tour: {
        ...state.tour,
        currentStopIndex: prevIdx,
        stopProgress: 0,
      },
      cameraPose: {
        position: stop.cameraPosition,
        target: stop.cameraTarget,
        transitionId: state.cameraPose.transitionId + 1,
      },
    });
  },

  exitGuidedTour: () =>
    set((state) => ({
      cameraControlMode: 'orbit',
      tour: {
        ...state.tour,
        isActive: false,
        isPlaying: false,
        stopProgress: 0,
      },
    })),

  tickGuidedTour: (dtSeconds) => {
    const state = get();
    if (!state.tour.isActive || !state.tour.isPlaying) return;
    const currentStop = GUIDED_TOUR_STOPS[state.tour.currentStopIndex];
    const nextProgress = state.tour.stopProgress + dtSeconds / currentStop.durationSeconds;

    if (nextProgress >= 1.0) {
      if (state.tour.currentStopIndex < GUIDED_TOUR_STOPS.length - 1) {
        get().nextTourStop();
      } else {
        set({
          tour: {
            ...state.tour,
            isPlaying: false,
            stopProgress: 1.0,
          },
        });
      }
    } else {
      set({
        tour: {
          ...state.tour,
          stopProgress: nextProgress,
        },
      });
    }
  },
}));
