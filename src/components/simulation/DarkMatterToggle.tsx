import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Eye, EyeOff, X } from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { ScienceBadge } from '@/components/ui/ScienceBadge';

export const DarkMatterToggle: React.FC = () => {
  const activeMode = useGalaxyStore((s) => s.activeMode);
  const setActiveMode = useGalaxyStore((s) => s.setActiveMode);
  const showDarkMatterHalo = useGalaxyStore((s) => s.showDarkMatterHalo);
  const setShowDarkMatterHalo = useGalaxyStore((s) => s.setShowDarkMatterHalo);
  const darkMatterOpacity = useGalaxyStore((s) => s.darkMatterOpacity);
  const setDarkMatterOpacity = useGalaxyStore((s) => s.setDarkMatterOpacity);
  const includeDarkMatterInCurve = useGalaxyStore((s) => s.includeDarkMatterInCurve);
  const setIncludeDarkMatterInCurve = useGalaxyStore((s) => s.setIncludeDarkMatterInCurve);

  if (activeMode !== 'dark-matter') return null;

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
              <ShieldAlert className="h-4 w-4 text-[#A78BFA]" />
              <ScienceBadge type="Scientific Simulation Data" size="sm" />
            </div>
            <h2 className="font-display text-lg font-semibold text-[#F4F7FB]">
              Quầng Vật Chất Tối Navarro-Frenk-White (NFW)
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Khung Xương Hấp Dẫn & Phân Tích Đường Cong Quay Phẳng
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
          Các ngôi sao phát sáng, khí và bụi chỉ chiếm khoảng ~5–6% tổng khối lượng của Dải Ngân Hà.
          Toàn bộ đĩa xoắn ốc nằm gọn bên trong một{' '}
          <strong className="text-[#A78BFA]">Quầng Vật Chất Tối NFW</strong> khổng lồ (M₂₀₀ ≈ 1,15 ×
          10¹² M☉).
        </p>

        {/* Toggle 3D Volumetric Halo Envelope & Opacity */}
        <div className="mt-4 rounded-xl border border-[#A78BFA]/30 bg-[#A78BFA]/10 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#F4F7FB]">
              Lớp Quầng Vật Chất Tối NFW 3D
            </span>
            <button
              type="button"
              onClick={() => setShowDarkMatterHalo(!showDarkMatterHalo)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                showDarkMatterHalo
                  ? 'bg-[#A78BFA] text-[#030509]'
                  : 'bg-white/10 text-[#94A3B8] hover:text-white'
              }`}
            >
              {showDarkMatterHalo ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>{showDarkMatterHalo ? 'Đang Bật' : 'Đang Tắt'}</span>
            </button>
          </div>

          <div>
            <div className="flex justify-between font-mono text-[11px] text-[#94A3B8]">
              <span>Độ Đậm Đặc Quầng Hiển Thị</span>
              <span className="text-[#A78BFA]">{Math.round(darkMatterOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.15}
              max={0.95}
              step={0.05}
              value={darkMatterOpacity}
              onChange={(e) => setDarkMatterOpacity(parseFloat(e.target.value))}
              className="mt-1 w-full accent-[#A78BFA] cursor-pointer"
            />
          </div>
        </div>

        {/* Interactive Galactic Rotation Curve V_c(R) Comparison SVG */}
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#101725]/80 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#F4F7FB]">
              Đường Cong Quay V_c(R) [0 – 25 kpc]
            </span>
            <button
              type="button"
              onClick={() => setIncludeDarkMatterInCurve(!includeDarkMatterInCurve)}
              className="font-mono text-[10px] text-[#67E8F9] hover:underline"
            >
              {includeDarkMatterInCurve ? 'Chế độ: Có Vật Chất Tối NFW' : 'Chế độ: Chỉ Sao & Khí'}
            </button>
          </div>

          <svg viewBox="0 0 300 135" className="w-full h-32 overflow-visible">
            {/* Axes */}
            <line x1="30" y1="110" x2="285" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="30" y1="15" x2="30" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

            {/* Y-axis labels */}
            <text x="4" y="26" fill="#64748B" fontSize="8" fontFamily="monospace">
              250
            </text>
            <text x="4" y="68" fill="#64748B" fontSize="8" fontFamily="monospace">
              150
            </text>
            <text x="4" y="110" fill="#64748B" fontSize="8" fontFamily="monospace">
              0
            </text>

            {/* X-axis labels */}
            <text x="30" y="124" fill="#64748B" fontSize="8" fontFamily="monospace">
              0 kpc
            </text>
            <text x="100" y="124" fill="#34D399" fontSize="8" fontFamily="monospace">
              Mặt Trời (8,2)
            </text>
            <text x="255" y="124" fill="#64748B" fontSize="8" fontFamily="monospace">
              25 kpc
            </text>

            {/* Solar Radius Vertical Dashed Line */}
            <line
              x1="114"
              y1="20"
              x2="114"
              y2="110"
              stroke="#34D399"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.6"
            />

            {/* Keplerian Baryonic Disk-Only Curve */}
            <path
              d="M 30 110 Q 55 24, 90 42 T 180 72 T 280 88"
              fill="none"
              stroke="#F8C98B"
              strokeWidth="1.75"
              strokeDasharray="4 3"
            />

            {/* NFW Dark Matter Contribution Curve */}
            {includeDarkMatterInCurve && (
              <path
                d="M 30 110 Q 85 78, 150 54 T 280 40"
                fill="none"
                stroke="#A78BFA"
                strokeWidth="1.5"
                opacity="0.8"
              />
            )}

            {/* Total Flat Rotation Curve (~232 km/s) */}
            {includeDarkMatterInCurve && (
              <path
                d="M 30 110 Q 48 22, 85 28 L 155 29 L 280 31"
                fill="none"
                stroke="#67E8F9"
                strokeWidth="2.2"
              />
            )}

            {/* Sun Marker on Curve */}
            <circle cx="114" cy={includeDarkMatterInCurve ? 28 : 50} r="3.5" fill="#34D399" />
          </svg>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
            <span className="flex items-center gap-1 text-[#67E8F9]">
              <span className="h-2 w-2 rounded-full bg-[#67E8F9]" /> Đường cong phẳng (~233 km/s)
            </span>
            <span className="flex items-center gap-1 text-[#F8C98B]">
              <span className="h-2 w-2 rounded-full bg-[#F8C98B]" /> Chỉ Sao + Khí
            </span>
            <span className="flex items-center gap-1 text-[#A78BFA]">
              <span className="h-2 w-2 rounded-full bg-[#A78BFA]" /> Quầng Vật Chất Tối
            </span>
          </div>
        </div>

        {/* Mass Budget Breakdown */}
        <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="rounded-xl border border-white/[0.06] bg-[#101725]/70 p-2.5">
            <div className="text-[10px] text-[#64748B]">Vật chất thông thường (Sao+Khí)</div>
            <div className="mt-0.5 font-semibold text-[#F8C98B]">~6,8 × 10¹⁰ M☉ (5,9%)</div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#101725]/70 p-2.5">
            <div className="text-[10px] text-[#64748B]">Quầng Vật Chất Tối (M₂₀₀)</div>
            <div className="mt-0.5 font-semibold text-[#A78BFA]">~1,08 × 10¹² M☉ (94,1%)</div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
