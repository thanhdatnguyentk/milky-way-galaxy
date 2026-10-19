import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Pause, Flame, Layers, X } from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { EVOLUTION_STAGES } from '@/data/scienceSources';
import { ScienceBadge } from '@/components/ui/ScienceBadge';

export const EvolutionTimeline: React.FC = () => {
  const activeMode = useGalaxyStore((s) => s.activeMode);
  const setActiveMode = useGalaxyStore((s) => s.setActiveMode);
  const evolutionStageIndex = useGalaxyStore((s) => s.evolutionStageIndex);
  const setEvolutionStageIndex = useGalaxyStore((s) => s.setEvolutionStageIndex);
  const isEvolutionPlaying = useGalaxyStore((s) => s.isEvolutionPlaying);
  const toggleEvolutionPlay = useGalaxyStore((s) => s.toggleEvolutionPlay);

  if (activeMode !== 'evolution') return null;

  const stage = EVOLUTION_STAGES[evolutionStageIndex] ?? EVOLUTION_STAGES[6];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="pointer-events-auto fixed bottom-20 left-1/2 z-20 w-[95vw] max-w-4xl -translate-x-1/2 rounded-2xl border border-white/[0.12] bg-[#090D18]/88 p-4 sm:p-5 backdrop-blur-2xl shadow-2xl"
      >
        {/* Top Row: Stage Title, Provenance Badge, and Close */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#7AA8FF]">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  GIAI ĐOẠN {stage.index + 1} / 7 · t = {stage.cosmicTimeGyr.toFixed(1)} TỶ NĂM (z ={' '}
                  {stage.redshift})
                </span>
              </span>
              <ScienceBadge type={stage.provenance} size="sm" />
            </div>

            <h3 className="mt-1 font-display text-lg sm:text-xl font-semibold text-[#F4F7FB]">
              {stage.title}
            </h3>
            <p className="text-xs text-[#94A3B8]">{stage.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleEvolutionPlay}
              className="flex items-center gap-1.5 rounded-xl bg-[#7AA8FF] px-3.5 py-1.5 text-xs font-semibold text-[#030509] hover:bg-[#93B8FF] transition"
            >
              {isEvolutionPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Tạm Dừng</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Chạy Tự Động 13,8 Tỷ Năm</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setEvolutionStageIndex(6);
                setActiveMode('overview');
              }}
              className="rounded-full p-1.5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition"
              title="Quay về kỷ nguyên hiện tại"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Middle Row: Description & Real-Time Morphological Metrics */}
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-7 space-y-2">
            <p className="text-xs leading-relaxed text-[#F4F7FB]/90">{stage.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {stage.physicalProcesses.map((proc) => (
                <span
                  key={proc}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-[#94A3B8]"
                >
                  • {proc}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-2 font-mono">
            <div className="rounded-xl border border-white/[0.06] bg-[#101725]/80 p-2.5">
              <div className="text-[9px] uppercase text-[#64748B] flex items-center gap-1">
                <Flame className="h-3 w-3 text-[#F8C98B]" />
                <span>Tốc Độ Tạo Sao</span>
              </div>
              <div className="mt-0.5 text-sm font-semibold text-[#F8C98B]">
                {stage.parameters.starFormationRateSolarYr}
                <span className="text-[10px] font-normal text-[#94A3B8]"> M☉/năm</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#101725]/80 p-2.5">
              <div className="text-[9px] uppercase text-[#64748B] flex items-center gap-1">
                <Layers className="h-3 w-3 text-[#67E8F9]" />
                <span>Độ Phẳng Đĩa</span>
              </div>
              <div className="mt-0.5 text-sm font-semibold text-[#67E8F9]">
                {Math.round(stage.parameters.diskFlattening * 100)}%
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#101725]/80 p-2.5">
              <div className="text-[9px] uppercase text-[#64748B]">Tỷ Lệ Khí</div>
              <div className="mt-0.5 text-sm font-semibold text-[#F4F7FB]">
                {Math.round(stage.parameters.gasFraction * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Interactive 7-Stage Scrubber Track */}
        <div className="mt-4 pt-3 border-t border-white/[0.08]">
          <div className="grid grid-cols-7 gap-1.5">
            {EVOLUTION_STAGES.map((item) => {
              const isSelected = item.index === evolutionStageIndex;
              const isPast = item.index <= evolutionStageIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEvolutionStageIndex(item.index)}
                  className={`group flex flex-col items-start rounded-xl border p-2 text-left transition-all ${
                    isSelected
                      ? 'border-[#7AA8FF] bg-[#7AA8FF]/15 shadow-sm'
                      : isPast
                      ? 'border-white/10 bg-white/[0.04] hover:border-white/25'
                      : 'border-white/[0.05] bg-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="font-mono text-[10px] font-semibold text-[#67E8F9]">
                    {item.cosmicTimeGyr.toFixed(1)} Gyr
                  </span>
                  <span className="mt-0.5 line-clamp-1 text-[11px] font-medium text-[#F4F7FB]">
                    {item.title}
                  </span>
                  <span className="font-mono text-[9px] text-[#64748B]">z = {item.redshift}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
