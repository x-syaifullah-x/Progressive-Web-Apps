export const requestPermission = () => {
    if ("Notification" in window) {
        return Notification.requestPermission().then((result) => {
            if (result === "denied") {
                console.warn("notifications not allowed")
                return false
            } else if (result === "default") {
                console.warn("the user closes the permission request dialog box")
                return false
            } else if (result === "granted") {
                return true
            }
        })
    } else {
        return Promise.reject(new Error("the browser does not support notifications"))
    }
}
