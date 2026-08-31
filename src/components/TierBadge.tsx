import React from 'react';
import { TIER_DETAILS } from '../data';
import { TierType } from '../types';

interface TierBadgeProps {
  tier: TierType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  size = 'md',
  showLabel = false
}) => {
  const details = TIER_DETAILS[tier] || TIER_DETAILS.F;

  const sizeClasses = {
    sm: 'w-6 h-6 text-[11px] font-extrabold',
    md: 'w-10 h-10 text-base font-black',
    lg: 'w-16 h-16 text-2xl font-black'
  };

  const tierColorClasses: Record<TierType, string> = {
    S: 'bg-[#F4F1EA] text-[#C5A059] border-[#C5A059]',
    A: 'bg-white text-[#9EA2A2] border-[#9EA2A2]',
    B: 'bg-white text-[#B08D75] border-[#B08D75]',
    C: 'bg-white text-[#8B8680] border-[#E5E1D8]',
    D: 'bg-[#FCFAF7] text-orange-700 border-orange-200',
    F: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-none border ${tierColorClasses[tier] || 'bg-white text-[#2D2A26] border-stone-300'} select-none font-serif italic shrink-0`}
      >
        {tier}
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-editorial-text tracking-tight">{details.name}</span>
          <span className="text-[10px] text-editorial-muted line-clamp-1 font-serif italic">{details.desc}</span>
        </div>
      )}
    </div>
  );
};
