import { DopaHistory } from "./DopaHistory"
export interface Dopamine {
    id: number
    name: string
    recordBestThinkDay: number
    recordBestDoDay: number
    allDoDayCount: number
    allThinkDayCount: number
    daysCount: number
    startDate: string
    dopaHistorys?:DopaHistory
}

