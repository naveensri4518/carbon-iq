"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setScanning(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // Simulate biometric scan delay for Hackathon wow-factor
    setTimeout(async () => {
      setScanning(false);
      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          setError(data.error || "Login failed");
          setLoading(false);
        } else {
          localStorage.setItem("token", data.token);
          router.push("/dashboard");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
        setLoading(false);
      }
    }, 2000); // 2 second scan
  }

  return (
    <div className="min-h-screen bg-background flex text-text sf-pro-display">
      {/* Left side: Cinematic visual */}
      <div className="hidden lg:flex flex-1 relative bg-white items-center justify-center overflow-hidden border-r border-black/5">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-accent opacity-5 blur-[150px] rounded-full mix-blend-multiply pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 text-center"
        >
          <div className="w-40 h-40 rounded-full border-[0.5px] border-black/10 flex items-center justify-center mx-auto mb-8 shadow-2xl bg-white">
            <span className="text-6xl">🌍</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-text sf-pro-display">
            Welcome back.
          </h2>
          <p className="text-muted mt-4 text-lg font-medium">Log in to your digital twin.</p>
        </motion.div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background relative overflow-hidden">
        {/* Animated Scanner Overlay */}
        <AnimatePresence>
          {scanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center"
            >
              <div className="relative w-48 h-48 rounded-[3rem] border-4 border-accent/20 flex items-center justify-center overflow-hidden bg-white shadow-2xl">
                <ScanFace size={64} className="text-accent opacity-50" />
                <motion.div 
                  initial={{ y: -100 }}
                  animate={{ y: 100 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-accent shadow-[0_0_20px_#0071E3]"
                />
              </div>
              <p className="mt-8 text-xl font-bold tracking-tight text-text">Scanning Carbon Passport...</p>
              <p className="text-muted font-medium mt-2">Verifying identity securely</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-text">Sign In</h1>
          <p className="text-muted mb-8 font-medium">Continue to CarbonIQ.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-muted mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 shadow-sm"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-muted mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 shadow-sm"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-danger text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading || scanning}
              className="w-full bg-text text-background hover:bg-black/80 py-4 rounded-xl font-semibold transition-colors duration-300 disabled:opacity-50 mt-4 text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <ScanFace size={20} />
              {loading ? "Authenticating..." : "Scan Passport & Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-muted font-medium">
            Don't have an account?{" "}
            <Link href="/register" className="text-accent hover:text-blue-600 transition-colors">
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
