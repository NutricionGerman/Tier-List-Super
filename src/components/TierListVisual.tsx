import React from 'react';
import { Product, TierType } from '../types';
import { TIER_DETAILS } from '../data';
import { Scale, Sparkles } from 'lucide-react';

interface TierListVisualProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  compareList: Product[];
  onToggleCompare: (product: Product, e: React.MouseEvent) => void;
}

export const TierListVisual: React.FC<TierListVisualProps> = ({
  products,
  onViewProduct,
  compareList,
  onToggleCompare,
}) => {
  const tiers: TierType[] = ['S', 'A', 'B', 'C', 'D', 'F'];

  return (
    <div className="bg-white border border-editorial-border p-3.5 sm:p-5 space-y-4 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-editorial-border pb-2.5 gap-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-editorial-gold fill-editorial-gold shrink-0" />
          <h3 className="font-serif text-sm sm:text-base font-bold italic text-editorial-text">
            Mapa de Clasificación (Tier List)
          </h3>
        </div>
        <span className="text-[9px] font-sans font-bold text-editorial-muted uppercase tracking-widest">
          Clasificación por Densidad Nutricional
        </span>
      </div>

      <div className="space-y-3">
        {tiers.map((tier) => {
          const tierProducts = products.filter((p) => p.tier === tier);

          // Define tier-specific accent colors for the label blocks
          const tierLabelStyles: Record<TierType, string> = {
            S: 'bg-emerald-600 text-white border-emerald-700',
            A: 'bg-green-500 text-white border-green-600',
            B: 'bg-blue-600 text-white border-blue-700',
            C: 'bg-amber-500 text-white border-amber-600',
            D: 'bg-orange-500 text-white border-orange-600',
            F: 'bg-red-600 text-white border-red-700',
          };

          return (
            <div
              key={tier}
              className="flex border border-editorial-border bg-[#FCFAF7] min-h-[90px]"
            >
              {/* Left Column: Tier Identifier */}
              <div
                className={`w-12 sm:w-16 shrink-0 flex flex-col items-center justify-center border-r border-editorial-border font-sans font-black text-xl sm:text-2xl tracking-tighter shadow-inner ${tierLabelStyles[tier]}`}
              >
                <span>{tier}</span>
                <span className="text-[7px] sm:text-[8px] font-bold tracking-widest uppercase opacity-85 mt-0.5">
                  TIER
                </span>
              </div>

              {/* Right Column: Clean Responsive Grid of Cheese Cards */}
              <div className="flex-1 p-2 sm:p-3">
                {tierProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {tierProducts.map((p) => {
                      const isSelected = compareList.some((item) => item.id === p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => onViewProduct(p)}
                          className="bg-white border border-editorial-border hover:border-editorial-text transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[125px] group relative"
                        >
                          {/* Image Container */}
                          <div className="relative h-14 w-full overflow-hidden border-b border-editorial-border shrink-0 bg-stone-50 p-1 flex items-center justify-center">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-1 right-1">
                              <span className="bg-white/95 backdrop-blur-[1px] text-editorial-text font-serif italic text-[8px] px-1 py-0.5 border border-editorial-border font-bold">
                                #{p.puesto}
                              </span>
                            </div>
                          </div>

                          {/* Title & Info */}
                          <div className="p-1.5 flex-1 flex flex-col justify-between">
                            <div className="flex flex-col">
                              <span className="text-[7.5px] font-sans font-bold text-editorial-muted uppercase tracking-wider line-clamp-1">
                                {p.brand}
                              </span>
                              <h4 className="text-[9.5px] font-serif font-bold italic text-editorial-text leading-tight line-clamp-2 mt-0.5 group-hover:text-black">
                                {p.name}
                              </h4>
                            </div>

                            <div className="flex items-center justify-between pt-1.5">
                              {/* Compare Quick Toggle */}
                              <button
                                onClick={(e) => onToggleCompare(p, e)}
                                className={`w-full text-[7.5px] font-sans font-bold uppercase tracking-wider py-1 px-1 border transition-all text-center ${
                                  isSelected
                                    ? 'bg-editorial-gold text-white border-editorial-gold'
                                    : 'bg-[#FCFAF7] text-editorial-muted border-editorial-border hover:bg-stone-100 hover:text-editorial-text'
                                }`}
                              >
                                {isSelected ? '★ Comparando' : '+ Comparar'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center py-4">
                    <span className="text-[10px] text-editorial-muted italic font-serif">
                      Sin opciones en esta categoría
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#F4F1EA] p-2.5 border border-editorial-border flex items-start gap-1.5">
        <span className="text-[9.5px] text-editorial-muted leading-relaxed font-serif italic">
          <strong>¿Qué representa esta clasificación?</strong> Germán Auad clasifica la góndola de S a F según la densidad de nutrientes benéficos frente al equipaje inflamatorio (sodio, aditivos, grasas trans y sobrecarga renal).
        </span>
      </div>
    </div>
  );
};
