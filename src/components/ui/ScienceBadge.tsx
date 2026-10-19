import React from 'react';
import type { ScienceProvenanceType } from '@/types/galaxy';
import { Database, Sparkles, Cpu, Atom } from 'lucide-react';

interface ScienceBadgeProps {
  type: ScienceProvenanceType;
  size?: 'sm' | 'md';
}

const BADGE_STYLES: Record<
  ScienceProvenanceType,
  {
    bg: string;
    border: string;
    text: string;
    icon: React.FC<{ className?: string }>;
    tooltip: string;
  }
> = {
  'Observational Data': {
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-400/35',
    text: 'text-emerald-300',
    icon: Database,
    tooltip: 'Derived from empirical astrometric/interferometric catalogs (ESA Gaia DR3, GRAVITY, EHT).',
  },
  'Scientific Simulation Data': {
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-400/35',
    text: 'text-cyan-300',
    icon: Cpu,
    tooltip: 'Calibrated to cosmological MHD simulation checkpoints (IllustrisTNG50 / Auriga).',
  },
  'Procedural Model': {
    bg: 'bg-blue-950/60',
    border: 'border-blue-400/35',
    text: 'text-blue-300',
    icon: Sparkles,
    tooltip: 'Physically informed parametric galaxy model (4-arm logarithmic spiral + triaxial bar).',
  },
  'Simplified Physics Demo': {
    bg: 'bg-amber-950/60',
    border: 'border-amber-400/35',
    text: 'text-amber-300',
    icon: Atom,
    tooltip: 'Real-time local browser numerical solver (Symplectic Leapfrog / Sedov-Taylor scaling).',
  },
};

export const ScienceBadge: React.FC<ScienceBadgeProps> = ({ type, size = 'sm' }) => {
  const style = BADGE_STYLES[type];
  const Icon = style.icon;

  return (
    <span
      title={style.tooltip}
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wider ${
        style.bg
      } ${style.border} ${style.text} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'
      }`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span>{type}</span>
    </span>
  );
};
