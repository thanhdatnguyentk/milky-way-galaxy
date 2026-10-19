# MILKY WAY — A Living Galaxy

> **"Explore the architecture of the cosmos."**  
> An interactive 3D Galactic Universe, GPU Particle Simulation, and Computational Astrophysics Visualization Platform.

---

## 1. Overview & Scientific Vision

**MILKY WAY — A Living Galaxy** is a real-time, browser-based 3D digital observatory where **the galaxy itself is the interface**. Designed at the intersection of NASA-style scientific visualization, planetarium immersion, and minimalist Apple-grade product design, the platform enables users to glide through the Milky Way's spiral arms, inspect star-forming nebulae, locate our Solar Neighborhood, and experiment with physical models of galactic evolution.

### Explicit Scientific Provenance Classification

Every visualization and dataset in the application is explicitly badged with one of four provenance tiers:

| Provenance Badge | Scope & Meaning | Examples in Application |
| :--- | :--- | :--- |
| **`Observational Data`** | Empirical astrometric, VLBI, or interferometric measurements | ESA Gaia DR3 nearby/anchor stars, VLT GRAVITY & EHT Sagittarius A* ($R_0 = 8.178\text{ kpc}$, $M_{\text{BH}} = 4.154 \times 10^6\,M_\odot$) |
| **`Scientific Simulation Data`** | Precomputed cosmological MHD simulation checkpoints | IllustrisTNG (`TNG50`) 7-stage star formation history ($z=8.2 \to z=0$), NFW dark matter halo virial mass ($M_{200} \approx 1.15 \times 10^{12}\,M_\odot$) |
| **`Procedural Model`** | Physically informed parametric astrophysical distributions | 4-arm logarithmic spiral density waves ($r(\theta) = r_0 e^{k\theta}$), triaxial Box/Peanut Galactic Bar ($\phi_{\text{bar}} \approx 28^\circ$), thin/thick exponential disk, Planckian blackbody star colors |
| **`Simplified Physics Demo`** | Real-time numerical solvers evaluated locally in the browser | Symplectic Velocity Verlet / Leapfrog test-particle orbital integrator, analytical Sedov-Taylor supernova blast-wave expansion |

---

## 2. Core Features

1. **GPU-Accelerated 3D Milky Way Particle System (`WebGL2` Custom GLSL Shaders)**
   - Hardware-adaptive particle presets: **Low** (`65K`), **Medium** (`180K`), **High** (`420K`), and **Ultra** (`850K+` stars, dust clouds, and HII regions).
   - Differential galactic rotation curve $\Omega(R) = V_c(R)/R$ evaluated on the GPU.
   - Planckian locus stellar color temperature mapping ($3,000\text{ K}$ red giants to $35,000\text{ K}$ OB supergiants).
   - Interstellar dust extinction lanes and ionized H$\alpha$ / $[\text{O III}]$ star-forming nebulae.

2. **10 Interactive Galactic Exploration Regions**
   - `Galactic Center` (Central Molecular Zone & Nuclear Star Cluster)
   - `Sagittarius A*` (Central Supermassive Black Hole with illustrative relativistic accretion & photon ring shader)
   - `Galactic Bar` (Triaxial Box/Peanut-shaped stellar bar)
   - `Scutum-Centaurus Arm` (Primary grand-design inner spiral arm)
   - `Perseus Arm` (Primary outer spiral arm)
   - `Sagittarius-Carina Arm` (Gas-rich nebular chain: Carina, Lagoon, Eagle)
   - `Orion Arm / Local Spur` (Radcliffe Wave & Gould Belt)
   - `Solar Neighborhood` (`Where Are We?` beacon at $R_0 = 8.178\text{ kpc}$ / $26,673\text{ ly}$)
   - `Outer Stellar Disk` (Disk flare & S-warp)
   - `Galactic Halo` (Ancient metal-poor streams, globular clusters & NFW dark matter envelope)

3. **Signature Guided Sequences**
   - **Journey Through the Milky Way**: 6-stop cinematic autopilot tour with Play/Pause/Next/Previous/Exit controls.
   - **Where Are We? (Find the Sun)**: Instant orbital approach to the Solar System in the Orion Spur with a calibrated Galactocentric distance vector.
   - **Explore Galactic Center (Sgr A\*)**: Deep dive into the inner parsec around Sagittarius A*.

4. **Interactive Computational Astrophysics Labs**
   - **13.8-Gyr Galaxy Evolution Timeline**: 7 cosmic epochs (`Early Structure Formation` $\to$ `Cosmic Noon` $\to$ `Present Secular Evolution`) morphing disk flattening, spiral contrast, turbulence, and OB star fraction in real time.
   - **Galactic Orbital Gravity Lab**: Symplectic Velocity Verlet (`Leapfrog`) orbital simulator comparing a Keplerian point potential against a composite `Miyamoto-Nagai Disk + NFW Dark Matter Halo`.
   - **Stellar Feedback — Supernova Blast**: Interactive Sedov-Taylor shockwave simulation ($R_s \propto (E_0/\rho_0)^{1/5} t^{2/5}$) displacing surrounding stellar and gas particles.
   - **Dark Matter Halo Overlay**: Toggleable 3D NFW volumetric halo + interactive Galactic Rotation Curve ($V_c(R)$ vs. $R$) chart.

---

## 3. Tech Stack & Architecture

- **Framework**: Vite + React 18 + TypeScript (Strict Mode)
- **3D Rendering**: Three.js (`WebGL2Renderer`, custom GLSL Vertex/Fragment Shaders, `BufferGeometry`, `Float32Array` attribute buffers, additive Airy-disk PSF rendering)
- **State Management**: Zustand (`useGalaxyStore`)
- **UI & Motion**: Tailwind CSS + Framer Motion + Lucide React
- **Simulation Architecture**: Decoupled `SimulationProvider` interface (`ProceduralSimulationProvider`, `PrecomputedDatasetProvider`, `LocalPhysicsSimulationProvider`, `FutureAISurrogateProvider`)

---

## 4. Local Development & Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check and build production bundle
npm run build
```
