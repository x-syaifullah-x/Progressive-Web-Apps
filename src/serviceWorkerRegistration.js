import { requestPermission } from "./requetPermission"
import { urlBase64ToUint8Array } from "./urlBase64ToUint8Array"

const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("./sw.js").then(registration => {
                console.log(`SW registration :  ${registration.scope}`)
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
            }).catch(registrationError => {
                console.log("SW registration failed: ", registrationError)
            })
        })
    } else {
        console.log("Service Worker Is Not Support")
    }
}

export default registerServiceWorker()
