const API_KEY = "57dcd2eeff75439facd905f82c008649"
export const BASE_URL = "https://api.football-data.org"
export const COMPETITION = {
    UEFA_CHAMPIONS_LEAGUE: 2001
}

export default class FootballApi {
    static URL_TEAM_MATCHES(ID_TEAM, status) {
        /* status = [SCHEDULED | LIVE | IN_PLAY | PAUSED | FINISHED | POSTPONED | SUSPENDED | CANCELED] */
        return `${BASE_URL}/v2/teams/${ID_TEAM}/matches/?status=${status}`
    }

    static URL_STANDINGS(ID_LEAGUE) {
        return `${BASE_URL}/v2/competitions/${ID_LEAGUE || "2001"}/standings`
    }

    static URL_TEAMS(ID_COMPETITION) {
        return `${BASE_URL}/v2/competitions/${ID_COMPETITION || "2001"}/teams`
    }

    static URL_TEAM(ID_TEAM) {
        return `${BASE_URL}/v2/teams/${ID_TEAM}`
    }

    getData(URL) {
        return fetch(URL, {
            method: "GET",
            headers: {
                "X-Auth-Token": API_KEY
            }
        }).then(response => {
            return response.ok ? response.json() : Promise.reject(new Error(response.statusText))
        }).then(data => {
            return data
        }).catch(error => {
            console.log(error)
            return null
        })
    }

    getDataCache(URL) {
        if ("caches" in window) {
            return caches.match(URL).then(response => {
                return response.json()
            }).then(data => {
                return data
            }).catch(_ => {
                return null
            })
        }
    }
}
