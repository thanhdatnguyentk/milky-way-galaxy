export const SUPERNOVA_SHELL_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vLocalPos;
  varying vec3 vViewDir;

  void main() {
    vLocalPos = position;
    // Subtle Rayleigh-Taylor filamentary corrugation on the blast front
    float ripple = sin(position.x * 9.0 + uTime * 2.5) *
                   cos(position.y * 9.0 - uTime * 2.1) *
                   sin(position.z * 9.0 + uTime * 1.8) * 0.035;
    vec3 displaced = position * (1.0 + ripple);

    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(displaced, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

export const SUPERNOVA_SHELL_FRAGMENT_SHADER = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vLocalPos;
  varying vec3 vViewDir;

  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 1.75);
    float filament = 0.55 + 0.45 * sin(vLocalPos.x * 16.0 + uTime * 3.0) * cos(vLocalPos.z * 16.0 - uTime * 2.2);

    // Color transitions from hot blue-white X-ray shock to cyan/violet oxygen/hydrogen radiative shell
    vec3 earlyColor = vec3(0.75, 0.95, 1.0);
    vec3 midColor = vec3(0.38, 0.85, 0.98);
    vec3 lateColor = vec3(0.68, 0.45, 0.98);

    vec3 col = mix(earlyColor, midColor, smoothstep(0.0, 0.45, uProgress));
    col = mix(col, lateColor, smoothstep(0.45, 1.0, uProgress));

    float fade = (1.0 - smoothstep(0.72, 1.0, uProgress));
    float alpha = clamp((rim * 0.85 + 0.15) * filament * fade * 0.78, 0.0, 0.92);

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col * (1.1 + rim * 0.6), alpha);
  }
`;
