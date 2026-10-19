import React, { useEffect, useRef, useState } from 'react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { QUALITY_PRESETS } from '@/utils/qualityPresets';
import { generateMilkyWayBuffers } from '@/simulation/models/galaxyGenerator';
import { STAR_FRAGMENT_SHADER, STAR_VERTEX_SHADER } from '@/shaders/stars/starShaders';
import {
  NEBULA_DUST_FRAGMENT_SHADER,
  NEBULA_DUST_VERTEX_SHADER,
} from '@/shaders/dust/dustShaders';
import { EVOLUTION_STAGES } from '@/data/scienceSources';
import { GALAXY_REGIONS } from '@/data/galaxyRegions';
import { stepLeapfrogParticles } from '@/simulation/integrators/leapfrog';
import { clamp, lerp } from '@/utils/math';
import {
  createGLProgram,
  mat4LookAt,
  mat4Multiply,
  mat4Perspective,
  projectWorldToScreen,
  type Vec3,
} from '@/utils/webglMath';

interface ProjectedMarker {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  x: number;
  y: number;
  visible: boolean;
  accentColor: string;
  distanceFromCenterKpc: number;
}

const LINE_VERTEX_SHADER = /* glsl */ `
  precision highp float;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  attribute vec3 position;
  attribute vec4 aColor;
  varying vec4 vColor;
  void main() {
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 7.0;
  }
`;

const LINE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  varying vec4 vColor;
  void main() {
    gl_FragColor = vColor;
  }
