"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SimulatorPage() {
  const [sliderVal, setSliderVal] = useState(0);

  // Baseline data (would come from DB in a full implementation, using static for the complex UI demo)
  const baselineEmissions = 14.2;
  const targetEmissions = 4.8;
  const currentEmissions = baselineEmissions - (sliderVal / 100) * (baselineEmissions - targetEmissions);
  
  const savedEmissions = baselineEmissions - currentEmissions;
  const moneySaved = (sliderVal / 100) * 3400;

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F7] pt-12 px-6 flex flex-col items-center max-w-7xl mx-auto pb-32 sf-pro-display selection:bg-[#2997FF]/30">
      <header className="w-full mb-16 text-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Intelligence Simulator.</h1>
        <p className="text-xl text-[#86868B] font-medium">Slide to predict your future impact and lifestyle morphing.</p>
      </header>

      {/* Main Split Screen */}
      <div className="w-full relative h-[600px] rounded-[3rem] overflow-hidden glass-panel flex bg-[#0A0A0A]">
        
        {/* LEFT: Current (fades out as slider moves right) */}
        <div className="absolute inset-y-0 left-0 w-1/2 p-12 flex flex-col justify-between" style={{ opacity: 1 - sliderVal / 100 }}>
          <div>
            <h3 className="text-2xl font-bold mb-8 text-[#86868B] tracking-tight">Current Lifestyle</h3>
            <div className="space-y-6">
              <div className="bg-[#000000] p-8 rounded-3xl border border-white/5">
                <p className="text-sm text-[#86868B] mb-2 font-semibold">Transport</p>
                <h2 className="text-3xl font-bold text-[#F5F5F7] tracking-tight">Car Commute</h2>
              </div>
              <div className="bg-[#000000] p-8 rounded-3xl border border-white/5">
                <p className="text-sm text-[#86868B] mb-2 font-semibold">Diet</p>
                <h2 className="text-3xl font-bold text-[#F5F5F7] tracking-tight">Meat Heavy</h2>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Future (fades in as slider moves right) */}
        <div className="absolute inset-y-0 right-0 w-1/2 p-12 flex flex-col justify-between items-end text-right" style={{ opacity: sliderVal / 100 }}>
          <div>
            <h3 className="text-2xl font-bold mb-8 text-[#2997FF] tracking-tight">Projected 2032</h3>
            <div className="space-y-6 flex flex-col items-end">
              <div className="bg-[#2997FF]/5 p-8 rounded-3xl border border-[#2997FF]/20 shadow-[0_0_40px_rgba(41,151,255,0.1)] w-80 backdrop-blur-md">
                <p className="text-sm text-[#2997FF] mb-2 font-semibold">Transport</p>
                <div className="flex justify-end items-center gap-4">
                  <span className="bg-[#2997FF]/20 text-[#2997FF] text-xs px-3 py-1 rounded-full font-bold tracking-wide">-65%</span>
                  <h2 className="text-3xl font-bold text-[#F5F5F7] tracking-tight">Public Transit</h2>
                </div>
              </div>
              <div className="bg-[#2997FF]/5 p-8 rounded-3xl border border-[#2997FF]/20 shadow-[0_0_40px_rgba(41,151,255,0.1)] w-80 backdrop-blur-md">
                <p className="text-sm text-[#2997FF] mb-2 font-semibold">Diet</p>
                <div className="flex justify-end items-center gap-4">
                  <span className="bg-[#2997FF]/20 text-[#2997FF] text-xs px-3 py-1 rounded-full font-bold tracking-wide">-40%</span>
                  <h2 className="text-3xl font-bold text-[#F5F5F7] tracking-tight">Plant Based</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Divider that moves */}
        <div 
          className="absolute inset-y-0 w-px bg-[#2997FF]/50 shadow-[0_0_20px_rgba(41,151,255,0.5)] z-20 flex items-center justify-center"
          style={{ left: `${sliderVal}%` }}
        >
          <div className="w-12 h-12 rounded-full bg-[#000000] border border-white/20 flex items-center justify-center shadow-xl backdrop-blur-xl">
            <span className="text-[#86868B] text-xs tracking-widest font-bold">YEAR</span>
          </div>
        </div>

        {/* Dynamic Center Metrics Box */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 glass-panel px-12 py-6 rounded-[2rem] flex gap-12 border-white/10 shadow-2xl">
          <div className="text-center">
            <p className="text-xs text-[#86868B] uppercase tracking-widest mb-1 font-bold">Annual Emissions</p>
            <h2 className="text-4xl font-bold text-[#F5F5F7] tracking-tight">{currentEmissions.toFixed(1)}<span className="text-lg text-[#86868B] ml-1">t</span></h2>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <p className="text-xs text-[#32D74B] uppercase tracking-widest mb-1 font-bold">Saved Money</p>
            <h2 className="text-4xl font-bold text-[#32D74B] tracking-tight">+${Math.round(moneySaved)}</h2>
          </div>
        </div>
      </div>

      {/* Premium Slider UI */}
      <div className="w-full max-w-4xl mt-16 glass-panel p-10 rounded-[3rem] flex flex-col gap-8 relative">
        <div className="flex justify-between items-center px-4">
          <span className="text-[#86868B] font-bold tracking-widest uppercase">2026</span>
          <span className="text-[#F5F5F7] font-bold tracking-widest uppercase text-sm">Transition Timeline</span>
          <span className="text-[#2997FF] font-bold tracking-widest uppercase">2032</span>
        </div>
        
        <div className="relative h-3 w-full rounded-full bg-white/10">
          <div 
            className="absolute top-0 left-0 h-full rounded-full bg-[#2997FF] shadow-[0_0_15px_rgba(41,151,255,0.5)] transition-all ease-out"
            style={{ width: `${sliderVal}%` }}
          />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderVal} 
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg pointer-events-none transition-all ease-out z-10 flex items-center justify-center"
            style={{ left: `calc(${sliderVal}% - 16px)` }}
          >
            <div className="w-2 h-2 bg-[#2997FF] rounded-full" />
          </div>
        </div>
      </div>
      
    </div>
  );
}
