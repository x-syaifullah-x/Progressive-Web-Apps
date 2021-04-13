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
    endpoint: "https://fcm.googleapis.com/fcm/send/cDPYD_ja9l0:APA91bFpcMW-NTvN2nOg1Tq4RMZf12_B1WegHfYTziw6qAFsUxrj7KuhAEZFN3Yf_fENVAupzO29E8qJc-5sc8u1f1kgw5R0_NuyestnTAtSXjLwPCTbi9sVasBPJ_N6EvqvKqKcuVYL",
    keys: {
        p256dh: "BIXTJ/LHQYmYRs/YWG7Xwo3dKnDXUzztBrVFtY9+9UnqRkmH90aNshvd43OEKauxGmMUt5/OvJd8+SyoYOkPNS0=",
        auth: "DbjSm7f/L12bvOLy/dWDJA=="
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
