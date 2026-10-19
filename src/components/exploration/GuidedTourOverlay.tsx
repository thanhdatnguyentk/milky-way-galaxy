import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, X, Compass } from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { GUIDED_TOUR_STOPS } from '@/data/cameraPresets';

export const GuidedTourOverlay: React.FC = () => {
  const tour = useGalaxyStore((s) => s.tour);
  const pauseGuidedTour = useGalaxyStore((s) => s.pauseGuidedTour);
  const resumeGuidedTour = useGalaxyStore((s) => s.resumeGuidedTour);
  const nextTourStop = useGalaxyStore((s) => s.nextTourStop);
  const prevTourStop = useGalaxyStore((s) => s.prevTourStop);
  const exitGuidedTour = useGalaxyStore((s) => s.exitGuidedTour);

  const stop = GUIDED_TOUR_STOPS[tour.currentStopIndex];

  return (
    <AnimatePresence>
      {tour.isActive && stop && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="pointer-events-auto fixed bottom-20 left-1/2 z-30 w-[94vw] max-w-2xl -translate-x-1/2 rounded-2xl border border-white/15 bg-[#090D18]/90 p-5 backdrop-blur-2xl shadow-2xl"
        >
          {/* Step Progress Bar */}
          <div className="mb-3 flex items-center gap-1.5">
            {GUIDED_TOUR_STOPS.map((s, idx) => {
              const fill =
                idx < tour.currentStopIndex
                  ? 100
                  : idx === tour.currentStopIndex
                  ? Math.round(tour.stopProgress * 100)
                  : 0;
              return (
                <div
                  key={s.id}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
                >
                  <div
                    className="h-full bg-[#67E8F9] transition-all duration-150"
                    style={{ width: `${fill}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#67E8F9]">
                <Compass className="h-3.5 w-3.5" />
                <span>
                  HÀNH TRÌNH XUYÊN NGÂN HÀ · CHẶNG {stop.stepNumber} / {GUIDED_TOUR_STOPS.length}
                </span>
                <span className="text-white/25">|</span>
                <span className="text-[#94A3B8]">{stop.scaleLabel}</span>
              </div>
              <h3 className="mt-1 font-display text-lg sm:text-xl font-semibold text-[#F4F7FB]">
                {stop.title}
              </h3>
              <p className="text-xs text-[#7AA8FF]">{stop.subtitle}</p>
            </div>

            <button
              type="button"
              onClick={exitGuidedTour}
              className="rounded-full p-1.5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition"
              title="Thoát hành trình thuyết minh"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#F4F7FB]/90">
            {stop.narrative}
          </p>

          <div className="mt-3 rounded-xl border border-white/[0.08] bg-[#101725]/80 px-3 py-2 font-mono text-[11px] text-[#94A3B8]">
            <strong className="text-[#F8C98B]">Ghi chú Vật lý Thiên văn: </strong>
            {stop.scientificCallout}
          </div>

          {/* Autopilot Transport Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevTourStop}
                className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#F4F7FB] hover:bg-white/10 transition"
              >
                <SkipBack className="h-3.5 w-3.5" />
                <span>Chặng Trước</span>
              </button>

              <button
                type="button"
                onClick={tour.isPlaying ? pauseGuidedTour : resumeGuidedTour}
                className="flex items-center gap-1.5 rounded-xl bg-[#7AA8FF] px-4 py-1.5 text-xs font-semibold text-[#030509] hover:bg-[#93B8FF] transition"
              >
                {tour.isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Tạm Dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Tiếp Tục</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={nextTourStop}
                className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#F4F7FB] hover:bg-white/10 transition"
              >
                <span>Chặng Tiếp</span>
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={exitGuidedTour}
              className="font-mono text-[11px] text-[#94A3B8] hover:text-white transition"
            >
              Thoát Tour Tự Động
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
