import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronRight, MapPin } from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { GALAXY_REGIONS } from '@/data/galaxyRegions';

export const RegionSelector: React.FC = () => {
  const hasDismissedHero = useGalaxyStore((s) => s.hasDismissedHero);
  const activeMode = useGalaxyStore((s) => s.activeMode);
  const selectedRegionId = useGalaxyStore((s) => s.selectedRegionId);
  const selectRegion = useGalaxyStore((s) => s.selectRegion);

  const isVisible = hasDismissedHero && (activeMode === 'regions' || activeMode === 'overview');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-auto fixed left-3 top-20 z-20 hidden lg:flex w-72 flex-col rounded-2xl border border-white/[0.08] bg-[#090D18]/78 p-3.5 backdrop-blur-xl max-h-[calc(100vh-150px)] overflow-y-auto"
        >
          <div className="mb-2.5 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#7AA8FF]" />
              <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-[#F4F7FB]">
                Galactic Atlas (10 Regions)
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#64748B]">R_gal (kpc)</span>
          </div>

          <div className="space-y-1">
            {GALAXY_REGIONS.map((region) => {
              const isSelected = selectedRegionId === region.id;
              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => selectRegion(region.id, true)}
                  className={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all ${
                    isSelected
                      ? 'bg-[#101725] border border-white/20 text-[#F4F7FB] shadow-md'
                      : 'border border-transparent text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F4F7FB]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: region.accentColor,
                        boxShadow: isSelected ? `0 0 8px ${region.accentColor}` : 'none',
                      }}
                    />
                    <div className="truncate">
                      <div className="truncate text-xs font-medium">{region.name}</div>
                      <div className="truncate text-[10px] text-[#64748B]">{region.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                    <span className="text-[#94A3B8]">{region.distanceFromCenterKpc.toFixed(1)}</span>
                    <ChevronRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        isSelected
                          ? 'translate-x-0.5 text-[#7AA8FF]'
                          : 'text-[#64748B] group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center gap-2 px-1 text-[10px] text-[#64748B]">
            <MapPin className="h-3 w-3 text-[#7AA8FF] shrink-0" />
            <span>Click any 3D marker or atlas item to engage orbital approach.</span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
