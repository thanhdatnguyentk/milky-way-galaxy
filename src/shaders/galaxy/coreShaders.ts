export const SGR_A_ACCRETION_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormalDir;

  void main() {
    vUv = uv;
    vNormalDir = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const SGR_A_ACCRETION_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 centered = (vUv - 0.5) * 2.0;
    float r = length(centered);
    if (r > 1.0 || r < 0.16) discard;

    float angle = atan(centered.y, centered.x);
    // Relativistic Doppler beaming & spiral magnetorotational turbulence
    float spiralWave = sin(angle * 5.0 - log(max(0.16, r)) * 12.0 + uTime * 3.8);
    float spiralWave2 = cos(angle * 3.0 - r * 18.0 + uTime * 2.4);
    float turbulence = 0.65 + 0.35 * (spiralWave * 0.6 + spiralWave2 * 0.4);

    // Photon ring peak near r = 0.23
    float photonRing = exp(-pow((r - 0.22) / 0.038, 2.0)) * 1.9;
    float diskEnvelope = exp(-pow((r - 0.38) / 0.26, 2.0)) * (1.0 - smoothstep(0.75, 1.0, r));

    // Doppler boosting asymmetry (approaching side brighter/bluer)
    float doppler = 1.0 + 0.38 * cos(angle + 0.6);

    vec3 innerColor = vec3(1.0, 0.93, 0.78);
    vec3 midColor = vec3(0.98, 0.62, 0.24);
    vec3 outerColor = vec3(0.65, 0.22, 0.08);

    vec3 col = mix(innerColor, midColor, smoothstep(0.18, 0.48, r));
    col = mix(col, outerColor, smoothstep(0.48, 0.9, r));

    float totalIntensity = (photonRing + diskEnvelope * turbulence) * doppler;
    float alpha = clamp(totalIntensity, 0.0, 0.96);

    gl_FragColor = vec4(col * totalIntensity, alpha);
  }
`;

export const DARK_MATTER_HALO_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

export const DARK_MATTER_HALO_FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  uniform float uTime;
  uniform vec3 uColor;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.2);
    float pulse = 0.92 + 0.08 * sin(uTime * 1.1);
    float alpha = fresnel * uOpacity * pulse;
    if (alpha < 0.005) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
