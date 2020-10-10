import iconApp from "src/assets/app_logo.png"
import badgeNotification from "src/assets/badge_notification.webp"
import { BASE_URL } from "./data/api/FootballApi"

const CACHE_NAME = "FootballApi-v1"
const urlsToCache = ["/", ...global.serviceWorkerOption.assets]

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache)
            })
    )
})

self.addEventListener("activate", (event) => {
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

self.addEventListener("fetch", (event) => {
    if (event.request.url.indexOf(BASE_URL) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return fetch(event.request).then(response => {
                    cache.put(event.request.url, response.clone())
                    return response
                })
            })
        )
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(response => {
                return response || fetch(event.request)
            })
        )
    }
})

self.addEventListener("push", function (event) {
    let body
    if (event.data) {
        body = event.data.text()
    } else {
        body = "Push message no payload"
    }
    const options = {
        badge: badgeNotification,
        body: body,
        icon: iconApp,
        vibrate: [100, 50, 100],
        requireInteraction: true,
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    }
    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    )
})
