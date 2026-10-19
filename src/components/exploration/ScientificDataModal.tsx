import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ExternalLink, Crosshair, Layers, X } from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { GAIA_NEARBY_STARS, SCIENCE_SOURCES } from '@/data/scienceSources';
import { SIMULATION_PROVIDERS } from '@/simulation/providers/SimulationProvider';
import { ScienceBadge } from '@/components/ui/ScienceBadge';

export const ScientificDataModal: React.FC = () => {
  const activeMode = useGalaxyStore((s) => s.activeMode);
  const setActiveMode = useGalaxyStore((s) => s.setActiveMode);
  const flyToPose = useGalaxyStore((s) => s.flyToPose);
  const [activeTab, setActiveTab] = useState<'gaia' | 'sources' | 'providers'>('gaia');

  if (activeMode !== 'data') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="pointer-events-auto fixed right-3 top-20 z-20 flex w-[94vw] max-w-xl max-h-[calc(100vh-145px)] flex-col rounded-2xl border border-white/[0.12] bg-[#090D18]/90 p-5 backdrop-blur-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[#67E8F9]" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#67E8F9]">
                Trình Duyệt Dữ Liệu Khoa Học & Kiến Trúc Mô Phỏng
              </span>
            </div>
            <h2 className="mt-1 font-display text-lg font-semibold text-[#F4F7FB]">
              Danh Mục Thiên Văn Thực Nghiệm & Nguồn Dữ Liệu
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActiveMode('overview')}
            className="rounded-full p-1.5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-[#030509]/70 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('gaia')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
              activeTab === 'gaia'
                ? 'bg-[#101725] text-[#F4F7FB] border border-white/15'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Sao Chuẩn ESA Gaia DR3 (8)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
              activeTab === 'sources'
                ? 'bg-[#101725] text-[#F4F7FB] border border-white/15'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Nguồn Dữ Liệu Khoa Học
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('providers')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
              activeTab === 'providers'
                ? 'bg-[#101725] text-[#F4F7FB] border border-white/15'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Adapter Mô Phỏng (4)
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-2.5">
          {activeTab === 'gaia' && (
            <>
              <div className="flex items-center justify-between px-1 text-[11px] text-[#94A3B8]">
                <span>Các ngôi sao chuẩn thiên văn gắn trong hệ tọa độ Tâm Ngân Hà:</span>
                <ScienceBadge type="Observational Data" size="sm" />
              </div>

              {GAIA_NEARBY_STARS.map((star) => (
                <div
                  key={star.id}
                  className="rounded-xl border border-white/[0.07] bg-[#101725]/70 p-3 hover:border-white/20 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display text-sm font-semibold text-[#F4F7FB]">
                        {star.commonName}
                      </div>
                      <div className="font-mono text-[10px] text-[#7AA8FF]">
                        {star.designation} · Phổ {star.spectralType}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const [x, y, z] = star.galactocentricPosKpc;
                        flyToPose([x + 0.45, y + 0.35, z + 0.75], [x, y, z]);
                      }}
                      className="flex items-center gap-1 rounded-lg border border-[#67E8F9]/30 bg-[#67E8F9]/10 px-2.5 py-1 font-mono text-[10px] text-[#67E8F9] hover:bg-[#67E8F9]/20 transition"
                    >
                      <Crosshair className="h-3 w-3" />
                      <span>Định Vị 3D</span>
                    </button>
                  </div>

                  <p className="mt-1.5 text-xs text-[#94A3B8]">{star.notes}</p>

                  <div className="mt-2 grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] font-mono text-[10px]">
                    <div>
                      <span className="text-[#64748B] block">Cách Mặt Trời</span>
                      <span className="text-[#F4F7FB]">
                        {star.distanceLy.toLocaleString()} năm ánh sáng
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Nhiệt độ (T_eff)</span>
                      <span className="text-[#F8C98B]">{star.temperatureK.toLocaleString()} K</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Vận tốc xuyên tâm</span>
                      <span className="text-[#67E8F9]">{star.radialVelocityKms} km/s</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'sources' &&
            SCIENCE_SOURCES.map((src) => (
              <div
                key={src.id}
                className="rounded-xl border border-white/[0.08] bg-[#101725]/75 p-3.5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-sm font-semibold text-[#F4F7FB]">
                    {src.name}
                  </span>
                  <ScienceBadge type={src.category} size="sm" />
                </div>

                <div className="font-mono text-[10px] text-[#7AA8FF]">
                  {src.institutionOrSource} ({src.publicationYear}) · {src.cosmologyModel}
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed">{src.summary}</p>

                <div className="rounded-lg bg-[#030509]/60 p-2 font-mono text-[10px] text-[#94A3B8]">
                  <strong className="text-[#F8C98B]">Vai trò Khoa học: </strong>
                  {src.fidelityNote}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="font-mono text-[10px] text-[#64748B]">
                    Độ phân giải: {src.spatialResolution}
                  </span>
                  <a
                    href={src.referenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-[#67E8F9] hover:underline"
                  >
                    <span>Tài liệu gốc</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}

          {activeTab === 'providers' && (
            <>
              <div className="rounded-xl border border-[#7AA8FF]/25 bg-[#7AA8FF]/10 p-3 text-xs text-[#94A3B8]">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#7AA8FF] mb-1">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Kiến Trúc SimulationProvider Độc Lập</span>
                </div>
                Ứng dụng tách biệt hoàn toàn tầng hiển thị 3D thời gian thực khỏi các dữ liệu mô
                phỏng siêu máy tính (HPC) và mô hình thay thế AI thông qua giao diện{' '}
                <code className="text-[#F4F7FB]">SimulationProvider</code>.
              </div>

              {SIMULATION_PROVIDERS.map((provider) => {
                const snap = provider.getSnapshotState(13.8);
                return (
                  <div
                    key={provider.id}
                    className="rounded-xl border border-white/[0.08] bg-[#101725]/75 p-3.5 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold text-[#F4F7FB]">
                        {provider.name}
                      </span>
                      <ScienceBadge type={provider.provenance} size="sm" />
                    </div>
                    <p className="text-xs text-[#94A3B8]">{provider.description}</p>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] font-mono text-[10px]">
                      <div>
                        <span className="text-[#64748B] block">Mã Adapter</span>
                        <span className="text-[#F4F7FB]">{provider.id}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">Khối lượng sao (z=0)</span>
                        <span className="text-[#F8C98B]">{snap.totalStellarMassSolar}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">Tốc độ tạo sao</span>
                        <span className="text-[#67E8F9]">{snap.starFormationRate} M☉/năm</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
