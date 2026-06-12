"use client";

import { motion } from "framer-motion";
import { Home, LayoutDashboard, MessageSquare, SlidersHorizontal, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/advisor", icon: MessageSquare, label: "Advisor" },
    { href: "/simulator", icon: SlidersHorizontal, label: "Simulator" },
    { href: "/passport", icon: User, label: "Passport" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="glass-panel flex items-center px-4 py-3 rounded-[2rem] gap-2 shadow-2xl"
        aria-label="Main"
        role="navigation"
      >
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link 
              key={link.href} 
              href={link.href} 
              aria-label={link.label}
              className="relative flex flex-col items-center justify-center p-2 min-w-[4.5rem] rounded-2xl transition-all duration-300 hover:bg-black/5 group"
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-bg"
                  className="absolute inset-0 bg-black/5 rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon 
                className={`relative z-10 w-6 h-6 mb-1 transition-colors duration-300 ${
                  isActive ? "text-accent drop-shadow-sm" : "text-muted group-hover:text-text"
                }`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`relative z-10 text-[11px] font-semibold transition-colors duration-300 ${
                isActive ? "text-accent" : "text-muted group-hover:text-text"
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
