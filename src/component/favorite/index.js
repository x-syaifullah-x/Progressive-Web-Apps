import BaseCustomHtml from "../BaseCustomHtml"
import itemHtml from "./item.html"
import noImage from "src/assets/no_image.webp"
import noDataImage from "src/assets/no_data_found.webp"
import { DATA_IDB, logError } from "src/main"
import noData from "./no_data.html"

customElements.define("my-favorite", class Favorite extends BaseCustomHtml {
    connectedCallback() {
        this.data.readData().then(data => {
            data.length > 0 ? this.loadData(data) : this.dataEmpty()
        }).catch(error => logError(error))
    }

    loadData(data) {
        this.innerHTML = "<div class='container'><h3 class='center'>My Favorite</h3></div>"
        const templateFavoriteItem = this.getTemplate(itemHtml, "")
        const selectorFavoriteItem = (selector) => templateFavoriteItem.content.querySelector(selector)
        data.forEach(team => {
            this.setAttributes(selectorFavoriteItem(".team-favorite-icon"), {
                src: (team.crestUrl && team.crestUrl.replace(/^http:\/\//i, "https://")) || "#",
                alt: team.name
            })
            this.setAttributes(selectorFavoriteItem(".card-content"), {
                href: `./team-info.html?id=${team.id}&data=${DATA_IDB}`
            })
            templateFavoriteItem.content.querySelector(".card").setAttribute("id", team.id)
            selectorFavoriteItem(".team-favorite-name").textContent = team.name
            this.querySelector(".container").appendChild(templateFavoriteItem.content.cloneNode(true))
        })

        this.imageError(noImage)
        this.btnEvent(this.querySelectorAll(".card-action .btn"))
    }

    btnEvent(selector) {
        selector.forEach((element) => {
            element.addEventListener("click", () => {
                const idItem = parseInt(element.parentElement.parentElement.getAttribute("id"))
                const teamName = element.parentElement.parentElement.querySelector(".team-favorite-name").textContent
                if (element.textContent === "update") {
                    this.eventUpdateRemove("update", idItem, teamName).then(isSuccess => {
                        if (isSuccess) {
                            this.connectedCallback()
                        }
                    })
                } else if (element.textContent === "delete") {
                    this.eventUpdateRemove("delete", idItem, teamName).then(isSuccess => {
                        if (isSuccess) {
                            this.connectedCallback()
                        }
                    })
                }
            })
        })
    }

    dataEmpty() {
        this.innerHTML = ""
        const templateNoData = this.getTemplate(noData, "")
        templateNoData.content.querySelector("img").setAttribute("src", noDataImage)
        this.appendChild(templateNoData.content.cloneNode(true))
    }

    set eventUpdateRemove(eventBtn) {
        this._eventBtn = eventBtn
    }

    get eventUpdateRemove() {
        return this._eventBtn
    }
})
