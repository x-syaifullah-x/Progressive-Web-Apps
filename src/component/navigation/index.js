import BaseCustomHtml from "../BaseCustomHtml"
import html from "src/component/navigation/template.html"
import logo from "src/assets/logo_UEFA_champions.webp"
import M from "materialize-css"
import FootballApi, { BASE_URL } from "src/data/api/FootballApi"

customElements.define("nav-navigation", class Navigation extends BaseCustomHtml {
    constructor() {
        super()
        caches.match(`${BASE_URL}/v2/competitions/2001/standings`).then((response) => {
            if (response === undefined) new FootballApi().getData(FootballApi.URL_STANDINGS()).then()
        })
        caches.match(`${BASE_URL}/v2/competitions/2001/teams`).then((response) => {
            if (response === undefined) new FootballApi().getData(FootballApi.URL_TEAMS()).then()
        })
    }

    connectedCallback() {
        const template = this.getTemplate(html, "")
        template.content.querySelectorAll(".img-logo").forEach((element) => {
            element.setAttribute("src", logo)
        })
        this.appendChild(template.content.cloneNode(true))
        this.instancesSideNav = M.Sidenav.init(this.querySelector(".sidenav"))
        M.Parallax.init(this.querySelectorAll(".parallax"))
    }

    get sideNav() {
        return this.instancesSideNav
    }
})
