import indexHtml from "./index.html"
import squadHtml from "./squad.html"
import matchesHtml from "./matches.html"
import scheduleHtml from "./schedule.html"
import preloaderHtml from "./preloader.html"
import activeCompetitionsHtml from "./activeCompetitions.html"
import M from "materialize-css"
import BaseCustomHtml from "../BaseCustomHtml"
import noImage from "src/assets/no_image.webp"
import { DATA_IDB } from "src/main"
import FootballApi, { COMPETITION } from "src/data/api/FootballApi"
import "./style.css"
import IdbFavorite, {
    INDEX_NAME_MATCHES_FINISHED, INDEX_NAME_MATCHES_SCHEDULED,
    STORE_NAME_MATCHES_FINISHED,
    STORE_NAME_MATCHES_SCHEDULED,
    STORE_NAME_TEAMS
} from "src/data/db/IdbFavorite"

customElements.define("team-info", class TeamInfo extends BaseCustomHtml {
    constructor() {
        super()
        this.footballApi = new FootballApi()
        this.templateIndex = this.getTemplate(indexHtml, "")
        this.templateSquad = this.getTemplate(squadHtml, "")
        this.templateMatchs = this.getTemplate(matchesHtml, "")
        this.templateSchedule = this.getTemplate(scheduleHtml, "")
        this.templateActiveCompetition = this.getTemplate(activeCompetitionsHtml, "")
        this.idbTeams = new IdbFavorite(STORE_NAME_TEAMS)
        this.idbMatchesScheduled = new IdbFavorite(STORE_NAME_MATCHES_SCHEDULED)
        this.idbMatchesFinished = new IdbFavorite(STORE_NAME_MATCHES_FINISHED)
        this.data_form = this.getAttribute("data_from")
    }

    connectedCallback() {
        this.dataTeam = this.data
        this.render()
    }

    render() {
        if (this.innerHTML !== "") this.innerHTML = ""
        this.templateIndexSelector(".name-team").textContent = this.dataTeam.name
        this.templateIndexSelector(".shortName-team").textContent = this.dataTeam.shortName
        this.templateIndexSelector(".venue-team").textContent = this.dataTeam.venue
        this.templateIndexSelector(".address-team").textContent = this.dataTeam.address
        this.templateIndexSelector(".founded-team").textContent = this.dataTeam.founded
        this.templateIndexSelector(".team-info-icon").setAttribute("src", this.dataTeam.crestUrl.replace(/^http:\/\//i, "https://"))
        this.dataTeam.squad.forEach((squad) => this.player(squad))

        this.dataTeam.activeCompetitions.forEach(activeCompetitions => this.activeCompetition(activeCompetitions))

        if (this.data_form === DATA_IDB) {
            this.idbMatchesFinished.readDataWithKeyPath(this.dataTeam.id, INDEX_NAME_MATCHES_FINISHED).then(dataMatchesFinished => {
                this.match(dataMatchesFinished)
            })

            this.idbMatchesScheduled.readDataWithKeyPath(this.dataTeam.id, INDEX_NAME_MATCHES_SCHEDULED).then(dataMatchesScheduled => {
                this.scheduled(dataMatchesScheduled)
            })
        } else {
            this.footballApi.getData(FootballApi.URL_TEAM_MATCHES(this.dataTeam.id, "FINISHED")).then(dataMatchesFinished => {
                this.dataMatchesFinished = dataMatchesFinished
                this.match(this.dataMatchesFinished)
            })

            this.footballApi.getData(FootballApi.URL_TEAM_MATCHES(this.dataTeam.id, "SCHEDULED")).then(dataMatchesScheduled => {
                this.dataMatchesScheduled = dataMatchesScheduled
                this.scheduled(this.dataMatchesScheduled)
            })
        }

        this.idbTeams.readData(this.dataTeam.id).then(data => {
            if (data !== undefined) this.templateIndexSelector(".btnFloatingAddRemove .material-icons").textContent = "delete"
            this.appendChild(this.templateIndex.content.cloneNode(true))

            const teamName = this.querySelector(".name-team").textContent
            const btnFloating = this.querySelector(".btnFloatingAddRemove .material-icons")
            btnFloating.addEventListener("click", ev => {
                const preloader = this.getTemplate(preloaderHtml, "")
                switch (btnFloating.textContent) {
                    case "delete":
                        btnFloating.innerHTML = preloader.innerHTML
                        this.eventAddRemove("remove", this.dataTeam.id, teamName).then(isSuccess => {
                            if (isSuccess) {
                                if (this.data_form === DATA_IDB) {
                                    btnFloating.textContent = "add"
                                    window.location = "/#MyFavorite"
                                } else {
                                    btnFloating.textContent = "add"
                                }
                            } else {
                                btnFloating.textContent = "delete"
                            }
                        })
                        break
                    case "add":
                        btnFloating.innerHTML = preloader.innerHTML
                        this.eventAddRemove("add", this.dataTeam.id, teamName).then(isSuccess => {
                            btnFloating.innerHTML = isSuccess ? "delete" : "add"
                        })
                }
            })

            const activeCompetitions = this.querySelector(".activeCompetitions .row")
            const activeCompetitionsColl = this.querySelectorAll(".activeCompetitions .col")
            if ((activeCompetitionsColl.length % 3) === 1) {
                activeCompetitions.lastElementChild.classList.add("m12")
            } else if ((activeCompetitionsColl.length % 3) === 2) {
                activeCompetitions.children[activeCompetitions.children.length - 1].classList.add("m6")
                activeCompetitions.children[activeCompetitions.children.length - 2].classList.add("m6")
            }

            this.imageError(noImage)

            M.Collapsible.init(this.querySelectorAll(".collapsible"))
        })
    }

    insertDataSquad(squad) {
        const templateSquadSelector = (selector) => this.templateSquad.content.querySelector(selector)
        templateSquadSelector(".name").textContent = squad.name
        templateSquadSelector(".dateOfBirth").textContent = this.dateFormat(squad.dateOfBirth)
        templateSquadSelector(".countryOfBirth").textContent = squad.countryOfBirth
        templateSquadSelector(".nationality").textContent = squad.nationality
        templateSquadSelector(".shirtNumber").textContent = squad.shirtNumber || "-"
    }

    templateIndexSelector(selector) {
        return this.templateIndex.content.querySelector(selector)
    }

    dateFormat(date) {
        return new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    player(squad) {
        switch (squad.position) {
            case "Goalkeeper":
                this.insertDataSquad(squad)
                this.templateIndexSelector(".positionGoalkeeper").appendChild(this.templateSquad.content.cloneNode(true))
                break
            case "Defender":
                this.insertDataSquad(squad)
                this.templateIndexSelector(".positionDefender").appendChild(this.templateSquad.content.cloneNode(true))
                break
            case "Midfielder":
                this.insertDataSquad(squad)
                this.templateIndexSelector(".positionMidfielder").appendChild(this.templateSquad.content.cloneNode(true))
                break
            case "Attacker":
                this.insertDataSquad(squad)
                this.templateIndexSelector(".positionAttacker").appendChild(this.templateSquad.content.cloneNode(true))
                break
            default:
                this.coach(squad)
        }
    }

    coach(squad) {
        if (squad.role === "COACH") {
            this.insertDataSquad(squad)
            this.templateIndexSelector(".COACH").appendChild(this.templateSquad.content.cloneNode(true))
        }
    }

    activeCompetition(activeCompetitions) {
        const templateActiveCompetitionSelector = (selector) => this.templateActiveCompetition.content.querySelector(selector)
        templateActiveCompetitionSelector(".area").textContent = activeCompetitions.area.name
        templateActiveCompetitionSelector(".name").textContent = activeCompetitions.name
        this.templateIndexSelector(".activeCompetitions .row").appendChild(this.templateActiveCompetition.content.cloneNode(true))
    }

    match(dataMatches) {
        this.querySelector(".matches").innerHTML = ""
        const templateMatchesSelector = (selector) => this.templateMatchs.content.querySelector(selector)
        dataMatches.matches.forEach(data => {
            if (data.competition.id === COMPETITION.UEFA_CHAMPIONS_LEAGUE) {
                templateMatchesSelector(".teamHome").textContent = data.homeTeam.name
                templateMatchesSelector(".teamAway").textContent = data.awayTeam.name
                templateMatchesSelector(".scoreHome").textContent = data.score.fullTime.homeTeam
                templateMatchesSelector(".scoreAway").textContent = data.score.fullTime.awayTeam
                this.querySelector(".matches").appendChild(this.templateMatchs.content.cloneNode(true))
            }
        })

        if (this.querySelector(".matches").innerHTML === "") {
            this.querySelector(".matches").appendChild(this.templateMatchs.content.cloneNode(true))
        }
    }

    scheduled(dataScheduled) {
        this.querySelector(".scheduled").innerHTML = ""
        const templateScheduledSelector = (selector) => this.templateSchedule.content.querySelector(selector)
        dataScheduled.matches.forEach(data => {
            if (data.competition.id === COMPETITION.UEFA_CHAMPIONS_LEAGUE) {
                templateScheduledSelector(".matchDay").textContent = `Match Day ${data.matchday}`
                templateScheduledSelector(".date").textContent = this.dateFormat(data.utcDate)
                templateScheduledSelector(".teamHome").textContent = data.homeTeam.name
                templateScheduledSelector(".teamAway").textContent = data.awayTeam.name
                this.querySelector(".scheduled").appendChild(this.templateSchedule.content.cloneNode(true))
            }
        })

        if (this.querySelector(".scheduled").innerHTML === "") {
            this.querySelector(".scheduled").appendChild(this.templateSchedule.content.cloneNode(true))
        }
    }

    set eventAddRemove(eventAddRemove) {
        this._eventAddRemove = eventAddRemove
    }

    get eventAddRemove() {
        return this._eventAddRemove
    }
})
