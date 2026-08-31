export type TierType = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface Product {
  id: string;
  categoryId: string;
  puesto: number;
  name: string;
  brand: string;
  calories: number; // kcal
  proteins: number; // g
  totalFats: number; // g
  saturatedFats: number; // g
  transFats?: number; // g
  sodium: number; // mg
  calcium: number | 'N/D'; // mg
  pricePerKg: number | 'N/D'; // in ARS or USD, e.g. 16985
  recommendedSupermarkets: string[];
  tier: TierType;
  badge: string; // e.g. "🥇 1er Puesto", "🥈 2do Puesto", "🚨 Cuidado", "🚫 No Recomendado"
  nutritionistVerdict: string; // Germán's tip or review
  imageUrl?: string; // local or placeholder
  healthScore?: number; // Calculated score out of 10
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  isComingSoon?: boolean;
}

export type NutrientKey = 'calories' | 'proteins' | 'saturatedFats' | 'transFats' | 'sodium' | 'calcium' | 'pricePerKg';

export interface NutrientMetadata {
  key: NutrientKey;
  label: string;
  unit: string;
  betterDirection: 'lower' | 'higher'; // 'lower' is better for sodium, 'higher' is better for proteins
  description: string;
}
