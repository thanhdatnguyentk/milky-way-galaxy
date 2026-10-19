import React from 'react';
import {
  Orbit,
  Compass,
  Clock,
  Atom,
  Zap,
  ShieldAlert,
  Database,
  Sun,
  Play,
  Sliders,
} from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import type { ActiveObservatoryMode, QualityTier } from '@/types/simulation';
import { QUALITY_PRESETS } from '@/utils/qualityPresets';

const MODE_ITEMS: {
  id: ActiveObservatoryMode;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'overview', label: 'Atlas', icon: Orbit },
  { id: 'regions', label: 'Regions (10)', icon: Compass },
  { id: 'evolution', label: 'Evolution (13.8 Gyr)', icon: Clock },
  { id: 'gravity', label: 'Gravity Lab', icon: Atom },
  { id: 'supernova', label: 'Supernova', icon: Zap },
  { id: 'dark-matter', label: 'Dark Matter', icon: ShieldAlert },
  { id: 'data', label: 'Gaia & Data', icon: Database },
];

export const TopBar: React.FC = () => {
  const hasDismissedHero = useGalaxyStore((s) => s.hasDismissedHero);
  const activeMode = useGalaxyStore((s) => s.activeMode);
  const setActiveMode = useGalaxyStore((s) => s.setActiveMode);
  const locateSun = useGalaxyStore((s) => s.locateSun);
  const exploreGalacticCenter = useGalaxyStore((s) => s.exploreGalacticCenter);
  const startGuidedTour = useGalaxyStore((s) => s.startGuidedTour);
  const tourActive = useGalaxyStore((s) => s.tour.isActive);
  const qualityTier = useGalaxyStore((s) => s.qualityTier);
  const setQualityTier = useGalaxyStore((s) => s.setQualityTier);
  const fps = useGalaxyStore((s) => s.fps);
  const setDismissedHero = useGalaxyStore((s) => s.setDismissedHero);

  if (!hasDismissedHero) return null;

  const preset = QUALITY_PRESETS[qualityTier];
  const totalParticles =
    preset.starCount + preset.haloStarCount + preset.dustCloudCount + preset.hiiRegionCount;

  return (
    <header className="pointer-events-none fixed top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between gap-2 p-3 md:px-5 md:py-3.5">
      {/* Left Brand Identity */}
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#090D18]/80 px-3.5 py-1.5 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setDismissedHero(false)}
          className="flex items-center gap-2.5 text-left group"
          title="Show Observatory Intro"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7AA8FF]/15 border border-[#7AA8FF]/35 text-[#7AA8FF] group-hover:scale-105 transition">
            <Orbit className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="font-display text-xs font-semibold tracking-wider text-[#F4F7FB]">
              MILKY WAY
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-[#94A3B8]">
              Digital Observatory
            </div>
          </div>
        </button>

        <span className="h-4 w-[1px] bg-white/10 hidden sm:inline-block" />

        {/* Quick Signature Sequence Buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            type="button"
            onClick={locateSun}
            className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/20 transition"
            title="Fly to the Solar Neighborhood (~8.178 kpc from Center)"
          >
            <Sun className="h-3 w-3" />
            <span>Where Are We?</span>
          </button>

          <button
            type="button"
            onClick={exploreGalacticCenter}
            className="flex items-center gap-1 rounded-full border border-[#F8C98B]/30 bg-[#F8C98B]/10 px-2.5 py-1 text-[11px] font-medium text-[#F8C98B] hover:bg-[#F8C98B]/20 transition"
            title="Approach Sagittarius A* in the Galactic Core"
          >
            <Orbit className="h-3 w-3" />
            <span>Sgr A* Core</span>
          </button>

          <button
            type="button"
            onClick={startGuidedTour}
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
              tourActive
                ? 'border-[#67E8F9]/60 bg-[#67E8F9]/20 text-[#67E8F9]'
                : 'border-white/15 bg-white/5 text-[#F4F7FB] hover:bg-white/10'
            }`}
          >
            <Play className="h-3 w-3" />
            <span>Guided Tour</span>
          </button>
        </div>
      </div>

      {/* Center Observatory Mode Switcher */}
      <nav className="pointer-events-auto flex items-center gap-1 overflow-x-auto max-w-full rounded-full border border-white/[0.08] bg-[#090D18]/85 p-1 backdrop-blur-xl">
        {MODE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeMode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveMode(item.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#7AA8FF] text-[#030509] font-semibold shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F4F7FB] hover:bg-white/5'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right GPU Particle Budget & Telemetry Pill */}
      <div className="pointer-events-auto hidden xl:flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#090D18]/80 px-3.5 py-1.5 backdrop-blur-xl font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <Sliders className="h-3 w-3 text-[#7AA8FF]" />
          <span>GPU Preset:</span>
          <select
            aria-label="GPU Particle Quality Tier"
            value={qualityTier}
            onChange={(e) => setQualityTier(e.target.value as QualityTier)}
            className="bg-transparent font-semibold text-[#F4F7FB] focus:outline-none cursor-pointer"
          >
            {(['Low', 'Medium', 'High', 'Ultra'] as QualityTier[]).map((tier) => (
              <option key={tier} value={tier} className="bg-[#090D18] text-[#F4F7FB]">
                {tier} ({Math.round(QUALITY_PRESETS[tier].starCount / 1000)}k)
              </option>
            ))}
          </select>
        </div>

        <span className="text-white/15">|</span>

        <div className="text-[#94A3B8]">
          Particles: <span className="text-[#67E8F9]">{(totalParticles / 1000).toFixed(0)}K</span>
        </div>

        <span className="text-white/15">|</span>

        <div className="flex items-center gap-1">
          <span
            className={`h-2 w-2 rounded-full ${
              fps >= 45 ? 'bg-emerald-400' : fps >= 25 ? 'bg-amber-400' : 'bg-rose-400'
            }`}
          />
          <span className="text-[#F4F7FB]">{fps} FPS</span>
        </div>
      </div>
    </header>
  );
};
