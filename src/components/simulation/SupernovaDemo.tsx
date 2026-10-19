import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, RotateCcw, Flame, X } from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { ScienceBadge } from '@/components/ui/ScienceBadge';

const NURSERY_TARGETS: { label: string; position: [number, number, number] }[] = [
  { label: 'Tổ Hợp Tinh Vân Carina (Nhánh Sagittarius)', position: [3.6, 0.0, 5.6] },
  { label: 'Vùng Bùng Nổ Sao W43 (Scutum-Centaurus)', position: [-3.8, 0.0, 3.6] },
  { label: 'Quần Hợp Perseus OB2 / Tinh Vân Trái Tim', position: [2.2, 0.0, 10.1] },
  { label: 'Đám Mây Phân Tử Orion (Nhánh Cục Bộ)', position: [-1.1, 0.0, 8.2] },
];

const PHASE_VI: Record<string, string> = {
  'Free Expansion': 'Giãn Nở Tự Do',
  'Sedov-Taylor Adiabatic': 'Đoạn Nhiệt Sedov-Taylor',
  'Radiative Snowplow': 'Tích Tụ Bức Xạ (Snowplow)',
  'ISM Mixing': 'Hòa Trộn Môi Trường Liên Sao',
};

export const SupernovaDemo: React.FC = () => {
  const activeMode = useGalaxyStore((s) => s.activeMode);
  const setActiveMode = useGalaxyStore((s) => s.setActiveMode);
  const supernova = useGalaxyStore((s) => s.supernova);
  const triggerSupernova = useGalaxyStore((s) => s.triggerSupernova);
  const resetSupernova = useGalaxyStore((s) => s.resetSupernova);

  if (activeMode !== 'supernova') return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        className="pointer-events-auto fixed right-3 top-20 z-20 flex w-[92vw] sm:w-[400px] max-h-[calc(100vh-145px)] flex-col rounded-2xl border border-white/[0.12] bg-[#090D18]/88 p-5 backdrop-blur-2xl shadow-2xl overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="h-4 w-4 text-[#67E8F9]" />
              <ScienceBadge type="Simplified Physics Demo" size="sm" />
            </div>
            <h2 className="font-display text-lg font-semibold text-[#F4F7FB]">
              Phản Hồi Sao — Vụ Nổ Siêu Tân Tinh
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Sóng Xung Kích Giải Tích Sedov-Taylor & Nén Khí Liên Sao
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveMode('overview')}
            className="rounded-full p-1.5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-[#94A3B8]">
          Các vụ nổ siêu tân tinh suy sụp lõi giải phóng ~10⁵¹ erg (<span className="font-mono">1 foe</span>)
          động năng vào môi trường liên sao—tạo nên những siêu bong bóng tia X nóng hàng triệu độ,
          phát tán các nguyên tố nặng và điều hòa tốc độ tạo sao của thiên hà.
        </p>

        {/* Target Stellar Nursery Selector */}
        <div className="mt-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] mb-1.5">
            Chọn Vùng Tạo Sao Khối Lượng Lớn
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {NURSERY_TARGETS.map((site) => {
              const isCurrent =
                Math.abs(supernova.originPosition[0] - site.position[0]) < 0.1 &&
                Math.abs(supernova.originPosition[2] - site.position[2]) < 0.1;
              return (
                <button
                  key={site.label}
                  type="button"
                  onClick={() => triggerSupernova(site.position)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ${
                    isCurrent
                      ? 'border-[#67E8F9]/50 bg-[#67E8F9]/15 text-[#F4F7FB]'
                      : 'border-white/[0.06] bg-[#101725]/60 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <span>{site.label}</span>
                  <Flame className="h-3.5 w-3.5 text-[#67E8F9]" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Sedov-Taylor Telemetry Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 font-mono">
          <div className="rounded-xl border border-white/[0.06] bg-[#101725]/80 p-2.5">
            <div className="text-[10px] text-[#64748B]">Pha Tiến Hóa Tàn Dư</div>
            <div className="mt-0.5 text-xs font-semibold text-[#67E8F9]">
              {PHASE_VI[supernova.phase] ?? supernova.phase}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#101725]/80 p-2.5">
            <div className="text-[10px] text-[#64748B]">Bán Kính Sóng (R_s)</div>
            <div className="mt-0.5 text-sm font-semibold text-[#F4F7FB]">
              {supernova.shockRadiusPc.toFixed(1)} <span className="text-[10px] text-[#7AA8FF]">pc</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#101725]/80 p-2.5">
            <div className="text-[10px] text-[#64748B]">Vận Tốc Sóng Xung Kích</div>
            <div className="mt-0.5 text-sm font-semibold text-[#F8C98B]">
              {supernova.shockVelocityKms.toLocaleString()}{' '}
              <span className="text-[10px] text-[#94A3B8]">km/s</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#101725]/80 p-2.5">
            <div className="text-[10px] text-[#64748B]">Nhiệt Độ Sau Xung Kích</div>
            <div className="mt-0.5 text-sm font-semibold text-rose-300">
              {supernova.temperatureMK} <span className="text-[10px] text-[#94A3B8]">× 10⁶ K</span>
            </div>
          </div>
        </div>

        {/* Trigger & Reset Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => triggerSupernova()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#67E8F9] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#030509] hover:bg-cyan-200 transition shadow-lg"
          >
            <Zap className="h-4 w-4" />
            <span>Kích Nổ Siêu Tân Tinh</span>
          </button>

          <button
            type="button"
            onClick={resetSupernova}
            className="flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-medium text-[#F4F7FB] hover:bg-white/10 transition"
            title="Xóa sóng xung kích"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#030509]/60 p-2.5 font-mono text-[10px] text-[#64748B]">
          Phương trình Sedov-Taylor: R_s(t) ≈ 1,15 (E₀ / ρ₀)^(1/5) t^(2/5) · Bán kính vỏ cầu được
          phóng đại trong góc nhìn toàn thiên hà để dễ quan sát.
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
