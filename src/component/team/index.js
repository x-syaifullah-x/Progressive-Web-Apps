import BaseCustomHtml from "../BaseCustomHtml"
import itemHtml from "src/component/team/item.html"
import noImage from "src/assets/no_image.webp"
import IdbFavorite, { STORE_NAME_TEAMS } from "src/data/db/IdbFavorite"
import index from "./index.html"

customElements.define("table-teams", class Navigation extends BaseCustomHtml {
    connectedCallback() {
        this.idbTeams = new IdbFavorite(STORE_NAME_TEAMS)
        this.idbTeams.readData().then(idbData => {
            return idbData
        }).then(idbData => {
            this.render(idbData)
        })
    }

    render(idbData) {
        this.innerHTML = this.getTemplate(index).innerHTML
        this._data.teams.forEach((team) => {
            const template = this.getTemplate(itemHtml, "")
            const templateSelector = (selector) => template.content.querySelector(selector)
            templateSelector("a").setAttribute("href", `./team-info.html?id=${team.id}`)
            templateSelector(".team-icon").setAttribute("src", team.crestUrl && team.crestUrl.replace(/^http:\/\//i, "https://"))
            templateSelector(".team-name").textContent = team.shortName
            templateSelector(".add-remove").setAttribute("id", team.id)
            idbData.forEach(value => {
                if (value.id === team.id) {
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
        if (btn.children[0].textContent === "favorite") { /* remove data favorite */
            this.idbTeams.readData(parseInt(btn.id)).then(data => {
                if (confirm(`do you want to delete team ${data.shortName} from favorite`)) {
                    this.idbTeams.deleteData(data.id).then(() => {
                        btn.children[0].textContent = "add"
                        alert(`${data.shortName} success removed from favorite`)
                    }).catch(() => alert(`${data.shortName} failed added to favorite`))
                }
            })
        } else { /* add data favorite */
            const teamName = btn.parentElement.parentElement.querySelector(".team-name").textContent
            if (confirm(`do you want to add team ${teamName} to favorite`)) {
                this.idbTeams.createData(parseInt(btn.id)).then(id => {
                    if (id !== -1) {
                        btn.children[0].textContent = "favorite"
                        alert(`${teamName} success added to favorite`)
                    } else {
                        alert(`${teamName} failed added to favorite`)
                    }
                })
            }
        }
    }
})
