export const STAR_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  uniform float uTime;
  uniform float uRotationSpeedScale;
  uniform float uPixelRatio;
  uniform float uDiskFlattening;
  uniform float uSpiralContrast;
  uniform float uTurbulence;
  uniform float uYoungBlueBoost;
  uniform vec3 uSupernovaOrigin;
  uniform float uSupernovaRadius;
  uniform float uSupernovaActive;

  attribute vec3 position;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAngularVelocity;
  attribute float aPhase;
  attribute float aPopulationType; // 0=bulge/bar, 1=disk, 2=spiral_arm, 3=young_ob, 4=halo
  attribute vec3 aProtoOffset;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vTempBoost;

  void main() {
    vec3 pos = position;

    // 1. Evolution morphing: interpolate between clumpy high-z protogalactic state and settled disk
    float settleFactor = clamp(uDiskFlattening, 0.1, 1.0);
    pos.y = mix(pos.y * 3.6 + aProtoOffset.y * 2.2, pos.y, settleFactor);
    pos.xz = mix(pos.xz * 0.68 + aProtoOffset.xz * 1.45, pos.xz, settleFactor);

    // 2. Differential galactic rotation around Y axis (galactocentric Z-axis)
    float angle = aAngularVelocity * uTime * uRotationSpeedScale;
    if (aPopulationType > 3.5) {
      angle *= 0.25;
    }

    float cosA = cos(angle);
    float sinA = sin(angle);
    vec2 rotatedXZ = vec2(
      pos.x * cosA - pos.z * sinA,
      pos.x * sinA + pos.z * cosA
    );
    pos.x = rotatedXZ.x;
    pos.z = rotatedXZ.y;

    // Subtle vertical epicyclic oscillation
    pos.y += sin(uTime * 0.4 + aPhase * 6.2831) * 0.03 * (1.0 + uTurbulence * 2.5);

    // 3. Supernova Sedov-Taylor shockwave displacement when active
    float snBoost = 0.0;
    if (uSupernovaActive > 0.5 && uSupernovaRadius > 0.01) {
      vec3 toStar = pos - uSupernovaOrigin;
      float distToSN = length(toStar);
      float shellWidth = max(0.18, uSupernovaRadius * 0.28);
      float shellFactor = exp(-pow((distToSN - uSupernovaRadius) / shellWidth, 2.0));
      if (distToSN < uSupernovaRadius * 1.35 && distToSN > 0.001) {
        pos += normalize(toStar) * shellFactor * 0.35;
        snBoost = shellFactor;
      }
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float camDist = max(0.15, -mvPosition.z);

    // Spiral and young OB star brightness modulation across cosmic evolution
    float lumMultiplier = 1.0;
    if (aPopulationType > 1.5 && aPopulationType < 3.5) {
      lumMultiplier = mix(0.45, 1.35, clamp(uSpiralContrast, 0.0, 1.3));
    }
    if (aPopulationType > 2.5 && aPopulationType < 3.5) {
      lumMultiplier *= mix(0.6, 1.5, clamp(uYoungBlueBoost, 0.0, 1.2));
    }

    // Distance-attenuated point size with subtle scintillation
    float twinkle = 0.92 + 0.08 * sin(uTime * 2.2 + aPhase * 12.56);
    float computedSize = aSize * lumMultiplier * twinkle * uPixelRatio * (18.0 / pow(camDist, 0.78));
    computedSize += snBoost * 8.0 * uPixelRatio;

    gl_PointSize = clamp(computedSize, 0.85, 42.0);

    vec3 finalColor = aColor;
    if (aPopulationType > 2.5 && aPopulationType < 3.5) {
      finalColor = mix(finalColor, vec3(0.55, 0.82, 1.0), clamp(uYoungBlueBoost - 0.4, 0.0, 0.6));
    }
    if (snBoost > 0.05) {
      finalColor = mix(finalColor, vec3(0.65, 0.95, 1.0), clamp(snBoost * 0.85, 0.0, 1.0));
    }

    vColor = finalColor;
    vTempBoost = snBoost;
    vAlpha = clamp(lumMultiplier * (0.88 + snBoost * 0.5), 0.15, 1.0);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const STAR_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vTempBoost;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv) * 2.0;
    if (dist > 1.0) discard;

    // Airy-disk-inspired stellar PSF: bright hot core + soft exponential corona
    float core = exp(-dist * dist * 9.5);
    float halo = exp(-dist * 3.1) * 0.52;
    float intensity = core + halo;

    vec3 col = vColor * (0.9 + core * 0.65 + vTempBoost * 0.5);
    float alpha = intensity * vAlpha;

    if (alpha < 0.015) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;
