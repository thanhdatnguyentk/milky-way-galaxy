import type {
  SimulationMetadata,
  SimulationProvider,
  SimulationSnapshotState,
} from '@/types/simulation';
import { EVOLUTION_STAGES, SCIENCE_SOURCES } from '@/data/scienceSources';

export class ProceduralSimulationProvider implements SimulationProvider {
  readonly id = 'procedural-milky-way';
  readonly name = 'Parametric 4-Arm Logarithmic Spiral + Box/Peanut Bar';
  readonly provenance = 'Procedural Model' as const;
  readonly description =
    'GPU-evaluated logarithmic spiral density waves, triaxial stellar bar, and differential rotation curve.';

  getMetadata(): SimulationMetadata {
    return SCIENCE_SOURCES[3];
  }

  getSnapshotState(cosmicTimeGyr: number): SimulationSnapshotState {
    const closest = EVOLUTION_STAGES.reduce((prev, curr) =>
      Math.abs(curr.cosmicTimeGyr - cosmicTimeGyr) < Math.abs(prev.cosmicTimeGyr - cosmicTimeGyr)
        ? curr
        : prev
    );
    return {
      timestampGyr: cosmicTimeGyr,
      activeStageId: closest.id,
      totalStellarMassSolar: `${(0.4 + (cosmicTimeGyr / 13.8) * 5.6).toFixed(2)} × 10¹⁰ M☉`,
      starFormationRate: closest.parameters.starFormationRateSolarYr,
      rotationSpeedAtSunKms: Math.round(145 + (cosmicTimeGyr / 13.8) * 87.8),
    };
  }
}

export class LocalPhysicsSimulationProvider implements SimulationProvider {
  readonly id = 'local-leapfrog-integrator';
  readonly name = 'Browser Symplectic Leapfrog / Sedov-Taylor Solver';
  readonly provenance = 'Simplified Physics Demo' as const;
  readonly description =
    'Real-time Velocity Verlet orbital mechanics in a Miyamoto-Nagai + NFW gravitational potential and analytical Sedov-Taylor supernova blast expansion.';

  getMetadata(): SimulationMetadata {
    return {
      id: 'local-browser-physics',
      name: 'Symplectic Leapfrog & Sedov-Taylor Browser Solver',
      category: 'Simplified Physics Demo',
      institutionOrSource: 'Local Web Worker & WebGL2 GPU Pipeline',
      publicationYear: 2025,
      spatialResolution: 'Softened 0.15 kpc orbital test particles',
      baryonicMassResolution: 'Test-particle dynamics in analytic galactic potential',
      cosmologyModel: 'Miyamoto-Nagai Disk + NFW Halo + Central Point Mass',
      summary:
        'Computes real-time orbital trajectories and supernova shock radii directly in the browser without claiming full cosmological hydrodynamics.',
      fidelityNote:
        'Explicitly scoped as an interactive educational physics laboratory.',
      referenceUrl: 'https://en.wikipedia.org/wiki/Leapfrog_integration',
    };
  }

  getSnapshotState(cosmicTimeGyr: number): SimulationSnapshotState {
    return {
      timestampGyr: cosmicTimeGyr,
      activeStageId: 'secular-evolution',
      totalStellarMassSolar: '6.0 × 10¹⁰ M☉',
      starFormationRate: 1.65,
      rotationSpeedAtSunKms: 232.8,
    };
  }
}

export class PrecomputedDatasetProvider implements SimulationProvider {
  readonly id = 'precomputed-illustristng-gaia';
  readonly name = 'ESA Gaia DR3 & IllustrisTNG50 Reference Adapter';
  readonly provenance = 'Scientific Simulation Data' as const;
  readonly description =
    'Precomputed cosmological zoom-in evolution checkpoints (TNG50) paired with ESA Gaia DR3 astrometric anchors.';

  getMetadata(): SimulationMetadata {
    return SCIENCE_SOURCES[2];
  }

  getSnapshotState(cosmicTimeGyr: number): SimulationSnapshotState {
    const stage =
      EVOLUTION_STAGES.find((s) => Math.abs(s.cosmicTimeGyr - cosmicTimeGyr) < 1.2) ??
      EVOLUTION_STAGES[EVOLUTION_STAGES.length - 1];
    return {
      timestampGyr: stage.cosmicTimeGyr,
      activeStageId: stage.id,
      totalStellarMassSolar: '5.8 × 10¹⁰ M☉',
      starFormationRate: stage.parameters.starFormationRateSolarYr,
      rotationSpeedAtSunKms: 232.8,
    };
  }
}

export class FutureAISurrogateProvider implements SimulationProvider {
  readonly id = 'future-ai-neural-surrogate';
  readonly name = 'Neural Operator / AI Cosmological Surrogate Interface';
  readonly provenance = 'Scientific Simulation Data' as const;
  readonly description =
    'Extensible interface designed for neural field / diffusion surrogate emulators of sub-grid supernova feedback and N-body phase-space interpolation.';

  getMetadata(): SimulationMetadata {
    return {
      id: 'ai-surrogate-architecture',
      name: 'AI / HPC Cosmological Surrogate Adapter (Extensible Interface)',
      category: 'Scientific Simulation Data',
      institutionOrSource: 'Computational Astrophysics Neural Emulator Spec',
      publicationYear: 2025,
      spatialResolution: 'Sub-parsec neural super-resolution adapter',
      baryonicMassResolution: 'Emulator-ready tensor state interface',
      cosmologyModel: 'Hybrid HPC + Neural Sub-Grid Feedback',
      summary:
        'Architecture hook enabling pre-trained neural operators to stream baryonic density and supernova feedback states into WebGL/WebGPU buffers.',
      fidelityNote:
        'Cleanly decoupled SimulationProvider contract for connecting external AI surrogate checkpoints.',
      referenceUrl: 'https://www.tng-project.org/',
    };
  }

  getSnapshotState(cosmicTimeGyr: number): SimulationSnapshotState {
    return {
      timestampGyr: cosmicTimeGyr,
      activeStageId: 'secular-evolution',
      totalStellarMassSolar: '6.0 × 10¹⁰ M☉',
      starFormationRate: 1.65,
      rotationSpeedAtSunKms: 232.8,
    };
  }
}

export const SIMULATION_PROVIDERS: SimulationProvider[] = [
  new ProceduralSimulationProvider(),
  new PrecomputedDatasetProvider(),
  new LocalPhysicsSimulationProvider(),
  new FutureAISurrogateProvider(),
];
