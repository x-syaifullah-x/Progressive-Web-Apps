import BaseCustomHtml from "../BaseCustomHtml"
import itemHtml from "src/component/team/item.html"
import noImage from "src/assets/no_image.webp"
import index from "./index.html"
import preloaderHtml from "./preloader.html"

customElements.define("table-teams", class Navigation extends BaseCustomHtml {
    connectedCallback() {
        this.innerHTML = this.getTemplate(index).innerHTML
        this._data.teams.forEach((team) => {
            const template = this.getTemplate(itemHtml, "")
            const templateSelector = (selector) => template.content.querySelector(selector)
            templateSelector("a").setAttribute("href", `./team-info.html?id=${team.id}`)
            templateSelector(".team-icon").setAttribute("src", team.crestUrl && team.crestUrl.replace(/^http:\/\//i, "https://"))
            templateSelector(".team-name").textContent = team.shortName
            templateSelector(".add-remove").setAttribute("id", team.id)
            this.dataDb.forEach(dataDbTeam => {
                if (dataDbTeam.id === team.id) {
                    templateSelector(".material-icons").textContent = "favorite"
                }
            })
            this.querySelector(".row").appendChild(template.content.cloneNode(true))
        })

        this.imageError(noImage)

        this.querySelectorAll(".add-remove").forEach((btn) => {
            btn.addEventListener("click", ev => {
                this.addRemove(btn)
            })
        })
    }

    addRemove(btn) {
        const preloader = this.getTemplate(preloaderHtml, "")
        const teamName = btn.parentElement.parentElement.querySelector(".team-name").textContent
        switch (btn.children[0].textContent) {
            case "favorite":
                btn.children[0].innerHTML = preloader.innerHTML
                this.eventAddRemove("remove", btn.id, teamName).then(isSuccess => {
                    btn.children[0].textContent = isSuccess ? "add" : "favorite"
                })
                break
            case "add":
                btn.children[0].innerHTML = preloader.innerHTML
                this.eventAddRemove("add", btn.id, teamName).then(isSuccess => {
                    btn.children[0].textContent = isSuccess ? "favorite" : "add"
                })
        }
    }

    set eventAddRemove(eventAddRemove) {
        this._eventAddRemove = eventAddRemove
    }

    get eventAddRemove() {
        return this._eventAddRemove
    }

    set dataDb(dataDb) {
        this._dataDb = dataDb
    }

    get dataDb() {
        return this._dataDb
    }
})
