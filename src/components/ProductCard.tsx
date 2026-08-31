import React from 'react';
import { Product } from '../types';
import { TierBadge } from './TierBadge';
import { MapPin, Scale, Plus, Check, TrendingDown } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isSelectedForCompare: boolean;
  onToggleCompare: (product: Product, e: React.MouseEvent) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelectedForCompare,
  onToggleCompare,
  onViewDetails
}) => {
  // Styles based on Tier for soft background touches
  const getCardBorder = (tier: string) => {
    switch (tier) {
      case 'S': return 'border-l-4 border-l-editorial-gold hover:border-l-editorial-gold';
      case 'A': return 'border-l-4 border-l-editorial-silver hover:border-l-editorial-silver';
      case 'B': return 'border-l-4 border-l-editorial-bronze hover:border-l-editorial-bronze';
      case 'C': return 'border-l-4 border-l-stone-300 hover:border-l-stone-400';
      case 'D': return 'border-l-4 border-l-amber-200 hover:border-l-amber-300';
      default: return 'border-l-4 border-l-red-500 hover:border-l-red-600';
    }
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className={`bg-[#FCFAF7] border border-editorial-border rounded-none p-4 flex flex-col justify-between hover:shadow-sm hover:border-editorial-text/40 transition-all duration-300 cursor-pointer relative overflow-hidden select-none active:scale-[0.99] ${getCardBorder(product.tier)}`}
    >
      {/* Top Header: Rank, Brand, Tier */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-sans font-bold tracking-[0.15em] text-editorial-muted uppercase">
              {product.brand}
            </span>
            <span className="text-xs font-serif font-black italic text-editorial-text">
              {getRankEmoji(product.puesto)}
            </span>
          </div>
          <h3 className="font-serif text-[15px] font-bold italic text-editorial-text leading-snug mt-1 pr-2 line-clamp-1">
            {product.name}
          </h3>
        </div>
        
        {/* Tier Indicator */}
        <TierBadge tier={product.tier} size="sm" />
      </div>

      {/* Main Nutritional Highlights Row - Editorial Style (thin-lined grid, no background, no roundings) */}
      <div className="grid grid-cols-3 gap-0 mt-4 py-2 border-t border-b border-editorial-border divide-x divide-editorial-border text-center">
        <div className="flex flex-col justify-center px-1">
          <span className="text-[9px] font-sans font-bold text-editorial-muted uppercase tracking-wider">Calorías</span>
          <span className="text-xs font-serif font-semibold text-editorial-text mt-0.5">{product.calories} kcal</span>
        </div>
        <div className="flex flex-col justify-center px-1">
          <span className="text-[9px] font-sans font-bold text-editorial-muted uppercase tracking-wider">Sodio</span>
          <span className={`text-xs font-serif font-semibold mt-0.5 ${product.sodium < 100 ? 'text-emerald-700 font-bold' : product.sodium < 450 ? 'text-editorial-text' : 'text-red-600 font-bold'}`}>
            {product.sodium} mg
          </span>
        </div>
        <div className="flex flex-col justify-center px-1">
          <span className="text-[9px] font-sans font-bold text-editorial-muted uppercase tracking-wider">Proteína</span>
          <span className="text-xs font-serif font-semibold text-editorial-text mt-0.5">{product.proteins}g</span>
        </div>
      </div>

      {/* Bottom Info: Price and Supermarket / Comparer selection */}
      <div className="flex items-center justify-between mt-3 pt-2 gap-2">
        {/* Price & Location */}
        <div className="flex flex-col gap-0.5 text-[11px] text-editorial-muted">
          <div className="flex items-center gap-1">
            <span className="font-sans font-bold text-editorial-text">
              {product.pricePerKg === 'N/D' ? 'Sin Precio' : `$${product.pricePerKg.toLocaleString('es-AR')}/kg`}
            </span>
          </div>
          {product.recommendedSupermarkets.length > 0 ? (
            <div className="flex items-center gap-0.5 text-[9px] text-emerald-800 font-medium tracking-tight">
              <MapPin className="w-2.5 h-2.5 text-editorial-gold" />
              <span className="line-clamp-1">{product.recommendedSupermarkets[0]}</span>
            </div>
          ) : (
            <div className="text-[9px] text-editorial-muted italic">Disponible</div>
          )}
        </div>

        {/* Compare Trigger Button - Premium Editorial Border Button */}
        <button
          onClick={(e) => onToggleCompare(product, e)}
          className={`px-3 py-1.5 rounded-none text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-1 transition-all duration-200 shrink-0 border ${
            isSelectedForCompare
              ? 'bg-editorial-text text-white border-editorial-text'
              : 'bg-white hover:bg-editorial-text hover:text-white text-editorial-text border-editorial-border'
          }`}
          title="Agregar al comparador"
        >
          {isSelectedForCompare ? (
            <>
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Listado</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span>Comparar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
