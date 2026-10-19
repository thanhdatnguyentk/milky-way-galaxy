import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Play, Pause, Plus, RotateCcw, X } from 'lucide-react';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { ScienceBadge } from '@/components/ui/ScienceBadge';

export const GravityLab: React.FC = () => {
  const activeMode = useGalaxyStore((s) => s.activeMode);
  const setActiveMode = useGalaxyStore((s) => s.setActiveMode);
  const gravityConfig = useGalaxyStore((s) => s.gravityConfig);
  const gravityParticles = useGalaxyStore((s) => s.gravityParticles);
  const updateGravityConfig = useGalaxyStore((s) => s.updateGravityConfig);
  const spawnGravityParticle = useGalaxyStore((s) => s.spawnGravityParticle);
  const resetGravityLab = useGalaxyStore((s) => s.resetGravityLab);

  if (activeMode !== 'gravity') return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        className="pointer-events-auto fixed right-3 top-20 z-20 flex w-[92vw] sm:w-[390px] max-h-[calc(100vh-145px)] flex-col rounded-2xl border border-white/[0.12] bg-[#090D18]/88 p-5 backdrop-blur-2xl shadow-2xl overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Atom className="h-4 w-4 text-[#7AA8FF]" />
              <ScienceBadge type="Simplified Physics Demo" size="sm" />
            </div>
            <h2 className="font-display text-lg font-semibold text-[#F4F7FB]">
              Galactic Orbital Gravity Lab
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Symplectic Velocity Verlet (Leapfrog) Integrator
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
          Experiment with test-particle orbits inside the Milky Way’s gravitational potential.
          Compare pure Keplerian point-mass gravity against a composite{' '}
          <strong className="text-[#F4F7FB]">Miyamoto-Nagai Disk + NFW Dark Matter Halo</strong>.
        </p>

        {/* Potential Model Switcher */}
        <div className="mt-4">
          <label className="block font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] mb-1.5">
            Gravitational Potential Φ(R, z)
          </label>
          <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[#030509]/80 p-1">
            {(['Miyamoto-Nagai + NFW Halo', 'Keplerian Point'] as const).map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => updateGravityConfig({ potentialModel: model })}
                className={`rounded-lg px-2 py-1.5 text-[11px] font-medium transition ${
                  gravityConfig.potentialModel === model
                    ? 'bg-[#7AA8FF] text-[#030509] font-semibold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {model === 'Keplerian Point' ? 'Keplerian Point (1/r)' : 'Disk + NFW Halo'}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="mt-4 space-y-3.5">
          <div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-[#94A3B8]">Central Core Mass (M_core)</span>
              <span className="text-[#F8C98B] font-semibold">
                {gravityConfig.centralMassSolarPow10.toFixed(2)} × 10¹⁰ M☉
              </span>
            </div>
            <input
              type="range"
              min={0.4}
              max={4.5}
              step={0.1}
              value={gravityConfig.centralMassSolarPow10}
              onChange={(e) =>
                updateGravityConfig({ centralMassSolarPow10: parseFloat(e.target.value) })
              }
              className="mt-1.5 w-full accent-[#F8C98B] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-[#94A3B8]">Launch Velocity Factor (v / v_circ)</span>
              <span className="text-[#67E8F9] font-semibold">
                {gravityConfig.initialVelocityScale.toFixed(2)}×
              </span>
            </div>
            <input
              type="range"
              min={0.4}
              max={1.6}
              step={0.05}
              value={gravityConfig.initialVelocityScale}
              onChange={(e) =>
                updateGravityConfig({ initialVelocityScale: parseFloat(e.target.value) })
              }
              className="mt-1.5 w-full accent-[#67E8F9] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs">
              <span className="text-[#94A3B8]">Integration Time Step (Δt)</span>
              <span className="text-[#F4F7FB] font-semibold">
                {gravityConfig.timeStep.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.08}
              step={0.005}
              value={gravityConfig.timeStep}
              onChange={(e) => updateGravityConfig({ timeStep: parseFloat(e.target.value) })}
              className="mt-1.5 w-full accent-[#7AA8FF] cursor-pointer"
            />
          </div>
        </div>

        {/* Display Checkboxes */}
        <div className="mt-4 flex items-center gap-4 text-xs text-[#94A3B8]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={gravityConfig.showTrails}
              onChange={(e) => updateGravityConfig({ showTrails: e.target.checked })}
              className="accent-[#7AA8FF]"
            />
            <span>Orbital Trails</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={gravityConfig.showVelocityVectors}
              onChange={(e) => updateGravityConfig({ showVelocityVectors: e.target.checked })}
              className="accent-[#7AA8FF]"
            />
            <span>Velocity Vectors (v)</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => updateGravityConfig({ isPaused: !gravityConfig.isPaused })}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#7AA8FF] px-3 py-2 text-xs font-semibold text-[#030509] hover:bg-[#93B8FF] transition"
          >
            {gravityConfig.isPaused ? (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={spawnGravityParticle}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#67E8F9]/40 bg-[#67E8F9]/15 px-3 py-2 text-xs font-medium text-[#67E8F9] hover:bg-[#67E8F9]/25 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Spawn ({gravityParticles.length}/24)</span>
          </button>

          <button
            type="button"
            onClick={resetGravityLab}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-[#F4F7FB] hover:bg-white/10 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Live Test Particle Telemetry */}
        <div className="mt-4 pt-3 border-t border-white/[0.08]">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#64748B] mb-2">
            Active Test Bodies ({gravityParticles.length})
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 font-mono text-[11px]">
            {gravityParticles.slice(0, 6).map((p, idx) => {
              const r = Math.hypot(p.position[0], p.position[2]);
              const v = Math.hypot(p.velocity[0], p.velocity[1], p.velocity[2]);
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg bg-[#101725]/70 px-2.5 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-[#F4F7FB]">Star #{idx + 1}</span>
                  </div>
                  <span className="text-[#94A3B8]">R = {r.toFixed(2)} kpc</span>
                  <span className="text-[#67E8F9]">|v| = {(v * 85).toFixed(0)} km/s</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
