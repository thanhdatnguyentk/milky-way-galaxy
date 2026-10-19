import type { QualityTier } from '@/types/simulation';

export function detectRecommendedQualityTier(): QualityTier {
  if (typeof window === 'undefined') return 'Medium';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  if (isMobile) return 'Low';

  const cores = navigator.hardwareConcurrency || 4;
  if (cores >= 12) return 'High';
  if (cores >= 6) return 'Medium';
  return 'Low';
}
