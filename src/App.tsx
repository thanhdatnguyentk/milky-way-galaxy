import React from 'react';
import { GalaxyCanvas } from '@/components/galaxy/GalaxyCanvas';
import { HeroOverlay } from '@/components/ui/HeroOverlay';
import { TopBar } from '@/components/ui/TopBar';
import { ScaleBar } from '@/components/ui/ScaleBar';
import { RegionSelector } from '@/components/exploration/RegionSelector';
import { RegionDetailDrawer } from '@/components/exploration/RegionDetailDrawer';
import { GuidedTourOverlay } from '@/components/exploration/GuidedTourOverlay';
import { ScientificDataModal } from '@/components/exploration/ScientificDataModal';
import { EvolutionTimeline } from '@/components/simulation/EvolutionTimeline';
import { GravityLab } from '@/components/simulation/GravityLab';
import { SupernovaDemo } from '@/components/simulation/SupernovaDemo';
import { DarkMatterToggle } from '@/components/simulation/DarkMatterToggle';

export function App() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#030509] text-[#F4F7FB]">
      {/* Primary Hero Interface: Real-Time GPU 3D Milky Way Simulation */}
      <GalaxyCanvas />

      {/* Entry Observatory Hero Overlay */}
      <HeroOverlay />

      {/* Minimalist Translucent Observatory HUD */}
      <TopBar />
      <RegionSelector />
      <RegionDetailDrawer />
      <GuidedTourOverlay />

      {/* Interactive Computational Astrophysics Modules */}
      <EvolutionTimeline />
      <GravityLab />
      <SupernovaDemo />
      <DarkMatterToggle />
      <ScientificDataModal />

      {/* Astronomical Scale & Camera Mode Bar */}
      <ScaleBar />
    </main>
  );
}

export default App;
