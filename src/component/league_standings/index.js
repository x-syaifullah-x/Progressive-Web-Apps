import BaseCustomHtml from "src/component/BaseCustomHtml"
import indexHtml from "./index.html"
import templateTableHtml from "./template_table.html"
import templateTbodyHtml from "./template_tbody.html"
import "./style.css"

customElements.define("league-standings", class LeagueStandings extends BaseCustomHtml {
    connectedCallback() {
        this.innerHTML = this.getTemplate(indexHtml).innerHTML
        this._data.standings.forEach((standings) => {
            const templateTable = this.getTemplate(templateTableHtml, "")
            templateTable.content.querySelector(".group-name").textContent = standings.group.replace(/_/g, " ")
            if (standings.type === (this.getAttribute("type") || "total").toUpperCase()) {
                standings.table.forEach(dataTable => {
                    templateTable.content.querySelector("table tbody").appendChild(
                        this.insertDataTable(dataTable).content.cloneNode(true)
                    )
                })
                this.querySelector(".row").appendChild(templateTable.content.cloneNode(true))
                this.querySelectorAll(".homeTotalAway").forEach((btn) => this.eventHomeTotalAway(btn))
            }
        })
    }

    insertDataTable(data) {
        const templateTbody = this.getTemplate(templateTbodyHtml, "")
        const tableDataSelector = (selector) => templateTbody.content.querySelector(selector)
        tableDataSelector(".team_name").setAttribute("href", `./team-info.html?id=${data.team.id}`)
        tableDataSelector(".team_name").textContent = data.team.name
        tableDataSelector(".playedGames").textContent = data.playedGames
        tableDataSelector(".won").textContent = data.won
        tableDataSelector(".draw").textContent = data.draw
        tableDataSelector(".lost").textContent = data.lost
        tableDataSelector(".goalsFor").textContent = data.goalsFor
        tableDataSelector(".goalsAgainst").textContent = data.goalsAgainst
        tableDataSelector(".goalDifference").textContent = data.goalDifference
        tableDataSelector(".points").textContent = data.points
        return templateTbody
    }

    eventHomeTotalAway(element) {
        element.addEventListener("click", ev => {
            const rootElementBtn = element.parentElement.parentElement.parentElement
            const groupTable = rootElementBtn.querySelector(".group-name").textContent.replace(/\s/, "_")
            const type = element.getAttribute("type")
            this._data.standings.forEach(standings => {
                if (standings.group === groupTable && standings.type === type) {
                    const tableTbody = rootElementBtn.querySelector("table tbody")
                    tableTbody.innerHTML = ""
                    standings.table.forEach(dataTable => tableTbody.appendChild(this.insertDataTable(dataTable).content.cloneNode(true)))
                }
            })
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== null) {
            if (oldValue !== newValue) {
                this[name] = newValue
                this.connectedCallback()
            }
        }
    }

    static get observedAttributes() {
        return ["type"]
    }
})
