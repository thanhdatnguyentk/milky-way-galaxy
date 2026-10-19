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
    labelVi: string;
    bg: string;
    border: string;
    text: string;
    icon: React.FC<{ className?: string }>;
    tooltip: string;
  }
> = {
  'Observational Data': {
    labelVi: 'Dữ Liệu Quan Sát Thực Nghiệm',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-400/35',
    text: 'text-emerald-300',
    icon: Database,
    tooltip: 'Dữ liệu thiên văn thực nghiệm từ vệ tinh & giao thoa kế (ESA Gaia DR3, GRAVITY, EHT).',
  },
  'Scientific Simulation Data': {
    labelVi: 'Dữ Liệu Mô Phỏng Vũ Trụ Học',
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-400/35',
    text: 'text-cyan-300',
    icon: Cpu,
    tooltip: 'Hiệu chuẩn theo dữ liệu mô phỏng từ-thủy động lực học vũ trụ (IllustrisTNG50 / Auriga).',
  },
  'Procedural Model': {
    labelVi: 'Mô Hình Vật Lý Tham Số',
    bg: 'bg-blue-950/60',
    border: 'border-blue-400/35',
    text: 'text-blue-300',
    icon: Sparkles,
    tooltip: 'Mô hình thiên hà tham số dựa trên vật lý thiên văn (xoắn ốc logarit 4 nhánh + thanh ba trục).',
  },
  'Simplified Physics Demo': {
    labelVi: 'Mô Phỏng Vật Lý Tương Tác',
    bg: 'bg-amber-950/60',
    border: 'border-amber-400/35',
    text: 'text-amber-300',
    icon: Atom,
    tooltip: 'Bộ giải số chạy trực tiếp theo thời gian thực trên trình duyệt (Symplectic Leapfrog / Sedov-Taylor).',
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
      <span>{style.labelVi}</span>
    </span>
  );
};
