import _standings from "src/static/league-standings.html"
import _favorite from "src/static/favorite-teams.html"
import _team from "src/static/all-team.html"
import logo from "src/assets/logo_UEFA_champions.webp"
import imgNoData from "src/assets/no_data_found.webp"
import M from "materialize-css"
import IdbFavorite, { STORE_NAME_TEAMS } from "src/data/db/IdbFavorite"
import FootballApi from "src/data/api/FootballApi"

export const DATA_IDB = "idb"
const urlParameterId = parseInt(new URLSearchParams(window.location.search).get("id"))
const urlParameterData = new URLSearchParams(window.location.search).get("data")
const footballApi = new FootballApi()
const idbFavorite = new IdbFavorite(STORE_NAME_TEAMS)
const navNavigation = document.createElement("nav-navigation")
const leagueStandings = document.createElement("league-standings")
const team = document.createElement("table-teams")
const teamInfo = document.createElement("team-info")
const teamFavorite = document.createElement("my-favorite")
const NAVIGATION = {
    "#LeagueStandings": _standings,
    "#AllTeams": _team,
    "#MyFavorite": _favorite
}

export const logError = (error) => {
    console.log(error)
}
const noData = () => {
    return `<div class="container" style="height: 90vh; width: 100%; position: relative">
                <img class="" src="${imgNoData}" alt="data empty" style="height: 100%; width: 100%">
            </div>`
}
const toastViewsAdd = (idTeam, teamName) => {
    return `
            <p class='' style=''>Success add data ${teamName} to favorite</p>
            <a href="./team-info.html?id=${idTeam}&data=idb" class="btn-flat toast-action" style="text-transform: capitalize">See</a>
        `
}
const toastViewFailedAdd = (idTeam, teamName) => {
    return `
            <p class='' style=''>Add data ${teamName} to favorite failed please try again</p>
        `
}
const toastViewRemove = (idTeam, teamName) => {
    return `<p>Success delete data ${teamName} in favorite</p>`
}
const toastViewUpdate = (idTeam, teamName) => {
    return `<p>Data team ${teamName} has been updated</p>`
}
const status = (isSuccess) => isSuccess
const crudIdbFavorite = (action, idTeam, teamName) => {
    $(".nav-preloader").show()
    switch (action) {
        case "remove":
        case "delete":
            return removeDataFavorite(idTeam, teamName)
        case "add":
        case "create":
            return addDataFavorite(idTeam, teamName)
        case "update":
            return updateDataFavorite(idTeam, teamName)
    }
}
const addDataFavorite = (idTeam, teamName) => {
    return new Promise((resolve) => {
        $(".modal_header").text("add to favorite")
        $(".modal_message").html(`do you want to add the team <b style="color: #4a148c">${teamName}</b> to favorites`)
        $(".modal").modal("open")
        $(".ok").on("click", () => resolve(true))
        $(".cancel").on("click", () => resolve(false))
    }).then(isConfirm => {
        if (isConfirm) {
            return footballApi.getData(FootballApi.URL_TEAM(idTeam)).then((dataTeam) => {
                return idbFavorite.createData(dataTeam).then(id => {
                    if (id !== -1) {
                        M.toast({ html: toastViewsAdd(idTeam, teamName) })
                        return true
                    } else {
                        M.toast({ html: toastViewFailedAdd(idTeam, teamName) })
                        return false
                    }
                })
            }).catch(() => {
                M.toast({ html: toastViewFailedAdd(idTeam, teamName) })
                return false
            })
        } else {
            return false
        }
    }).finally(() => {
        $(".nav-preloader").hide()
    })
}
const removeDataFavorite = (idTeam, teamName) => {
    return new Promise((resolve, reject) => {
        $(".modal_header").text("remove in favorite")
        $(".modal_message").html(`do you want to remove the team <b style="color: #4a148c">${teamName}</b> to favorites`)
        $(".modal").modal("open")
        $(".ok").on("click", () => {
            return idbFavorite.deleteData(parseInt(idTeam)).then(() => {
                return resolve(true)
            }).catch(_ => reject(false))
        })
        $(".cancel").on("click", () => {
            return reject(false)
        })
    }).then(confirmOk => {
        M.toast({ html: toastViewRemove(idTeam, teamName) })
        return status(confirmOk)
    }).catch(confirmCancel => status(confirmCancel)
    ).finally(() => {
        $(".nav-preloader").hide()
    })
}
const updateDataFavorite = (idTeam, teamName) => {
    return new Promise((resolve) => {
        $(".modal_header").text("update data favorite")
        $(".modal_message").html(`do you want to update the team <b style="color: #4a148c">${teamName}</b>`)
        $(".modal").modal("open")
        $(".nav-preloader").show()
        $(".ok").on("click", () => resolve(true))
        $(".cancel").on("click", () => resolve(false))
    }).then(isConfirm => {
        if (isConfirm) {
            return idbFavorite.updateData(idTeam).then((id) => {
                if (id !== -1) {
                    M.toast({ html: toastViewUpdate(idTeam, teamName) })
                    return true
                } else {
                    return false
                }
            })
        } else {
            return false
        }
    }).finally(() => {
        $(".nav-preloader").hide()
    })
}
const loadPages = (page) => {
    $(".nav-preloader").show()
    const xmlHttpRequest = new XMLHttpRequest()
    xmlHttpRequest.open("GET", NAVIGATION[page], true)
    xmlHttpRequest.send()
    xmlHttpRequest.onreadystatechange = () => {
        if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
            const getData = (url, element, action) => {
                footballApi.getData(url).then(data => {
                    element.data = data
                    element.data != null ? action(true) : action(false)
                }).catch(error => logError(error)).finally(() => $(".nav-preloader").hide())
            }
            switch (NAVIGATION[page]) {
                case NAVIGATION["#LeagueStandings"]:
                    getData(FootballApi.URL_STANDINGS(), leagueStandings, (isComplete) => {
                        $(".content").html(xmlHttpRequest.responseText)
                        $(".league-standings").append(isComplete ? $(leagueStandings).attr("type", "total") : noData())
                    })
                    break
                case NAVIGATION["#AllTeams"]:
                    getData(FootballApi.URL_TEAMS(), team, (isComplete) => {
                        $(".content").html(xmlHttpRequest.responseText)
                        if (isComplete) {
                            idbFavorite.readData().then(dataDb => {
                                team.dataDb = dataDb
                                team.eventAddRemove = crudIdbFavorite
                                $(".team").append(team)
                            })
                        } else {
                            $(".team").html(noData())
                        }
                    })
                    break
                case NAVIGATION["#MyFavorite"]:
                    $(".content").html(xmlHttpRequest.responseText)
                    teamFavorite.data = idbFavorite
                    teamFavorite.eventUpdateRemove = crudIdbFavorite
                    $(".my-favorite").append(teamFavorite)
                    $(".nav-preloader").hide()
                    break
                default:
                    console.log("not found")
            }
        }
    }
}

