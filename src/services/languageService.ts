
// Multi-language support service
interface TranslationKeys {
  // Navigation
  'nav.home': string;
  'nav.spots': string;
  'nav.forecast': string;
  'nav.profile': string;
  
  // Surf conditions
  'conditions.waveHeight': string;
  'conditions.period': string;
  'conditions.windSpeed': string;
  'conditions.windDirection': string;
  'conditions.tide': string;
  'conditions.rating': string;
  
  // Wave ratings
  'rating.poor': string;
  'rating.fair': string;
  'rating.good': string;
  'rating.veryGood': string;
  'rating.excellent': string;
  
  // Difficulties
  'difficulty.beginner': string;
  'difficulty.intermediate': string;
  'difficulty.advanced': string;
  'difficulty.expert': string;
  
  // Common actions
  'action.viewDetails': string;
  'action.getLiveUpdate': string;
  'action.shareSurfConditions': string;
  'action.setAlerts': string;
  'action.addToFavorites': string;
  
  // Weather
  'weather.sunny': string;
  'weather.cloudy': string;
  'weather.rainy': string;
  'weather.stormy': string;
  'weather.overcast': string;
  
  // Time periods
  'time.now': string;
  'time.today': string;
  'time.tomorrow': string;
  'time.thisWeek': string;
  'time.nextWeek': string;
  
  // Forecast
  'forecast.title': string;
  'forecast.7day': string;
  'forecast.hourly': string;
  'forecast.tides': string;
  
  // Achievements and points
  'points.earned': string;
  'points.total': string;
  'achievement.unlocked': string;
  'session.logged': string;
  'level.up': string;
  
  // Errors and loading
  'error.loadingFailed': string;
  'loading.surfConditions': string;
  'loading.forecast': string;
  'error.locationDenied': string;
  'error.networkError': string;
}

type Language = 'en' | 'es' | 'fr' | 'pt' | 'de' | 'ja';