`;

function hexToRgbNormalized(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export const GalaxyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [projectedMarkers, setProjectedMarkers] = useState<ProjectedMarker[]>([]);

  const qualityTier = useGalaxyStore((s) => s.qualityTier);
  const selectedRegionId = useGalaxyStore((s) => s.selectedRegionId);
  const showRegionMarkers = useGalaxyStore((s) => s.showRegionMarkers);
  const selectRegion = useGalaxyStore((s) => s.selectRegion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preset = QUALITY_PRESETS[qualityTier];
    const gl =
      (canvas.getContext('webgl2', {
        antialias: true,
        alpha: false,
        depth: true,
        powerPreference: 'high-performance',
      }) as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl', {
        antialias: true,
        alpha: false,
        depth: true,
      }) as WebGLRenderingContext | null);

    if (!gl) return;

    // 1. COMPILE GPU SHADER PROGRAMS
    const starProgram = createGLProgram(gl, STAR_VERTEX_SHADER, STAR_FRAGMENT_SHADER);
    const nebulaProgram = createGLProgram(
      gl,
      NEBULA_DUST_VERTEX_SHADER,
      NEBULA_DUST_FRAGMENT_SHADER
    );
    const lineProgram = createGLProgram(gl, LINE_VERTEX_SHADER, LINE_FRAGMENT_SHADER);

    // 2. GENERATE MILKY WAY GPU BUFFERS
    const buffers = generateMilkyWayBuffers(preset);

    const createBuffer = (data: Float32Array, usage = gl.STATIC_DRAW) => {
      const buf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      return buf;
    };

    const starPosBuf = createBuffer(buffers.positions);
    const starColBuf = createBuffer(buffers.colors);
    const starSizeBuf = createBuffer(buffers.sizes);
    const starAngVelBuf = createBuffer(buffers.angularVelocities);
    const starPhaseBuf = createBuffer(buffers.phases);
    const starPopBuf = createBuffer(buffers.populationTypes);
    const starProtoBuf = createBuffer(buffers.protoOffsets);

    const nebPosBuf = createBuffer(buffers.nebulaPositions);
    const nebColBuf = createBuffer(buffers.nebulaColors);
    const nebSizeBuf = createBuffer(buffers.nebulaSizes);
    const nebAngVelBuf = createBuffer(buffers.nebulaAngularVelocities);
    const nebOpacityBuf = createBuffer(buffers.nebulaOpacities);

    // Dynamic line/overlay buffers for Solar Orbit, Sgr A* rings, Dark Matter Halo, Supernova shell & Gravity Lab
    const dynamicPosBuf = gl.createBuffer()!;
    const dynamicColBuf = gl.createBuffer()!;

    // 3. CAMERA ORBIT & FREE-FLIGHT STATE
    const initialPose = useGalaxyStore.getState().cameraPose;
    const camPos: Vec3 = [...initialPose.position];
    const camTarget: Vec3 = [...initialPose.target];
    const desiredCamPos: Vec3 = [...initialPose.position];
    const desiredTarget: Vec3 = [...initialPose.target];
    let lastTransitionId = initialPose.transitionId;
    let isTransitioningCamera = false;

    // Spherical coordinates around camTarget for smooth damped mouse orbit
    const syncSphericalFromVectors = (pos: Vec3, target: Vec3) => {
      const dx = pos[0] - target[0];
      const dy = pos[1] - target[1];
      const dz = pos[2] - target[2];
      const r = Math.max(0.2, Math.hypot(dx, dy, dz));
      const phi = Math.acos(clamp(dy / r, -0.999, 0.999));
      const theta = Math.atan2(dx, dz);
      return { r, phi, theta };
    };

    let spherical = syncSphericalFromVectors(camPos, camTarget);
    let targetSpherical = { ...spherical };

    // Mouse / Touch interaction handlers
    let isDragging = false;
    let isRightDrag = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      isRightDrag = e.button === 2 || e.shiftKey;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      isTransitioningCamera = false;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      if (isRightDrag) {
        const panScale = targetSpherical.r * 0.0014;
        const cosT = Math.cos(targetSpherical.theta);
        const sinT = Math.sin(targetSpherical.theta);
        camTarget[0] -= dx * cosT * panScale;
        camTarget[2] += dx * sinT * panScale;
        camTarget[1] += dy * panScale;
      } else {
        targetSpherical.theta -= dx * 0.0055;
        targetSpherical.phi = clamp(targetSpherical.phi - dy * 0.0055, 0.08, Math.PI - 0.08);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      isTransitioningCamera = false;
      const zoomFactor = Math.exp(e.deltaY * 0.0011);
      targetSpherical.r = clamp(targetSpherical.r * zoomFactor, 0.22, 92.0);
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('contextmenu', onContextMenu);

    // Keyboard WASD Free-Flight state
    const keysPressed = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      keysPressed.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.code);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Resize handler
    let pixelRatio = Math.min(window.devicePixelRatio || 1, preset.pixelRatioMax);
    const updateSize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, preset.pixelRatioMax);
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(w * pixelRatio);
      canvas.height = Math.round(h * pixelRatio);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Smoothed evolution parameters
    const currentEvoParams = {
      diskFlattening: 1.0,
      spiralContrast: 1.0,
      turbulence: 0.1,
      youngBlueFraction: 0.42,
      gasFraction: 0.12,
    };

    let animationFrameId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let frameCount = 0;
    let fpsAccum = 0;
    let evoTimer = 0;
    let markerTimer = 0;

    const bindAttrib = (
      prog: WebGLProgram,
      name: string,
      buf: WebGLBuffer,
      size: number
    ): number => {
      const loc = gl.getAttribLocation(prog, name);
      if (loc >= 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      }
      return loc;
    };

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      elapsed += dt;

      const state = useGalaxyStore.getState();

      // FPS counter
      frameCount++;
      fpsAccum += dt;
      if (fpsAccum >= 0.5) {
        state.setFps(Math.min(120, Math.round(frameCount / fpsAccum)));
        frameCount = 0;
        fpsAccum = 0;
      }

      // Check for new flyToPose / preset transition
      if (state.cameraPose.transitionId !== lastTransitionId) {
        lastTransitionId = state.cameraPose.transitionId;
        desiredCamPos[0] = state.cameraPose.position[0];
        desiredCamPos[1] = state.cameraPose.position[1];
        desiredCamPos[2] = state.cameraPose.position[2];
        desiredTarget[0] = state.cameraPose.target[0];
        desiredTarget[1] = state.cameraPose.target[1];
        desiredTarget[2] = state.cameraPose.target[2];
        isTransitioningCamera = true;
      }

      if (isTransitioningCamera) {
        const alpha = 1.0 - Math.exp(-3.4 * dt);
        camPos[0] = lerp(camPos[0], desiredCamPos[0], alpha);
        camPos[1] = lerp(camPos[1], desiredCamPos[1], alpha);
        camPos[2] = lerp(camPos[2], desiredCamPos[2], alpha);
        camTarget[0] = lerp(camTarget[0], desiredTarget[0], alpha);
        camTarget[1] = lerp(camTarget[1], desiredTarget[1], alpha);
        camTarget[2] = lerp(camTarget[2], desiredTarget[2], alpha);

        spherical = syncSphericalFromVectors(camPos, camTarget);
        targetSpherical = { ...spherical };

        const distErr =
          Math.hypot(
            camPos[0] - desiredCamPos[0],
            camPos[1] - desiredCamPos[1],
            camPos[2] - desiredCamPos[2]
          ) +
          Math.hypot(
            camTarget[0] - desiredTarget[0],
            camTarget[1] - desiredTarget[1],
            camTarget[2] - desiredTarget[2]
          );
        if (distErr < 0.04) {
          isTransitioningCamera = false;
        }
      } else {
        // Autopilot subtle orbital drift
        if (state.tour.isActive && state.tour.isPlaying) {
          state.tickGuidedTour(dt);
          targetSpherical.theta += dt * 0.085;
        }

        // Inertial damping of spherical orbit coordinates
        const damp = 1.0 - Math.exp(-10.0 * dt);
        spherical.theta = lerp(spherical.theta, targetSpherical.theta, damp);
        spherical.phi = lerp(spherical.phi, targetSpherical.phi, damp);
        spherical.r = lerp(spherical.r, targetSpherical.r, damp);

        // WASD Free-Flight thrust
        if (state.cameraControlMode === 'free-flight' && keysPressed.size > 0) {
          const speed =
            (keysPressed.has('ShiftLeft') || keysPressed.has('ShiftRight') ? 14.0 : 5.5) * dt;
          const forwardX = -Math.sin(spherical.phi) * Math.sin(spherical.theta);
          const forwardY = -Math.cos(spherical.phi);
          const forwardZ = -Math.sin(spherical.phi) * Math.cos(spherical.theta);

          const rightX = Math.cos(spherical.theta);
          const rightZ = -Math.sin(spherical.theta);

          let moveX = 0;
          let moveY = 0;
          let moveZ = 0;
          if (keysPressed.has('KeyW') || keysPressed.has('ArrowUp')) {
            moveX += forwardX * speed;
            moveY += forwardY * speed;
            moveZ += forwardZ * speed;
          }
          if (keysPressed.has('KeyS') || keysPressed.has('ArrowDown')) {
            moveX -= forwardX * speed;
            moveY -= forwardY * speed;
            moveZ -= forwardZ * speed;
          }
          if (keysPressed.has('KeyD') || keysPressed.has('ArrowRight')) {
            moveX += rightX * speed;
            moveZ += rightZ * speed;
          }
          if (keysPressed.has('KeyA') || keysPressed.has('ArrowLeft')) {
            moveX -= rightX * speed;
            moveZ -= rightZ * speed;
          }
          if (keysPressed.has('KeyE') || keysPressed.has('Space')) {
            moveY += speed;
          }
          if (keysPressed.has('KeyQ')) {
            moveY -= speed;
          }

          camTarget[0] += moveX;
          camTarget[1] += moveY;
          camTarget[2] += moveZ;
        }

        camPos[0] = camTarget[0] + spherical.r * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        camPos[1] = camTarget[1] + spherical.r * Math.cos(spherical.phi);
        camPos[2] = camTarget[2] + spherical.r * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      }

      if (Math.abs(spherical.r - state.cameraDistanceKpc) > 0.15) {
        state.setCameraDistanceKpc(spherical.r);
      }

      // Evolution timeline auto-advance
      if (state.activeMode === 'evolution' && state.isEvolutionPlaying) {
        evoTimer += dt;
        if (evoTimer >= 3.2) {
          evoTimer = 0;
          state.setEvolutionStageIndex((state.evolutionStageIndex + 1) % EVOLUTION_STAGES.length);
        }
      }

      const targetStage = EVOLUTION_STAGES[state.evolutionStageIndex] ?? EVOLUTION_STAGES[6];
      const evoLerp = 1.0 - Math.exp(-3.5 * dt);
      currentEvoParams.diskFlattening = lerp(
        currentEvoParams.diskFlattening,
        targetStage.parameters.diskFlattening,
        evoLerp
      );
      currentEvoParams.spiralContrast = lerp(
        currentEvoParams.spiralContrast,
        targetStage.parameters.spiralContrast,
        evoLerp
      );
      currentEvoParams.turbulence = lerp(
        currentEvoParams.turbulence,
        targetStage.parameters.turbulenceDispersion,
        evoLerp
      );
      currentEvoParams.youngBlueFraction = lerp(
        currentEvoParams.youngBlueFraction,
        targetStage.parameters.youngBlueFraction,
        evoLerp
      );
      currentEvoParams.gasFraction = lerp(
        currentEvoParams.gasFraction,
        targetStage.parameters.gasFraction,
        evoLerp
      );

      // Step Supernova if active
      if (state.supernova.isActive) {
        state.stepSupernovaProgress(dt);
      }
      const snState = useGalaxyStore.getState().supernova;
      const visualSnRadiusKpc = snState.progress * 2.4;

      // Step Gravity Lab if in gravity mode
      let activeGravityParticles = state.gravityParticles;
      if (state.activeMode === 'gravity' && !state.gravityConfig.isPaused) {
        activeGravityParticles = stepLeapfrogParticles(
          state.gravityParticles,
          state.gravityConfig
        );
        state.setGravityParticles(activeGravityParticles);
      }

      // 4. COMPUTE CAMERA MATRICES
      const aspect = Math.max(1, canvas.width) / Math.max(1, canvas.height);
      const projMatrix = mat4Perspective((48 * Math.PI) / 180, aspect, 0.04, 260.0);
      const viewMatrix = mat4LookAt(camPos, camTarget, [0, 1, 0]);
      const viewProjMatrix = mat4Multiply(projMatrix, viewMatrix);

      // 5. CLEAR FRAMEBUFFER & SET ADDITIVE BLENDING
      gl.clearColor(0.0118, 0.0196, 0.0353, 1.0); // #030509 Deep Space Black
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      // 6. DRAW NEBULA & INTERSTELLAR DUST CLOUDS
      if (state.showDustLanes) {
        gl.useProgram(nebulaProgram);
        gl.uniformMatrix4fv(
          gl.getUniformLocation(nebulaProgram, 'modelViewMatrix'),
          false,
          viewMatrix
        );
        gl.uniformMatrix4fv(
          gl.getUniformLocation(nebulaProgram, 'projectionMatrix'),
          false,
          projMatrix
        );
        gl.uniform1f(gl.getUniformLocation(nebulaProgram, 'uTime'), elapsed);
        gl.uniform1f(
          gl.getUniformLocation(nebulaProgram, 'uRotationSpeedScale'),
          state.rotationSpeedMultiplier
        );
        gl.uniform1f(gl.getUniformLocation(nebulaProgram, 'uPixelRatio'), pixelRatio);
        gl.uniform1f(
          gl.getUniformLocation(nebulaProgram, 'uDiskFlattening'),
          currentEvoParams.diskFlattening
        );
        gl.uniform1f(
          gl.getUniformLocation(nebulaProgram, 'uGasFraction'),
          currentEvoParams.gasFraction
        );

        bindAttrib(nebulaProgram, 'position', nebPosBuf, 3);
        bindAttrib(nebulaProgram, 'aColor', nebColBuf, 3);
        bindAttrib(nebulaProgram, 'aSize', nebSizeBuf, 1);
        bindAttrib(nebulaProgram, 'aAngularVelocity', nebAngVelBuf, 1);
        bindAttrib(nebulaProgram, 'aOpacity', nebOpacityBuf, 1);

        gl.drawArrays(gl.POINTS, 0, buffers.dustAndHiiCount);
      }

      // 7. DRAW MILKY WAY GPU STAR FIELD
      gl.useProgram(starProgram);
      gl.uniformMatrix4fv(gl.getUniformLocation(starProgram, 'modelViewMatrix'), false, viewMatrix);
      gl.uniformMatrix4fv(
        gl.getUniformLocation(starProgram, 'projectionMatrix'),
        false,
        projMatrix
      );
      gl.uniform1f(gl.getUniformLocation(starProgram, 'uTime'), elapsed);
      gl.uniform1f(
        gl.getUniformLocation(starProgram, 'uRotationSpeedScale'),
        state.rotationSpeedMultiplier
      );
      gl.uniform1f(gl.getUniformLocation(starProgram, 'uPixelRatio'), pixelRatio);
      gl.uniform1f(
        gl.getUniformLocation(starProgram, 'uDiskFlattening'),
        currentEvoParams.diskFlattening
      );
      gl.uniform1f(
        gl.getUniformLocation(starProgram, 'uSpiralContrast'),
        currentEvoParams.spiralContrast
      );
      gl.uniform1f(
        gl.getUniformLocation(starProgram, 'uTurbulence'),
        currentEvoParams.turbulence
      );
      gl.uniform1f(
        gl.getUniformLocation(starProgram, 'uYoungBlueBoost'),
        currentEvoParams.youngBlueFraction
      );
      gl.uniform3f(
        gl.getUniformLocation(starProgram, 'uSupernovaOrigin'),
        snState.originPosition[0],
        snState.originPosition[1],
        snState.originPosition[2]
      );
      gl.uniform1f(gl.getUniformLocation(starProgram, 'uSupernovaRadius'), visualSnRadiusKpc);
      gl.uniform1f(
        gl.getUniformLocation(starProgram, 'uSupernovaActive'),
        snState.isActive ? 1.0 : 0.0
      );

      bindAttrib(starProgram, 'position', starPosBuf, 3);
      bindAttrib(starProgram, 'aColor', starColBuf, 3);
      bindAttrib(starProgram, 'aSize', starSizeBuf, 1);
      bindAttrib(starProgram, 'aAngularVelocity', starAngVelBuf, 1);
      bindAttrib(starProgram, 'aPhase', starPhaseBuf, 1);
      bindAttrib(starProgram, 'aPopulationType', starPopBuf, 1);
      bindAttrib(starProgram, 'aProtoOffset', starProtoBuf, 3);

      gl.drawArrays(gl.POINTS, 0, buffers.starCount);

      // 8. DRAW 3D SCIENTIFIC OVERLAYS (Solar Orbit, Sgr A* Relativistic Rings, NFW Dark Matter Halo, Supernova Shell, Gravity Lab)
      const lineVerts: number[] = [];
      const lineCols: number[] = [];

      const pushSegment = (
        p1: Vec3,
        p2: Vec3,
        rgb: [number, number, number],
        alpha: number
      ) => {
        lineVerts.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
        lineCols.push(rgb[0], rgb[1], rgb[2], alpha, rgb[0], rgb[1], rgb[2], alpha);
      };

      // 8a. Solar Neighborhood Orbital Circle (R_0 = 8.178 kpc) & GC-to-Sun Vector
      if (state.showSolarBeacon) {
        const segs = 96;
        for (let i = 0; i < segs; i++) {
          const a0 = (i / segs) * Math.PI * 2;
          const a1 = ((i + 1) / segs) * Math.PI * 2;
          pushSegment(
            [Math.cos(a0) * 8.178, 0.0, Math.sin(a0) * 8.178],
            [Math.cos(a1) * 8.178, 0.0, Math.sin(a1) * 8.178],
            [0.2, 0.83, 0.6],
            0.18
          );
        }
        // Dashed vector from Galactic Center [0,0,0] to Sun [0, 0.02, 8.178]
        for (let d = 0; d < 16; d += 2) {
          const z0 = (d / 16) * 8.178;
          const z1 = ((d + 1) / 16) * 8.178;
          pushSegment([0, 0.01, z0], [0, 0.02, z1], [0.2, 0.83, 0.6], 0.45);
        }
      }

      // 8b. Sagittarius A* Relativistic Accretion & Photon Ring at [0,0,0]
      const sgrRings = [0.12, 0.18, 0.25];
      for (const rRing of sgrRings) {
        const segs = 48;
        for (let i = 0; i < segs; i++) {
          const a0 = (i / segs) * Math.PI * 2 + elapsed * 2.5;
          const a1 = ((i + 1) / segs) * Math.PI * 2 + elapsed * 2.5;
          pushSegment(
            [Math.cos(a0) * rRing, Math.sin(a0) * rRing * 0.25, Math.sin(a0) * rRing],
            [Math.cos(a1) * rRing, Math.sin(a1) * rRing * 0.25, Math.sin(a1) * rRing],
            [0.98, 0.72, 0.35],
            0.65
          );
        }
      }

      // 8c. NFW Dark Matter Halo 3D Spherical/Oblate Geodesic Cage when enabled
      if (state.showDarkMatterHalo) {
        const haloRadii = [14.0, 21.5];
        for (const hr of haloRadii) {
          const latitudes = [-0.55, -0.25, 0.0, 0.25, 0.55];
          for (const lat of latitudes) {
            const y = hr * 0.86 * Math.sin(lat);
            const rSlice = hr * Math.cos(lat);
            const segs = 64;
            for (let i = 0; i < segs; i++) {
              const a0 = (i / segs) * Math.PI * 2 + elapsed * 0.05;
              const a1 = ((i + 1) / segs) * Math.PI * 2 + elapsed * 0.05;
              pushSegment(
                [Math.cos(a0) * rSlice, y, Math.sin(a0) * rSlice],
                [Math.cos(a1) * rSlice, y, Math.sin(a1) * rSlice],
                [0.65, 0.55, 0.98],
                state.darkMatterOpacity * 0.32
              );
            }
          }
          // Meridians
          for (let m = 0; m < 6; m++) {
            const lon = (m / 6) * Math.PI;
            const segs = 48;
            for (let i = 0; i < segs; i++) {
              const p0 = (i / segs) * Math.PI * 2;
              const p1 = ((i + 1) / segs) * Math.PI * 2;
              pushSegment(
                [
                  hr * Math.cos(p0) * Math.cos(lon),
                  hr * 0.86 * Math.sin(p0),
                  hr * Math.cos(p0) * Math.sin(lon),
                ],
                [
                  hr * Math.cos(p1) * Math.cos(lon),
                  hr * 0.86 * Math.sin(p1),
                  hr * Math.cos(p1) * Math.sin(lon),
                ],
                [0.52, 0.42, 0.96],
                state.darkMatterOpacity * 0.24
              );
            }
          }
        }
      }

      // 8d. Supernova Sedov-Taylor Expanding Spherical Blast Shell
      if (snState.progress > 0 && snState.progress < 0.99) {
        const [ox, oy, oz] = snState.originPosition;
        const rSn = Math.max(0.08, visualSnRadiusKpc);
        const fade = 1.0 - smoothstepSimple(0.7, 1.0, snState.progress);
        for (let ring = 0; ring < 5; ring++) {
          const lat = ((ring - 2) / 2.5) * (Math.PI * 0.45);
          const yOff = rSn * Math.sin(lat);
          const rSlice = rSn * Math.cos(lat);
          const segs = 48;
          for (let i = 0; i < segs; i++) {
            const a0 = (i / segs) * Math.PI * 2;
            const a1 = ((i + 1) / segs) * Math.PI * 2;
            pushSegment(
              [ox + Math.cos(a0) * rSlice, oy + yOff, oz + Math.sin(a0) * rSlice],
              [ox + Math.cos(a1) * rSlice, oy + yOff, oz + Math.sin(a1) * rSlice],
              [0.4, 0.91, 0.98],
              fade * 0.78
            );
          }
        }
      }

      // 8e. Gravity Lab Orbital Trails & Velocity Vectors
      if (state.activeMode === 'gravity') {
        for (const p of activeGravityParticles) {
          const rgb = hexToRgbNormalized(p.color);
          if (state.gravityConfig.showTrails && p.trail.length > 1) {
            for (let i = 0; i < p.trail.length - 1; i++) {
              const alpha = ((i + 1) / p.trail.length) * 0.85;
              pushSegment(p.trail[i], p.trail[i + 1], rgb, alpha);
            }
          }
          if (state.gravityConfig.showVelocityVectors) {
            const end: Vec3 = [
              p.position[0] + p.velocity[0] * 0.95,
              p.position[1] + p.velocity[1] * 0.95,
              p.position[2] + p.velocity[2] * 0.95,
            ];
            pushSegment(p.position, end, [1.0, 1.0, 1.0], 0.9);
          }
        }
      }

      if (lineVerts.length > 0) {
        gl.useProgram(lineProgram);
        gl.uniformMatrix4fv(
          gl.getUniformLocation(lineProgram, 'modelViewMatrix'),
          false,
          viewMatrix
        );
        gl.uniformMatrix4fv(
          gl.getUniformLocation(lineProgram, 'projectionMatrix'),
          false,
          projMatrix
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, dynamicPosBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineVerts), gl.DYNAMIC_DRAW);
        const posLoc = gl.getAttribLocation(lineProgram, 'position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, dynamicColBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineCols), gl.DYNAMIC_DRAW);
        const colLoc = gl.getAttribLocation(lineProgram, 'aColor');
        gl.enableVertexAttribArray(colLoc);
        gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINES, 0, lineVerts.length / 3);
      }

      // Also draw bright point heads for Gravity Lab test bodies
      if (state.activeMode === 'gravity' && activeGravityParticles.length > 0) {
        const ptVerts: number[] = [];
        const ptCols: number[] = [];
        for (const p of activeGravityParticles) {
          const rgb = hexToRgbNormalized(p.color);
          ptVerts.push(p.position[0], p.position[1], p.position[2]);
          ptCols.push(rgb[0], rgb[1], rgb[2], 1.0);
        }
        gl.useProgram(lineProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, dynamicPosBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ptVerts), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, dynamicColBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ptCols), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, activeGravityParticles.length);
      }

      // 9. PROJECT 3D GALACTIC REGIONS TO 2D SCREEN MARKERS AT ~20 HZ
      markerTimer += dt;
      if (markerTimer >= 0.05) {
        markerTimer = 0;
        const cssW = canvas.clientWidth;
        const cssH = canvas.clientHeight;
        const nextMarkers: ProjectedMarker[] = GALAXY_REGIONS.map((reg) => {
          const proj = projectWorldToScreen(reg.position, viewProjMatrix, cssW, cssH);
          return {
            id: reg.id,
            name: reg.name,
            subtitle: reg.subtitle,
            category: reg.category,
            x: proj.x,
            y: proj.y,
            visible: proj.visible,
            accentColor: reg.accentColor,
            distanceFromCenterKpc: reg.distanceFromCenterKpc,
          };
        });
        setProjectedMarkers(nextMarkers);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('contextmenu', onContextMenu);
      gl.deleteProgram(starProgram);
      gl.deleteProgram(nebulaProgram);
      gl.deleteProgram(lineProgram);
    };
  }, [qualityTier]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#030509]">
      {/* WebGL2 Fullscreen 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Subtle Radial Vignette to frame the 3D Cosmos */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 55%, rgba(3, 5, 9, 0.68) 100%)',
        }}
      />

      {/* Interactive 3D Projected Galactic Region Markers */}
      {showRegionMarkers && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {projectedMarkers.map((marker) => {
            if (!marker.visible) return null;
            const isSelected = selectedRegionId === marker.id;
            const isSolar = marker.id === 'solar-neighborhood';
            const isSgrA = marker.id === 'sagittarius-a-star';

            // Avoid overlapping Galactic Center and Sgr A* markers when zoomed far out
            if (isSgrA && useGalaxyStore.getState().cameraDistanceKpc > 6.5 && !isSelected) {
              return null;
            }

            return (
              <button
                key={marker.id}
                type="button"
                onClick={() => selectRegion(marker.id, true)}
                style={{
                  transform: `translate3d(${marker.x}px, ${marker.y}px, 0) translate(-50%, -50%)`,
                }}
                className="pointer-events-auto group absolute left-0 top-0 flex items-center gap-2 transition-opacity duration-200 focus:outline-none"
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span
                    className={`absolute inset-0 rounded-full transition-transform duration-300 ${
                      isSelected
                        ? 'scale-150 opacity-90 animate-ping'
                        : 'scale-100 opacity-40 group-hover:scale-150 group-hover:opacity-80'
                    }`}
                    style={{
                      border: `1px solid ${marker.accentColor}`,
                    }}
                  />
                  <span
                    className="h-2 w-2 rounded-full shadow-sm transition-transform duration-200 group-hover:scale-125"
                    style={{
                      backgroundColor: marker.accentColor,
                      boxShadow: `0 0 10px ${marker.accentColor}`,
                    }}
                  />
                </span>

                <span
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide backdrop-blur-md transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#101725]/95 text-[#F4F7FB] border border-white/25 shadow-lg'
                      : isSolar
                      ? 'bg-emerald-950/75 text-emerald-200 border border-emerald-400/35 group-hover:bg-emerald-900/90'
                      : 'bg-[#090D18]/70 text-[#94A3B8] border border-white/[0.08] group-hover:bg-[#101725]/90 group-hover:text-[#F4F7FB] group-hover:border-white/20'
                  }`}
                >
                  <span>{marker.name}</span>
                  {isSolar && (
                    <span className="font-mono text-[9px] uppercase text-emerald-300">
                      YOU ARE HERE
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

function smoothstepSimple(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}
