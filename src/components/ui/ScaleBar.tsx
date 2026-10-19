import React from 'react';
import {
  RotateCcw,
  Navigation,
  Eye,
  EyeOff,
  Sparkles,
  Gauge,
  Camera,
} from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { getScaleViewLabel } from '@/utils/astronomyUnits';
import { CAMERA_PRESETS } from '@/data/cameraPresets';

export const ScaleBar: React.FC = () => {
  const hasDismissedHero = useGalaxyStore((s) => s.hasDismissedHero);
  const cameraDistanceKpc = useGalaxyStore((s) => s.cameraDistanceKpc);
  const cameraControlMode = useGalaxyStore((s) => s.cameraControlMode);
  const setCameraControlMode = useGalaxyStore((s) => s.setCameraControlMode);
  const resetCameraOverview = useGalaxyStore((s) => s.resetCameraOverview);
  const applyCameraPreset = useGalaxyStore((s) => s.applyCameraPreset);
  const showRegionMarkers = useGalaxyStore((s) => s.showRegionMarkers);
  const toggleRegionMarkers = useGalaxyStore((s) => s.toggleRegionMarkers);
  const showDustLanes = useGalaxyStore((s) => s.showDustLanes);
  const toggleDustLanes = useGalaxyStore((s) => s.toggleDustLanes);
  const rotationSpeedMultiplier = useGalaxyStore((s) => s.rotationSpeedMultiplier);
  const setRotationSpeedMultiplier = useGalaxyStore((s) => s.setRotationSpeedMultiplier);

  if (!hasDismissedHero) return null;

  const scaleInfo = getScaleViewLabel(cameraDistanceKpc);

  return (
    <div className="pointer-events-none fixed bottom-3 left-3 right-3 z-20 flex flex-wrap items-end justify-between gap-3 md:bottom-5 md:left-5 md:right-5">
      {/* Left Scale Bar & Astronomical Distance Telemetry */}
      <div className="pointer-events-auto flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#090D18]/80 px-3.5 py-2 backdrop-blur-xl">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#64748B]">
            {scaleInfo.level}
          </div>
          <div className="mt-1 flex items-center gap-2.5">
            <div className="flex flex-col items-center">
              <div className="h-1.5 w-20 border-b border-l border-r border-[#67E8F9]/80" />
            </div>
            <div className="font-mono text-[11px] text-[#F4F7FB]">
              <span>{scaleInfo.scaleBarKpc}</span>
              <span className="mx-1 text-[#64748B]">≈</span>
              <span className="text-[#67E8F9]">{scaleInfo.scaleBarLy}</span>
            </div>
          </div>
        </div>

        <span className="h-6 w-[1px] bg-white/10 hidden sm:inline-block" />

        {/* Camera Distance & Speed Control */}
        <div className="hidden sm:flex items-center gap-3 font-mono text-[11px]">
          <div>
            <span className="text-[#64748B] block text-[9px] uppercase">Cự ly Camera</span>
            <span className="text-[#F4F7FB]">
              {cameraDistanceKpc < 0.24
                ? `${(cameraDistanceKpc * 1000).toFixed(1)} pc (~${Math.max(1, Math.round(cameraDistanceKpc * 650))} AU)`
                : `${cameraDistanceKpc.toFixed(2)} kpc`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-[#7AA8FF]" />
            <span className="text-[#94A3B8] text-[10px]">Tốc độ quay Ω:</span>
            <input
              type="range"
              min={0}
              max={3}
              step={0.1}
              value={rotationSpeedMultiplier}
              onChange={(e) => setRotationSpeedMultiplier(parseFloat(e.target.value))}
              className="w-16 accent-[#7AA8FF] cursor-pointer"
              title="Hệ số nhân tốc độ quay vi sai của thiên hà"
            />
            <span className="text-[#F4F7FB] w-7">{rotationSpeedMultiplier.toFixed(1)}×</span>
          </div>
        </div>
      </div>

      {/* Right Camera Mode & Layer Controls */}
      <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-[#090D18]/80 p-1.5 backdrop-blur-xl">
        {/* Camera Preset Dropdown */}
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-[#94A3B8]">
          <Camera className="h-3.5 w-3.5 text-[#7AA8FF]" />
          <select
            aria-label="Góc nhìn Camera"
            onChange={(e) => {
              if (e.target.value) applyCameraPreset(e.target.value);
            }}
            defaultValue=""
            className="bg-transparent text-xs font-medium text-[#F4F7FB] focus:outline-none cursor-pointer"
          >
            <option value="" disabled className="bg-[#090D18] text-[#94A3B8]">
              Góc nhìn nhanh...
            </option>
            {CAMERA_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id} className="bg-[#090D18] text-[#F4F7FB]">
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <span className="h-4 w-[1px] bg-white/10" />

        {/* Orbit vs Free-Flight Mode Toggle */}
        <button
          type="button"
          onClick={() =>
            setCameraControlMode(cameraControlMode === 'free-flight' ? 'orbit' : 'free-flight')
          }
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-medium transition ${
            cameraControlMode === 'free-flight'
              ? 'bg-[#7AA8FF]/20 text-[#7AA8FF] border border-[#7AA8FF]/40'
              : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
          }`}
          title="Chuyển đổi giữa Chế độ Xoay Quỹ Đạo và Chế độ Bay Tự Do (WASD)"
        >
          <Navigation className="h-3 w-3" />
          <span>{cameraControlMode === 'free-flight' ? 'Bay Tự Do (WASD)' : 'Xoay Quỹ Đạo'}</span>
        </button>

        {/* Toggle 3D Region Pins */}
        <button
          type="button"
          onClick={toggleRegionMarkers}
          className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-medium transition ${
            showRegionMarkers
              ? 'text-[#F4F7FB] bg-white/10'
              : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
          title="Bật/Tắt nhãn địa danh 3D"
        >
          {showRegionMarkers ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          <span className="hidden sm:inline">Nhãn 3D</span>
        </button>

        {/* Toggle Dust & Nebulae */}
        <button
          type="button"
          onClick={toggleDustLanes}
          className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-medium transition ${
            showDustLanes ? 'text-[#67E8F9] bg-[#67E8F9]/10' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
          title="Bật/Tắt dải bụi liên sao & tinh vân HII"
        >
          <Sparkles className="h-3 w-3" />
          <span className="hidden sm:inline">Tinh Vân</span>
        </button>

        {/* Reset Overview */}
        <button
          type="button"
          onClick={resetCameraOverview}
          className="flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-medium text-[#94A3B8] hover:text-white hover:bg-white/10 transition"
          title="Đặt lại góc nhìn toàn cảnh Dải Ngân Hà"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="hidden sm:inline">Đặt Lại</span>
        </button>
      </div>
    </div>
  );
};
