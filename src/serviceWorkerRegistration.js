import runtime from "serviceworker-webpack-plugin/lib/runtime"
import { requestPermission } from "./requetPermission"
import { urlBase64ToUint8Array } from "./urlBase64ToUint8Array"

const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
        const registration = runtime.register()
        registration.then(registration => {
            console.log(`ServiceWorker: Registration Success ${registration.scope}`)
            requestPermission().then(isRequest => {
                if (isRequest) {
                    if (("PushManager" in window)) {
                        const publicKey = "BP7_iAxMcv0E9AYK-zIBx12UIteLU9lmFC1RjBw1uOv5yAEyZPA4udURQeBtx9Ty-AYtM7UHLYzawVT7VUmcbS0"
                        navigator.serviceWorker.getRegistration().then(registration => {
                            registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array(publicKey)
                            }).then(subscribe => {
                                console.log("endpoint: ", subscribe.endpoint)
                                console.log("p256dh key: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("p256dh")))))
                                console.log("auth key: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("auth")))))
                            }).catch(e => {
                                location.reload()
                            })
                        })
                    }
                }
            })
        }).catch(error => {
            console.error(`ServiceWorker: Registration failed ${error}`)
        })
    } else {
        console.log("Service Worker Is Not Support")
    }
}

export default registerServiceWorker()
