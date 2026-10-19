import type { CameraPreset, GuidedTourStop } from '@/types/camera';

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'galactic-overview',
    name: 'Toàn Cảnh Ngân Hà (45°)',
    subtitle: 'Góc Nhìn Đài Quan Sát Nghiêng Chuẩn',
    position: [0, 17.5, 25.5],
    target: [0, 0, 0],
    fov: 48,
  },
  {
    id: 'top-down-atlas',
    name: 'Cực Bắc Ngân Hà (Nhìn Thẳng)',
    subtitle: 'Bản Đồ Cấu Trúc 4 Nhánh Xoắn Ốc',
    position: [0, 34.0, 0.01],
    target: [0, 0, 0],
    fov: 45,
  },
  {
    id: 'edge-on-profile',
    name: 'Mặt Cắt Ngang Đĩa & Bầu',
    subtitle: 'Đĩa Mỏng, Bầu Hộp/Đậu Phộng & Quầng Thiên Hà',
    position: [28.0, 1.2, 0.0],
    target: [0, 0, 0],
    fov: 45,
  },
  {
    id: 'galactic-core-dive',
    name: 'Lõi Thiên Hà & Hố Đen Sgr A*',
    subtitle: 'Bên Trong Vùng Phân Tử Trung Tâm',
    position: [0.0, 0.42, 0.92],
    target: [0, 0, 0],
    fov: 50,
  },
  {
    id: 'solar-vantage',
    name: 'Vùng Lân Cận Mặt Trời (~8,18 kpc)',
    subtitle: 'Bong Bóng Cục Bộ Trong Nhánh Orion',
    position: [0.85, 0.65, 9.45],
    target: [0.0, 0.02, 8.178],
    fov: 48,
  },
];

