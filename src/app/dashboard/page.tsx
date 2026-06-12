import { getUserData } from "@/app/actions/data";
import { logoutUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { LogOut, Activity, ArrowUpRight, Zap, Target, ArrowRight } from "lucide-react";
import CarbonRings from "@/components/CarbonRings";
import Link from "next/link";

export default async function DashboardPage() {
  let user: any, climateData: any;
  let authFailed = false;
  try {
    const data = await getUserData();
    user = data.user;
    climateData = data.climateData;
  } catch (e) {
    authFailed = true;
  }

  if (authFailed) {
    redirect("/login");
  }

  const score = user?.climateScore || 0;
  let statusText = "Sustainable";
  if (score < 50) statusText = "At Risk";
  else if (score > 90) statusText = "Climate Hero";

  return (
    <div className="min-h-screen bg-background text-text sf-pro-display selection:bg-accent/30 font-sans pb-32">
      {/* Top Nav */}
      <nav className="w-full flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight">CarbonIQ</h1>
        <form action={async () => {
          "use server";
          await logoutUser();
          redirect("/login");
        }}>
          <button className="text-muted hover:text-text transition-colors flex items-center gap-2 text-sm bg-surface px-5 py-2.5 rounded-full border border-glass-border shadow-sm backdrop-blur-md">
            Sign Out <LogOut size={16} />
          </button>
        </form>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 text-text">Hello, {user?.name?.split(" ")[0]}.</h2>
          <p className="text-xl text-muted tracking-tight">Here&apos;s your environmental impact summary.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* Main Activity Rings Card */}
          <div className="bento-box md:col-span-2 md:row-span-2 p-10 flex flex-col md:flex-row items-center justify-between relative group hover:border-black/10 transition-colors">
            <div className="flex-1 mb-8 md:mb-0 z-10">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={16}/> Daily Activity</h3>
              <h2 className="text-4xl font-bold text-text mb-2 tracking-tight">{statusText}</h2>
              <p className="text-accent font-medium text-xl mb-8">Score: {score}</p>
              
              <div className="space-y-4 max-w-xs">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm text-[#FF3B30] font-medium"><div className="w-2 h-2 rounded-full bg-[#FF3B30]"/>Transport</span>
                  <span className="text-text font-bold">{climateData?.transportEmission || 0}t</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm text-[#34C759] font-medium"><div className="w-2 h-2 rounded-full bg-[#34C759]"/>Diet</span>
                  <span className="text-text font-bold">{climateData?.foodEmission || 0}t</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm text-[#0071E3] font-medium"><div className="w-2 h-2 rounded-full bg-[#0071E3]"/>Energy</span>
                  <span className="text-text font-bold">{climateData?.electricityEmission || 0}t</span>
                </div>
              </div>
            </div>
            <div className="relative z-10">
              <CarbonRings transport={climateData?.transportEmission} diet={climateData?.foodEmission} energy={climateData?.electricityEmission} size={280} />
            </div>
            {/* Ambient subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>

          {/* Advisor CTA Card */}
          <Link href="/advisor" className="bento-box p-8 flex flex-col justify-between group hover:border-black/10 transition-colors relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 p-6 text-muted group-hover:text-text transition-colors">
              <ArrowUpRight size={24} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-widest mb-2 flex items-center gap-2"><Zap size={16}/> Intelligence</h3>
              <p className="text-2xl font-bold text-text tracking-tight leading-snug mt-4">Ask the AI Advisor for footprint reduction strategies.</p>
            </div>
            <div className="mt-8 flex justify-end">
               <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <ArrowRight size={20} />
               </div>
            </div>
          </Link>

          {/* Quick Stat Card */}
          <div className="bento-box p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#34C759]/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-widest mb-2 flex items-center gap-2"><Target size={16}/> Total Emissions</h3>
              <h2 className="text-5xl font-bold text-text tracking-tight mt-6">{climateData?.totalEmission || 0}<span className="text-2xl text-muted ml-1">tons</span></h2>
            </div>
          </div>

          {/* AI Insight Bento */}
          <div className="bento-box md:col-span-3 p-10 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
               <div className="flex-1">
                 <h3 className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">CarbonIQ Insight</h3>
                 <h2 className="text-2xl md:text-3xl font-bold text-text leading-snug tracking-tight">
                   {climateData?.aiInsight || "Switching to renewable grid energy will reduce your footprint by 2.1 tons instantly."}
                 </h2>
               </div>
               <div className="shrink-0 flex gap-4 mt-6 md:mt-0">
                 <span className="bg-surface border border-glass-border px-6 py-3 rounded-full text-sm font-medium text-text shadow-sm">
                   High Impact
                 </span>
               </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
