import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Sun,
  Sparkles,
  Compass,
  ChevronRight,
  ChevronLeft,
  X,
  Thermometer,
  Gauge,
  Orbit,
  Layers,
  Wind,
} from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import {
  CELESTIAL_BODIES,
  CELESTIAL_BODY_MAP,
  SOLAR_ORIGIN_KPC,
  type CelestialBodyCategory,
} from '@/data/planetaryBodies';

const CATEGORY_FILTERS: ('Tất Cả' | CelestialBodyCategory)[] = [
  'Tất Cả',
  'Hành Tinh Hệ Mặt Trời',
  'Mặt Trăng & Hành Tinh Lùn',
  'Sao Chổi (Comet)',
  'Ngoại Hành Tinh (Exoplanet)',
];

export const PlanetaryExplorer: React.FC = () => {
  const hasDismissedHero = useGalaxyStore((s) => s.hasDismissedHero);
  const activeMode = useGalaxyStore((s) => s.activeMode);
  const selectedPlanetId = useGalaxyStore((s) => s.selectedPlanetId);
  const selectPlanet = useGalaxyStore((s) => s.selectPlanet);
  const flyToPose = useGalaxyStore((s) => s.flyToPose);
  const rotationSpeedMultiplier = useGalaxyStore((s) => s.rotationSpeedMultiplier);
  const setRotationSpeedMultiplier = useGalaxyStore((s) => s.setRotationSpeedMultiplier);

  const [categoryFilter, setCategoryFilter] = useState<'Tất Cả' | CelestialBodyCategory>('Tất Cả');

  if (!hasDismissedHero || activeMode !== 'planets') return null;

  const filteredBodies =
    categoryFilter === 'Tất Cả'
      ? CELESTIAL_BODIES
      : CELESTIAL_BODIES.filter((b) => b.category === categoryFilter);

  const selectedBody = selectedPlanetId ? CELESTIAL_BODY_MAP[selectedPlanetId] : CELESTIAL_BODIES[3];

  const currentIndex = selectedBody
    ? CELESTIAL_BODIES.findIndex((b) => b.id === selectedBody.id)
    : 0;

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + CELESTIAL_BODIES.length) % CELESTIAL_BODIES.length;
    selectPlanet(CELESTIAL_BODIES[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % CELESTIAL_BODIES.length;
    selectPlanet(CELESTIAL_BODIES[nextIdx].id);
  };

  const handleViewFullSolarOrrery = () => {
    selectPlanet('sun');
    flyToPose(
      [SOLAR_ORIGIN_KPC[0], SOLAR_ORIGIN_KPC[1] + 0.036, SOLAR_ORIGIN_KPC[2] + 0.056],
      SOLAR_ORIGIN_KPC
    );
  };

  const handleZoomOutToOrionArm = () => {
    selectPlanet(null);
    flyToPose(
      [SOLAR_ORIGIN_KPC[0] + 0.65, SOLAR_ORIGIN_KPC[1] + 0.95, SOLAR_ORIGIN_KPC[2] + 1.45],
      SOLAR_ORIGIN_KPC
    );
  };

  return (
    <>
      {/* Left Panel: Celestial Bodies & Exoplanets Catalog */}
      <aside className="pointer-events-auto fixed left-3 top-20 bottom-16 z-20 flex w-80 flex-col rounded-2xl border border-white/[0.08] bg-[#090D18]/84 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/[0.08] p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#F4F7FB]">
                Hành Tinh, Sao Chổi & Ngoại Hành Tinh
              </span>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
              {CELESTIAL_BODIES.length} Thiên thể
            </span>
          </div>

          <p className="mt-1 text-[11px] text-[#94A3B8] leading-relaxed">
            Hệ Mặt Trời thực tế chỉ rộng <span className="font-mono text-[#F4F7FB]">~80 AU (0,0004 pc)</span>{' '}
            so với Ngân Hà <span className="font-mono text-[#F4F7FB]">32.000 pc</span>. Camera tự động thu
            phóng sâu vào thang vi mô (Sub-Parsec) để hiển thị quỹ đạo 3D và ẩn đi khi nhìn toàn thiên hà.
          </p>

          {/* Quick Camera Presets */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={handleViewFullSolarOrrery}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-medium text-amber-300 hover:bg-amber-500/20 transition"
            >
              <Sun className="h-3 w-3" />
              <span>Toàn Hệ Mặt Trời</span>
            </button>
            <button
              type="button"
              onClick={() => selectPlanet('earth')}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-sky-400/30 bg-sky-500/10 px-2.5 py-1.5 text-[11px] font-medium text-sky-300 hover:bg-sky-500/20 transition"
            >
              <Globe className="h-3 w-3" />
              <span>Trái Đất & Mặt Trăng</span>
            </button>
            <button
              type="button"
              onClick={handleZoomOutToOrionArm}
              className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-mono text-[#CBD5E1] hover:bg-white/10 transition"
            >
              <Compass className="h-3 w-3 text-[#7AA8FF]" />
              <span>Thu Nhỏ Ra Nhánh Orion (So Sánh Tỉ Lệ Ngân Hà)</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {CATEGORY_FILTERS.map((cat) => {
              const active = categoryFilter === cat;
              const shortLabel =
                cat === 'Hành Tinh Hệ Mặt Trời'
                  ? 'Hệ Mặt Trời'
                  : cat === 'Mặt Trăng & Hành Tinh Lùn'
                  ? 'Mặt Trăng & Lùn'
                  : cat === 'Sao Chổi (Comet)'
                  ? 'Sao Chổi'
                  : cat === 'Ngoại Hành Tinh (Exoplanet)'
                  ? 'Ngoại Hành Tinh'
                  : 'Tất Cả';

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition ${
                    active
                      ? 'bg-[#7AA8FF] text-[#030509] font-semibold'
                      : 'bg-white/5 text-[#94A3B8] hover:text-[#F4F7FB] hover:bg-white/10'
                  }`}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Celestial Body List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredBodies.map((body) => {
            const isSelected = selectedBody?.id === body.id;
            return (
              <button
                key={body.id}
                type="button"
                onClick={() => selectPlanet(body.id)}
                className={`w-full text-left rounded-xl p-2.5 transition-all flex items-start justify-between gap-2.5 border ${
                  isSelected
                    ? 'bg-[#101725]/95 border-white/20 shadow-md'
                    : 'bg-transparent border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {/* Visual Sphere Preview Icon */}
                  <span
                    className="mt-1 h-3.5 w-3.5 rounded-full shrink-0 border border-white/25"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${body.accentColor}, rgba(9,13,24,0.9))`,
                      boxShadow: isSelected ? `0 0 12px ${body.accentColor}` : 'none',
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-xs font-medium text-[#F4F7FB] truncate">
                        {body.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                      {body.subtitle}
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[9px] text-[#64748B]">
                      <span className="text-[#67E8F9]">{body.category}</span>
                      <span>·</span>
                      <span className="truncate">{body.distanceFromSunOrHost}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 mt-1 transition-transform ${
                    isSelected ? 'text-[#7AA8FF] translate-x-0.5' : 'text-[#64748B]'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Bottom Orbital Speed Control */}
        <div className="border-t border-white/[0.08] p-3 bg-[#060911]/60 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8] flex items-center gap-1">
              <Orbit className="h-3 w-3 text-[#7AA8FF]" />
              <span>Tốc độ quỹ đạo hành tinh</span>
            </span>
            <span className="font-mono text-[#F4F7FB]">
              {rotationSpeedMultiplier.toFixed(1)}×
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={3.5}
            step={0.1}
            value={rotationSpeedMultiplier}
            onChange={(e) => setRotationSpeedMultiplier(parseFloat(e.target.value))}
            className="w-full accent-[#7AA8FF] h-1 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>
      </aside>

      {/* Right Panel: Selected Planet / Moon / Comet / Exoplanet Telemetry Drawer */}
      <AnimatePresence mode="wait">
        {selectedBody && (
          <motion.aside
            key={selectedBody.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto fixed right-3 top-20 bottom-16 z-20 flex w-80 md:w-96 flex-col rounded-2xl border border-white/[0.08] bg-[#090D18]/86 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Top Header */}
            <div className="border-b border-white/[0.08] p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>{selectedBody.category}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="rounded-lg border border-white/10 bg-white/5 p-1 text-[#94A3B8] hover:text-white hover:bg-white/10 transition"
                    title="Thiên thể trước"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-lg border border-white/10 bg-white/5 p-1 text-[#94A3B8] hover:text-white hover:bg-white/10 transition"
                    title="Thiên thể tiếp theo"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectPlanet(null)}
                    className="rounded-lg border border-white/10 bg-white/5 p-1 text-[#94A3B8] hover:text-white hover:bg-white/10 transition ml-1"
                    title="Đóng bảng chi tiết"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div
                  className="h-11 w-11 rounded-full shrink-0 border border-white/20 shadow-inner"
                  style={{
                    background: `radial-gradient(circle at 32% 32%, ${selectedBody.accentColor}, rgba(6,10,20,0.95))`,
                    boxShadow: `0 0 22px ${selectedBody.accentColor}55`,
                  }}
                />
                <div>
                  <h2 className="font-display text-lg font-semibold text-[#F4F7FB] leading-snug">
                    {selectedBody.name}
                  </h2>
                  <p className="font-mono text-[11px] text-[#94A3B8]">
                    {selectedBody.englishName}
                  </p>
                </div>
              </div>

              <p className="mt-2 text-xs font-medium text-[#7AA8FF]">{selectedBody.subtitle}</p>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 6 Telemetry Cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#64748B]">
                    <Compass className="h-3 w-3 text-[#7AA8FF]" />
                    <span>Khoảng Cách Quỹ Đạo</span>
                  </div>
                  <div className="mt-1 font-mono text-xs font-semibold text-[#F4F7FB]">
                    {selectedBody.distanceFromSunOrHost}
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#64748B]">
                    <Orbit className="h-3 w-3 text-[#67E8F9]" />
                    <span>Chu Kỳ Quỹ Đạo</span>
                  </div>
                  <div className="mt-1 font-mono text-xs font-semibold text-[#F4F7FB]">
                    {selectedBody.orbitalPeriod}
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#64748B]">
                    <Gauge className="h-3 w-3 text-emerald-400" />
                    <span>Bán Kính</span>
                  </div>
                  <div className="mt-1 font-mono text-xs font-semibold text-[#F4F7FB]">
                    {selectedBody.radiusKmOrEarth}
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#64748B]">
                    <Layers className="h-3 w-3 text-amber-300" />
                    <span>Khối Lượng</span>
                  </div>
                  <div className="mt-1 font-mono text-xs font-semibold text-[#F4F7FB]">
                    {selectedBody.massLabel}
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 col-span-2">
                  <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#64748B]">
                    <Thermometer className="h-3 w-3 text-rose-400" />
                    <span>Nhiệt Độ Bề Mặt / Cân Bằng</span>
                  </div>
                  <div className="mt-1 font-mono text-xs font-semibold text-[#F4F7FB]">
                    {selectedBody.surfaceTempLabel}
                  </div>
                </div>
              </div>

              {/* Moons & Satellites */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                  Hệ Vệ Tinh Tự Nhiên (Mặt Trăng)
                </div>
                <div className="mt-1 text-xs font-medium text-[#F4F7FB]">
                  {selectedBody.moonsCountLabel}
                </div>
              </div>

              {/* Atmosphere & Composition */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#67E8F9]">
                  <Wind className="h-3.5 w-3.5" />
                  <span>Khí Quyển & Cấu Tạo Vật Lý</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#E2E8F0]">
                  {selectedBody.atmosphereComposition}
                </p>
              </div>

              {/* Summary */}
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                  Hồ Sơ Thiên Văn Học
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#CBD5E1]">
                  {selectedBody.summary}
                </p>
              </div>

              {/* Scientific Highlights */}
              <div className="rounded-xl border border-[#7AA8FF]/25 bg-[#7AA8FF]/[0.06] p-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#7AA8FF]">
                  Dữ Liệu Khám Phá & Tàu Vũ Trụ
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#E2E8F0]">
                  {selectedBody.scientificHighlights}
                </p>
              </div>
            </div>

            {/* Footer Camera Lock Status */}
            <div className="border-t border-white/[0.08] bg-[#060911]/80 px-4 py-2.5 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-300 font-mono text-[10px]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>CAMERA ĐANG BÁM THEO QUỸ ĐẠO 3D</span>
              </span>
              <button
                type="button"
                onClick={handleViewFullSolarOrrery}
                className="font-mono text-[10px] text-[#7AA8FF] hover:underline"
              >
                Thu nhỏ toàn hệ →
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
