"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        setError(data.error || "Registration failed");
        setLoading(false);
      } else {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Left side: Cinematic visual */}
      <div className="hidden lg:flex flex-1 relative bg-[#000000] items-center justify-center overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[#32D74B] opacity-[0.08] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 text-center"
        >
          <div className="w-40 h-40 rounded-full border-[0.5px] border-white/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_80px_rgba(50,215,75,0.2)]">
            <span className="text-6xl">🌱</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-[#F5F5F7] sf-pro-display">
            Start your journey.
          </h2>
          <p className="text-[#86868B] mt-4 text-lg font-medium">Predict. Act. Save the planet.</p>
        </motion.div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-[#000000] lg:bg-[#0A0A0A]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-[#F5F5F7]">Create Account</h1>
          <p className="text-[#86868B] mb-8 font-medium">Join the intelligence that matters.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#86868B] mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-[#000000] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#32D74B] focus:ring-1 focus:ring-[#32D74B] transition-all duration-300"
                placeholder="Steve Jobs"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#86868B] mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-[#000000] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#32D74B] focus:ring-1 focus:ring-[#32D74B] transition-all duration-300"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#86868B] mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full bg-[#000000] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#32D74B] focus:ring-1 focus:ring-[#32D74B] transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-[#FF6B6B] text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5F5F7] text-[#000000] hover:bg-white py-4 rounded-xl font-semibold transition-colors duration-300 disabled:opacity-50 mt-4 text-lg"
            >
              {loading ? "Creating Identity..." : "Continue"}
            </button>
          </form>

          <p className="mt-8 text-center text-[#86868B] font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-[#32D74B] hover:text-[#4facfe] transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
