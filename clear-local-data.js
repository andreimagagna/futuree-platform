// Script para limpar todos os dados locais salvos
// Execute este script no console do navegador (F12 > Console)

console.log('🧹 Limpando dados locais...');

// Lista de chaves conhecidas que podem estar no localStorage
const knownKeys = [
  'creator-solutions-storage',
  'zustand-store',
  'user-preferences',
  'company-settings',
  'saved-funnels',
  'landing-pages',
  'automation-settings',
  'leads-data',
  'crm-data',
  'settings',
  'theme',
  'language'
];

// Limpa chaves específicas
knownKeys.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Removido: ${key}`);
  }
});

// Limpa todas as chaves que contenham palavras relacionadas
const allKeys = Object.keys(localStorage);
allKeys.forEach(key => {
  const lowerKey = key.toLowerCase();
  if (
    lowerKey.includes('creator') ||
    lowerKey.includes('crm') ||
    lowerKey.includes('lead') ||
    lowerKey.includes('funnel') ||
    lowerKey.includes('landing') ||
    lowerKey.includes('automation') ||
    lowerKey.includes('settings') ||
    lowerKey.includes('preferences') ||
    lowerKey.includes('company') ||
    lowerKey.includes('user') ||
    lowerKey.includes('theme') ||
    lowerKey.includes('persist')
  ) {
    localStorage.removeItem(key);
    console.log(`✅ Removido: ${key}`);
  }
});

// Limpa sessionStorage também
const sessionKeys = Object.keys(sessionStorage);
sessionKeys.forEach(key => {
  const lowerKey = key.toLowerCase();
  if (
    lowerKey.includes('creator') ||
    lowerKey.includes('crm') ||
    lowerKey.includes('lead') ||
    lowerKey.includes('funnel') ||
    lowerKey.includes('landing') ||
    lowerKey.includes('automation') ||
    lowerKey.includes('settings') ||
    lowerKey.includes('preferences') ||
    lowerKey.includes('company') ||
    lowerKey.includes('user') ||
    lowerKey.includes('theme') ||
    lowerKey.includes('persist')
  ) {
    sessionStorage.removeItem(key);
    console.log(`✅ Removido do sessionStorage: ${key}`);
  }
});

console.log('🎉 Todos os dados locais foram removidos!');
console.log('📋 Execute: localStorage.clear() se quiser limpar TUDO');
console.log('📋 Execute: sessionStorage.clear() se quiser limpar TUDO do sessionStorage');