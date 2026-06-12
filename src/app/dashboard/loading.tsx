export default function DashboardLoading() {
  return (
    <div className="min-h-screen pt-12 px-6 flex flex-col items-center max-w-7xl mx-auto pb-32 animate-pulse">
      <header className="w-full mb-12 flex justify-between items-start">
        <div>
          <div className="h-10 w-64 bg-white/10 rounded mb-2"></div>
          <div className="h-5 w-96 bg-white/5 rounded"></div>
        </div>
        <div className="h-10 w-24 bg-white/10 rounded-xl"></div>
      </header>

      {/* Climate Health Orb Skeleton */}
      <div className="w-full flex justify-center mb-16 relative">
        <div className="w-72 h-72 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <div className="text-center">
            <div className="h-4 w-16 bg-white/10 rounded mb-4 mx-auto"></div>
            <div className="h-12 w-32 bg-white/20 rounded mb-4 mx-auto"></div>
            <div className="h-6 w-24 bg-white/10 rounded mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-6 rounded-3xl h-36 border border-white/5 bg-white/5"></div>
        ))}
      </div>

      {/* Timeline Skeleton */}
      <div className="w-full mb-12 glass-card p-8 rounded-3xl border border-white/5 h-48 bg-white/5"></div>
      
      {/* Insight Skeleton */}
      <div className="w-full glass-card p-8 rounded-3xl border border-[#00F5A0]/10 h-40 bg-white/5"></div>
    </div>
  );
}
