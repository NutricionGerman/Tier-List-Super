import { Product } from '../types';

export function calculateHealthScore(product: Product): number {
  let score = 10; // Empezamos con puntaje perfecto

  // PENALIZACIONES (Restan puntos)
  
  // 1. Grasas Trans (Mayor penalización)
  // 1 gramo de trans resta 2 puntos
  const transPenalty = (product.transFats || 0) * 2.0;
  
  // 2. Grasas Saturadas (Fuerte penalización)
  // 1 gramo resta 0.25 puntos (ej. 10g = -2.5)
  const satPenalty = product.saturatedFats * 0.25;

  // 3. Sodio (Fuerte penalización)
  // 100mg restan 0.25 puntos (ej. 500mg = -1.25)
  const sodiumPenalty = product.sodium * 0.0025;

  // 4. Calorías (Penalización media)
  // 100kcal restan 0.30 puntos (ej. 300kcal = -0.9)
  const caloriesPenalty = product.calories * 0.003;

  score -= (transPenalty + satPenalty + sodiumPenalty + caloriesPenalty);

  // BONIFICACIONES (Suman puntos)

  // 5. Calcio (Bonificación leve)
  // 100mg suman 0.12 puntos (ej. 800mg = +0.96)
  const calciumVal = product.calcium === 'N/D' ? 0 : product.calcium;
  const calciumBonus = calciumVal * 0.0012;

  // 6. Proteínas (Bonificación muy leve)
  // 10g suman 0.2 puntos (ej. 20g = +0.4)
  const proteinBonus = product.proteins * 0.02;

  score += (calciumBonus + proteinBonus);

  // Asegurar límites
  score = Math.max(1, Math.min(10, score));

  // Redondear a 1 decimal
  return Math.round(score * 10) / 10;
}

export function getScoreColorClass(score: number): string {
  if (score >= 8.5) return 'text-emerald-500';
  if (score >= 7.0) return 'text-green-500';
  if (score >= 5.0) return 'text-amber-500';
  if (score >= 3.5) return 'text-orange-500';
  return 'text-red-500';
}

export function getScoreBgClass(score: number): string {
  if (score >= 8.5) return 'bg-emerald-50 border-emerald-200';
  if (score >= 7.0) return 'bg-green-50 border-green-200';
  if (score >= 5.0) return 'bg-amber-50 border-amber-200';
  if (score >= 3.5) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
}
