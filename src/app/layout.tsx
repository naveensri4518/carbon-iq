import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CarbonIQ | AI Climate Copilot",
  description: "Predict future environmental impact and reduce emissions before they happen with your personalized AI Climate Twin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-text selection:bg-accent/30`}>
        {/* Background Subtle Ambient Glows */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
          <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-accent opacity-[0.05] blur-[150px] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-success opacity-[0.03] blur-[150px] rounded-full mix-blend-multiply" />
        </div>
        
        <main className="relative z-0 pb-24">
          {children}
        </main>

        <Navigation />
      </body>
    </html>
  );
}
