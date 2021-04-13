import { openDB } from "idb"
import FootballApi from "src/data/api/FootballApi"

export const STORE_NAME_TEAMS = "TEAMS"
export const STORE_NAME_MATCHES_FINISHED = "MATCHES_FINISHED"
export const STORE_NAME_MATCHES_SCHEDULED = "MATCHES_SCHEDULED"

export const INDEX_NAME_MATCHES_FINISHED = "Matches Finished"
export const INDEX_NAME_MATCHES_SCHEDULED = "Matches Scheduled"

export const KEY_PATH_MATCHES_FINISHED = "matchesFinished"
export const KEY_PATH_MATCHES_SCHEDULED = "matchesScheduled"

export default class IdbFavorite {
    constructor(storeName) {
        this.storeName = storeName
        this.footballApi = new FootballApi()
        this.dbPromise = openDB("DB-Favorite", 1, {
            upgrade(database, oldVersion, newVersion, transaction) {
                database.createObjectStore(STORE_NAME_TEAMS, { keyPath: "id" })
                transaction.objectStore(STORE_NAME_TEAMS).createIndex("names", "name", { unique: true })

                database.createObjectStore(STORE_NAME_MATCHES_FINISHED, { keyPath: "id" })
                transaction.objectStore(STORE_NAME_MATCHES_FINISHED).createIndex(INDEX_NAME_MATCHES_FINISHED, KEY_PATH_MATCHES_FINISHED, { unique: true })

                database.createObjectStore(STORE_NAME_MATCHES_SCHEDULED, { keyPath: "id" })
                transaction.objectStore(STORE_NAME_MATCHES_SCHEDULED).createIndex(INDEX_NAME_MATCHES_SCHEDULED, KEY_PATH_MATCHES_SCHEDULED, { unique: true })
            }
        })
    }

    createData(dataTeam, dataMatchesFinished, dataMatchesScheduled) {
        return this.dbPromise.then(db => {
            if (typeof dataTeam === "number") {
                return this.footballApi.getData(FootballApi.URL_TEAM(dataTeam)).then(dataTeam => {
                    return this.dbPromise.then(db => {
                        return db.add(STORE_NAME_TEAMS, dataTeam)
                    })
                })
            } else {
                return db.add(STORE_NAME_TEAMS, dataTeam)
            }
        }).then(id => {
            if (dataMatchesFinished === undefined) {
                return this.footballApi.getData(FootballApi.URL_TEAM_MATCHES(id, "FINISHED")).then(dataMatchesFinished => {
                    dataMatchesFinished.matchesFinished = id
                    dataMatchesFinished.id = id
                    return this.dbPromise.then(db => {
                        return db.add(STORE_NAME_MATCHES_FINISHED, dataMatchesFinished)
                    })
                })
            } else {
                dataMatchesFinished.matchesFinished = id
                dataMatchesFinished.id = id
                return this.dbPromise.then(db => {
                    return db.add(STORE_NAME_MATCHES_FINISHED, dataMatchesFinished)
                })
            }
        }).then(id => {
            if (dataMatchesScheduled === undefined) {
                return this.footballApi.getData(FootballApi.URL_TEAM_MATCHES(id, "SCHEDULED")).then(dataMatchesScheduled => {
                    dataMatchesScheduled.matchesScheduled = id
                    dataMatchesScheduled.id = id
                    return this.dbPromise.then(db => {
                        return db.add(STORE_NAME_MATCHES_SCHEDULED, dataMatchesScheduled)
                    })
                })
            } else {
                dataMatchesScheduled.matchesScheduled = id
                dataMatchesScheduled.id = id
                return this.dbPromise.then(db => {
                    return db.add(STORE_NAME_MATCHES_SCHEDULED, dataMatchesScheduled)
                })
            }
        }).catch(_ => {
            this.deleteData(dataTeam.id).catch(err => {
                console.log(err)
            })
            if (dataTeam === null) return -1
            return -1
        })
    }

    readData(id) {
        return this.dbPromise.then(db => {
            return id !== undefined ? db.get(this.storeName, id) : db.getAll(this.storeName)
        })
    }

    readDataWithKeyPath(id, indexName) {
        return this.dbPromise.then(db => {
            return db.getFromIndex(this.storeName, indexName, id)
        })
    }

    updateData(id) {
        return this.dbPromise.then(db => {
            return this.footballApi.getData(FootballApi.URL_TEAM(id)).then(dataTeam => {
                const tx = db.transaction(STORE_NAME_TEAMS, "readwrite")
                return tx.objectStore(STORE_NAME_TEAMS).openCursor(id).then(cursorRequest => {
                    return cursorRequest.update(dataTeam)
                })
            })
        }).then(id => {
            return this.dbPromise.then(db => {
                return this.footballApi.getData(FootballApi.URL_TEAM_MATCHES(id, "FINISHED")).then(dataMatchesFinished => {
                    dataMatchesFinished.matchesFinished = id
                    dataMatchesFinished.id = id
                    const tx = db.transaction(STORE_NAME_MATCHES_FINISHED, "readwrite")
                    return tx.objectStore(STORE_NAME_MATCHES_FINISHED).openCursor(id).then(cursorRequest => {
                        return cursorRequest.update(dataMatchesFinished)
                    })
                })
            })
        }).then(id => {
            return this.dbPromise.then(db => {
                return this.footballApi.getData(FootballApi.URL_TEAM_MATCHES(id, "SCHEDULED")).then(dataMatchesScheduled => {
                    dataMatchesScheduled.matchesScheduled = id
                    dataMatchesScheduled.id = id
                    const tx = db.transaction(STORE_NAME_MATCHES_SCHEDULED, "readwrite")
                    return tx.objectStore(STORE_NAME_MATCHES_SCHEDULED).openCursor(id).then(cursorRequest => {
                        return cursorRequest.update(dataMatchesScheduled)
                    })
                })
            })
        }).catch(err => {
            console.log(err)
            return -1
        })
    }

    deleteData(id) {
        return this.dbPromise.then(db => {
            db.delete(STORE_NAME_TEAMS, id).then(_ => {
                db.delete(STORE_NAME_MATCHES_FINISHED, id).then(_ => {
                    db.delete(STORE_NAME_MATCHES_SCHEDULED, id).then()
                })
            })
        })
    }
}
