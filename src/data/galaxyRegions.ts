import type { GalacticRegion } from '@/types/galaxy';

/**
 * Hệ quy chiếu tọa độ trong không gian 3D:
 * 1 đơn vị (scene unit) = 1 kiloparsec (kpc) = 3.261,56 năm ánh sáng.
 * Tâm Ngân Hà = [0, 0, 0]
 * Mặt phẳng Ngân Hà = mặt phẳng X-Z (trục Y là độ cao z_gal vuông góc với đĩa)
 * Vùng Lân Cận Mặt Trời = [0.0, 0.02, 8.178] (~8.178 kpc từ Tâm Ngân Hà trong Nhánh Orion)
 */
export const GALAXY_REGIONS: GalacticRegion[] = [
  {
    id: 'galactic-center',
    name: 'Tâm Thiên Hà (Galactic Center)',
    subtitle: 'Vùng Phân Tử Trung Tâm & Cụm Sao Nhân',
    category: 'Galactic Core',
    provenance: 'Observational Data',
    position: [0.0, 0.0, 0.0],
    cameraPosition: [0.0, 2.2, 4.2],
    cameraTarget: [0.0, 0.0, 0.0],
    distanceFromCenterKpc: 0.0,
    distanceFromCenterLy: 0,
    distanceFromSunKpc: 8.18,
    dominantStellarPopulation: 'Sao khổng lồ đỏ già giàu kim loại, sao Wolf-Rayet & siêu khổng lồ OB trong cụm nhân',
    starFormationActivity: 'Extreme',
    estimatedMassSolar: '~2,0 × 10¹⁰ M☉ (Bầu trung tâm + Đĩa nhân)',
    summary:
      'Trái tim hấp dẫn và động lực học của Dải Ngân Hà. Trong phạm vi 500 parsec trong cùng là Vùng Phân Tử Trung Tâm (CMZ), chứa khoảng 60 triệu khối lượng Mặt Trời khí phân tử đậm đặc và Cụm Sao Nhân—môi trường sao dày đặc nhất thiên hà.',
    astrophysicalSignificance:
      'Được thúc đẩy bởi dòng khí chảy vào dọc theo các dải bụi của Thanh Thiên Hà, Tâm Thiên Hà sở hữu từ trường cực mạnh (cỡ milligauss), các sợi phát xạ phi nhiệt tương đối tính và những cụm sao trẻ khổng lồ như Arches và Quintuplet.',
    observationalEvidence:
      'Quan sát qua bước sóng hồng ngoại, dưới milimet và tia X (JWST, ALMA, Chandra, MeerKAT) để xuyên qua lớp bụi che khuất ~30 cấp sao ở bước sóng khả kiến.',
    keyMetrics: [
      { label: 'Bán kính từ tâm', value: '< 0,25', unit: 'kpc' },
      { label: 'Mật độ sao tại lõi', value: '~10⁷', unit: 'sao / pc³' },
      { label: 'Độ tắt sáng bụi (A_V)', value: '~30', unit: 'cấp sao' },
      { label: 'Khối lượng khí phân tử', value: '6 × 10⁷', unit: 'M☉' },
    ],
    accentColor: '#F8C98B',
  },
  {
    id: 'sagittarius-a-star',
    name: 'Sagittarius A* (Hố Đen Trung Tâm)',
    subtitle: 'Hố Đen Siêu Khối Lượng Trung Tâm (Sgr A*)',
    category: 'Galactic Core',
    provenance: 'Observational Data',
    position: [0.0, 0.0, 0.0],
    cameraPosition: [0.0, 0.38, 0.85],
    cameraTarget: [0.0, 0.0, 0.0],
    distanceFromCenterKpc: 0.0,
    distanceFromCenterLy: 0,
    distanceFromSunKpc: 8.178,
    dominantStellarPopulation: 'Cụm sao S (các sao dãy chính loại B trên quỹ đạo tương đối tính cực hẹp)',
    starFormationActivity: 'Quiescent',
    estimatedMassSolar: '4,154 × 10⁶ M☉',
    summary:
      'Nguồn phát xạ vô tuyến компакт và hố đen siêu khối lượng neo giữ trung tâm Dải Ngân Hà. Khối lượng 4,15 triệu lần Mặt Trời của nó được xác định chính xác tuyệt đối nhờ theo dõi quỹ đạo 16 năm của ngôi sao S2.',
    astrophysicalSignificance:
      'Sgr A* là phòng thí nghiệm tự nhiên hàng đầu để kiểm chứng thuyết tương đối rộng trong trường hấp dẫn mạnh, bao gồm dịch chuyển đỏ hấp dẫn, tiến động cận điểm Schwarzschild và dòng bồi tụ từ hóa.',
    observationalEvidence:
      'Bóng chân trời sự kiện được chụp trực tiếp bởi Kính thiên văn Chân trời Sự kiện (EHT, 2022) ở bước sóng 1,3 mm; quỹ đạo sao đo bằng giao thoa kế VLT GRAVITY và quang học thích nghi Keck.',
    keyMetrics: [
      { label: 'Khối lượng hố đen', value: '4,154 × 10⁶', unit: 'M☉' },
      { label: 'Bán kính Schwarzschild', value: '12,3 × 10⁶', unit: 'km (0,082 AU)' },
      { label: 'Vận tốc cận điểm sao S2', value: '7.650', unit: 'km/s (2,55% c)' },
      { label: 'Đường kính góc bóng', value: '51,8', unit: 'μas' },
    ],
    accentColor: '#F59E0B',
  },
  {
    id: 'galactic-bar',
    name: 'Thanh Thiên Hà (Galactic Bar)',
    subtitle: 'Thanh Sao Ba Trục Dạng Hộp / Đậu Phộng',
    category: 'Galactic Core',
    provenance: 'Procedural Model',
    position: [1.8, 0.0, 1.4],
    cameraPosition: [5.5, 4.8, 6.2],
    cameraTarget: [0.8, 0.0, 0.6],
    distanceFromCenterKpc: 2.3,
    distanceFromCenterLy: 7500,
    distanceFromSunKpc: 6.4,
    dominantStellarPopulation: 'Sao Quần thể II & sao khổng lồ đỏ K/M giàu kim loại (tuổi 8–11 tỷ năm)',
    starFormationActivity: 'Low',
    estimatedMassSolar: '~1,8 × 10¹⁰ M☉',
    summary:
      'Dải Ngân Hà là một thiên hà xoắn ốc có thanh chắn (loại SBbc). Thanh sao ba trục ở trung tâm trải dài ~4,5–5,0 kpc mỗi nửa chiều dài, nằm nghiêng một góc ~27°–30° so với đường ngắm từ Mặt Trời tới Tâm Thiên Hà.',
    astrophysicalSignificance:
      'Đóng vai trò như một động cơ mô-men xoắn hấp dẫn, thanh sao quay thúc đẩy tiến hóa thế kỷ—quét khí liên sao vào Vùng Phân Tử Trung Tâm và kích thích các sóng mật độ xoắn ốc.',
    observationalEvidence:
      'Lập bản đồ 3D qua khảo sát VVV, 2MASS và dữ liệu đếm sao khổng lồ đỏ từ ESA Gaia, cho thấy cấu trúc phình hình chữ X khi nhìn ngang.',
    keyMetrics: [
      { label: 'Bán trục lớn thanh', value: '4,6 ± 0,3', unit: 'kpc' },
      { label: 'Góc nghiêng (φ_bar)', value: '28°', unit: 'so với trục Mặt Trời-Tâm' },
      { label: 'Tốc độ góc mẫu (Ω_b)', value: '38–41', unit: 'km/s/kpc' },
      { label: 'Bán kính đồng quay', value: '~6,0', unit: 'kpc' },
    ],
    accentColor: '#F8C98B',
  },
  {
    id: 'scutum-centaurus-arm',
    name: 'Nhánh Scutum-Centaurus',
    subtitle: 'Nhánh Xoắn Ốc Chính Phía Trong (Lá Chắn - Bán Nhân Mã)',
    category: 'Spiral Structure',
    provenance: 'Procedural Model',
    position: [-3.8, 0.0, 3.6],
    cameraPosition: [-6.8, 3.8, 7.2],
    cameraTarget: [-3.8, 0.0, 3.6],
    distanceFromCenterKpc: 5.2,
    distanceFromCenterLy: 16960,
    distanceFromSunKpc: 5.9,
    dominantStellarPopulation: 'Trục xương sống sao già mật độ cao + quần hợp sao trẻ OB & cụm siêu khổng lồ đỏ',
    starFormationActivity: 'Extreme',
    estimatedMassSolar: '~8,5 × 10⁹ M☉',
    summary:
      'Một trong hai nhánh mật độ khối lượng sao chính xuất phát trực tiếp từ đầu gần của Thanh Thiên Hà. Không giống các nhánh phụ chỉ giàu khí, Scutum-Centaurus thể hiện mật độ vượt trội liên tục của cả sao già lẫn các tổ hợp tạo sao trẻ.',
    astrophysicalSignificance:
      'Tại giao điểm giữa đầu Thanh Thiên Hà và nhánh Scutum-Centaurus (~4,5 kpc), các đám mây phân tử khổng lồ va chạm mạnh, kích hoạt sự ra đời hàng loạt của các cụm sao siêu khổng lồ đỏ (RSGC1, RSGC2/Stephenson 2).',
    observationalEvidence:
      'Xác nhận qua khảo sát đếm sao hồng ngoại Spitzer GLIMPSE và đo thị sai maser vùng tạo sao khối lượng lớn (BeSSeL / VERA).',
    keyMetrics: [
      { label: 'Góc mở xoắn ốc', value: '12,1°', unit: 'xoắn ốc logarit' },
      { label: 'Độ tăng mật độ sao', value: '+35%', unit: 'so với trung bình đĩa' },
      { label: 'Tổ hợp bùng nổ sao', value: 'W43 & RSGC1–3', unit: 'starburst' },
      { label: 'Vận tốc quỹ đạo', value: '~228', unit: 'km/s' },
    ],
    accentColor: '#7AA8FF',
  },
  {
    id: 'perseus-arm',
    name: 'Nhánh Perseus (Anh Tiên)',
    subtitle: 'Nhánh Xoắn Ốc Chính Phía Ngoài',
    category: 'Spiral Structure',
    provenance: 'Observational Data',
    position: [2.2, 0.0, 10.1],
    cameraPosition: [5.2, 4.0, 14.5],
    cameraTarget: [2.2, 0.0, 10.1],
    distanceFromCenterKpc: 10.3,
    distanceFromCenterLy: 33600,
    distanceFromSunKpc: 2.9,
    dominantStellarPopulation: 'Quần hợp sao trẻ OB, sao biến quang Cepheid, tàn dư siêu tân tinh (Tinh vân Con Cua, Cas A)',
    starFormationActivity: 'High',
    estimatedMassSolar: '~6,2 × 10⁹ M☉',
    summary:
      'Nhánh xoắn ốc đối xứng chính thứ hai của Dải Ngân Hà, bắt nguồn từ đầu xa của Thanh Thiên Hà và cuộn ra phía ngoài qua vùng Lân Cận Mặt Trời ở bán kính ~9,5–11 kpc.',
    astrophysicalSignificance:
      'Nơi tọa lạc của các vùng tạo sao biểu tượng (W3/W4/W5, Tinh vân Trái Tim & Linh Hồn, NGC 7538) và Cụm Sao Đôi trong chòm Anh Tiên, định hình sóng mật độ sao phía ngoài.',
    observationalEvidence:
      'Đo thị sai lượng giác độ chính xác cao từ maser nước/methanol VLBA và dữ liệu sao OB của Gaia DR3.',
    keyMetrics: [
      { label: 'Bán kính từ tâm', value: '9,8–11,2', unit: 'kpc' },
      { label: 'Góc mở xoắn ốc', value: '11,5°', unit: 'xoắn ốc logarit' },
      { label: 'Khoảng cách gần Mặt Trời nhất', value: '~1,95', unit: 'kpc (6.400 ly)' },
      { label: 'Tàn dư siêu tân tinh', value: 'M1 Con Cua, Cas A', unit: 'SNR' },
    ],
    accentColor: '#67E8F9',
  },
  {
    id: 'sagittarius-carina-arm',
    name: 'Nhánh Sagittarius-Carina',
    subtitle: 'Nhánh Xoắn Ốc Giàu Khí & Chuỗi Tinh Vân Phát Xạ',
    category: 'Spiral Structure',
    provenance: 'Observational Data',
    position: [3.6, 0.0, 5.6],
    cameraPosition: [7.4, 3.2, 8.8],
    cameraTarget: [3.6, 0.0, 5.6],
    distanceFromCenterKpc: 6.6,
    distanceFromCenterLy: 21500,
    distanceFromSunKpc: 2.7,
    dominantStellarPopulation: 'Các vùng HII phát sáng mạnh, sao loại O, sao biến quang xanh cực sáng (Eta Carinae)',
    starFormationActivity: 'High',
    estimatedMassSolar: '~4,5 × 10⁹ M☉',
    summary:
      'Nằm ngay phía trong quỹ đạo Mặt Trời hướng về Tâm Thiên Hà, nhánh Sagittarius-Carina nổi tiếng với chuỗi tinh vân phát xạ rực rỡ quan sát được từ Trái Đất: Tinh vân Đầm Phá (M8), Đại Bàng (M16), Omega (M17) và Carina (NGC 3372).',
    astrophysicalSignificance:
      'Dù có mật độ sao già loại K thấp hơn nhánh Scutum-Centaurus, sự nén khí phân tử mạnh mẽ tại đây nuôi dưỡng những vùng hydro ion hóa (HII) khổng lồ và các cột bụi tạo sao.',
    observationalEvidence:
      'Theo dõi dọc bầu trời qua bức xạ H-alpha, khảo sát vạch phổ phân tử CO và bản đồ sao trẻ dãy chính trên từ Gaia DR3.',
    keyMetrics: [
      { label: 'Bán kính từ tâm', value: '6,2–7,4', unit: 'kpc' },
      { label: 'Tinh vân tiêu biểu', value: 'Carina (NGC 3372)', unit: 'tổ hợp HII' },
      { label: 'Góc mở xoắn ốc', value: '12,0°', unit: 'độ' },
      { label: 'Thông lượng ion hóa', value: 'Bức xạ UV cực cao', unit: 'sao OB' },
    ],
    accentColor: '#7AA8FF',
  },
  {
    id: 'orion-arm',
    name: 'Nhánh Orion / Nhánh Cục Bộ',
    subtitle: 'Phân Đoạn Xoắn Ốc Cục Bộ & Sóng Radcliffe',
    category: 'Local Universe',
    provenance: 'Observational Data',
    position: [-1.1, 0.0, 8.2],
    cameraPosition: [-3.2, 2.1, 10.8],
    cameraTarget: [-1.1, 0.0, 8.2],
    distanceFromCenterKpc: 8.25,
    distanceFromCenterLy: 26900,
    distanceFromSunKpc: 0.45,
    dominantStellarPopulation: 'Sao dãy chính G/K/M + vườn ươm sao trẻ Vành đai Gould / Sóng Radcliffe',
    starFormationActivity: 'Moderate',
    estimatedMassSolar: '~1,2 × 10⁹ M☉',
    summary:
      'Từng được coi là một cầu nối nhỏ giữa nhánh Sagittarius và Perseus, nhưng dữ liệu giao thoa VLBI và Gaia hiện đại chứng minh Nhánh Orion là một phân đoạn xoắn ốc lớn dài 20.000 năm ánh sáng chứa Hệ Mặt Trời của chúng ta.',
    astrophysicalSignificance:
      'Chứa Sóng Radcliffe—một sợi khí tạo sao uốn lượn hình sin dài 2,7 kiloparsec kết nối Tổ hợp Đám mây Phân tử Orion, Taurus, Perseus và Cygnus X.',
    observationalEvidence:
      'Chụp cắt lớp bụi 3D và bản đồ thị sai sao trẻ từ Gaia DR3 (Alves et al. 2020; Reid et al. 2019).',
    keyMetrics: [
      { label: 'Chiều dài phân đoạn', value: '~6,5', unit: 'kpc (21.000 ly)' },
      { label: 'Biên độ Sóng Radcliffe', value: '160', unit: 'pc dao động đứng' },
      { label: 'Góc mở xoắn ốc', value: '11,4°', unit: 'độ' },
      { label: 'Vườn ươm sao nổi bật', value: 'Tinh vân Orion (M42)', unit: '412 pc' },
    ],
    accentColor: '#67E8F9',
  },
  {
    id: 'solar-neighborhood',
    name: 'Vùng Lân Cận Mặt Trời',
    subtitle: 'Bong Bóng Cục Bộ & Địa Chỉ Vũ Trụ Của Chúng Ta (~8,18 kpc)',
    category: 'Local Universe',
    provenance: 'Observational Data',
    position: [0.0, 0.02, 8.178],
    cameraPosition: [0.85, 0.65, 9.45],
    cameraTarget: [0.0, 0.02, 8.178],
    distanceFromCenterKpc: 8.178,
    distanceFromCenterLy: 26673,
    distanceFromSunKpc: 0.0,
    dominantStellarPopulation: 'Hệ Mặt Trời (sao lùn vàng G2V), sao lùn đỏ loại M (Proxima Centauri), Sirius, Alpha Centauri, cụm Tua Rua (Pleiades)',
    starFormationActivity: 'Low',
    estimatedMassSolar: '0,097 M☉ / pc³ (Mật độ mặt phẳng giữa cục bộ)',
    summary:
      'Ngôi nhà của chúng ta trong Dải Ngân Hà. Mặt Trời quay quanh Tâm Thiên Hà ở khoảng cách ~8,178 kpc (26.673 năm ánh sáng) bên trong Bong Bóng Cục Bộ—một khoang khí đường kính 1.000 năm ánh sáng được chạm khắc bởi nhiều vụ nổ siêu tân tinh trong 14 triệu năm qua.',
    astrophysicalSignificance:
      'Mặt Trời nằm cao hơn mặt phẳng giữa của thiên hà khoảng 20 parsec (65 năm ánh sáng) và hoàn thành một "Năm Ngân Hà" sau mỗi ~225–230 triệu năm với vận tốc quỹ đạo 232,8 km/s.',
    observationalEvidence:
      'Neo chuẩn bởi khoảng cách hình học tới Sgr A* từ Hợp tác GRAVITY (8.178 ± 13 pc) và danh mục 1,8 tỷ ngôi sao của ESA Gaia DR3.',
    keyMetrics: [
      { label: 'Khoảng cách tới Tâm (R₀)', value: '8,178 ± 0,013', unit: 'kpc' },
      { label: 'Độ cao trên mặt phẳng (z₀)', value: '+20,8', unit: 'pc (68 ly)' },
      { label: 'Vận tốc quay tròn (Θ₀)', value: '232,8', unit: 'km/s' },
      { label: 'Chu kỳ Năm Ngân Hà', value: '~226', unit: 'triệu năm' },
    ],
    accentColor: '#34D399',
  },
  {
    id: 'outer-stellar-disk',
    name: 'Đĩa Sao Ngoài (Outer Disk)',
    subtitle: 'Nhánh Norma-Outer, Độ Vênh Đĩa & Vành Đai Monoceros',
    category: 'Outer Structure',
    provenance: 'Procedural Model',
    position: [-9.5, 0.35, -9.8],
    cameraPosition: [-15.5, 6.2, -14.2],
    cameraTarget: [-9.5, 0.35, -9.8],
    distanceFromCenterKpc: 13.6,
    distanceFromCenterLy: 44350,
    distanceFromSunKpc: 19.8,
    dominantStellarPopulation: 'Sao đĩa nghèo kim loại, lớp khí nguyên tử HI loe rộng, sao biến quang Cepheid cổ điển',
    starFormationActivity: 'Low',
    estimatedMassSolar: '~5,0 × 10⁹ M☉ (Đĩa ngoài)',
    summary:
      'Vượt ra ngoài bán kính 12 kiloparsec từ tâm, mật độ sao của Ngân Hà giảm theo hàm mũ trong khi đĩa khí loe rộng theo phương thẳng đứng và uốn cong thành hình chữ S.',
    astrophysicalSignificance:
      'Độ vênh của đĩa ngoài và các gợn sóng thẳng đứng (như Vành đai Monoceros) lưu giữ dấu tích tương tác thủy triều đang diễn ra với thiên hà lùn Sagittarius và Đám mây Magellan Lớn (LMC).',
    observationalEvidence:
      'Vị trí 3D của hàng nghìn sao biến quang Cepheid (Skowron et al. 2019) và bản đồ động học sóng thẳng đứng từ Gaia DR3.',
    keyMetrics: [
      { label: 'Chiều dài thang đĩa (R_d)', value: '2,6 ± 0,5', unit: 'kpc' },
      { label: 'Bán kính rìa đĩa sao', value: '~15–19', unit: 'kpc' },
      { label: 'Biên độ vênh đứng', value: '±1,2', unit: 'kpc' },
      { label: 'Gradient độ kim loại', value: '-0,06', unit: 'dex / kpc' },
    ],
    accentColor: '#7AA8FF',
  },
  {
    id: 'galactic-halo',
    name: 'Quầng Thiên Hà (Galactic Halo)',
    subtitle: 'Dòng Sao Bồi Tụ, Cụm Sao Cầu & Quầng Vật Chất Tối',
    category: 'Outer Structure',
    provenance: 'Scientific Simulation Data',
    position: [0.0, 9.5, 0.0],
    cameraPosition: [18.5, 16.0, 22.0],
    cameraTarget: [0.0, 2.0, 0.0],
    distanceFromCenterKpc: 12.5,
    distanceFromCenterLy: 40770,
    distanceFromSunKpc: 14.2,
    dominantStellarPopulation: 'Sao Quần thể II cổ đại nghèo kim loại ([Fe/H] < -1.5) & ~165 Cụm Sao Cầu',
    starFormationActivity: 'Quiescent',
    estimatedMassSolar: '~1,15 × 10¹² M☉ (Tổng khối lượng Virial gồm Vật chất tối)',
    summary:
      'Bao bọc quanh đĩa xoắn ốc phát sáng là một quầng sao và vật chất tối hình cầu khổng lồ. Dù chỉ chứa ~1% số sao của thiên hà, quầng sao lưu giữ hóa thạch của các thiên hà lùn cổ đại bị xé toạc bởi lực thủy triều Ngân Hà—đáng chú ý nhất là vụ sáp nhập Gaia-Enceladus-Sausage cách đây ~10 tỷ năm.',
    astrophysicalSignificance:
      'Nằm bên trong quầng vật chất tối Navarro-Frenk-White (NFW) trải rộng hơn 200 kpc, lực hấp dẫn của quầng giữ cho đường cong quay ở rìa Ngân Hà duy trì phẳng ở mức ~220–235 km/s.',
    observationalEvidence:
      'Các dòng sao trong không gian pha của Gaia (dòng Helmi, dòng Sagittarius, Gaia-Sausage-Enceladus) và mô phỏng vũ trụ học độ phân giải cao (IllustrisTNG50 / Auriga).',
    keyMetrics: [
      { label: 'Tổng khối lượng Virial (M_200)', value: '1,15 × 10¹²', unit: 'M☉' },
      { label: 'Khối lượng quầng sao', value: '1,4 × 10⁹', unit: 'M☉' },
      { label: 'Số cụm sao cầu', value: '~165', unit: 'hệ đã biết' },
      { label: 'Kỷ nguyên sáp nhập lớn', value: '~10', unit: 'tỷ năm trước (Gaia-Enceladus)' },
    ],
    accentColor: '#A78BFA',
  },
];

export const GALAXY_REGION_MAP: Record<string, GalacticRegion> = Object.fromEntries(
  GALAXY_REGIONS.map((region) => [region.id, region])
);
