const CACHE_NAME = 'digital-books-v1';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'about.html',
  'style.css',
  'manifest.json'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Кэшируем ресурсы');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Автоматически активируем SW без ожидания закрытия вкладок
      .catch((err) => console.error('SW: Ошибка при установке кэша:', err))
  );
});

// Активация и удаление старых версий кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: Удаляем старый кэш', key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim()) // Позволяет SW сразу управлять текущими вкладками
  );
});

// Перехват запросов и отдача файлов из кэша в офлайне
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Возвращаем файл из кэша, если он там есть, иначе делаем запрос в сеть
      return cachedResponse || fetch(event.request);
    })
  );
});
