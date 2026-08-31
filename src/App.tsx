import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES, TIER_DETAILS } from './data';
import { calculateHealthScore } from './utils/score';
import { Product, TierType } from './types';
import { BrandLogo } from './components/BrandLogo';
import { MobileFrame } from './components/MobileFrame';
import { ProductCard } from './components/ProductCard';
import { ProductDetailBottomSheet } from './components/ProductDetailBottomSheet';
import { ComparePanel } from './components/ComparePanel';
import { EvaluatorWizard } from './components/EvaluatorWizard';
import { TierListVisual } from './components/TierListVisual';
import {
  Search,
  Scale,
  BookOpen,
  Filter,
  ArrowRight,
  Sparkles,
  Award,
  AlertTriangle,
  Info,
  Lock,
  ChevronRight,
  TrendingDown,
  DollarSign,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'compare' | 'tips' | 'assistant'>('explore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSupermarket, setSelectedSupermarket] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'puesto' | 'proteins' | 'sodium' | 'price' | 'calories'>('puesto');
  const [selectedTierFilter, setSelectedTierFilter] = useState<TierType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Comparison & Bottom Sheet States
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [detailedProduct, setDetailedProduct] = useState<Product | null>(null);

  // Extract all unique brands for filter dropdown
  const uniqueBrands = useMemo(() => {
    const brands = PRODUCTS.map(p => p.brand);
    return ['all', ...Array.from(new Set(brands))];
  }, []);

  // Enrich products with dynamic Health Score, recalculate Tiers, and Sort
  const rankedProducts = useMemo(() => {
    const withScores = PRODUCTS.map(p => ({
      ...p,
      healthScore: calculateHealthScore(p)
    }));
    
    // Group by category, sort by score, and assign tiers and 'puesto' relatively
    const categoriesSet = new Set(withScores.map(p => p.categoryId));
    let finalRanked: Product[] = [];
    
    categoriesSet.forEach(catId => {
      const catProducts = withScores.filter(p => p.categoryId === catId);
      catProducts.sort((a, b) => b.healthScore! - a.healthScore!);
      
      const total = catProducts.length;
      let currentTier: TierType = 'S';
      let currentScore = -1;
      
      const rankedCatProducts = catProducts.map((p, index) => {
        // Only drop to a lower tier if the score actually changed (handles ties)
        if (p.healthScore !== currentScore) {
          const fraction = index / total;
          if (fraction < 1/6) currentTier = 'S';
          else if (fraction < 2/6) currentTier = 'A';
          else if (fraction < 3/6) currentTier = 'B';
          else if (fraction < 4/6) currentTier = 'C';
          else if (fraction < 5/6) currentTier = 'D';
          else currentTier = 'F';
          
          currentScore = p.healthScore!;
        }
        
        return {
          ...p,
          tier: currentTier,
          puesto: index + 1
        };
      });
      finalRanked = [...finalRanked, ...rankedCatProducts];
    });

    return finalRanked;
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...rankedProducts];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Supermarket filter
    if (selectedSupermarket !== 'all') {
      result = result.filter(p => {
        if (selectedSupermarket === 'No prioritario') {
          return p.recommendedSupermarkets.length === 0;
        }
        return p.recommendedSupermarkets.some(s => s.toLowerCase().includes(selectedSupermarket.toLowerCase()));
      });
    }

    // Tier Filter
    if (selectedTierFilter !== 'all') {
      result = result.filter(p => p.tier === selectedTierFilter);
    }

    // Sorting logic
    result.sort((a, b) => {
      if (sortBy === 'puesto') {
        return a.puesto - b.puesto; // 1st is best
      }
      if (sortBy === 'proteins') {
        return b.proteins - a.proteins; // Higher is better
      }
      if (sortBy === 'sodium') {
        return a.sodium - b.sodium; // Lower is better
      }
      if (sortBy === 'price') {
        const priceA = a.pricePerKg === 'N/D' ? Infinity : (a.pricePerKg as number);
        const priceB = b.pricePerKg === 'N/D' ? Infinity : (b.pricePerKg as number);
        return priceA - priceB; // Lower is better
      }
      if (sortBy === 'calories') {
        return a.calories - b.calories; // Lower is better
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedBrand, selectedSupermarket, sortBy, selectedTierFilter, rankedProducts, selectedCategory]);

  // Handler to toggle compare list
  const handleToggleCompare = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening details sheet
    setCompareList(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 2) {
          // Replace the oldest item (or keep it at 2 max)
          return [prev[1], product];
        }
        return [...prev, product];
      }
    });
  };

  const handleRemoveCompare = (product: Product) => {
    setCompareList(prev => prev.filter(p => p.id !== product.id));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleViewDetails = (product: Product) => {
    setDetailedProduct(product);
  };

  return (
    <MobileFrame>
      <div className="flex flex-col min-h-screen bg-[#FCFAF7] text-editorial-text font-sans relative">
        
        {/* Dynamic header - hides on subpanels for cleaner navigation */}
        {activeTab === 'explore' && (
          <div className="bg-white px-5 pt-6 pb-5 border-b border-editorial-border shrink-0">
            {/* Logo */}
            <BrandLogo className="mb-4" />

            {/* Category Selector Carousel - ONLY SHOW IF A CATEGORY IS SELECTED */}
            {selectedCategory && (
              <div className="mt-4 space-y-2 animate-fade-in">
                <span className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-editorial-muted">
                  Categorías de Góndola
                </span>
                
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      disabled={cat.isComingSoon}
                      onClick={() => !cat.isComingSoon && setSelectedCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-none text-[11px] font-sans font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 border ${
                        cat.isComingSoon
                          ? 'bg-[#FCFAF7] text-stone-300 border-editorial-border cursor-not-allowed opacity-60'
                          : selectedCategory === cat.id
                          ? 'bg-editorial-text text-white border-editorial-text hover:bg-black cursor-pointer'
                          : 'bg-white text-editorial-text border-editorial-border hover:bg-stone-50 cursor-pointer'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      {cat.isComingSoon && <Lock className="w-3 h-3 text-stone-300 ml-0.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- EXPLORE TAB VIEW --- */}
        {activeTab === 'explore' && (
          <div className="flex-1 p-5 space-y-6 overflow-y-auto">
            
            {!selectedCategory ? (
              /* --- GALLERY VIEW --- */
              <div className="space-y-4 animate-fade-in pb-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-bold italic text-editorial-text">Selecciona una Categoría</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      disabled={cat.isComingSoon}
                      onClick={() => !cat.isComingSoon && setSelectedCategory(cat.id)}
                      className={`p-5 rounded-none border text-left flex items-center justify-between transition-all group ${
                        cat.isComingSoon
                          ? 'bg-[#F4F1EA] border-editorial-border opacity-60 cursor-not-allowed'
                          : 'bg-white border-editorial-border hover:shadow-md hover:border-editorial-text cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FCFAF7] border border-editorial-border flex items-center justify-center text-2xl group-hover:bg-editorial-text group-hover:text-white transition-colors">
                          {cat.icon}
                        </div>
                        <div>
                          <h3 className="font-sans font-extrabold text-sm text-editorial-text uppercase tracking-widest">{cat.name}</h3>
                          <p className="text-xs text-editorial-muted font-serif italic mt-1 line-clamp-2">{cat.description}</p>
                        </div>
                      </div>
                      {cat.isComingSoon ? (
                        <Lock className="w-5 h-5 text-stone-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-editorial-gold shrink-0 transition-transform group-hover:translate-x-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* --- EXISTING EXPLORE VIEW --- */
              <div className="space-y-6 animate-fade-in">
                {/* Back to Gallery button */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1.5 text-[10px] font-sans font-extrabold uppercase tracking-widest text-editorial-muted hover:text-editorial-text transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>Volver a la Galería</span>
                </button>

                {/* Horizontal visual Tier List section */}
                <TierListVisual
                  products={filteredProducts}
                  onViewProduct={handleViewDetails}
                  compareList={compareList}
                  onToggleCompare={handleToggleCompare}
                />

            {/* Search, Filter & Sort Box */}
            <div className="bg-white p-4.5 rounded-none border border-editorial-border space-y-3.5">
              
              {/* Search field */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-muted" />
                <input
                  type="text"
                  placeholder="Buscar queso o marca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FCFAF7] text-editorial-text text-xs font-semibold rounded-none border border-editorial-border focus:outline-none focus:ring-1 focus:ring-editorial-text focus:bg-white placeholder-stone-400 font-serif italic"
                />
              </div>

              {/* Filters grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Brand Selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-sans font-bold uppercase tracking-wider text-editorial-muted">Marca</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full p-2 bg-[#FCFAF7] border border-editorial-border rounded-none text-[10px] font-sans font-bold uppercase tracking-wider text-editorial-text focus:outline-none"
                  >
                    <option value="all">Todas ({uniqueBrands.length - 1})</option>
                    {uniqueBrands.filter(b => b !== 'all').map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Supermarket Selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-sans font-bold uppercase tracking-wider text-editorial-muted">Supermercado</label>
                  <select
                    value={selectedSupermarket}
                    onChange={(e) => setSelectedSupermarket(e.target.value)}
                    className="w-full p-2 bg-[#FCFAF7] border border-editorial-border rounded-none text-[10px] font-sans font-bold uppercase tracking-wider text-editorial-text focus:outline-none"
                  >
                    <option value="all">Todos</option>
                    <option value="Carrefour">Carrefour</option>
                    <option value="Comodín">Comodín</option>
                    <option value="La Anónima">La Anónima</option>
                    <option value="No prioritario">No prioritario</option>
                  </select>
                </div>
              </div>

              {/* Sorting and Tier filter row */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-editorial-border">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="text-[8px] font-sans font-bold uppercase tracking-wider text-editorial-muted">Ordenar por</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full p-2 bg-[#FCFAF7] border border-editorial-border rounded-none text-[10px] font-sans font-bold uppercase tracking-wider text-editorial-text focus:outline-none"
                  >
                    <option value="puesto">⭐ Recomendación</option>
                    <option value="proteins">💪 Más Proteínas</option>
                    <option value="sodium">🧂 Menos Sodio</option>
                    <option value="calories">🔥 Menos Calorías</option>
                    <option value="price">💸 Menor Precio</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 w-1/2">
                  <label className="text-[8px] font-sans font-bold uppercase tracking-wider text-editorial-muted">Clasificación Tier</label>
                  <div className="flex items-center gap-1">
                    {['all', 'S', 'A', 'B', 'C', 'D', 'F'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTierFilter(t as any)}
                        className={`w-5.5 h-5.5 text-[9px] font-sans font-bold rounded-none flex items-center justify-center border transition-all ${
                          selectedTierFilter === t
                            ? 'bg-editorial-text text-white border-editorial-text font-black'
                            : 'bg-[#F4F1EA] text-editorial-muted border-editorial-border hover:bg-[#E5E1D8]'
                        }`}
                      >
                        {t === 'all' ? 'Ver' : t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Quick anchor scroll guide description */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-editorial-muted">
                  Lista de Clasificación (Tier List)
                </span>
                <span className="text-[10px] font-serif font-bold italic text-editorial-text bg-[#F4F1EA] border border-editorial-border px-2.5 py-0.5 rounded-none">
                  {filteredProducts.length} alimentos
                </span>
              </div>

              {/* Products Grid Stack */}
              <div className="space-y-3">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelectedForCompare={compareList.some(p => p.id === product.id)}
                      onToggleCompare={handleToggleCompare}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <div className="bg-white p-10 text-center rounded-none border border-editorial-border">
                    <p className="text-xs font-sans font-bold text-editorial-text uppercase tracking-wider">No se encontraron productos.</p>
                    <p className="text-[10px] text-editorial-muted mt-1 font-serif italic">Prueba cambiando los filtros de búsqueda.</p>
                  </div>
                )}
              </div>
            </div>
            </div>
            )}
          </div>
        )}

        {/* --- COMPARE TAB VIEW --- */}
        {activeTab === 'compare' && (
          <div className="flex-1 flex flex-col overflow-hidden h-full">
            <ComparePanel
              selectedProducts={compareList}
              onRemoveProduct={handleRemoveCompare}
              onClearAll={handleClearCompare}
            />
          </div>
        )}

        {/* --- TIPS TAB VIEW --- */}
        {activeTab === 'tips' && (
          <div className="flex-1 p-5 space-y-5 overflow-y-auto">
            {/* Header branding */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-editorial-border select-none">
              <BrandLogo showText={true} />
              <div className="mt-4 bg-[#F4F1EA] text-editorial-text text-[10px] font-sans font-bold border border-editorial-border px-3 py-1.5 rounded-none uppercase tracking-widest">
                Consejos de Compra Inteligente
              </div>
            </div>

            <div className="space-y-3">
              
              {/* Tip 1 */}
              <div className="bg-white p-5 rounded-none border border-editorial-border space-y-2.5">
                <div className="flex items-center gap-2 text-editorial-gold">
                  <AlertTriangle className="w-4.5 h-4.5 text-editorial-gold" />
                  <h3 className="font-serif text-sm font-bold italic text-editorial-text">
                    ⚠️ La Trampa de lo "Light"
                  </h3>
                </div>
                <p className="text-[11.5px] text-editorial-muted leading-relaxed font-serif italic">
                  Que un producto diga <strong>"Light"</strong> o <strong>"Dietético"</strong> solo indica que tiene una reducción mínima del 25% en algún nutriente (normalmente grasas) frente al original. En muchos quesos, para mantener la textura untuosa al quitar grasa, añaden almidones espesantes o elevan considerablemente el sodio. ¡Siempre lee la tabla de nutrientes!
                </p>
              </div>

              {/* Tip 2 */}
              <div className="bg-white p-5 rounded-none border border-editorial-border space-y-2.5">
                <div className="flex items-center gap-2 text-editorial-gold">
                  <Sparkles className="w-4.5 h-4.5 text-editorial-gold fill-editorial-gold" />
                  <h3 className="font-serif text-sm font-bold italic text-editorial-text">
                    🧂 El Semáforo del Sodio
                  </h3>
                </div>
                <p className="text-[11.5px] text-editorial-muted leading-relaxed font-serif italic">
                  Como guía práctica en góndola:
                  <br />• <strong>Excelente (Verde):</strong> Menos de 100mg de sodio por cada 100g de queso. (Ejemplo: Tregar Light Sin Sal).
                  <br />• <strong>Moderado (Amarillo):</strong> Entre 100mg y 450mg de sodio.
                  <br />• <strong>Alerta (Rojo):</strong> Más de 500mg de sodio por porción de 100g. ¡Limita su ingesta si tienes presión alta!
                </p>
              </div>

              {/* Tip 3 */}
              <div className="bg-white p-5 rounded-none border border-editorial-border space-y-2.5">
                <div className="flex items-center gap-2 text-editorial-gold">
                  <Award className="w-4.5 h-4.5 text-editorial-gold fill-editorial-gold" />
                  <h3 className="font-serif text-sm font-bold italic text-editorial-text">
                    💪 El Filtro Proteico
                  </h3>
                </div>
                <p className="text-[11.5px] text-editorial-muted leading-relaxed font-serif italic">
                  Los quesos compactos y magros deben ser una gran fuente proteica en tu día. Busca aquellos que superen los <strong>25g de proteína por cada 100g</strong>. Te darán saciedad muscular prolongada y son perfectos para meriendas de deportistas.
                </p>
              </div>

              {/* Tip 4 */}
              <div className="bg-white p-5 rounded-none border border-editorial-border space-y-2.5">
                <div className="flex items-center gap-2 text-editorial-gold">
                  <Info className="w-4.5 h-4.5 text-editorial-gold" />
                  <h3 className="font-serif text-sm font-bold italic text-editorial-text">
                    🌱 Quesos Veganos (Plant-Based)
                  </h3>
                </div>
                <p className="text-[11.5px] text-editorial-muted leading-relaxed font-serif italic">
                  Los quesos plant-based son grandes aliados para intolerantes a la lactosa o veganos. No obstante, fíjate que la mayoría están hechos con aceites de coco (altos en grasas saturadas perjudiciales) y tienen un aporte proteico casi nulo (2g o menos). ¡Asegúrate de complementar la proteína de tu comida de otra forma!
                </p>
              </div>

              {/* Tip 5 */}
              <div className="bg-white p-5 rounded-none border border-editorial-border space-y-2.5">
                <div className="flex items-center gap-2 text-editorial-gold">
                  <DollarSign className="w-4.5 h-4.5 text-editorial-gold" />
                  <h3 className="font-serif text-sm font-bold italic text-editorial-text">
                    🛒 Hack de Ahorro Nutricional
                  </h3>
                </div>
                <p className="text-[11.5px] text-editorial-muted leading-relaxed font-serif italic">
                  Comprar quesos fraccionados en fetas o porciones pequeñas suele inflar el precio por kilo hasta un 45%. Compra siempre la pieza o la horma de 500g o 1kg, córtala en porciones en casa y congélala. Además, fíjate en el precio por kilogramo expuesto en la etiqueta de góndola, no en el precio de la unidad.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* --- ASSISTANT TAB VIEW --- */}
        {activeTab === 'assistant' && (
          <div className="flex-1 p-5 space-y-6 overflow-y-auto">
            {/* Header branding */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-editorial-border select-none">
              <BrandLogo showText={true} />
              <div className="mt-4 bg-[#F4F1EA] text-editorial-text text-[10px] font-sans font-bold border border-editorial-border px-3 py-1.5 rounded-none uppercase tracking-widest">
                Asistente de Compra Inteligente
              </div>
            </div>

            <EvaluatorWizard onViewProduct={handleViewDetails} />
          </div>
        )}

        {/* --- INTERACTIVE BOTTOM NAVIGATION BAR (NATIVE LOOK) --- */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-editorial-border flex items-center justify-around px-2 shrink-0 z-30 select-none h-[64px] shadow-sm">
          {/* Tab Button: Explore */}
          <button
            onClick={() => {
              if (activeTab === 'explore') {
                setSelectedCategory(null); // Return to gallery if tapped again
              }
              setActiveTab('explore');
            }}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'text-editorial-gold font-sans font-bold'
                : 'text-editorial-muted hover:text-editorial-text'
            }`}
          >
            <Search className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className="text-[10px] tracking-wide font-sans font-bold uppercase">Explorar</span>
          </button>

          {/* Tab Button: Compare */}
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 transition-all cursor-pointer relative ${
              activeTab === 'compare'
                ? 'text-editorial-gold font-sans font-bold'
                : 'text-editorial-muted hover:text-editorial-text'
            }`}
          >
            <div className="relative">
              <Scale className={`w-5 h-5 ${activeTab === 'compare' ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              {compareList.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-editorial-text text-white text-[8px] font-sans font-extrabold w-4.5 h-4.5 rounded-none flex items-center justify-center border border-white">
                  {compareList.length}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-wide font-sans font-bold uppercase">Comparar</span>
          </button>

          {/* Tab Button: Assistant */}
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 transition-all cursor-pointer ${
              activeTab === 'assistant'
                ? 'text-editorial-gold font-sans font-bold'
                : 'text-editorial-muted hover:text-editorial-text'
            }`}
          >
            <HelpCircle className={`w-5 h-5 ${activeTab === 'assistant' ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className="text-[10px] tracking-wide font-sans font-bold uppercase">Asistente</span>
          </button>

          {/* Tab Button: Tips */}
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 transition-all cursor-pointer ${
              activeTab === 'tips'
                ? 'text-editorial-gold font-sans font-bold'
                : 'text-editorial-muted hover:text-editorial-text'
            }`}
          >
            <BookOpen className={`w-5 h-5 ${activeTab === 'tips' ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className="text-[10px] tracking-wide font-sans font-bold uppercase">Consejos</span>
          </button>
        </div>

        {/* --- FLOATING NOTIFIER IF 2 PRODUCTS SELECTED AND IN EXPLORE TAB --- */}
        {activeTab === 'explore' && compareList.length === 2 && (
          <div className="fixed bottom-20 max-w-[calc(100%-2rem)] md:max-w-[480px] mx-auto inset-x-4 bg-editorial-text text-white px-4 py-3 rounded-none border border-editorial-border flex items-center justify-between z-40 animate-slide-up select-none shadow-2xl">
            <div className="flex items-center gap-2">
              <Scale className="w-4.5 h-4.5 text-editorial-gold" />
              <div className="flex flex-col">
                <span className="text-[10.5px] font-sans font-bold tracking-wider uppercase">Listado de comparación listo</span>
                <span className="text-[9px] text-stone-300 leading-none mt-0.5 font-serif italic">Tienes 2 productos para comparar cara a cara.</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('compare')}
              className="px-3.5 py-2 bg-editorial-gold hover:bg-[#FCFAF7] hover:text-editorial-text text-white text-[10px] font-sans font-bold rounded-none flex items-center gap-0.5 uppercase tracking-widest transition-all duration-200"
            >
              <span>Ir Ahora</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* --- DETAILED PRODUCT BOTTOM SHEET --- */}
        <ProductDetailBottomSheet
          product={detailedProduct}
          onClose={() => setDetailedProduct(null)}
          onToggleCompare={handleToggleCompare}
          isSelectedForCompare={compareList.some(p => p?.id === detailedProduct?.id)}
        />

      </div>
    </MobileFrame>
  );
}
