"use client";

import Image from "next/image";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getPassportData } from "@/app/actions/data";
import { logoutUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Share, LogOut } from "lucide-react";

export default function PassportPage() {
  const [data, setData] = useState<any>(null);
  const passportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getPassportData().then(setData).catch(console.error);
  }, []);

  const handleDownload = async () => {
    if (!passportRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(passportRef.current, { backgroundColor: "#000000", scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("CarbonPassport.pdf");
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    router.push("/login");
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-[3px] border-black/10 border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-12 px-6 flex flex-col items-center max-w-7xl mx-auto pb-24 sf-pro-display selection:bg-accent/30 text-text">
      
      {/* Header with Sign Out */}
      <header className="w-full mb-16 flex justify-between items-start max-w-3xl mx-auto">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">Identity.</h1>
          <p className="text-lg text-muted font-medium">Your authenticated digital sustainability footprint.</p>
        </div>
        <button 
          onClick={handleSignOut} 
          className="text-muted hover:text-danger transition-colors flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-full border border-black/5 shadow-sm"
        >
          Sign Out <LogOut size={16} />
        </button>
      </header>

      {/* Premium Apple Wallet style card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm aspect-[1/1.6] rounded-[3rem] p-1 group perspective-1000 mb-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#2997FF] via-[#0A0A0A] to-[#32D74B] rounded-[3rem] opacity-30 group-hover:opacity-60 transition-opacity duration-1000 blur-[20px]" />
        
        <div 
          ref={passportRef}
          className="relative w-full h-full bg-[#0A0A0A] rounded-[3rem] border border-white/10 flex flex-col overflow-hidden transform-style-3d group-hover:rotate-x-3 group-hover:-rotate-y-3 transition-transform duration-700 ease-out shadow-2xl"
        >
          {/* Noise overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          
          {/* Top Metal Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          {/* Card Header with Profile Pic */}
          <div className="p-8 pb-4 flex justify-between items-start">
            <div>
              <p className="text-[10px] text-[#86868B] uppercase tracking-widest mb-1 font-bold">Holder Identity</p>
              <h2 className="text-2xl font-semibold text-[#F5F5F7] tracking-tight">{data.user.name}</h2>
            </div>
            <div className="w-14 h-14 rounded-full border-[2px] border-white/20 overflow-hidden shadow-inner bg-[#111111]">
              <Image 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.name}&backgroundColor=transparent`} 
                alt="Profile" 
                width={56}
                height={56}
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8 flex-1 flex flex-col justify-center relative">
            <div className="text-center mb-8 relative z-10">
              <p className="text-[10px] text-[#86868B] uppercase tracking-widest font-bold mb-2">Climate Score</p>
              <h1 className="text-7xl font-bold tracking-tighter text-[#F5F5F7]">
                {data.user.climateScore}
              </h1>
              <p className="text-[#32D74B] font-medium mt-2 tracking-wide text-sm">{data.passport.climateRank}</p>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-[#86868B] text-[10px] uppercase tracking-widest font-bold">Carbon Saved</span>
                <span className="font-semibold text-white">{data.passport.carbonSaved}t CO₂</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-[#86868B] text-[10px] uppercase tracking-widest font-bold">Equivalency</span>
                <span className="font-semibold text-white">{data.passport.treesEquivalent} Trees</span>
              </div>
            </div>
          </div>

          {/* Achievements Footer */}
          <div className="p-6 bg-[#111111] border-t border-white/5 flex flex-wrap justify-center gap-2">
            {data.passport.achievements.map((badge: string, i: number) => (
              <span key={i} className="text-[10px] font-bold text-[#F5F5F7] bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                {badge}
              </span>
            ))}
          </div>

          {/* Holographic Sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-[1.5s] ease-in-out pointer-events-none" />
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 z-10">
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="glass-panel hover:bg-black/5 px-8 py-4 rounded-full font-semibold transition-colors flex items-center justify-center gap-3 disabled:opacity-50 min-w-[200px]"
        >
          {downloading ? "Generating..." : <><Download size={18} /> Add to Wallet</>}
        </button>
        <button className="bg-text text-background px-8 py-4 rounded-full font-semibold transition-colors hover:bg-black/80 flex items-center justify-center gap-3 min-w-[200px] shadow-md">
          <Share size={18} /> Share Identity
        </button>
      </div>
    </main>
  );
}
