import type {
  SimulationMetadata,
  SimulationProvider,
  SimulationSnapshotState,
} from '@/types/simulation';
import { EVOLUTION_STAGES, SCIENCE_SOURCES } from '@/data/scienceSources';

export class ProceduralSimulationProvider implements SimulationProvider {
  readonly id = 'procedural-milky-way';
  readonly name = 'Mô Hình Tham Số Xoắn Ốc Logarit 4 Nhánh + Thanh Ba Trục';
  readonly provenance = 'Procedural Model' as const;
  readonly description =
    'Tính toán trên GPU sóng mật độ xoắn ốc logarit, thanh sao dạng hộp/đậu phộng và đường cong quay vi sai.';

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
  readonly name = 'Bộ Giải Số Symplectic Leapfrog / Sedov-Taylor Trên Trình Duyệt';
  readonly provenance = 'Simplified Physics Demo' as const;
  readonly description =
    'Tích phân quỹ đạo Velocity Verlet thời gian thực trong thế hấp dẫn Miyamoto-Nagai + NFW và nghiệm giải tích sóng xung kích siêu tân tinh Sedov-Taylor.';

  getMetadata(): SimulationMetadata {
    return {
      id: 'local-browser-physics',
      name: 'Bộ Giải Số Symplectic Leapfrog & Sedov-Taylor Cục Bộ',
      category: 'Simplified Physics Demo',
      institutionOrSource: 'Web Worker & Đường Ống WebGL2 GPU Trình Duyệt',
      publicationYear: 2025,
      spatialResolution: 'Hạt thử nghiệm quỹ đạo làm mềm hấp dẫn 0,15 kpc',
      baryonicMassResolution: 'Động lực học hạt thử trong thế hấp dẫn giải tích của thiên hà',
      cosmologyModel: 'Đĩa Miyamoto-Nagai + Quầng NFW + Khối Lượng Điểm Trung Tâm',
      summary:
        'Tính toán quỹ đạo sao và bán kính sóng xung kích siêu tân tinh trực tiếp trên trình duyệt theo thời gian thực.',
      fidelityNote:
        'Được phân định rõ ràng là phòng thí nghiệm vật lý tương tác giáo dục trên trình duyệt.',
      referenceUrl: 'https://en.wikipedia.org/wiki/Leapfrog_integration',
    };
  }

  getSnapshotState(cosmicTimeGyr: number): SimulationSnapshotState {
    return {
      timestampGyr: cosmicTimeGyr,
      activeStageId: 'secular-evolution',
      totalStellarMassSolar: '6,0 × 10¹⁰ M☉',
      starFormationRate: 1.65,
      rotationSpeedAtSunKms: 232.8,
    };
  }
}

export class PrecomputedDatasetProvider implements SimulationProvider {
  readonly id = 'precomputed-illustristng-gaia';
  readonly name = 'Bộ Chuyển Đổi Dữ Liệu ESA Gaia DR3 & IllustrisTNG50';
  readonly provenance = 'Scientific Simulation Data' as const;
  readonly description =
    'Các mốc tiến hóa mô phỏng vũ trụ học tính sẵn (TNG50) kết hợp cùng mốc đo lường thiên văn ESA Gaia DR3.';

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
      totalStellarMassSolar: '5,8 × 10¹⁰ M☉',
      starFormationRate: stage.parameters.starFormationRateSolarYr,
      rotationSpeedAtSunKms: 232.8,
    };
  }
}

export class FutureAISurrogateProvider implements SimulationProvider {
  readonly id = 'future-ai-neural-surrogate';
  readonly name = 'Giao Diện Mô Hình Thay Thế AI / Neural Operator Vũ Trụ Học';
  readonly provenance = 'Scientific Simulation Data' as const;
  readonly description =
    'Giao diện mở rộng cho phép kết nối các mô hình học sâu (Neural Operator / Diffusion Emulator) nội suy phản hồi siêu tân tinh và không gian pha N-body.';

  getMetadata(): SimulationMetadata {
    return {
      id: 'ai-surrogate-architecture',
      name: 'Adapter Mô Hình Thay Thế AI / HPC (Giao Diện Mở Rộng)',
      category: 'Scientific Simulation Data',
      institutionOrSource: 'Đặc Tả Trình Giả Lập Thần Kinh Vật Lý Thiên Văn Tính Toán',
      publicationYear: 2025,
      spatialResolution: 'Adapter siêu phân giải thần kinh quy mô dưới parsec',
      baryonicMassResolution: 'Giao diện trạng thái tensor sẵn sàng cho AI Emulator',
      cosmologyModel: 'Lai Ghép HPC + Phản Hồi Dưới Lưới Bằng Mạng Thần Kinh',
      summary:
        'Kiến trúc mở cho phép truyền trực tiếp các trạng thái mật độ baryon và phản hồi siêu tân tinh từ mô hình AI đã huấn luyện vào bộ đệm WebGL/WebGPU.',
      fidelityNote:
        'Hợp đồng giao diện SimulationProvider tách biệt hoàn toàn tầng hiển thị và tầng dữ liệu mô phỏng.',
      referenceUrl: 'https://www.tng-project.org/',
    };
  }

  getSnapshotState(cosmicTimeGyr: number): SimulationSnapshotState {
    return {
      timestampGyr: cosmicTimeGyr,
      activeStageId: 'secular-evolution',
      totalStellarMassSolar: '6,0 × 10¹⁰ M☉',
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
