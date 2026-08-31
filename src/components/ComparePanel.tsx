import React from 'react';
import { Product } from '../types';
import { NUTRIENTS_METADATA } from '../data';
import { TierBadge } from './TierBadge';
import { Scale, Star, X } from 'lucide-react';
import { calculateHealthScore, getScoreColorClass, getScoreBgClass } from '../utils/score';
interface ComparePanelProps {
  selectedProducts: Product[];
  onRemoveProduct: (product: Product) => void;
  onClearAll: () => void;
}

export const ComparePanel: React.FC<ComparePanelProps> = ({
  selectedProducts,
  onRemoveProduct,
  onClearAll
}) => {
  if (selectedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full select-none bg-[#FCFAF7]">
        <div className="w-16 h-16 bg-white border border-editorial-border rounded-none flex items-center justify-center mb-4">
          <Scale className="w-6 h-6 text-editorial-muted stroke-[1.5]" />
        </div>
        <h3 className="font-serif text-sm font-bold italic text-editorial-text">Comparador Inteligente</h3>
        <p className="text-[11px] text-editorial-muted max-w-[240px] mt-2 leading-relaxed font-serif italic">
          Selecciona 2 quesos del listado tocando el botón <strong>"Comparar"</strong> para ver sus diferencias nutricionales en detalle.
        </p>
      </div>
    );
  }

  if (selectedProducts.length === 1) {
    const prod = selectedProducts[0];
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full select-none bg-[#FCFAF7]">
        <div className="relative mb-4">
          <div className="w-14 h-14 bg-white border border-editorial-border rounded-none flex items-center justify-center">
            <Scale className="w-6 h-6 text-editorial-gold animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 bg-editorial-gold text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-none shadow-sm">
            1/2
          </span>
        </div>
        <h3 className="font-sans text-[10px] font-bold tracking-widest text-editorial-muted uppercase">Has seleccionado:</h3>
        <p className="text-sm font-serif font-bold italic text-editorial-text mt-1">{prod.brand} — {prod.name}</p>
        <p className="text-[11px] text-editorial-muted max-w-[240px] mt-2.5 leading-relaxed font-serif italic">
          Selecciona otro producto de la lista para iniciar la comparación cara a cara.
        </p>
        <button
          onClick={() => onRemoveProduct(prod)}
          className="mt-4 px-4 py-2 bg-white hover:bg-stone-100 text-editorial-text border border-editorial-border rounded-none text-[10px] font-sans font-bold tracking-widest uppercase transition-colors"
        >
          Quitar Selección
        </button>
      </div>
    );
  }

  // We have exactly 2 or more products (we will take the first 2)
  const [p1, p2] = selectedProducts;

  const score1 = calculateHealthScore(p1);
  const score2 = calculateHealthScore(p2);

  return (
    <div className="flex flex-col h-full bg-white select-none font-sans overflow-y-auto no-scrollbar">
      
      {/* Compare Sticky Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-gray-800" />
          <h2 className="font-sans text-sm font-bold text-gray-800 uppercase tracking-widest">Comparación Cara a Cara</h2>
        </div>
        <button
          onClick={onClearAll}
          className="text-[10px] font-sans font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded uppercase tracking-widest transition-colors cursor-pointer"
        >
          Limpiar Todo
        </button>
      </div>

      <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full">
        {/* Header Section: Product Images and Names */}
        <div className="grid grid-cols-2 gap-2 sm:gap-8 mb-8 relative">
          
          {/* VS Badge in Center */}
          <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl font-black text-gray-300 italic z-0 pointer-events-none">
            VS.
          </div>

          {/* Product 1 */}
          <div className="flex flex-col items-center z-10 w-full min-w-0">
            <h2 className="text-[13px] sm:text-2xl font-black text-slate-800 text-center mb-0.5 leading-tight w-full px-1 line-clamp-2 min-h-[30px] sm:min-h-[32px] flex items-end justify-center">{p1.brand}</h2>
            <h3 className="text-[10px] sm:text-sm font-bold text-gray-500 text-center mb-3 line-clamp-2 h-7 sm:h-10 flex items-start justify-center px-1">{p1.name}</h3>
            <div className="relative">
              <img src={p1.imageUrl} alt={p1.name} className="w-24 h-24 sm:w-40 sm:h-40 object-contain bg-white rounded-2xl shadow-md border-2 sm:border-4 border-white p-1" />
              <button onClick={() => onRemoveProduct(p1)} className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 bg-white border border-gray-200 p-1 sm:p-1.5 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer z-10">
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <div className={`absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-white flex flex-col items-center justify-center shadow-md z-10 ${getScoreBgClass(score1)}`}>
                <span className={`font-black text-[10px] sm:text-base leading-none ${getScoreColorClass(score1)}`}>{score1.toFixed(1)}</span>
                <span className="text-[5px] sm:text-[7px] font-bold uppercase text-gray-500 mt-0.5 leading-none">Score</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 scale-75 sm:scale-100 z-10">
                <TierBadge tier={p1.tier} size="sm" />
              </div>
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Porción</p>
              <p className="text-[10px] sm:text-sm font-semibold text-gray-600">100 gramos</p>
            </div>
          </div>

          {/* Product 2 */}
          <div className="flex flex-col items-center z-10 w-full min-w-0">
            <h2 className="text-[13px] sm:text-2xl font-black text-slate-800 text-center mb-0.5 leading-tight w-full px-1 line-clamp-2 min-h-[30px] sm:min-h-[32px] flex items-end justify-center">{p2.brand}</h2>
            <h3 className="text-[10px] sm:text-sm font-bold text-gray-500 text-center mb-3 line-clamp-2 h-7 sm:h-10 flex items-start justify-center px-1">{p2.name}</h3>
            <div className="relative">
              <img src={p2.imageUrl} alt={p2.name} className="w-24 h-24 sm:w-40 sm:h-40 object-contain bg-white rounded-2xl shadow-md border-2 sm:border-4 border-white p-1" />
              <button onClick={() => onRemoveProduct(p2)} className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 bg-white border border-gray-200 p-1 sm:p-1.5 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer z-10">
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <div className={`absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-white flex flex-col items-center justify-center shadow-md z-10 ${getScoreBgClass(score2)}`}>
                <span className={`font-black text-[10px] sm:text-base leading-none ${getScoreColorClass(score2)}`}>{score2.toFixed(1)}</span>
                <span className="text-[5px] sm:text-[7px] font-bold uppercase text-gray-500 mt-0.5 leading-none">Score</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 scale-75 sm:scale-100 z-10">
                <TierBadge tier={p2.tier} size="sm" />
              </div>
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Porción</p>
              <p className="text-[10px] sm:text-sm font-semibold text-gray-600">100 gramos</p>
            </div>
          </div>
        </div>

        {/* Nutritional Divider */}
        <div className="w-full flex items-center justify-center my-10">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="px-4 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Análisis Nutricional</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* Nutritional Rows */}
        <div className="space-y-6 sm:space-y-7 px-1 sm:px-0">
          {NUTRIENTS_METADATA.map(nut => {
            const val1 = p1[nut.key];
            const val2 = p2[nut.key];
            const hasND = val1 === 'N/D' || val2 === 'N/D';
            const num1 = typeof val1 === 'number' ? val1 : 0;
            const num2 = typeof val2 === 'number' ? val2 : 0;

            const maxVal = Math.max(num1, num2, 1);
            // Limit percent to 100 for the UI bars
            const percent1 = hasND ? 0 : Math.min(Math.round((num1 / maxVal) * 100), 100);
            const percent2 = hasND ? 0 : Math.min(Math.round((num2 / maxVal) * 100), 100);

            let winner: 'p1' | 'p2' | 'tie' | null = null;
            if (val1 === 'N/D' && val2 !== 'N/D') {
              winner = 'p2';
            } else if (val2 === 'N/D' && val1 !== 'N/D') {
              winner = 'p1';
            } else if (!hasND) {
              if (num1 === num2) {
                winner = 'tie';
              } else if (nut.betterDirection === 'lower') {
                winner = num1 < num2 ? 'p1' : 'p2';
              } else {
                winner = num1 > num2 ? 'p1' : 'p2';
              }
            }

            return (
              <div key={nut.key} className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center w-full group py-1">
                
                {/* Left Side (Product 1) */}
                <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-3 items-center w-full min-w-0 pr-1 sm:pr-2">
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 justify-start">
                    <span className={`text-[11px] sm:text-sm whitespace-nowrap ${winner === 'p1' ? 'text-green-600 font-bold' : 'text-editorial-text font-semibold'}`}>
                      {val1 === 'N/D' ? 'N/D' : val1} <span className="text-[9px] sm:text-[11px]">{val1 !== 'N/D' && nut.unit}</span>
                    </span>
                    {winner === 'p1' ? <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 fill-green-500 shrink-0" /> : <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-0" />}
                  </div>
                  <div className="w-full h-3 sm:h-4 bg-[#E5E1D8] flex justify-end rounded-sm overflow-hidden shadow-inner">
                    {val1 !== 'N/D' && (
                      <div 
                        className={`h-full transition-all duration-700 ease-out ${winner === 'p1' ? 'bg-green-500' : 'bg-slate-700'}`} 
                        style={{ width: `${percent1}%` }} 
                      />
                    )}
                  </div>
                </div>

                {/* Center Label */}
                <div className="w-20 sm:w-28 text-center shrink-0 flex flex-col justify-center">
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-editorial-muted group-hover:text-editorial-text transition-colors leading-tight">
                    {nut.label}
                  </span>
                </div>

                {/* Right Side (Product 2) */}
                <div className="grid grid-cols-[1fr_auto] gap-2 sm:gap-3 items-center w-full min-w-0 pl-1 sm:pl-2">
                  <div className="w-full h-3 sm:h-4 bg-[#E5E1D8] flex justify-start rounded-sm overflow-hidden shadow-inner">
                    {val2 !== 'N/D' && (
                      <div 
                        className={`h-full transition-all duration-700 ease-out ${winner === 'p2' ? 'bg-green-500' : 'bg-[#990033]'}`} 
                        style={{ width: `${percent2}%` }} 
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 justify-end">
                    {winner === 'p2' ? <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 fill-green-500 shrink-0" /> : <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-0" />}
                    <span className={`text-[11px] sm:text-sm whitespace-nowrap ${winner === 'p2' ? 'text-green-600 font-bold' : 'text-editorial-text font-semibold'}`}>
                      {val2 === 'N/D' ? 'N/D' : val2} <span className="text-[9px] sm:text-[11px]">{val2 !== 'N/D' && nut.unit}</span>
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        
        {/* Footer info */}
        <div className="mt-12 text-center text-[9px] sm:text-[10px] text-gray-400 italic">
          * El ganador de cada categoría se destaca en color verde.<br/>
          Los valores nutricionales corresponden a una porción de 100 gramos.
        </div>

      </div>
    </div>
  );
};
