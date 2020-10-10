const webPush = require("web-push")

const vapidKeys = {
    publicKey: "BP7_iAxMcv0E9AYK-zIBx12UIteLU9lmFC1RjBw1uOv5yAEyZPA4udURQeBtx9Ty-AYtM7UHLYzawVT7VUmcbS0",
    privateKey: "j4EOAnkpBoMWDKaQBvCy7divIxreUhnyOdhPVioJRdo"
}

webPush.setVapidDetails(
    "mailto:example@yourdomain.org",
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
const pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/dTKHDwjbxSs:APA91bF87_JL0dietzHgyAJ7H-sRPx9XbmypBa8QHB207Gu0AIoZE6aW6qXvjYF72SfzEhTzIz2maQiL_KM0ztFl25EjJJouLSQZ_ROjF1tAgV5N6RrgbpphHslv9bCnJsSQoS4rCOwh",
    keys: {
        p256dh: "BIEmpmV0YX/fIOh9c1BrV7tRHhTQ1Eh4Igus8u6y0SHukr8Q0gx0gjC0lx/ffoV5gs4XC/AsiDb1vvo8dOPAHgs=",
        auth: "4twoyUgG5wlJzpbdjRO73A=="
    }
}
const payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!"

const options = {
    gcmAPIKey: "908740532940",
    TTL: 60
}
webPush.sendNotification(
    pushSubscription,
    payload,
    options
)
