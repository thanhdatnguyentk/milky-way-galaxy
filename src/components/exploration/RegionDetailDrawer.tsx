import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Zap,
  Sparkles,
  Compass,
  Telescope,
  Flame,
  Info,
} from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { GALAXY_REGION_MAP } from '@/data/galaxyRegions';
import { ScienceBadge } from '@/components/ui/ScienceBadge';

const CATEGORY_VI: Record<string, string> = {
  'Galactic Core': 'Lõi Thiên Hà',
  'Spiral Structure': 'Cấu Trúc Xoắn Ốc',
  'Local Universe': 'Vũ Trụ Cục Bộ',
  'Outer Structure': 'Cấu Trúc Rìa & Quầng',
};

const ACTIVITY_VI: Record<string, string> = {
  Extreme: 'Cực Cao (Starburst)',
  High: 'Mạnh Mẽ',
  Moderate: 'Trung Bình',
  Low: 'Thấp',
  Quiescent: 'Tĩnh Lặng',
};

export const RegionDetailDrawer: React.FC = () => {
  const hasDismissedHero = useGalaxyStore((s) => s.hasDismissedHero);
  const selectedRegionId = useGalaxyStore((s) => s.selectedRegionId);
  const selectRegion = useGalaxyStore((s) => s.selectRegion);
  const triggerSupernova = useGalaxyStore((s) => s.triggerSupernova);
  const tourIsActive = useGalaxyStore((s) => s.tour.isActive);

  const region = selectedRegionId ? GALAXY_REGION_MAP[selectedRegionId] : null;
  const isVisible = hasDismissedHero && region !== null && !tourIsActive;

  return (
    <AnimatePresence>
      {isVisible && region && (
        <motion.aside
          key={region.id}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{ duration: 0.28 }}
          className="pointer-events-auto fixed right-3 top-20 z-20 flex w-[92vw] sm:w-[400px] max-h-[calc(100vh-145px)] flex-col rounded-2xl border border-white/[0.1] bg-[#090D18]/85 p-5 backdrop-blur-2xl shadow-2xl overflow-y-auto"
        >
          {/* Header & Close Button */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8]">
                  {CATEGORY_VI[region.category] ?? region.category}
                </span>
                <ScienceBadge type={region.provenance} size="sm" />
              </div>
              <h2 className="font-display text-xl font-semibold text-[#F4F7FB]">
                {region.name}
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">{region.subtitle}</p>
            </div>

            <button
              type="button"
              onClick={() => selectRegion(null)}
              className="rounded-full p-1.5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition"
              title="Đóng bảng thông tin"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Primary Distance & Mass Telemetry Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {region.keyMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-white/[0.06] bg-[#101725]/75 p-2.5"
              >
                <div className="font-mono text-[10px] text-[#64748B]">{metric.label}</div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-[#F4F7FB]">
                  {metric.value}{' '}
                  {metric.unit && (
                    <span className="text-[11px] font-normal text-[#7AA8FF]">{metric.unit}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Galactocentric & Heliocentric Coordinates */}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#030509]/60 px-3 py-2 font-mono text-[11px]">
            <div>
              <span className="text-[#64748B]">Từ Tâm Ngân Hà: </span>
              <span className="text-[#F4F7FB]">
                {region.distanceFromCenterKpc.toFixed(2)} kpc ({region.distanceFromCenterLy.toLocaleString()} ly)
              </span>
            </div>
            <div>
              <span className="text-[#64748B]">Từ Mặt Trời: </span>
              <span className="text-[#67E8F9]">{region.distanceFromSunKpc.toFixed(2)} kpc</span>
            </div>
          </div>

          {/* Scientific Overview */}
          <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#94A3B8]">
            <p className="text-[#F4F7FB]/90">{region.summary}</p>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#7AA8FF]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Quần Thể Sao Chủ Đạo</span>
              </div>
              <p className="text-xs text-[#F4F7FB]">{region.dominantStellarPopulation}</p>

              <div className="pt-1 flex items-center justify-between border-t border-white/[0.06]">
                <span className="font-mono text-[10px] uppercase text-[#64748B]">
                  Cường Độ Tạo Sao
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#F8C98B]">
                  <Flame className="h-3 w-3" />
                  {ACTIVITY_VI[region.starFormationActivity] ?? region.starFormationActivity}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#F8C98B] mb-1">
                <Compass className="h-3.5 w-3.5" />
                <span>Ý Nghĩa Vật Lý Thiên Văn</span>
              </div>
              <p>{region.astrophysicalSignificance}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#67E8F9] mb-1">
                <Telescope className="h-3.5 w-3.5" />
                <span>Bằng Chứng Quan Sát & Khảo Sát</span>
              </div>
              <p>{region.observationalEvidence}</p>
            </div>
          </div>

          {/* Special Scientific Transparency Note for Sagittarius A* */}
          {region.id === 'sagittarius-a-star' && (
            <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-950/30 p-3 text-[11px] text-amber-200/90 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Lưu ý tỷ lệ:</strong> Vòng bồi tụ tương đối tính và vòng photon tại [0, 0, 0]
                được phóng đại để có thể quan sát trực quan trong không gian 3D. Bán kính
                Schwarzschild thực của Sgr A* là 0,082 AU (4,0 × 10⁻¹⁰ kpc).
              </span>
            </div>
          )}

          {/* Action Footer: Trigger Supernova Feedback in this Region */}
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center gap-2">
            <button
              type="button"
              onClick={() => triggerSupernova(region.position)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#67E8F9]/35 bg-[#67E8F9]/15 px-3 py-2 text-xs font-medium text-[#67E8F9] hover:bg-[#67E8F9]/25 transition"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Kích Hoạt Sóng Xung Kích Siêu Tân Tinh Tại Đây</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
