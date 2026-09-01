import React from 'react';
import { Product } from '../types';
import { TierBadge } from './TierBadge';
import { X, MapPin, Sparkles, Check, TrendingDown, DollarSign, Award, AlertOctagon } from 'lucide-react';

interface ProductDetailBottomSheetProps {
  product: Product | null;
  onClose: () => void;
  onToggleCompare: (product: Product, e: React.MouseEvent) => void;
  isSelectedForCompare: boolean;
}

export const ProductDetailBottomSheet: React.FC<ProductDetailBottomSheetProps> = ({
  product,
  onClose,
  onToggleCompare,
  isSelectedForCompare
}) => {
  if (!product) return null;

  // Recommended Daily Intake limits for cheese serving/100g contextual calculations
  const IDR = {
    calories: 2000,       // 2000 kcal
    proteins: 60,         // 60g
    totalFats: 70,        // 70g
    saturatedFats: 20,    // max 20g
    transFats: 2,         // max 2g (WHO <1% energy)
    sodium: 2000,         // max 2000mg
    calcium: 1000         // 1000mg
  };

  const getPercent = (value: number | string | 'N/D', key: keyof typeof IDR) => {
    if (value === 'N/D' || typeof value !== 'number') return 0;
    return Math.min(Math.round((value / IDR[key]) * 100), 100);
  };

  const isLowSodium = product.sodium < 100;
  const isHighSaturatedFat = product.saturatedFats >= 11;
  const isHighProtein = product.proteins >= 25;

  return (
    <div className="fixed inset-0 bg-[#2D2A26]/40 flex items-end justify-center z-50 p-0 md:p-4 overflow-hidden select-none animate-fade-in">
      {/* Backdrop tap-to-close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Floating Bottom Sheet */}
      <div className="w-full max-w-lg md:max-w-xl bg-[#FCFAF7] rounded-none max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl relative z-10 flex flex-col border border-editorial-border animate-slide-up pb-6">
        
        {/* Slider Handle Accent - Minimal styled bar */}
        <div className="w-12 h-1 bg-editorial-border mx-auto mt-3 mb-2 shrink-0 cursor-pointer" onClick={onClose} />

        {/* Top Sticky Header */}
        <div className="flex items-start justify-between px-6 pt-2 pb-4 border-b border-editorial-border sticky top-0 bg-[#FCFAF7]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <TierBadge tier={product.tier} size="md" />
            <div className="flex flex-col">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-editorial-muted">
                {product.brand}
              </span>
              <h2 className="font-serif text-lg font-bold italic text-editorial-text leading-tight mt-0.5">
                {product.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none border border-editorial-border bg-white text-editorial-text hover:bg-editorial-border transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Status Badges Alert / Recommendations */}
          <div className="flex flex-wrap gap-1.5">
            {isLowSodium && (
              <span className="text-[10px] font-sans font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-none flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                Apto Hipertensos
              </span>
            )}
            {isHighProtein && (
              <span className="text-[10px] font-sans font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-none flex items-center gap-1">
                <Award className="w-3 h-3 text-blue-600 fill-blue-600" />
                Alto en Proteínas
              </span>
            )}
            {isHighSaturatedFat && (
              <span className="text-[10px] font-sans font-bold text-red-800 bg-red-50 border border-red-200 px-2.5 py-1 rounded-none flex items-center gap-1">
                <AlertOctagon className="w-3 h-3 text-red-600" />
                Alto en Grasas Sat.
              </span>
            )}
          </div>

          {/* Germán Auad's Verdict Box - Stylized Editorial Quote */}
          <div className="bg-[#F4F1EA] text-[#2D2A26] p-4.5 rounded-none border border-editorial-border relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
              <Sparkles className="w-24 h-24 text-editorial-text" />
            </div>
            
            <div className="flex items-center gap-2 mb-2 text-editorial-gold">
              <Sparkles className="w-4 h-4 text-editorial-gold fill-editorial-gold" />
              <span className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase">
                Análisis de Germán Auad
              </span>
            </div>

            <p className="text-xs text-editorial-text leading-relaxed font-serif italic">
              "{product.nutritionistVerdict}"
            </p>
          </div>

          {/* Complete Nutritional Table & Meters */}
          <div className="space-y-3">
            <h3 className="font-sans text-[11px] font-bold text-editorial-text tracking-[0.15em] uppercase">
              Información Nutricional (por 100g)
            </h3>

            <div className="space-y-4 bg-white p-4.5 rounded-none border border-editorial-border">
              
              {/* Sodium meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-sans font-semibold">
                  <span className="text-editorial-text">Sodio</span>
                  <span className={`font-serif italic font-bold ${isLowSodium ? 'text-emerald-700' : product.sodium > 500 ? 'text-red-600 font-extrabold' : 'text-editorial-text'}`}>
                    {product.sodium} mg <span className="text-[10px] text-editorial-muted font-sans font-normal not-italic">({getPercent(product.sodium, 'sodium')}% IDR)</span>
                  </span>
                </div>
                <div className="h-1 w-full bg-[#E5E1D8] rounded-none overflow-hidden">
                  <div
                    className={`h-full rounded-none transition-all duration-500 ${
                      isLowSodium ? 'bg-emerald-600' : product.sodium > 500 ? 'bg-red-500' : 'bg-editorial-text'
                    }`}
                    style={{ width: `${getPercent(product.sodium, 'sodium')}%` }}
                  />
                </div>
              </div>

              {/* Protein meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-sans font-semibold">
                  <span className="text-editorial-text">Proteínas</span>
                  <span className="text-editorial-text font-serif italic font-bold">
                    {product.proteins} g <span className="text-[10px] text-editorial-muted font-sans font-normal not-italic">({getPercent(product.proteins, 'proteins')}% IDR)</span>
                  </span>
                </div>
                <div className="h-1 w-full bg-[#E5E1D8] rounded-none overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-none transition-all duration-500"
                    style={{ width: `${getPercent(product.proteins, 'proteins')}%` }}
                  />
                </div>
              </div>

              {/* Saturated Fats meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-sans font-semibold">
                  <span className="text-editorial-text">Grasas Saturadas</span>
                  <span className={`font-serif italic font-bold ${isHighSaturatedFat ? 'text-red-600 font-extrabold' : 'text-editorial-text'}`}>
                    {product.saturatedFats} g <span className="text-[10px] text-editorial-muted font-sans font-normal not-italic">({getPercent(product.saturatedFats, 'saturatedFats')}% IDR)</span>
                  </span>
                </div>
                <div className="h-1 w-full bg-[#E5E1D8] rounded-none overflow-hidden">
                  <div
                    className={`h-full rounded-none transition-all duration-500 ${
                      isHighSaturatedFat ? 'bg-red-500' : 'bg-[#B08D75]'
                    }`}
                    style={{ width: `${getPercent(product.saturatedFats, 'saturatedFats')}%` }}
                  />
                </div>
              </div>

              {/* Trans Fats meter */}
              {product.transFats !== undefined && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-sans font-semibold">
                    <span className="text-editorial-text">Grasas Trans</span>
                    <span className={`font-serif italic font-bold ${product.transFats > 0 ? 'text-red-600 font-extrabold' : 'text-editorial-text'}`}>
                      {product.transFats} g <span className="text-[10px] text-editorial-muted font-sans font-normal not-italic">({getPercent(product.transFats, 'transFats')}% Límite)</span>
                    </span>
                  </div>
                  <div className="h-1 w-full bg-[#E5E1D8] rounded-none overflow-hidden">
                    <div
                      className="h-full bg-[#990033] rounded-none transition-all duration-500"
                      style={{ width: `${getPercent(product.transFats, 'transFats')}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Calories meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-sans font-semibold">
                  <span className="text-editorial-text">Energía / Calorías</span>
                  <span className="text-editorial-text font-serif italic font-bold">
                    {product.calories} kcal <span className="text-[10px] text-editorial-muted font-sans font-normal not-italic">({getPercent(product.calories, 'calories')}% IDR)</span>
                  </span>
                </div>
                <div className="h-1 w-full bg-[#E5E1D8] rounded-none overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-none transition-all duration-500"
                    style={{ width: `${getPercent(product.calories, 'calories')}%` }}
                  />
                </div>
              </div>

              {/* Calcium meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-sans font-semibold">
                  <span className="text-editorial-text">Calcio</span>
                  <span className="text-editorial-text font-serif italic font-bold">
                    {product.calcium === 'N/D' ? 'N/D' : `${product.calcium} mg`}
                    {product.calcium !== 'N/D' && (
                      <span className="text-[10px] text-editorial-muted font-sans font-normal not-italic"> ({getPercent(product.calcium, 'calcium')}% IDR)</span>
                    )}
                  </span>
                </div>
                {product.calcium !== 'N/D' && (
                  <div className="h-1 w-full bg-[#E5E1D8] rounded-none overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-none transition-all duration-500"
                      style={{ width: `${getPercent(product.calcium, 'calcium')}%` }}
                    />
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Recommended Supermarkets, Price & Placement */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F4F1EA] p-3.5 rounded-none border border-editorial-border flex flex-col justify-between">
              <span className="text-[9px] font-sans font-bold text-editorial-muted uppercase tracking-wider">Supermercados</span>
              <div className="mt-1 flex items-center gap-1 text-editorial-text font-semibold text-xs">
                <MapPin className="w-3.5 h-3.5 text-editorial-gold shrink-0" />
                <span className="line-clamp-1 font-serif italic">
                  {product.recommendedSupermarkets.length > 0 ? product.recommendedSupermarkets.join(' / ') : 'No prioritario'}
                </span>
              </div>
            </div>

            <div className="bg-[#F4F1EA] p-3.5 rounded-none border border-editorial-border flex flex-col justify-between">
              <span className="text-[9px] font-sans font-bold text-editorial-muted uppercase tracking-wider">Precio por Kilo</span>
              <div className="mt-1 flex items-center gap-1 text-editorial-text font-bold text-xs">
                <DollarSign className="w-3.5 h-3.5 text-editorial-muted shrink-0" />
                <span className="font-serif">
                  {product.pricePerKg === 'N/D' ? 'N/D' : `$${product.pricePerKg.toLocaleString('es-AR')}`}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button: Toggle Compare directly inside the Sheet - Editorial Premium Block Button */}
          <button
            onClick={(e) => {
              onToggleCompare(product, e);
            }}
            className="w-full bg-[#2D2A26] text-white py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[#44403C] rounded-none transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSelectedForCompare ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Quitar del comparador</span>
              </>
            ) : (
              <>
                <span>Agregar para Comparar</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
