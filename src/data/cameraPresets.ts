import type { CameraPreset, GuidedTourStop } from '@/types/camera';

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'galactic-overview',
    name: 'Galactic Overview',
    subtitle: 'Inclined 45° Observatory Perspective',
    position: [0, 17.5, 25.5],
    target: [0, 0, 0],
    fov: 48,
  },
  {
    id: 'top-down-atlas',
    name: 'North Galactic Pole',
    subtitle: 'Face-On Spiral Structure Mapping',
    position: [0, 34.0, 0.01],
    target: [0, 0, 0],
    fov: 45,
  },
  {
    id: 'edge-on-profile',
    name: 'Edge-On Disk & Bulge',
    subtitle: 'Thin Disk, Box/Peanut Bulge & Vertical Halo',
    position: [28.0, 1.2, 0.0],
    target: [0, 0, 0],
    fov: 45,
  },
  {
    id: 'galactic-core-dive',
    name: 'Galactic Core & Sgr A*',
    subtitle: 'Inside the Central Molecular Zone',
    position: [0.0, 0.42, 0.92],
    target: [0, 0, 0],
    fov: 50,
  },
  {
    id: 'solar-vantage',
    name: 'Solar Neighborhood (~8.18 kpc)',
    subtitle: 'Local Bubble in the Orion Spur',
    position: [0.85, 0.65, 9.45],
    target: [0.0, 0.02, 8.178],
    fov: 48,
  },
];

export const GUIDED_TOUR_STOPS: GuidedTourStop[] = [
  {
    id: 'stop-1-architecture',
    stepNumber: 1,
    title: 'The Architecture of the Milky Way',
    subtitle: 'A 105,000-Light-Year Barred Spiral Galaxy',
    regionId: 'galactic-bar',
    cameraPosition: [0.0, 21.0, 27.0],
    cameraTarget: [0.0, 0.0, 0.0],
    durationSeconds: 11,
    narrative:
      'Welcome to the Milky Way—an SBbc barred spiral galaxy containing 100 to 400 billion stars and ~1.15 trillion solar masses of total matter. Four logarithmic spiral arms wind outward from a rotating triaxial stellar bar.',
    scientificCallout:
      'Procedural 4-Arm Logarithmic Spiral + Box/Peanut Bar calibrated to Spitzer GLIMPSE & VLBI maser parallaxes (Reid et al. 2019).',
    scaleLabel: 'Full Galactic Scale · 32 kpc (105,000 ly)',
  },
  {
    id: 'stop-2-spiral-arms',
    stepNumber: 2,
    title: 'Grand-Design Spiral Density Waves',
    subtitle: 'Scutum-Centaurus & Perseus Arms',
    regionId: 'scutum-centaurus-arm',
    cameraPosition: [-7.2, 4.2, 7.6],
    cameraTarget: [-3.8, 0.0, 3.6],
    durationSeconds: 11,
    narrative:
      'Spiral arms are not rigid structures; they are gravitational density waves moving through the stellar disk. As interstellar gas clouds enter these traffic jams, shock compression triggers luminous ribbons of hot blue OB stars and dark dust lanes.',
    scientificCallout:
      'Differential Galactic Rotation: Inner stars complete orbits in ~50 Myr while outer disk stars take >250 Myr.',
    scaleLabel: 'Spiral Sector · 5.2 kpc from Center',
  },
  {
    id: 'stop-3-star-nurseries',
    stepNumber: 3,
    title: 'Stellar Nurseries & Ionized Nebulae',
    subtitle: 'The Sagittarius-Carina Star-Forming Chain',
    regionId: 'sagittarius-carina-arm',
    cameraPosition: [6.8, 2.6, 8.4],
    cameraTarget: [3.6, 0.0, 5.6],
    durationSeconds: 11,
    narrative:
      'Within the Sagittarius-Carina arm, ultraviolet radiation from newborn O-type stars ionizes surrounding hydrogen gas into glowing crimson HII regions—including the Carina, Lagoon, and Eagle Nebulae.',
    scientificCallout:
      'Current Milky Way Star Formation Rate (SFR): ~1.65 ± 0.19 M☉ per year across giant molecular clouds.',
    scaleLabel: 'Nebular Complex · 6.6 kpc from Center',
  },
  {
    id: 'stop-4-solar-home',
    stepNumber: 4,
    title: 'Where Are We? The Solar Neighborhood',
    subtitle: '8.178 Kiloparsecs from the Galactic Core',
    regionId: 'solar-neighborhood',
    cameraPosition: [0.95, 0.68, 9.55],
    cameraTarget: [0.0, 0.02, 8.178],
    durationSeconds: 11,
    narrative:
      'Nested along the inner edge of the Orion Spur, our Solar System orbits the galaxy at 232.8 km/s inside the Local Bubble—a cavity sculpted by ancient supernovae. It takes the Sun 226 million years to complete a single Galactic Year.',
    scientificCallout:
      'Observational Anchor: R₀ = 8,178 ± 13 pc (26,673 ly) measured via VLT GRAVITY interferometry & ESA Gaia DR3.',
    scaleLabel: 'Local Neighborhood · R₀ = 8.178 kpc',
  },
  {
    id: 'stop-5-galactic-center',
    stepNumber: 5,
    title: 'Into the Galactic Core & Sagittarius A*',
    subtitle: 'Nuclear Star Cluster & 4.15-Million-M☉ Black Hole',
    regionId: 'sagittarius-a-star',
    cameraPosition: [0.0, 0.36, 0.82],
    cameraTarget: [0.0, 0.0, 0.0],
    durationSeconds: 11,
    narrative:
      'Plunging 26,673 light-years inward through dense dust lanes, we arrive at the Galactic Center. Here, ten million stars per cubic parsec swarm around Sagittarius A*, where the star S2 whips past pericenter at 2.55% the speed of light.',
    scientificCallout:
      'Illustrative Relativistic Accretion & Gravitational Lensing Shader scaled for interactive exploration (actual r_s = 0.082 AU).',
    scaleLabel: 'Core Horizon View · Sgr A* (4.15 × 10⁶ M☉)',
  },
  {
    id: 'stop-6-dark-matter-halo',
    stepNumber: 6,
    title: 'The Invisible Architecture: Dark Matter Halo',
    subtitle: 'Ancient Merger Streams & NFW Gravitational Envelope',
    regionId: 'galactic-halo',
    cameraPosition: [16.5, 14.5, 20.5],
    cameraTarget: [0.0, 0.0, 0.0],
    durationSeconds: 12,
    narrative:
      'Zooming out to the intergalactic scale reveals the full story: the luminous disk is only ~5% of the galaxy’s mass. An invisible Navarro-Frenk-White (NFW) dark matter halo extending over 200 kiloparsecs binds the spinning disk together.',
    scientificCallout:
      'Cosmological Context: Total Virial Mass M_200 ≈ 1.15 × 10¹² M☉ inferred from halo globular clusters & satellite kinematics.',
    scaleLabel: 'Halo Envelope · > 30 kpc View',
  },
];
