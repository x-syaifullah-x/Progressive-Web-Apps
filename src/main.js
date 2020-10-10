import _standings from "src/static/league-standings.html"
import _favorite from "src/static/favorite-teams.html"
import _team from "src/static/all-team.html"
import logo from "src/assets/logo_UEFA_champions.webp"
import IdbFavorite, { STORE_NAME_TEAMS } from "./data/db/IdbFavorite"
import FootballApi from "./data/api/FootballApi"

export const DATA_IDB = "idb"
const URL_HOME = "/"
const NAVIGATION = {
    "#LeagueStandings": _standings,
    "#AllTeams": _team,
    "#MyFavorite": _favorite
}

export const logError = (error) => {
    console.log(error)
}
const getData = (url, element, action) => {
    footballApi.getDataCache(url).then(data => {
        element.data = data
        if (element.data != null) action()
    }).catch(error => logError(error))
    footballApi.getData(url).then(data => {
        element.data = data
        if (element.data != null) action()
    }).catch(error => logError(error))
}
const loadPages = (page) => {
    const xmlHttpRequest = new XMLHttpRequest()
    xmlHttpRequest.open("GET", NAVIGATION[page], true)
    xmlHttpRequest.send()
    xmlHttpRequest.onreadystatechange = () => {
        if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
            $(".content").html(xmlHttpRequest.responseText)
            switch (NAVIGATION[page]) {
                case NAVIGATION["#LeagueStandings"]:
                    getData(FootballApi.URL_STANDINGS(), tableStandings, (_) => {
                        $(".standings").append($(tableStandings).attr("type", "total"))
                    })
                    break
                case NAVIGATION["#AllTeams"]:
                    getData(FootballApi.URL_TEAMS(), team, _ => {
                        $(".team").append(team)
                    })
                    break
                case NAVIGATION["#MyFavorite"]:
                    teamFavorite.data = idbFavorite
                    $(".my-favorite").append(teamFavorite)
                    break
                default:
                    console.log("not found")
            }
        }
    }
}
const footballApi = new FootballApi()
const idbFavorite = new IdbFavorite(STORE_NAME_TEAMS)
const navNavigation = document.createElement("nav-navigation")
const tableStandings = document.createElement("standings-group")
const team = document.createElement("table-teams")
const teamInfo = document.createElement("team-info")
const teamFavorite = document.createElement("my-favorite")

export default function main() {
    $("img.banner").attr({ src: logo })
    $(".parallax").parallax()

    const urlParameterId = parseInt(new URLSearchParams(window.location.search).get("id"))
    const urlParameterData = new URLSearchParams(window.location.search).get("data")
    if (location.pathname === URL_HOME || location.pathname === "/index.html") {
        $(".navigation").append(navNavigation)
        $(".navigation .nav-page").map((index, element) => {
            $(element).on("click", (_) => {
                loadPages($(element).attr("href"))
                navNavigation.sideNav.close()
            })
        })
        loadPages((location.hash in NAVIGATION && location.hash) || "#LeagueStandings")
    } else if (location.pathname === "/team-info.html") {
        if (!isNaN(urlParameterId)) {
            teamInfo.setAttribute("data_id", urlParameterId)
            $(".team-info").append(
                urlParameterData === DATA_IDB ? $(teamInfo).attr({ data_from: DATA_IDB }) : teamInfo
            )
        }
    }
}
