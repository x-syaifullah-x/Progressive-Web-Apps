export default class BaseCustomHtml extends HTMLElement {
    set data(data) {
        this._data = data
    }

    get data() {
        return this._data
    }

    getTemplate(html, style) {
        const template = document.createElement("template")
        const css = style === "" || style === undefined ? "" : `<style>${style}</style>`
        template.innerHTML = `${css} ${html}`
        return template
    }

    setAttributes(element, attribute) {
        Object.entries(attribute).forEach(args =>
            element.setAttribute(...args)
        )
    }

    imageError(icon) {
        this.querySelectorAll("img").forEach((img) => {
            img.onerror = () => {
                img.setAttribute("src", icon)
            }
        })
    }
}