export default function main() {
    $(".navigation").append(navNavigation)
    $("img.banner").attr({ src: logo })
    $(".parallax").parallax()
    $(".modal").modal({
        endingTop: "30%",
        dismissible: false
    })

    if (location.pathname === "/" || location.pathname === "/index.html") {
        $(".navigation .nav-page").map((index, element) => {
            $(element).on("click", _ => {
                loadPages($(element).attr("href"))
                navNavigation.sideNav.close()
            })
        })
        loadPages((location.hash in NAVIGATION && location.hash) || "#LeagueStandings")
    } else if (location.pathname === "/team-info.html") {
        const insertDataTeamInfo = (data) => {
            teamInfo.data = data
            teamInfo.eventAddRemove = crudIdbFavorite
            $(".nav-preloader").hide()
        }
        if (urlParameterData !== null) { /* get data from db */
            idbFavorite.readData(urlParameterId).then(dataFavorite => {
                if (dataFavorite !== undefined) {
                    insertDataTeamInfo(dataFavorite)
                    $(".team-info").html($(teamInfo).attr({ data_from: DATA_IDB }))
                } else {
                    location.href = `/team-info.html?id=${urlParameterId}`
                }
            })
        } else { /* get data from api */
            footballApi.getData(FootballApi.URL_TEAM(urlParameterId)).then(dataApi => {
                if (dataApi !== null) {
                    insertDataTeamInfo(dataApi)
                    $(".team-info").html(teamInfo)
                } else {
                    $(".nav-preloader").hide()
                    $(".team-info").html(noData())
                }
            })
        }
    }
}
