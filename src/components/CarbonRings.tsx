"use client";

import { motion } from "framer-motion";

export default function CarbonRings({ 
  transport = 0, 
  diet = 0, 
  energy = 0, 
  size = 200 
}: { 
  transport?: number, 
  diet?: number, 
  energy?: number, 
  size?: number 
}) {
  const strokeWidth = size * 0.1;
  const center = size / 2;
  const radius1 = center - strokeWidth;
  const radius2 = center - strokeWidth * 2.2;
  const radius3 = center - strokeWidth * 3.4;

  const circumference = (r: number) => 2 * Math.PI * r;

  // Max targets for the rings (in tons) - arbitrary budget for demo
  const maxTransport = 5;
  const maxDiet = 3;
  const maxEnergy = 6;

  const getOffset = (val: number, max: number, r: number) => {
    const c = circumference(r);
    const percent = Math.min(val / max, 1);
    return c - percent * c;
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 drop-shadow-xl">
        {/* Background Rings */}
        <circle cx={center} cy={center} r={radius1} stroke="#FF3B30" strokeWidth={strokeWidth} fill="none" opacity={0.15} />
        <circle cx={center} cy={center} r={radius2} stroke="#34C759" strokeWidth={strokeWidth} fill="none" opacity={0.15} />
        <circle cx={center} cy={center} r={radius3} stroke="#0071E3" strokeWidth={strokeWidth} fill="none" opacity={0.15} />

        {/* Foreground Rings */}
        <motion.circle 
          cx={center} cy={center} r={radius1} 
          stroke="#FF3B30" strokeWidth={strokeWidth} fill="none" 
          strokeDasharray={circumference(radius1)}
          initial={{ strokeDashoffset: circumference(radius1) }}
          animate={{ strokeDashoffset: getOffset(transport, maxTransport, radius1) }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
        />
        <motion.circle 
          cx={center} cy={center} r={radius2} 
          stroke="#34C759" strokeWidth={strokeWidth} fill="none" 
          strokeDasharray={circumference(radius2)}
          initial={{ strokeDashoffset: circumference(radius2) }}
          animate={{ strokeDashoffset: getOffset(diet, maxDiet, radius2) }}
          transition={{ duration: 1.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
        />
        <motion.circle 
          cx={center} cy={center} r={radius3} 
          stroke="#0071E3" strokeWidth={strokeWidth} fill="none" 
          strokeDasharray={circumference(radius3)}
          initial={{ strokeDashoffset: circumference(radius3) }}
          animate={{ strokeDashoffset: getOffset(energy, maxEnergy, radius3) }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