const translations: Record<Language, TranslationKeys> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.spots': 'Surf Spots',
    'nav.forecast': 'Forecast',
    'nav.profile': 'Profile',
    
    // Surf conditions
    'conditions.waveHeight': 'Wave Height',
    'conditions.period': 'Period',
    'conditions.windSpeed': 'Wind Speed',
    'conditions.windDirection': 'Wind Direction',
    'conditions.tide': 'Tide',
    'conditions.rating': 'Rating',
    
    // Wave ratings
    'rating.poor': 'Poor',
    'rating.fair': 'Fair',
    'rating.good': 'Good',
    'rating.veryGood': 'Very Good',
    'rating.excellent': 'Excellent',
    
    // Difficulties
    'difficulty.beginner': 'Beginner',
    'difficulty.intermediate': 'Intermediate',
    'difficulty.advanced': 'Advanced',
    'difficulty.expert': 'Expert',
    
    // Common actions
    'action.viewDetails': 'View Details',
    'action.getLiveUpdate': 'Get Live Update',
    'action.shareSurfConditions': 'Share Conditions',
    'action.setAlerts': 'Set Alerts',
    'action.addToFavorites': 'Add to Favorites',
    
    // Weather
    'weather.sunny': 'Sunny',
    'weather.cloudy': 'Cloudy',
    'weather.rainy': 'Rainy',
    'weather.stormy': 'Stormy',
    'weather.overcast': 'Overcast',
    
    // Time periods
    'time.now': 'Now',
    'time.today': 'Today',
    'time.tomorrow': 'Tomorrow',
    'time.thisWeek': 'This Week',
    'time.nextWeek': 'Next Week',
    
    // Forecast
    'forecast.title': 'Surf Forecast',
    'forecast.7day': '7-Day Forecast',
    'forecast.hourly': 'Hourly Forecast',
    'forecast.tides': 'Tides',
    
    // Achievements and points
    'points.earned': 'Points Earned',
    'points.total': 'Total Points',
    'achievement.unlocked': 'Achievement Unlocked',
    'session.logged': 'Session Logged',
    'level.up': 'Level Up!',
    
    // Errors and loading
    'error.loadingFailed': 'Loading failed',
    'loading.surfConditions': 'Loading surf conditions...',
    'loading.forecast': 'Loading forecast...',
    'error.locationDenied': 'Location access denied',
    'error.networkError': 'Network error',
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.spots': 'Spots de Surf',
    'nav.forecast': 'Pronóstico',
    'nav.profile': 'Perfil',
    
    // Surf conditions
    'conditions.waveHeight': 'Altura de Olas',
    'conditions.period': 'Período',
    'conditions.windSpeed': 'Velocidad del Viento',
    'conditions.windDirection': 'Dirección del Viento',
    'conditions.tide': 'Marea',
    'conditions.rating': 'Calificación',
    
    // Wave ratings
    'rating.poor': 'Malo',
    'rating.fair': 'Regular',
    'rating.good': 'Bueno',
    'rating.veryGood': 'Muy Bueno',
    'rating.excellent': 'Excelente',
    
    // Difficulties
    'difficulty.beginner': 'Principiante',
    'difficulty.intermediate': 'Intermedio',
    'difficulty.advanced': 'Avanzado',
    'difficulty.expert': 'Experto',
    
    // Common actions
    'action.viewDetails': 'Ver Detalles',
    'action.getLiveUpdate': 'Actualización en Vivo',
    'action.shareSurfConditions': 'Compartir Condiciones',
    'action.setAlerts': 'Configurar Alertas',
    'action.addToFavorites': 'Agregar a Favoritos',
    
    // Weather
    'weather.sunny': 'Soleado',
    'weather.cloudy': 'Nublado',
    'weather.rainy': 'Lluvioso',
    'weather.stormy': 'Tormentoso',
    'weather.overcast': 'Encapotado',
    
    // Time periods
    'time.now': 'Ahora',
    'time.today': 'Hoy',
    'time.tomorrow': 'Mañana',
    'time.thisWeek': 'Esta Semana',
    'time.nextWeek': 'Próxima Semana',
    
    // Forecast
    'forecast.title': 'Pronóstico de Surf',
    'forecast.7day': 'Pronóstico 7 Días',
    'forecast.hourly': 'Pronóstico por Horas',
    'forecast.tides': 'Mareas',
    
    // Achievements and points
    'points.earned': 'Puntos Ganados',
    'points.total': 'Puntos Totales',
    'achievement.unlocked': 'Logro Desbloqueado',
    'session.logged': 'Sesión Registrada',
    'level.up': '¡Subiste de Nivel!',
    
    // Errors and loading
    'error.loadingFailed': 'Error al cargar',
    'loading.surfConditions': 'Cargando condiciones de surf...',
    'loading.forecast': 'Cargando pronóstico...',
    'error.locationDenied': 'Acceso a ubicación denegado',
    'error.networkError': 'Error de conexión',
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.spots': 'Spots de Surf',
    'nav.forecast': 'Prévisions',
    'nav.profile': 'Profil',
    
    // Surf conditions
    'conditions.waveHeight': 'Hauteur des Vagues',
    'conditions.period': 'Période',
    'conditions.windSpeed': 'Vitesse du Vent',
    'conditions.windDirection': 'Direction du Vent',
    'conditions.tide': 'Marée',
    'conditions.rating': 'Note',
    
    // Wave ratings
    'rating.poor': 'Mauvais',
    'rating.fair': 'Correct',
    'rating.good': 'Bon',
    'rating.veryGood': 'Très Bon',
    'rating.excellent': 'Excellent',
    
    // Difficulties
    'difficulty.beginner': 'Débutant',
    'difficulty.intermediate': 'Intermédiaire',
    'difficulty.advanced': 'Avancé',
    'difficulty.expert': 'Expert',
    
    // Common actions
    'action.viewDetails': 'Voir Détails',
    'action.getLiveUpdate': 'Mise à Jour Live',
    'action.shareSurfConditions': 'Partager Conditions',
    'action.setAlerts': 'Configurer Alertes',
    'action.addToFavorites': 'Ajouter aux Favoris',
    
    // Weather
    'weather.sunny': 'Ensoleillé',
    'weather.cloudy': 'Nuageux',
    'weather.rainy': 'Pluvieux',
    'weather.stormy': 'Orageux',
    'weather.overcast': 'Couvert',
    
    // Time periods
    'time.now': 'Maintenant',
    'time.today': 'Aujourd\'hui',
    'time.tomorrow': 'Demain',
    'time.thisWeek': 'Cette Semaine',
    'time.nextWeek': 'Semaine Prochaine',
    
    // Forecast
    'forecast.title': 'Prévisions Surf',
    'forecast.7day': 'Prévisions 7 Jours',
    'forecast.hourly': 'Prévisions Horaires',
    'forecast.tides': 'Marées',
    
    // Achievements and points
    'points.earned': 'Points Gagnés',
    'points.total': 'Points Totaux',
    'achievement.unlocked': 'Succès Débloqué',
    'session.logged': 'Session Enregistrée',
    'level.up': 'Niveau Supérieur!',
    
    // Errors and loading
    'error.loadingFailed': 'Échec du chargement',
    'loading.surfConditions': 'Chargement des conditions...',
    'loading.forecast': 'Chargement des prévisions...',
    'error.locationDenied': 'Accès à la localisation refusé',
    'error.networkError': 'Erreur réseau',
  },
  
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.spots': 'Picos de Surf',
    'nav.forecast': 'Previsão',
    'nav.profile': 'Perfil',
    
    // Surf conditions
    'conditions.waveHeight': 'Altura das Ondas',
    'conditions.period': 'Período',
    'conditions.windSpeed': 'Velocidade do Vento',
    'conditions.windDirection': 'Direção do Vento',
    'conditions.tide': 'Maré',
    'conditions.rating': 'Avaliação',
    
    // Wave ratings
    'rating.poor': 'Ruim',
    'rating.fair': 'Razoável',
    'rating.good': 'Bom',
    'rating.veryGood': 'Muito Bom',
    'rating.excellent': 'Excelente',
    
    // Difficulties
    'difficulty.beginner': 'Iniciante',
    'difficulty.intermediate': 'Intermediário',
    'difficulty.advanced': 'Avançado',
    'difficulty.expert': 'Expert',
    
    // Common actions
    'action.viewDetails': 'Ver Detalhes',
    'action.getLiveUpdate': 'Atualização ao Vivo',
    'action.shareSurfConditions': 'Compartilhar Condições',
    'action.setAlerts': 'Configurar Alertas',
    'action.addToFavorites': 'Adicionar aos Favoritos',
    
    // Weather
    'weather.sunny': 'Ensolarado',
    'weather.cloudy': 'Nublado',
    'weather.rainy': 'Chuvoso',
    'weather.stormy': 'Tempestuoso',
    'weather.overcast': 'Encoberto',
    
    // Time periods
    'time.now': 'Agora',
    'time.today': 'Hoje',
    'time.tomorrow': 'Amanhã',
    'time.thisWeek': 'Esta Semana',
    'time.nextWeek': 'Próxima Semana',
    
    // Forecast
    'forecast.title': 'Previsão do Surf',
    'forecast.7day': 'Previsão 7 Dias',
    'forecast.hourly': 'Previsão Horária',
    'forecast.tides': 'Marés',
    
    // Achievements and points
    'points.earned': 'Pontos Ganhos',
    'points.total': 'Pontos Totais',
    'achievement.unlocked': 'Conquista Desbloqueada',
    'session.logged': 'Sessão Registrada',
    'level.up': 'Subiu de Nível!',
    
    // Errors and loading
    'error.loadingFailed': 'Falha ao carregar',
    'loading.surfConditions': 'Carregando condições...',
    'loading.forecast': 'Carregando previsão...',
    'error.locationDenied': 'Acesso à localização negado',
    'error.networkError': 'Erro de rede',
  },
  
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.spots': 'Surf-Spots',
    'nav.forecast': 'Vorhersage',
    'nav.profile': 'Profil',
    
    // Surf conditions
    'conditions.waveHeight': 'Wellenhöhe',
    'conditions.period': 'Periode',
    'conditions.windSpeed': 'Windgeschwindigkeit',
    'conditions.windDirection': 'Windrichtung',
    'conditions.tide': 'Gezeiten',
    'conditions.rating': 'Bewertung',
    
    // Wave ratings
    'rating.poor': 'Schlecht',
    'rating.fair': 'Ordentlich',
    'rating.good': 'Gut',
    'rating.veryGood': 'Sehr Gut',
    'rating.excellent': 'Ausgezeichnet',
    
    // Difficulties
    'difficulty.beginner': 'Anfänger',
    'difficulty.intermediate': 'Fortgeschritten',
    'difficulty.advanced': 'Erweitert',
    'difficulty.expert': 'Experte',
    
    // Common actions
    'action.viewDetails': 'Details Anzeigen',
    'action.getLiveUpdate': 'Live-Update',
    'action.shareSurfConditions': 'Bedingungen Teilen',
    'action.setAlerts': 'Benachrichtigungen',
    'action.addToFavorites': 'Zu Favoriten',
    
    // Weather
    'weather.sunny': 'Sonnig',
    'weather.cloudy': 'Bewölkt',
    'weather.rainy': 'Regnerisch',
    'weather.stormy': 'Stürmisch',
    'weather.overcast': 'Bedeckt',
    
    // Time periods
    'time.now': 'Jetzt',
    'time.today': 'Heute',
    'time.tomorrow': 'Morgen',
    'time.thisWeek': 'Diese Woche',
    'time.nextWeek': 'Nächste Woche',
    
    // Forecast
    'forecast.title': 'Surf-Vorhersage',
    'forecast.7day': '7-Tage-Vorhersage',
    'forecast.hourly': 'Stündliche Vorhersage',
    'forecast.tides': 'Gezeiten',
    
    // Achievements and points
    'points.earned': 'Punkte Erhalten',
    'points.total': 'Gesamtpunkte',
    'achievement.unlocked': 'Erfolg Freigeschaltet',
    'session.logged': 'Session Aufgezeichnet',
    'level.up': 'Level Up!',
    
    // Errors and loading
    'error.loadingFailed': 'Laden fehlgeschlagen',
    'loading.surfConditions': 'Lade Surf-Bedingungen...',
    'loading.forecast': 'Lade Vorhersage...',
    'error.locationDenied': 'Standortzugriff verweigert',
    'error.networkError': 'Netzwerkfehler',
  },
  
  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.spots': 'サーフスポット',
    'nav.forecast': '予報',
    'nav.profile': 'プロフィール',
    
    // Surf conditions
    'conditions.waveHeight': '波の高さ',
    'conditions.period': '周期',
    'conditions.windSpeed': '風速',
    'conditions.windDirection': '風向き',
    'conditions.tide': '潮汐',
    'conditions.rating': '評価',
    
    // Wave ratings
    'rating.poor': '悪い',
    'rating.fair': '普通',
    'rating.good': '良い',
    'rating.veryGood': 'とても良い',
    'rating.excellent': '素晴らしい',
    
    // Difficulties
    'difficulty.beginner': '初心者',
    'difficulty.intermediate': '中級者',
    'difficulty.advanced': '上級者',
    'difficulty.expert': 'エキスパート',
    
    // Common actions
    'action.viewDetails': '詳細を見る',
    'action.getLiveUpdate': 'ライブ更新',
    'action.shareSurfConditions': '状況を共有',
    'action.setAlerts': 'アラート設定',
    'action.addToFavorites': 'お気に入りに追加',
    
    // Weather
    'weather.sunny': '晴れ',
    'weather.cloudy': '曇り',
    'weather.rainy': '雨',
    'weather.stormy': '嵐',
    'weather.overcast': '曇天',
    
    // Time periods
    'time.now': '今',
    'time.today': '今日',
    'time.tomorrow': '明日',
    'time.thisWeek': '今週',
    'time.nextWeek': '来週',
    
    // Forecast
    'forecast.title': 'サーフ予報',
    'forecast.7day': '7日間予報',
    'forecast.hourly': '時間別予報',
    'forecast.tides': '潮汐',
    
    // Achievements and points
    'points.earned': '獲得ポイント',
    'points.total': '総ポイント',
    'achievement.unlocked': '実績解除',
    'session.logged': 'セッション記録',
    'level.up': 'レベルアップ！',
    
    // Errors and loading
    'error.loadingFailed': '読み込み失敗',
    'loading.surfConditions': 'サーフ状況を読み込み中...',
    'loading.forecast': '予報を読み込み中...',
    'error.locationDenied': '位置情報アクセス拒否',
    'error.networkError': 'ネットワークエラー',
  },
};

