import { CELESTIAL_BODY_MAP, type CelestialBody } from '@/data/planetaryBodies';
import type { Vec3 } from '@/utils/webglMath';

/**
 * Computes the instantaneous 3D Galactocentric world position [x, y, z] of any CelestialBody
 * at simulation time `elapsedSeconds`.
 * Handles hierarchical orbits (e.g. the Moon orbiting Earth while Earth orbits the Sun)
 * and elliptical + inclined orbits (e.g. Halley's Comet, Hale-Bopp, Pluto).
 */
export function computeCelestialBodyPosition(
  body: CelestialBody,
  elapsedSeconds: number,
  speedScale = 1.0
): Vec3 {
  let center: Vec3 = [...body.hostStarPosKpc];

  // If this body orbits another planet (e.g. Moon around Earth), compute parent position first
  if (body.parentBodyId && CELESTIAL_BODY_MAP[body.parentBodyId]) {
    center = computeCelestialBodyPosition(
      CELESTIAL_BODY_MAP[body.parentBodyId],
      elapsedSeconds,
      speedScale
    );
  }

  if (body.orreryRadiusUnits <= 0.0001) {
    return center;
  }

  const a = body.orreryRadiusUnits;
  const e = body.eccentricity;
  const b = a * Math.sqrt(Math.max(0.05, 1.0 - e * e));
  const incRad = (body.inclinationDeg * Math.PI) / 180.0;

  const meanAnomaly = body.initialPhaseRad + elapsedSeconds * body.orbitalSpeedRadSec * speedScale;
  // Approximate eccentric anomaly for smooth visual Keplerian motion (faster near perihelion)
  const E = meanAnomaly + e * Math.sin(meanAnomaly);

  // Focal offset so the Sun sits at one focus of the ellipse
  const xOrb = a * (Math.cos(E) - e);
  const zOrb = b * Math.sin(E);

  // Rotate by orbital inclination around X axis
  const yInclined = zOrb * Math.sin(incRad);
  const zInclined = zOrb * Math.cos(incRad);

  return [center[0] + xOrb, center[1] + yInclined, center[2] + zInclined];
}

/**
 * Generates 3D polyline vertices tracing the full elliptical orbit of a CelestialBody
 */
export function computeOrbitLoopVertices(
  body: CelestialBody,
  elapsedSeconds: number,
  speedScale = 1.0,
  segments = 72
): Vec3[] {
  let center: Vec3 = [...body.hostStarPosKpc];
  if (body.parentBodyId && CELESTIAL_BODY_MAP[body.parentBodyId]) {
    center = computeCelestialBodyPosition(
      CELESTIAL_BODY_MAP[body.parentBodyId],
      elapsedSeconds,
      speedScale
    );
  }

  const a = body.orreryRadiusUnits;
  const e = body.eccentricity;
  const b = a * Math.sqrt(Math.max(0.05, 1.0 - e * e));
  const incRad = (body.inclinationDeg * Math.PI) / 180.0;
  const sinI = Math.sin(incRad);
  const cosI = Math.cos(incRad);

  const pts: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const E = (i / segments) * Math.PI * 2;
    const xOrb = a * (Math.cos(E) - e);
    const zOrb = b * Math.sin(E);
    pts.push([center[0] + xOrb, center[1] + zOrb * sinI, center[2] + zOrb * cosI]);
  }
  return pts;
}

export const PLANET_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uPixelRatio;

  attribute vec3 position;
  attribute vec3 aPrimaryColor;
  attribute vec3 aSecondaryColor;
  attribute float aPointSize;
  attribute float aStyleId; // 0=sun, 1=terrestrial/earth, 2=gas_banded, 3=comet, 4=lava

  varying vec3 vPrimaryColor;
  varying vec3 vSecondaryColor;
  varying float vStyleId;

  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    float camDist = max(0.001, -mvPos.z);

    // Multi-scale sizing:
    // - At Solar System micro-scale (camDist ~ 0.002 to 0.08 kpc), planets render as 3D shaded spheres
    // - At Galactic scale (camDist > 0.25 kpc), planets fade to 0px while the Sun shrinks to a pinpoint star
    float microFactor = clamp(0.22 / pow(camDist, 0.45), 0.65, 3.2);
    float galacticFade = aStyleId < 0.5 ? 1.0 : smoothstep(0.28, 0.10, camDist);

    float scaledSize = aPointSize * uPixelRatio * microFactor * galacticFade;
    if (aStyleId < 0.5 && camDist > 0.22) {
      // At galactic distances, the Sun appears as a compact luminous star point
      scaledSize = clamp(18.0 * uPixelRatio / pow(camDist, 0.45), 5.0 * uPixelRatio, 14.0 * uPixelRatio);
    }

    gl_PointSize = clamp(scaledSize, 0.0, 96.0);

    vPrimaryColor = aPrimaryColor;
    vSecondaryColor = aSecondaryColor;
    vStyleId = aStyleId;

    gl_Position = projectionMatrix * mvPos;
  }
