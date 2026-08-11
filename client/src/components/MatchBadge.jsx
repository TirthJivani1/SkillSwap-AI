import React from 'react';
import { Sparkles } from 'lucide-react';

const MatchBadge = ({ score, showLabel = true, size = 'md' }) => {
  let colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let glowClass = 'shadow-emerald-500/20';

  if (score >= 85) {
    colorClasses = 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40';
    glowClass = 'shadow-emerald-500/20';
  } else if (score >= 70) {
    colorClasses = 'bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/40';
    glowClass = 'shadow-sky-500/20';
  } else {
    colorClasses = 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40';
    glowClass = 'shadow-amber-500/20';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-4 py-1.5 text-sm font-bold gap-2'
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border backdrop-blur-md shadow-sm ${colorClasses} ${sizeClasses[size]} ${glowClass}`}
    >
      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      <span>{score}% Match</span>
    </div>
  );
};

export default MatchBadge;
