import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Overview Card Skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl h-64 w-full" />

      {/* Metrics Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-28" />
        ))}
      </div>

      {/* Score Card Skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl h-56 w-full" />

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl h-72" />
        <div className="bg-slate-900 border border-slate-800 rounded-3xl h-72" />
      </div>
    </div>
  );
};
