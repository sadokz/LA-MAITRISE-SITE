// src/lib/fallbackImages.ts

export const keywordFallbackImages = new Map<string, string>([
  // Generic defaults
  ['default', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop'], // Engineering/Construction
  ['électricité', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop'],
  ['bim', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'],
  ['ingénierie', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop'],
  ['projet', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop'],

  // Specific fallback for 'Établissements Hospitaliers'
  ['établissements hospitaliers', 'https://la-maitrise.tn/MEDIA/REF.HOPITAL.jpg'],

  // Domains & Categories
  ['bâtiments résidentiels', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop'],
  ['bâtiments tertiaires', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['industrie', 'https://images.unsplash.com/photo-1545558014_8692077e9b5c?w=600&h=400&fit=crop'],
  ['infrastructures', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'],
  ['énergie', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop'],
  ['santé', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['hospitalier', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['hôpital', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['clinique', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['centre de santé', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['cfo', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop'], // Courants Forts
  ['cfa', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'], // Courants Faibles
  ['éclairage public', 'https://images.unsplash.com/photo-1545558014_8692077e9b5c?w=600&h=400&fit=crop'],
  ['ssi', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'], // Système de Sécurité Incendie
  ['ascenseurs', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['photovoltaïque', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop'],
  ['rénovation', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop'],
  ['transformation', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['urgence', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['cardiologie', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['psychiatrie', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['hémodialyse', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['pédiatrie', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['irm', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['pharmacie', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['chirurgicale', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['incendie', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['maternité', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['néonatologie', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['salle blanche', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['chu', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['institut', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['poste de transformation', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['gynéco-obstétrique', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['anésthésie', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],
  ['réanimation', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'],

  // Locations (can be used as keywords if relevant images exist)
  ['tunis', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['nabeul', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['sousse', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['monastir', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['korba', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['mégrine', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['ksar hellal', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['kairouan', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['sfax', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['gabès', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['djerba', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['bizerte', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['jendouba', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['le kef', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['gafsa', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['tozeur', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['tataouine', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['mahdia', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['zaghouan', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['grombalia', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['kélibia', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['hawaria', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['soliman', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['takelsa', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['bembla', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['chrarda', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['bouhajla', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['menzel bouzelfa', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
  ['dar chaabane el fehri', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop'],
]);

export function getRelevantFallbackImage(text: string, defaultKey: string = 'default'): string {
  const lowerText = text.toLowerCase();
  for (const [keyword, url] of keywordFallbackImages.entries()) {
    if (lowerText.includes(keyword)) {
      return url;
    }
  }
  return keywordFallbackImages.get(defaultKey) || '';
}