import { stepLeapfrogParticles } from '../integrators/leapfrog';
import type { GravityLabConfig, GravityParticle } from '@/types/simulation';

export interface GravityWorkerRequest {
  type: 'STEP';
  particles: GravityParticle[];
  config: GravityLabConfig;
}

export interface GravityWorkerResponse {
  type: 'STEP_RESULT';
  particles: GravityParticle[];
}

self.onmessage = (event: MessageEvent<GravityWorkerRequest>) => {
  const { data } = event;
  if (data.type === 'STEP') {
    const updated = stepLeapfrogParticles(data.particles, data.config);
    const response: GravityWorkerResponse = {
      type: 'STEP_RESULT',
      particles: updated,
    };
    self.postMessage(response);
  }
};