`;

export const PLANET_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;

  varying vec3 vPrimaryColor;
  varying vec3 vSecondaryColor;
  varying float vStyleId;

  void main() {
    vec2 uv = (gl_PointCoord - vec2(0.5)) * 2.0;
    float r2 = dot(uv, uv);
    if (r2 > 1.0) discard;

    // Reconstruct 3D sphere normal from billboard UV
    float z = sqrt(max(0.0, 1.0 - r2));
    vec3 normal = normalize(vec3(uv.x, -uv.y, z));

    if (vStyleId < 0.5) {
      // Style 0: The Sun (Glowing solar photosphere + limb corona)
      float core = exp(-r2 * 1.6);
      float granulation = 0.9 + 0.1 * sin(uv.x * 18.0 + uTime * 3.0) * cos(uv.y * 18.0 - uTime * 2.5);
      vec3 sunCol = mix(vSecondaryColor, vPrimaryColor, core * granulation);
      sunCol += vec3(1.0, 0.96, 0.85) * pow(z, 2.2) * 0.65;
      float alpha = smoothstep(1.0, 0.25, sqrt(r2));
      gl_FragColor = vec4(sunCol * 1.35, alpha);
      return;
    }

    if (vStyleId > 2.5 && vStyleId < 3.5) {
      // Style 3: Comet Coma & Glowing Nucleus
      float nucleus = exp(-r2 * 10.0);
      float coma = exp(-r2 * 2.6) * 0.85;
      vec3 cometCol = mix(vSecondaryColor, vec3(0.95, 0.99, 1.0), nucleus);
      float alpha = clamp(nucleus + coma, 0.0, 0.98);
      gl_FragColor = vec4(cometCol * 1.25, alpha);
      return;
    }

    // Directional solar illumination for 3D planetary spheres
    vec3 lightDir = normalize(vec3(-0.55, 0.38, 0.74));
    float diff = max(0.18, dot(normal, lightDir));

    // Procedural surface texture based on styleId
    float lon = atan(normal.x, normal.z) + uTime * 0.45;
    float lat = asin(clamp(normal.y, -1.0, 1.0));

    vec3 surfaceCol = vPrimaryColor;
    if (vStyleId < 1.5) {
      // Style 1: Earth / Terrestrial / Habitable Exoplanet (Continents + Polar Caps + Ocean Specular)
      float continent = sin(lon * 3.0) * cos(lat * 4.0) + 0.45 * sin(lon * 7.0 - lat * 5.0);
      surfaceCol = mix(vPrimaryColor, vSecondaryColor, smoothstep(-0.05, 0.35, continent));
      // Polar ice caps
      float polar = smoothstep(1.05, 1.35, abs(lat));
      surfaceCol = mix(surfaceCol, vec3(0.94, 0.97, 1.0), polar * 0.75);
    } else if (vStyleId < 2.5) {
      // Style 2: Banded Gas/Ice Giant (Jupiter, Saturn, Uranus, Neptune)
      float bands = 0.5 + 0.5 * sin(lat * 14.0 + 0.35 * sin(lon * 4.0));
      surfaceCol = mix(vPrimaryColor, vSecondaryColor, bands);
    } else {
      // Style 4: Lava Super-Earth (55 Cancri e)
      float magma = 0.5 + 0.5 * sin(lon * 6.0 + uTime * 1.5) * cos(lat * 6.0);
      surfaceCol = mix(vPrimaryColor * 0.45, vSecondaryColor * 1.4, smoothstep(0.2, 0.75, magma));
    }

    // Atmospheric Fresnel rim glow
    float fresnel = pow(1.0 - z, 2.4);
    vec3 finalCol = surfaceCol * diff + vPrimaryColor * fresnel * 0.55;

    // Anti-aliased sphere edge
    float edgeAlpha = smoothstep(1.0, 0.88, sqrt(r2));
    gl_FragColor = vec4(finalCol, edgeAlpha);
  }
`;
