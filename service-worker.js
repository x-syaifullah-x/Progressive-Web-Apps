const CACHE_NAME = new Date().toISOString()
let urlsToCache = [
    '/',
    '/manifest.json',
    '/index.html',
    '/nav.html',

    '/pages/account.html',
    '/pages/contact.html',
    '/pages/inbox.html',
    '/pages/send.html',
    '/pages/spam.html',

    '/css/materialize.min.css',
    '/css/materialize-icon.css',

    '/assets/font_materialize.woff2',
    '/assets/account_photo_profile.png',
    'assets/nav_photo_profile.png',
    '/assets/no_send.png',
    '/assets/no_spam.png',
    '/assets/favicon_32x32.png',
    '/assets/icon_512.png',
    '/assets/icon_256.png',

    '/js/materialize.min.js',
    '/js/script.js',
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache)
            })
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log(`ServiceWorker: cache ${cacheName} removed`)
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request, {cacheName: CACHE_NAME})
            .then((response) => {
                if (response) {
                    console.log(`ServiceWorker: use assets from cache: ${response.url}`)
                    return response
                }
                console.log(`ServiceWorker: loading assets from server: ${event.request.url}`)
                return fetch(event.request)
            })
    )
})
