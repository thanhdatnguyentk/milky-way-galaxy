import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Play, Sun, Sparkles, Orbit } from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { QUALITY_PRESETS } from '@/utils/qualityPresets';

export const HeroOverlay: React.FC = () => {
  const hasDismissedHero = useGalaxyStore((s) => s.hasDismissedHero);
  const setDismissedHero = useGalaxyStore((s) => s.setDismissedHero);
  const startGuidedTour = useGalaxyStore((s) => s.startGuidedTour);
  const exploreGalacticCenter = useGalaxyStore((s) => s.exploreGalacticCenter);
  const locateSun = useGalaxyStore((s) => s.locateSun);
  const qualityTier = useGalaxyStore((s) => s.qualityTier);

  const preset = QUALITY_PRESETS[qualityTier];
  const totalParticles =
    preset.starCount + preset.haloStarCount + preset.dustCloudCount + preset.hiiRegionCount;

  return (
    <AnimatePresence>
      {!hasDismissedHero && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-6 md:p-12"
        >
          {/* Top Minimal Scientific Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#090D18]/80 backdrop-blur-md">
                <Orbit className="h-4 w-4 text-[#7AA8FF]" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#94A3B8]">
                  DIGITAL ASTROPHYSICS OBSERVATORY · SBbc BARRED SPIRAL
                </div>
                <div className="font-display text-sm font-medium tracking-wider text-[#F4F7FB]">
                  MILKY WAY — A LIVING GALAXY
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 rounded-full border border-white/10 bg-[#090D18]/75 px-4 py-1.5 backdrop-blur-md font-mono text-[11px] text-[#94A3B8]">
              <span>
                R₀ = <strong className="text-[#F4F7FB]">8.178 kpc</strong> (26,673 ly)
              </span>
              <span className="text-white/20">|</span>
              <span>
                M_vir = <strong className="text-[#F4F7FB]">1.15 × 10¹² M☉</strong>
              </span>
              <span className="text-white/20">|</span>
              <span>
                GPU Particles:{' '}
                <strong className="text-[#67E8F9]">{totalParticles.toLocaleString()}</strong>
              </span>
            </div>
          </div>

          {/* Center-Left Editorial Hero Block (leaves central 3D galaxy unobstructed) */}
          <div className="my-auto max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="pointer-events-auto rounded-2xl border border-white/[0.08] bg-[#090D18]/72 p-6 md:p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#7AA8FF]/30 bg-[#7AA8FF]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#7AA8FF]">
                <Sparkles className="h-3 w-3" />
                <span>Real-Time WebGL2 Galactic Simulation</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#F4F7FB] leading-[1.08]">
                MILKY WAY
                <span className="block text-xl sm:text-2xl md:text-3xl font-normal text-[#94A3B8] mt-1.5">
                  Explore the architecture of the cosmos.
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-[#94A3B8]">
                Glide through four logarithmic spiral arms, inspect star-forming nebulae, trace our
                Solar Neighborhood at <span className="font-mono text-[#F4F7FB]">8.178 kpc</span>,
                and experiment with N-body orbital dynamics, supernova shockwaves, and 13.8 billion
                years of galactic evolution.
              </p>

              {/* 4 Signature Entry CTAs */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDismissedHero(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#F4F7FB] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#030509] transition hover:bg-white shadow-lg"
                >
                  <Compass className="h-4 w-4" />
                  <span>Enter the Galaxy</span>
                </button>

                <button
                  type="button"
                  onClick={startGuidedTour}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#7AA8FF]/40 bg-[#7AA8FF]/15 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#F4F7FB] transition hover:bg-[#7AA8FF]/25"
                >
                  <Play className="h-4 w-4 text-[#7AA8FF]" />
                  <span>Start Guided Tour</span>
                </button>

                <button
                  type="button"
                  onClick={exploreGalacticCenter}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#F8C98B]/35 bg-[#F8C98B]/10 px-4 py-2.5 text-xs font-medium tracking-wide text-[#F8C98B] transition hover:bg-[#F8C98B]/20"
                >
                  <Orbit className="h-3.5 w-3.5" />
                  <span>Explore Galactic Center (Sgr A*)</span>
                </button>

                <button
                  type="button"
                  onClick={locateSun}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium tracking-wide text-emerald-300 transition hover:bg-emerald-500/20"
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>Where Are We? (Find the Sun)</span>
                </button>
              </div>

              {/* Scientific Provenance Legend */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
                <span>Interactive 3D Canvas active behind this panel — drag to orbit</span>
                <span className="font-mono text-[10px] text-[#94A3B8]">
                  ESA Gaia DR3 · GRAVITY · IllustrisTNG50
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Subtle Hint */}
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-mono uppercase tracking-widest text-[10px]">
              1 SCENE UNIT = 1 KILOPARSEC (3,261.56 LIGHT-YEARS)
            </span>
            <button
              type="button"
              onClick={() => setDismissedHero(true)}
              className="pointer-events-auto font-mono text-[11px] uppercase tracking-wider text-[#94A3B8] hover:text-white transition"
            >
              Dismiss Intro Overlay →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
