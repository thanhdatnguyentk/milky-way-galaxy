export const KPC_TO_LIGHT_YEARS = 3261.563777;
export const PC_TO_LIGHT_YEARS = 3.261563777;
export const SUN_GALACTOCENTRIC_DISTANCE_KPC = 8.178; // GRAVITY Collaboration (2019)
export const SUN_GALACTOCENTRIC_DISTANCE_LY = Math.round(
  SUN_GALACTOCENTRIC_DISTANCE_KPC * KPC_TO_LIGHT_YEARS
); // ~26,673 năm ánh sáng
export const MILKY_WAY_DIAMETER_KPC = 32.0; // Đĩa sao ~30-32 kpc (~105,000 năm ánh sáng)
export const LOCAL_CIRCULAR_VELOCITY_KMS = 232.8; // km/s tại R_0

export function kpcToLy(kpc: number): number {
  return kpc * KPC_TO_LIGHT_YEARS;
}

export function formatDistanceKpcAndLy(kpc: number): string {
  if (kpc < 0.01) {
    const pc = kpc * 1000;
    const ly = pc * PC_TO_LIGHT_YEARS;
    return `${pc.toFixed(1)} pc (${ly.toFixed(1)} năm ánh sáng)`;
  }
  const ly = kpc * KPC_TO_LIGHT_YEARS;
  return `${kpc.toFixed(2)} kpc (${Math.round(ly).toLocaleString()} năm ánh sáng)`;
}

export function getScaleViewLabel(cameraDistanceKpc: number): {
  level: string;
  scaleBarKpc: number | string;
  scaleBarLy: string;
} {
  if (cameraDistanceKpc > 36) {
    return {
      level: 'Toàn Cảnh Liên Thiên Hà',
      scaleBarKpc: '10 kpc',
      scaleBarLy: '32.600 năm ánh sáng',
    };
  }
  if (cameraDistanceKpc > 16) {
    return {
      level: 'Toàn Bộ Đĩa Ngân Hà',
      scaleBarKpc: '5 kpc',
      scaleBarLy: '16.300 năm ánh sáng',
    };
  }
  if (cameraDistanceKpc > 6) {
    return {
      level: 'Phân Khu Nhánh Xoắn Ốc',
      scaleBarKpc: '2 kpc',
      scaleBarLy: '6.520 năm ánh sáng',
    };
  }
  if (cameraDistanceKpc > 1.8) {
    return {
      level: 'Vùng Lân Cận Sao Cục Bộ',
      scaleBarKpc: '0,5 kpc',
      scaleBarLy: '1.630 năm ánh sáng',
    };
  }
  if (cameraDistanceKpc > 0.24) {
    return {
      level: 'Cận Cảnh Cụm Sao (Sub-Parsec)',
      scaleBarKpc: '0,1 kpc',
      scaleBarLy: '326 năm ánh sáng',
    };
  }
  if (cameraDistanceKpc > 0.015) {
    return {
      level: 'Vi Mô Hệ Mặt Trời (Thang Quỹ Đạo AU)',
      scaleBarKpc: '10 AU',
      scaleBarLy: '1,496 tỷ km',
    };
  }
  return {
    level: 'Cận Cảnh Hành Tinh & Vệ Tinh',
    scaleBarKpc: '1,0 AU',
    scaleBarLy: '149,6 triệu km',
  };
}