export const GUIDED_TOUR_STOPS: GuidedTourStop[] = [
  {
    id: 'stop-1-architecture',
    stepNumber: 1,
    title: 'Kiến Trúc Tổng Thể Của Dải Ngân Hà',
    subtitle: 'Thiên Hà Xoắn Ốc Có Thanh Chắn Rộng 105.000 Năm Ánh Sáng',
    regionId: 'galactic-bar',
    cameraPosition: [0.0, 21.0, 27.0],
    cameraTarget: [0.0, 0.0, 0.0],
    durationSeconds: 11,
    narrative:
      'Chào mừng bạn đến với Dải Ngân Hà (Milky Way)—một thiên hà xoắn ốc có thanh chắn (loại SBbc) chứa từ 100 đến 400 tỷ ngôi sao và tổng khối lượng khoảng 1,15 nghìn tỷ lần Mặt Trời. Bốn nhánh xoắn ốc logarit vươn ra từ một thanh sao ba trục đang quay ở trung tâm.',
    scientificCallout:
      'Mô hình tham số 4 nhánh xoắn ốc logarit + Thanh chắn dạng hộp/đậu phộng hiệu chuẩn theo dữ liệu Spitzer GLIMPSE & thị sai maser VLBI (Reid et al. 2019).',
    scaleLabel: 'Quy Mô Toàn Thiên Hà · 32 kpc (105.000 năm ánh sáng)',
  },
  {
    id: 'stop-2-spiral-arms',
    stepNumber: 2,
    title: 'Sóng Mật Độ Hấp Dẫn Ở Các Nhánh Xoắn Ốc',
    subtitle: 'Nhánh Scutum-Centaurus & Nhánh Perseus',
    regionId: 'scutum-centaurus-arm',
    cameraPosition: [-7.2, 4.2, 7.6],
    cameraTarget: [-3.8, 0.0, 3.6],
    durationSeconds: 11,
    narrative:
      'Các nhánh xoắn ốc không phải là những cấu trúc cứng cố định; chúng là các sóng mật độ hấp dẫn truyền qua đĩa sao. Khi các đám mây khí liên sao đi vào vùng nén này, sóng xung kích kích hoạt sự ra đời của hàng loạt sao trẻ OB xanh lam rực rỡ dọc theo các dải bụi tối.',
    scientificCallout:
      'Quay Vi Sai Thiên Hà: Các ngôi sao vùng trong hoàn thành một vòng quỹ đạo sau ~50 triệu năm, trong khi sao ở đĩa ngoài cần hơn 250 triệu năm.',
    scaleLabel: 'Phân Khu Nhánh Xoắn Ốc · Cách Tâm 5,2 kpc',
  },
  {
    id: 'stop-3-star-nurseries',
    stepNumber: 3,
    title: 'Vườn Ươm Sao & Chuỗi Tinh Vân Ion Hóa',
    subtitle: 'Chuỗi Tạo Sao Nhánh Sagittarius-Carina',
    regionId: 'sagittarius-carina-arm',
    cameraPosition: [6.8, 2.6, 8.4],
    cameraTarget: [3.6, 0.0, 5.6],
    durationSeconds: 11,
    narrative:
      'Bên trong nhánh Sagittarius-Carina, bức xạ tử ngoại cực mạnh từ các ngôi sao loại O mới hình thành đã ion hóa khí hydro xung quanh thành những vùng HII phát sáng đỏ thẫm và xanh lơ—bao gồm Tinh vân Carina, Đầm Phá (Lagoon) và Đại Bàng (Eagle).',
    scientificCallout:
      'Tốc độ tạo sao hiện tại của Ngân Hà (SFR): ~1,65 ± 0,19 khối lượng Mặt Trời mỗi năm trong các đám mây phân tử khổng lồ.',
    scaleLabel: 'Tổ Hợp Tinh Vân · Cách Tâm 6,6 kpc',
  },
  {
    id: 'stop-4-solar-home',
    stepNumber: 4,
    title: 'Chúng Ta Đang Ở Đâu? Vùng Lân Cận Mặt Trời',
    subtitle: 'Cách Tâm Ngân Hà 8,178 Kiloparsec (26.673 Năm Ánh Sáng)',
    regionId: 'solar-neighborhood',
    cameraPosition: [0.95, 0.68, 9.55],
    cameraTarget: [0.0, 0.02, 8.178],
    durationSeconds: 11,
    narrative:
      'Nằm dọc theo rìa trong của Nhánh Orion, Hệ Mặt Trời chuyển động quanh tâm thiên hà với vận tốc 232,8 km/s bên trong Bong Bóng Cục Bộ—một khoang khí được tạo ra bởi các vụ nổ siêu tân tinh cổ đại. Mặt Trời mất khoảng 226 triệu năm để hoàn thành một Năm Ngân Hà.',
    scientificCallout:
      'Mốc Quan Sát Thực Nghiệm: R₀ = 8.178 ± 13 pc (26.673 năm ánh sáng) đo bằng giao thoa kế VLT GRAVITY & ESA Gaia DR3.',
    scaleLabel: 'Lân Cận Mặt Trời · R₀ = 8,178 kpc',
  },
  {
    id: 'stop-5-galactic-center',
    stepNumber: 5,
    title: 'Tiến Vào Lõi Thiên Hà & Hố Đen Sagittarius A*',
    subtitle: 'Cụm Sao Nhân & Hố Đen Siêu Khối Lượng 4,15 Triệu M☉',
    regionId: 'sagittarius-a-star',
    cameraPosition: [0.0, 0.36, 0.82],
    cameraTarget: [0.0, 0.0, 0.0],
    durationSeconds: 11,
    narrative:
      'Lao sâu 26.673 năm ánh sáng vào tâm xuyên qua các dải bụi dày đặc, chúng ta tiến tới Tâm Thiên Hà. Tại đây, mười triệu ngôi sao trên mỗi parsec khối chuyển động quanh hố đen Sagittarius A*, nơi ngôi sao S2 lướt qua cận điểm với tốc độ bằng 2,55% vận tốc ánh sáng.',
    scientificCallout:
      'Mô phỏng minh họa đĩa bồi tụ tương đối tính & vòng photon phóng đại tỷ lệ để quan sát trực quan (bán kính Schwarzschild thực r_s = 0,082 AU).',
    scaleLabel: 'Cận Cảnh Chân Trời Sự Kiện · Sgr A* (4,15 × 10⁶ M☉)',
  },
  {
    id: 'stop-6-dark-matter-halo',
    stepNumber: 6,
    title: 'Kiến Trúc Vô Hình: Quầng Vật Chất Tối NFW',
    subtitle: 'Dòng Sao Cổ Đại & Khung Xương Hấp Dẫn Vật Chất Tối',
    regionId: 'galactic-halo',
    cameraPosition: [16.5, 14.5, 20.5],
    cameraTarget: [0.0, 0.0, 0.0],
    durationSeconds: 12,
    narrative:
      'Thu phóng ra quy mô liên thiên hà hé lộ bức tranh toàn diện: đĩa sao phát sáng chỉ chiếm ~5% tổng khối lượng thiên hà. Một quầng vật chất tối Navarro-Frenk-White (NFW) vô hình trải rộng hơn 200 kiloparsec chính là mỏ neo hấp dẫn giữ cho toàn bộ đĩa Ngân Hà không bị văng rời.',
    scientificCallout:
      'Bối Cảnh Vũ Trụ Học: Tổng khối lượng Virial M_200 ≈ 1,15 × 10¹² M☉ suy ra từ động học các cụm sao cầu và thiên hà vệ tinh.',
    scaleLabel: 'Quầng Bao Thể Tích · Góc Nhìn > 30 kpc',
  },
];
