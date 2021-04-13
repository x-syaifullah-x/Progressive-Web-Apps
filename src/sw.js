import iconApp from "src/assets/app_logo.png"
import badgeNotification from "src/assets/badge_notification.webp"
import { BASE_URL_FOOTBALL_API } from "./data/api/FootballApi"

import * as precaching from "workbox-precaching"
import { registerRoute } from "workbox-routing"
import * as strategies from "workbox-strategies"
import { ExpirationPlugin } from "workbox-expiration"

precaching.precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
    ({ url, request, event }) => {
        if (event.request.url.indexOf(BASE_URL_FOOTBALL_API) > -1 || event.request.url.indexOf("https://upload.wikimedia.org") > -1) {
            return url.pathname
        } else {
            event.respondWith(
                caches.match(event.request, { ignoreSearch: true }).then(response => {
                    return response || fetch(event.request)
                })
            )
        }
    },
    new strategies.NetworkFirst({
        cacheName: "FOOTBALL_API",
        networkTimeoutSeconds: 2,
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60
                // maxEntries: 100
            })
        ]
    })
)

self.addEventListener("push", (event) => {
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
