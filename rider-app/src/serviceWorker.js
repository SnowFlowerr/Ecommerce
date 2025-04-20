import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { clients } from 'workbox-core';

/* global ServiceWorkerGlobalScope */
/* eslint-disable no-restricted-globals */
const sw = self;

// Ensure manifest is an array
const manifest = Array.isArray(sw.__WB_MANIFEST) ? sw.__WB_MANIFEST : [];

// Precache static assets
precacheAndRoute(manifest);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Cache static assets
registerRoute(
  ({ request }) => request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Setup background sync when service worker activates
sw.addEventListener('activate', (event) => {
  event.waitUntil(
    sw.registration.then(registration => {
      if ('sync' in registration) {
        const bgSyncPlugin = new BackgroundSyncPlugin('api-queue', {
          maxRetentionTime: 24 * 60, // 24 hours
        });

        registerRoute(
          ({ url }) => url.pathname.startsWith('/api'),
          new NetworkFirst({
            cacheName: 'api-requests',
            plugins: [bgSyncPlugin],
          })
        );
      } else {
        // Fallback: Just use NetworkFirst without background sync
        registerRoute(
          ({ url }) => url.pathname.startsWith('/api'),
          new NetworkFirst({
            cacheName: 'api-requests',
          })
        );
      }
    })
  );
});

// Push notification handling
sw.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Order',
        icon: '/logo192.png'
      }
    ]
  };

  event.waitUntil(
    sw.registration.showNotification('New Delivery Assignment', options)
  );
});

// Notification click handling
sw.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      sw.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (sw.clients.openWindow) {
          return sw.clients.openWindow('/orders');
        }
      })
    );
  }
});

// Service worker registration
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
};

const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
};

export { registerServiceWorker, unregisterServiceWorker }; 