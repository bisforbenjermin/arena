// Custom Service Worker additions — merged into the next-pwa generated SW.
// R1 calls navigator.serviceWorker.controller.postMessage({ type: 'CACHE_GAME_BUNDLE', url })
// to warm a game bundle before a round starts. Cached under arena-game-bundles-v1.

declare const self: ServiceWorkerGlobalScope;

const GAME_BUNDLE_CACHE = 'arena-game-bundles-v1';

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_GAME_BUNDLE') return;
  const { url } = event.data as { type: string; url: string };
  event.waitUntil(
    caches.open(GAME_BUNDLE_CACHE).then((cache) => cache.add(url)),
  );
});
