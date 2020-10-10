import index from "./index.html"
import BaseCustomHtml from "../BaseCustomHtml"
import templateTableHtml from "src/component/standings/template_table.html"
import templateTbodyHtml from "./template_tbody.html"
import "./style.css"

customElements.define("standings-group", class Standings extends BaseCustomHtml {
    connectedCallback() {
        this.index = this.getTemplate(index).innerHTML
        this.render()
    }

    render() {
        this.innerHTML = this.index
        this._data.standings.forEach((standings) => {
            const templateTable = this.getTemplate(templateTableHtml, "")
            templateTable.content.querySelector(".group-name").textContent = standings.group.replace("_", " ")
            if (standings.type === (this.getAttribute("type") || "total").toUpperCase()) {
                standings.table.forEach(dataTable => {
                    templateTable.content.querySelector("table tbody").appendChild(
                        this.insertDataTable(dataTable).content.cloneNode(true)
                    )
                })
                this.querySelector(".row").appendChild(templateTable.content.cloneNode(true))
            }
        })

        this.querySelectorAll(".btn").forEach((btn) => {
            btn.addEventListener("click", ev => {
                const rootElementBtn = btn.parentElement.parentElement.parentElement.parentElement
                const groupTable = rootElementBtn.querySelector(".group-name").textContent.replace(" ", "_")
                const type = btn.getAttribute("type")
                this._data.standings.forEach(standings => {
                    if (standings.group === groupTable) {
                        if (standings.type === type) {
                            const tableTbody = rootElementBtn.querySelector("table tbody")
                            tableTbody.innerHTML = ""
                            standings.table.forEach(dataTable => {
                                tableTbody.appendChild(this.insertDataTable(dataTable).content.cloneNode(true))
                            })
                        }
                    }
                })
            })
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

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== null) {
            if (oldValue !== newValue) {
                this[name] = newValue
                this.render()
            }
        }
    }

    static get observedAttributes() {
        return ["type"]
    }
})
