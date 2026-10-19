export const NEBULA_DUST_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  uniform float uTime;
  uniform float uRotationSpeedScale;
  uniform float uPixelRatio;
  uniform float uDiskFlattening;
  uniform float uGasFraction;

  attribute vec3 position;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAngularVelocity;
  attribute float aOpacity;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vec3 pos = position;
    float settle = clamp(uDiskFlattening, 0.15, 1.0);
    pos.y = mix(pos.y * 3.2, pos.y, settle);

    float angle = aAngularVelocity * uTime * uRotationSpeedScale;
    float c = cos(angle);
    float s = sin(angle);
    pos.xz = vec2(pos.x * c - pos.z * s, pos.x * s + pos.z * c);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float camDist = max(0.5, -mvPosition.z);

    float gasScale = mix(0.65, 1.45, clamp(uGasFraction * 2.2, 0.0, 1.0));
    gl_PointSize = clamp(aSize * gasScale * uPixelRatio * (35.0 / pow(camDist, 0.85)), 2.0, 110.0);

    vColor = aColor;
    float nearFade = smoothstep(0.35, 1.8, camDist);
    vOpacity = aOpacity * nearFade * gasScale;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const NEBULA_DUST_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float r = length(uv) * 2.0;
    if (r > 1.0) discard;

    float cloud = exp(-r * r * 3.6) * (1.0 - r * r);
    float alpha = cloud * vOpacity;
    if (alpha < 0.004) discard;

    gl_FragColor = vec4(vColor, alpha);
  }
`;
