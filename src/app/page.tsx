"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe, Zap, Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text selection:bg-accent/30 overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center z-10 max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 sf-pro-display">
            Predict Your <br />
            <span className="text-gradient">Climate Future.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-12 font-medium max-w-2xl mx-auto tracking-tight">
            CarbonIQ uses Intelligence to simulate your environmental future before it happens. Experience the next generation of sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="bg-text text-background hover:bg-white/90 px-8 py-4 rounded-full font-semibold transition-all duration-300 text-[17px]"
            >
              Start Free
            </Link>
            <Link
              href="/simulator"
              className="glass-panel text-text hover:bg-white/10 px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 text-[17px]"
            >
              Watch Experience <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Ambient Hero Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-accent opacity-10 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Globe className="w-8 h-8 text-accent" />,
              title: "Digital Twin",
              desc: "A perfect simulation of your lifestyle, mapped across a global environmental database.",
            },
            {
              icon: <Zap className="w-8 h-8 text-warning" />,
              title: "Intelligence",
              desc: "Watch how today's choices alter your carbon footprint years into the future.",
            },
            {
              icon: <Leaf className="w-8 h-8 text-success" />,
              title: "Carbon Passport",
              desc: "Your authenticated digital identity for sustainability achievements.",
            },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bento-box p-10 flex flex-col gap-6 group hover:border-glass-border/80 transition-colors duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                {feat.icon}
              </div>
              <h3 className="text-2xl font-bold tracking-tight">{feat.title}</h3>
              <p className="text-muted leading-relaxed text-[17px]">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cinematic Banner */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden relative aspect-video flex items-center justify-center border border-black/5 shadow-2xl"
        >
          <div className="absolute inset-0 bg-white z-0" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-multiply" />
          <div className="relative z-10 text-center px-6">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 sf-pro-display text-text">
              Intelligence that <br /> saves the planet.
            </h2>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
