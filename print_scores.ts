import { PRODUCTS } from './src/data.ts';
import { calculateHealthScore } from './src/utils/score.ts';

const untables = PRODUCTS.filter(p => p.categoryId === 'quesos-untables');
const blandos = PRODUCTS.filter(p => p.categoryId === 'quesos-blandos');

untables.sort((a,b) => calculateHealthScore(b) - calculateHealthScore(a));
blandos.sort((a,b) => calculateHealthScore(b) - calculateHealthScore(a));

console.log('--- QUESOS UNTABLES ---');
untables.forEach(p => console.log(`${calculateHealthScore(p).toFixed(1)} -> ${p.name} (${p.brand})`));

console.log('\n--- QUESOS BLANDOS ---');
blandos.forEach(p => console.log(`${calculateHealthScore(p).toFixed(1)} -> ${p.name} (${p.brand})`));
