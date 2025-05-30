
const CACHE_NAME = 'wave-ai-tracker-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'surf-conditions-sync') {
    event.waitUntil(syncSurfConditions());
  }
});

// Push notification handler
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/placeholder.svg',
      badge: '/placeholder.svg',
      data: data.data,
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

async function syncSurfConditions() {
  try {
    // Fetch latest surf conditions and check alert preferences
    const preferences = await getStoredPreferences();
    if (!preferences || !preferences.enabled) {
      return;
    }

    // Mock check - in real implementation, this would fetch from APIs
    const mockConditions = {
      spot: 'Pipeline',
      waveHeight: 6,
      windSpeed: 10,
      rating: 4,
      conditions: 'Epic'
    };

    // Check if conditions meet alert criteria
    if (shouldTriggerAlert(mockConditions, preferences)) {
      await self.registration.showNotification(
        `🏄‍♂️ Great surf at ${mockConditions.spot}!`,
        {
          body: `${mockConditions.waveHeight}ft waves, ${mockConditions.windSpeed}mph wind, ${mockConditions.rating}/5 rating`,
          icon: '/placeholder.svg',
          badge: '/placeholder.svg',
          tag: `surf-alert-${mockConditions.spot}`,
          data: { spot: mockConditions.spot, conditions: mockConditions }
        }
      );
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getStoredPreferences() {
  // In a real implementation, this would use IndexedDB or similar
  return {
    enabled: true,
    waveHeightMin: 3,
    waveHeightMax: 15,
    windSpeedMax: 20,
    ratingMin: 3,
    spots: ['Pipeline', 'Mavericks']
  };
}

function shouldTriggerAlert(conditions, preferences) {
  return (
    conditions.waveHeight >= preferences.waveHeightMin &&
    conditions.waveHeight <= preferences.waveHeightMax &&
    conditions.windSpeed <= preferences.windSpeedMax &&
    conditions.rating >= preferences.ratingMin &&
    preferences.spots.includes(conditions.spot)
  );
}
