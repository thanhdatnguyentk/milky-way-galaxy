import type { GalacticRegion } from '@/types/galaxy';

/**
 * Coordinate convention in 3D scene:
 * 1 unit = 1 kiloparsec (kpc) = 3,261.56 light-years.
 * Galactic Center = [0, 0, 0]
 * Galactic Plane = X-Z plane (Y is vertical height z_gal perpendicular to the disk)
 * Solar Neighborhood = [0.0, 0.02, 8.178] (~8.178 kpc from Galactic Center in Orion Spur)
 */
export const GALAXY_REGIONS: GalacticRegion[] = [
  {
    id: 'galactic-center',
    name: 'Galactic Center',
    subtitle: 'Central Molecular Zone & Nuclear Star Cluster',
    category: 'Galactic Core',
    provenance: 'Observational Data',
    position: [0.0, 0.0, 0.0],
    cameraPosition: [0.0, 2.2, 4.2],
    cameraTarget: [0.0, 0.0, 0.0],
    distanceFromCenterKpc: 0.0,
    distanceFromCenterLy: 0,
    distanceFromSunKpc: 8.18,
    dominantStellarPopulation: 'Metal-rich old red giants, Wolf-Rayet & OB supergiants in nuclear clusters',
    starFormationActivity: 'Extreme',
    estimatedMassSolar: '~2.0 × 10¹⁰ M☉ (Bulge + Nuclear Disk)',
    summary:
      'The rotational and gravitational heart of the Milky Way. Within the inner 500 parsecs lies the Central Molecular Zone (CMZ), housing ~60 million solar masses of dense molecular gas and the Nuclear Star Cluster—the densest stellar environment in our galaxy.',
    astrophysicalSignificance:
      'Driven by bar-induced gas inflows along dust lanes, the Galactic Center hosts extreme magnetic fields (up to milligauss scales), relativistic non-thermal filaments, and young massive clusters like the Arches and Quintuplet.',
    observationalEvidence:
      'Observed in infrared, sub-millimeter, and X-ray wavelengths (JWST, ALMA, Chandra, MeerKAT) to penetrate ~30 magnitudes of visual dust extinction along the galactic plane.',
    keyMetrics: [
      { label: 'Galactocentric Radius', value: '< 0.25', unit: 'kpc' },
      { label: 'Core Stellar Density', value: '~10⁷', unit: 'stars / pc³' },
      { label: 'Visual Extinction (A_V)', value: '~30', unit: 'mag' },
      { label: 'Molecular Gas Mass', value: '6 × 10⁷', unit: 'M☉' },
    ],
    accentColor: '#F8C98B',
  },
  {
    id: 'sagittarius-a-star',
    name: 'Sagittarius A*',
    subtitle: 'Central Supermassive Black Hole (Sgr A*)',
    category: 'Galactic Core',
    provenance: 'Observational Data',
    position: [0.0, 0.0, 0.0],
    cameraPosition: [0.0, 0.38, 0.85],
    cameraTarget: [0.0, 0.0, 0.0],
    distanceFromCenterKpc: 0.0,
    distanceFromCenterLy: 0,
    distanceFromSunKpc: 8.178,
    dominantStellarPopulation: 'S-star cluster (B-type main sequence stars on tight relativistic orbits)',
    starFormationActivity: 'Quiescent',
    estimatedMassSolar: '4.154 × 10⁶ M☉',
    summary:
      'The compact radio source and supermassive black hole anchoring the Milky Way. Its mass of 4.15 million solar masses is constrained with exquisite precision by tracking the 16-year Keplerian and relativistic orbit of star S2.',
    astrophysicalSignificance:
      'Sgr A* provides a premier laboratory for testing general relativity in the strong-field regime, including gravitational redshift, Schwarzschild orbital precession, and horizon-scale magnetized accretion flows.',
    observationalEvidence:
      'Direct horizon-scale shadow imaged by the Event Horizon Telescope (EHT, 2022) at 1.3 mm; astrometric orbits measured by VLT GRAVITY and Keck adaptive optics.',
    keyMetrics: [
      { label: 'Black Hole Mass', value: '4.154 × 10⁶', unit: 'M☉' },
      { label: 'Schwarzschild Radius', value: '12.3 × 10⁶', unit: 'km (0.082 AU)' },
      { label: 'S2 Pericenter Speed', value: '7,650', unit: 'km/s (2.55% c)' },
      { label: 'Shadow Angular Size', value: '51.8', unit: 'μas' },
    ],
    accentColor: '#F59E0B',
  },
  {
    id: 'galactic-bar',
    name: 'Galactic Bar',
    subtitle: 'Box/Peanut-Shaped Triaxial Stellar Bar',
    category: 'Galactic Core',
    provenance: 'Procedural Model',
    position: [1.8, 0.0, 1.4],
    cameraPosition: [5.5, 4.8, 6.2],
    cameraTarget: [0.8, 0.0, 0.6],
    distanceFromCenterKpc: 2.3,
    distanceFromCenterLy: 7500,
    distanceFromSunKpc: 6.4,
    dominantStellarPopulation: 'Population II & old metal-rich K/M red clump giants (ages 8–11 Gyr)',
    starFormationActivity: 'Low',
    estimatedMassSolar: '~1.8 × 10¹⁰ M☉',
    summary:
      'The Milky Way is a barred spiral galaxy (type SBbc). Its central triaxial stellar bar extends ~4.5–5.0 kpc in half-length, oriented at an angle of ~27°–30° relative to the Sun–Galactic Center line of sight.',
    astrophysicalSignificance:
      'Acting as a gravitational torque engine, the rotating bar drives secular evolution—sweeping interstellar gas inward toward the Central Molecular Zone and exciting resonance rings and spiral density waves.',
    observationalEvidence:
      'Mapped in 3D via VVV, 2MASS, and ESA Gaia red clump star counts, revealing a vertically thickened X-shaped "box/peanut" bulge profile.',
    keyMetrics: [
      { label: 'Bar Half-Length', value: '4.6 ± 0.3', unit: 'kpc' },
      { label: 'Orientation Angle (φ_bar)', value: '28°', unit: 'to Sun-GC line' },
      { label: 'Pattern Speed (Ω_b)', value: '38–41', unit: 'km/s/kpc' },
      { label: 'Corotation Radius', value: '~6.0', unit: 'kpc' },
    ],
    accentColor: '#F8C98B',
  },
  {
    id: 'scutum-centaurus-arm',
    name: 'Scutum-Centaurus Arm',
    subtitle: 'Primary Grand-Design Inner Spiral Arm',
    category: 'Spiral Structure',
    provenance: 'Procedural Model',
    position: [-3.8, 0.0, 3.6],
    cameraPosition: [-6.8, 3.8, 7.2],
    cameraTarget: [-3.8, 0.0, 3.6],
    distanceFromCenterKpc: 5.2,
    distanceFromCenterLy: 16960,
    distanceFromSunKpc: 5.9,
    dominantStellarPopulation: 'Dense old stellar backbone + massive OB associations & red supergiant clusters',
    starFormationActivity: 'Extreme',
    estimatedMassSolar: '~8.5 × 10⁹ M☉',
    summary:
      'One of the two primary stellar mass density arms emerging directly from the near end of the Galactic Bar. Unlike minor gas-rich spurs, Scutum-Centaurus exhibits a strong, continuous overdensity of both old stellar mass and young star-forming complexes.',
    astrophysicalSignificance:
      'Where the southern end of the Galactic Bar meets the Scutum-Centaurus arm (~4.5 kpc radius), giant molecular clouds collide, triggering prolific bursts of red supergiant cluster formation (RSGC1, RSGC2/Stephenson 2).',
    observationalEvidence:
      'Confirmed by Spitzer GLIMPSE near-infrared stellar counts and high-mass star-forming maser parallax surveys (BeSSeL / VERA).',
    keyMetrics: [
      { label: 'Pitch Angle', value: '12.1°', unit: 'logarithmic spiral' },
      { label: 'Stellar Overdensity', value: '+35%', unit: 'above disk mean' },
      { label: 'Key Starburst Region', value: 'W43 & RSGC1–3', unit: 'complexes' },
      { label: 'Orbital Speed', value: '~228', unit: 'km/s' },
    ],
    accentColor: '#7AA8FF',
  },
  {
    id: 'perseus-arm',
    name: 'Perseus Arm',
    subtitle: 'Primary Outer Grand-Design Spiral Arm',
    category: 'Spiral Structure',
    provenance: 'Observational Data',
    position: [2.2, 0.0, 10.1],
    cameraPosition: [5.2, 4.0, 14.5],
    cameraTarget: [2.2, 0.0, 10.1],
    distanceFromCenterKpc: 10.3,
    distanceFromCenterLy: 33600,
    distanceFromSunKpc: 2.9,
    dominantStellarPopulation: 'Young OB associations, Cepheid variables, supernova remnants (Crab Nebula, Cas A)',
    starFormationActivity: 'High',
    estimatedMassSolar: '~6.2 × 10⁹ M☉',
    summary:
      'The second major symmetric spiral arm of the Milky Way, originating from the far end of the Galactic Bar and wrapping outward past the Solar Neighborhood at a galactocentric radius of ~9.5–11 kpc.',
    astrophysicalSignificance:
      'Home to iconic star-forming regions (W3/W4/W5, Heart & Soul Nebulae, NGC 7538) and the Double Cluster in Perseus, tracing the outer stellar density wave.',
    observationalEvidence:
      'Precision trigonometrical parallaxes from VLBA water/methanol masers and Gaia DR3 OB star astrometry.',
    keyMetrics: [
      { label: 'Galactocentric Radius', value: '9.8–11.2', unit: 'kpc' },
      { label: 'Pitch Angle', value: '11.5°', unit: 'logarithmic spiral' },
      { label: 'Nearest Approach to Sun', value: '~1.95', unit: 'kpc (6,400 ly)' },
      { label: 'Notable Remnants', value: 'M1 Crab, Cas A', unit: 'SNR' },
    ],
    accentColor: '#67E8F9',
  },
  {
    id: 'sagittarius-carina-arm',
    name: 'Sagittarius-Carina Arm',
    subtitle: 'Gas-Rich Secondary Spiral Arm & Nebular Chain',
    category: 'Spiral Structure',
    provenance: 'Observational Data',
    position: [3.6, 0.0, 5.6],
    cameraPosition: [7.4, 3.2, 8.8],
    cameraTarget: [3.6, 0.0, 5.6],
    distanceFromCenterKpc: 6.6,
    distanceFromCenterLy: 21500,
    distanceFromSunKpc: 2.7,
    dominantStellarPopulation: 'Luminous HII regions, O-type stars, Luminous Blue Variables (Eta Carinae)',
    starFormationActivity: 'High',
    estimatedMassSolar: '~4.5 × 10⁹ M☉',
    summary:
      'Lying just inward of the Sun’s orbit toward the Galactic Center, the Sagittarius-Carina arm is famous for its spectacular chain of emission nebulae visible from Earth, including the Lagoon (M8), Eagle (M16), Omega (M17), and Carina (NGC 3372) nebulae.',
    astrophysicalSignificance:
      'Although less massive in old K-giant stars than Scutum-Centaurus, its high molecular gas compression fuels intense ionized hydrogen (HII) regions and photo-evaporating pillars.',
    observationalEvidence:
      'Traced across the sky via H-alpha emission, CO molecular line surveys, and Gaia DR3 young upper-main-sequence star maps.',
    keyMetrics: [
      { label: 'Galactocentric Radius', value: '6.2–7.4', unit: 'kpc' },
      { label: 'Flagship Nebula', value: 'Carina (NGC 3372)', unit: 'HII complex' },
      { label: 'Pitch Angle', value: '12.0°', unit: 'deg' },
      { label: 'Ionizing Flux', value: 'High UV', unit: 'OB stars' },
    ],
    accentColor: '#7AA8FF',
  },
  {
    id: 'orion-arm',
    name: 'Orion Arm / Local Spur',
    subtitle: 'Local Spiral Segment & Radcliffe Wave',
    category: 'Local Universe',
    provenance: 'Observational Data',
    position: [-1.1, 0.0, 8.2],
    cameraPosition: [-3.2, 2.1, 10.8],
    cameraTarget: [-1.1, 0.0, 8.2],
    distanceFromCenterKpc: 8.25,
    distanceFromCenterLy: 26900,
    distanceFromSunKpc: 0.45,
    dominantStellarPopulation: 'G/K/M main sequence stars + Gould Belt / Radcliffe Wave young stellar nurseries',
    starFormationActivity: 'Moderate',
    estimatedMassSolar: '~1.2 × 10⁹ M☉',
    summary:
      'Historically considered a minor inter-arm bridge between the Sagittarius and Perseus arms, modern VLBI and Gaia astrometry reveal the Orion Spur as a substantial 20,000-light-year spiral segment hosting our Solar System.',
    astrophysicalSignificance:
      'Contains the Radcliffe Wave—a coherent, undulating 2.7-kiloparsec filament of interconnected star-forming clouds including the Orion Molecular Cloud Complex, Taurus, Perseus, and Cygnus X.',
    observationalEvidence:
      '3D dust extinction tomography and Gaia DR3 parallax mapping (Alves et al. 2020; Reid et al. 2019).',
    keyMetrics: [
      { label: 'Segment Length', value: '~6.5', unit: 'kpc (21,000 ly)' },
      { label: 'Radcliffe Wave Amplitude', value: '160', unit: 'pc vertical wave' },
      { label: 'Pitch Angle', value: '11.4°', unit: 'deg' },
      { label: 'Flagship Nursery', value: 'Orion Nebula (M42)', unit: '412 pc' },
    ],
    accentColor: '#67E8F9',
  },
  {
    id: 'solar-neighborhood',
    name: 'Solar Neighborhood',
    subtitle: 'Local Bubble & Our Cosmic Address (~8.18 kpc)',
    category: 'Local Universe',
    provenance: 'Observational Data',
    position: [0.0, 0.02, 8.178],
    cameraPosition: [0.85, 0.65, 9.45],
    cameraTarget: [0.0, 0.02, 8.178],
    distanceFromCenterKpc: 8.178,
    distanceFromCenterLy: 26673,
    distanceFromSunKpc: 0.0,
    dominantStellarPopulation: 'G2V Solar System, M-dwarf majority (Proxima Centauri), Sirius, Alpha Centauri, Pleiades',
    starFormationActivity: 'Low',
    estimatedMassSolar: '0.097 M☉ / pc³ (Local Midplane Density)',
    summary:
      'Our home in the Milky Way. The Sun orbits the Galactic Center at ~8.178 kpc (26,673 light-years) inside the Local Bubble—a 1,000-light-year cavity carved by multiple supernova explosions over the past 14 million years.',
    astrophysicalSignificance:
      'The Sun sits ~20 parsecs (65 light-years) above the galactic midplane and completes one full "Galactic Year" every ~225–230 million years at an orbital velocity of 232.8 km/s.',
    observationalEvidence:
      'Anchored by the GRAVITY Collaboration geometric distance to Sgr A* (8,178 ± 13 pc) and ESA Gaia DR3 census of 1.8 billion stars.',
    keyMetrics: [
      { label: 'Galactocentric Distance (R₀)', value: '8.178 ± 0.013', unit: 'kpc' },
      { label: 'Height Above Midplane (z₀)', value: '+20.8', unit: 'pc (68 ly)' },
      { label: 'Circular Orbital Speed (Θ₀)', value: '232.8', unit: 'km/s' },
      { label: 'Galactic Year Period', value: '~226', unit: 'Myr' },
    ],
    accentColor: '#34D399',
  },
  {
    id: 'outer-stellar-disk',
    name: 'Outer Stellar Disk',
    subtitle: 'Norma-Outer Arm, Disk Warp & Monoceros Ring',
    category: 'Outer Structure',
    provenance: 'Procedural Model',
    position: [-9.5, 0.35, -9.8],
    cameraPosition: [-15.5, 6.2, -14.2],
    cameraTarget: [-9.5, 0.35, -9.8],
    distanceFromCenterKpc: 13.6,
    distanceFromCenterLy: 44350,
    distanceFromSunKpc: 19.8,
    dominantStellarPopulation: 'Sub-solar metallicity disk stars, flaring HI atomic gas layer, Classical Cepheids',
    starFormationActivity: 'Low',
    estimatedMassSolar: '~5.0 × 10⁹ M☉ (Outer Disk)',
    summary:
      'Beyond 12 kiloparsecs from the center, the Milky Way’s stellar density drops exponentially while the gas disk flares vertically and exhibits an S-shaped gravitational warp.',
    astrophysicalSignificance:
      'The outer disk warp and corrugated vertical ripples (such as the Monoceros Ring) record ongoing tidal interactions with the Sagittarius Dwarf Spheroidal galaxy and the Large Magellanic Cloud.',
    observationalEvidence:
      '3D positions of thousands of Classical Cepheids (Skowron et al. 2019) and Gaia DR3 kinematic vertical wave maps.',
    keyMetrics: [
      { label: 'Disk Scale Length (R_d)', value: '2.6 ± 0.5', unit: 'kpc' },
      { label: 'Outer Cutoff Radius', value: '~15–19', unit: 'kpc' },
      { label: 'Vertical Warp Amplitude', value: '±1.2', unit: 'kpc' },
      { label: 'Metallicity Gradient', value: '-0.06', unit: 'dex / kpc' },
    ],
    accentColor: '#7AA8FF',
  },
  {
    id: 'galactic-halo',
    name: 'Galactic Halo',
    subtitle: 'Accreted Stellar Streams, Globular Clusters & Dark Matter Envelope',
    category: 'Outer Structure',
    provenance: 'Scientific Simulation Data',
    position: [0.0, 9.5, 0.0],
    cameraPosition: [18.5, 16.0, 22.0],
    cameraTarget: [0.0, 2.0, 0.0],
    distanceFromCenterKpc: 12.5,
    distanceFromCenterLy: 40770,
    distanceFromSunKpc: 14.2,
    dominantStellarPopulation: 'Ancient metal-poor Population II stars ([Fe/H] < -1.5) & ~160 Globular Clusters',
    starFormationActivity: 'Quiescent',
    estimatedMassSolar: '~1.15 × 10¹² M☉ (Total Virial Mass incl. Dark Matter)',
    summary:
      'Surrounding the luminous spiral disk is a vast, spherical stellar and dark matter halo. Though containing only ~1% of the galaxy’s stars, it preserves the fossil record of ancient dwarf galaxies shredded by Milky Way tides—most notably the Gaia-Enceladus-Sausage merger ~10 Gyr ago.',
    astrophysicalSignificance:
      'Embedded within a Navarro-Frenk-White (NFW) dark matter halo extending past 200 kpc, halo gravity keeps the Milky Way’s outer rotation curve nearly flat at ~220–235 km/s.',
    observationalEvidence:
      'Gaia phase-space halo streams (Helmi stream, Sagittarius stream, Gaia-Sausage-Enceladus) and cosmological zoom-in simulations (IllustrisTNG50 / Auriga).',
    keyMetrics: [
      { label: 'Total Virial Mass (M_200)', value: '1.15 × 10¹²', unit: 'M☉' },
      { label: 'Stellar Halo Mass', value: '1.4 × 10⁹', unit: 'M☉' },
      { label: 'Globular Clusters', value: '~165', unit: 'known systems' },
      { label: 'Major Merger Epoch', value: '~10', unit: 'Gyr ago (Gaia-Enceladus)' },
    ],
    accentColor: '#A78BFA',
  },
];

export const GALAXY_REGION_MAP: Record<string, GalacticRegion> = Object.fromEntries(
  GALAXY_REGIONS.map((region) => [region.id, region])
);
