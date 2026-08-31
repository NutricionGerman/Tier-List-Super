import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data';
import { TierBadge } from './TierBadge';
import { ShieldAlert, Award, TrendingDown, HelpCircle, DollarSign, Leaf, ArrowRight, RotateCcw, MapPin, Sparkles } from 'lucide-react';

interface EvaluatorWizardProps {
  onViewProduct: (product: Product) => void;
}

export const EvaluatorWizard: React.FC<EvaluatorWizardProps> = ({ onViewProduct }) => {
  const [step, setStep] = useState<number>(1);
  const [priority, setPriority] = useState<string | null>(null);

  const OPTIONS = [
    {
      id: 'calories',
      label: '⚠️ 1. La Trampa de lo "Light" y el "Efecto Halo"',
      icon: TrendingDown,
      color: 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100/50',
      description: 'Descubre por qué "bajo en grasa" te hace comer hasta 47% más y esconde almidones.'
    },
    {
      id: 'sodium',
      label: '🧂 2. El Semáforo Real del Sodio (Salud Endotelial Directa)',
      icon: ShieldAlert,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50',
      description: 'Evita la inflamación y rigidez arterial inmediata a los 30 minutos de comer.'
    },
    {
      id: 'protein',
      label: '🚫 3. El Filtro Proteico (La Carga de la Proteína Animal)',
      icon: Award,
      color: 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100/50',
      description: 'El exceso de caseína hiperactiva mTORC1, acelera el envejecimiento y sobrecarga los riñones.'
    },
    {
      id: 'vegan',
      label: '🌱 4. Quesos Veganos: Eludir el "Equipaje" Lácteo',
      icon: Leaf,
      color: 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100/50',
      description: 'Esquiva la galactosa, el azúcar animal inflamatorio Neu5Gc y las grasas trans rumiantes.'
    },
    {
      id: 'budget',
      label: '🪙 5. Hack de Ahorro Nutricional (Inversión en Salud)',
      icon: DollarSign,
      color: 'text-slate-700 bg-slate-50 border-slate-100 hover:bg-slate-100/50',
      description: 'La opción que protege tus arterias sin costar más: la mejor inversión de tu canasta.'
    }
  ];

  const handleSelectPriority = (id: string) => {
    setPriority(id);
    setStep(2);
  };

  const resetWizard = () => {
    setPriority(null);
    setStep(1);
  };

  // Recommender logic based on priority selection with rigorous scientific corrections
  const getRecommendation = (): { product: Product; note: string } => {
    if (priority === 'sodium') {
      const prod = PRODUCTS.find(p => p.id === 'tregar-por-salut-light-sin-sal')!;
      return {
        product: prod,
        note: 'El sodio no solo eleva la presión; una sola comida alta en sodio daña, inflama y rigidiza tus arterias de forma directa e inmediata (a los 30 minutos de comer) a través del estrés oxidativo, independientemente de tu presión arterial. Un queso con 430 mg de sodio ya entra en la zona roja de agresión vascular endotelial.'
      };
    }
    if (priority === 'protein') {
      const prod = PRODUCTS.find(p => p.id === 'tregar-por-salut-light-sin-sal')!;
      return {
        product: prod,
        note: 'Buscar quesos por su alto contenido de proteína animal es contraproducente para la longevidad. La caseína dispara la hormona IGF-1 e hiperactiva la vía mTORC1, acelerando el deterioro orgánico. Además, induce hiperfiltración y sobrecarga renal aguda. Para personas sanas, 0,8 g/kg al día es suficiente; el exceso de proteína animal no aporta fuerza y sí acelera tu envejecimiento.'
      };
    }
    if (priority === 'calories') {
      const prod = PRODUCTS.find(p => p.id === 'la-serenisima-port-salut-sin-sal-light')!;
      return {
        product: prod,
        note: 'Las etiquetas "Light" o "Bajo en grasa" activan el "Efecto Halo", una trampa psicológica que hace percibir el producto como saludable en su totalidad, llevando a consumir porciones hasta un 47% más grandes. Además, al retirar la grasa, se suele compensar la textura añadiendo almidones o azúcares, lo que provoca picos rápidos de glucemia e insulina.'
      };
    }
    if (priority === 'vegan') {
      const prod = PRODUCTS.find(p => p.id === 'felices-las-vacas-muzzalmendra-vegano')!;
      return {
        product: prod,
        note: 'El verdadero valor de un queso vegetal no es evitar la lactosa (que en quesos maduros es casi nula), sino esquivar el "equipaje biológico" nocivo de la leche: la galactosa, las grasas trans rumiantes y el azúcar animal inflamatorio Neu5Gc. Además, el mito de que "debes complementar su proteína" es falso: la proteína vegetal es completa y limpia.'
      };
    }
    const prod = PRODUCTS.find(p => p.id === 'tregar-por-salut-light-sin-sal')!;
    return {
      product: prod,
      note: 'El sodio daña las arterias de forma aguda e independiente de la presión arterial. Además, según los precios reales de góndola, la versión Sin Sal de Tregar cuesta prácticamente lo mismo, lo que convierte a la versión sin sal en la inversión de salud vascular más costo-eficiente de la canasta familiar.'
    };
  };

  const recommendation = priority ? getRecommendation() : null;

  return (
    <div className="bg-white rounded-none border border-editorial-border p-5 shadow-sm select-none font-sans">
      
      {/* Header section */}
      <div className="flex items-start gap-2.5 mb-4">
        <div className="w-8 h-8 bg-[#F4F1EA] border border-editorial-border rounded-none flex items-center justify-center shrink-0">
          <HelpCircle className="w-4 h-4 text-editorial-gold" />
        </div>
        <div>
          <h3 className="font-serif text-sm font-bold italic text-editorial-text">
            Asistente Rápido de Góndola
          </h3>
          <p className="text-[10px] text-editorial-muted mt-0.5 font-serif italic">
            ¿No sabes cuál llevar hoy? Deja que Germán te recomiende el ideal en 2 pasos.
          </p>
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-2.5">
          <span className="text-[9px] font-sans font-bold text-editorial-muted uppercase tracking-[0.12em]">
            Paso 1: ¿Cuál es tu objetivo de salud hoy?
          </span>

          <div className="space-y-2">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectPriority(opt.id)}
                  className="w-full text-left p-3 rounded-none border border-editorial-border hover:border-editorial-text bg-[#FCFAF7] flex items-center gap-3 transition-all cursor-pointer group"
                >
                  <div className="p-2 bg-white border border-editorial-border rounded-none shrink-0 text-editorial-muted group-hover:text-editorial-gold transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-sans font-bold text-editorial-text uppercase tracking-wider group-hover:text-black leading-snug">{opt.label}</span>
                    <span className="text-[9.5px] text-editorial-muted mt-0.5 leading-tight font-serif italic">{opt.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        recommendation && (
          <div className="space-y-4 animate-fade-in">
            <span className="text-[9px] font-sans font-bold text-editorial-muted uppercase tracking-[0.12em]">
              Paso 2: La recomendación de Germán
            </span>

            {/* Recommended Product Visual Card */}
            <div
              onClick={() => onViewProduct(recommendation.product)}
              className="p-4 bg-[#FCFAF7] rounded-none border border-editorial-border flex items-center justify-between cursor-pointer hover:bg-[#F4F1EA] transition-colors"
            >
              <div className="flex items-center gap-3">
                <TierBadge tier={recommendation.product.tier} size="sm" />
                <div className="flex flex-col pr-1">
                  <span className="text-[9px] font-sans font-bold text-editorial-muted uppercase tracking-wider">{recommendation.product.brand}</span>
                  <h4 className="text-xs font-serif font-black italic text-editorial-text leading-tight mt-0.5">{recommendation.product.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {recommendation.product.pricePerKg !== 'N/D' && (
                      <span className="text-[10px] font-sans font-bold text-editorial-text">
                        ${recommendation.product.pricePerKg.toLocaleString('es-AR')}/kg
                      </span>
                    )}
                    {recommendation.product.recommendedSupermarkets.length > 0 && (
                      <span className="text-[9px] text-emerald-800 font-sans font-semibold tracking-wide flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-editorial-gold" />
                        {recommendation.product.recommendedSupermarkets[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-editorial-muted shrink-0" />
            </div>

            {/* Nutritionist's Note */}
            <div className="bg-[#2D2A26] text-white p-4 rounded-none border border-editorial-border relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <div className="flex items-center gap-1.5 text-editorial-gold text-[10px] font-sans font-bold uppercase tracking-widest mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-editorial-gold fill-editorial-gold" />
                <span>¿Por qué este queso?</span>
              </div>
              <p className="text-xs text-stone-200 italic font-serif leading-relaxed">
                "{recommendation.note}"
              </p>
            </div>

            {/* Reset Controller */}
            <button
              onClick={resetWizard}
              className="w-full py-2.5 bg-[#F4F1EA] hover:bg-[#E5E1D8] text-editorial-text border border-editorial-border text-[10px] font-sans font-bold rounded-none uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Volver a empezar</span>
            </button>
          </div>
        )
      )}

    </div>
  );
};