class LanguageService {
  private currentLanguage: Language = 'en';
  private listeners: Array<(language: Language) => void> = [];

  constructor() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('surf-app-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        this.currentLanguage = browserLang;
      }
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language): void {
    if (translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('surf-app-language', language);
      this.notifyListeners();
    }
  }

  translate(key: keyof TranslationKeys, fallback?: string): string {
    const translation = translations[this.currentLanguage][key];
    return translation || fallback || key;
  }

  // Short alias for translate
  t(key: keyof TranslationKeys, fallback?: string): string {
    return this.translate(key, fallback);
  }

  getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    ];
  }

  subscribe(callback: (language: Language) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  // Format numbers according to locale
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const localeMap: Record<Language, string> = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      pt: 'pt-BR',
      de: 'de-DE',
      ja: 'ja-JP',
    };

    return new Intl.NumberFormat(localeMap[this.currentLanguage], options).format(number);
  }

  // Format dates according to locale
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const localeMap: Record<Language, string> = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      pt: 'pt-BR',
      de: 'de-DE',
      ja: 'ja-JP',
    };

    return new Intl.DateTimeFormat(localeMap[this.currentLanguage], options).format(date);
  }

  // Get direction for RTL languages (future expansion)
  getDirection(): 'ltr' | 'rtl' {
    const rtlLanguages: Language[] = []; // Add RTL languages when supported
    return rtlLanguages.includes(this.currentLanguage) ? 'rtl' : 'ltr';
  }
}

export const languageService = new LanguageService();
export type { Language, TranslationKeys };
