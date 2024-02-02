import { DopaHistory } from "./DopaHistory"
export interface Dopamine {
    id: string
    name: string
    recordBestThinkDay: number
    recordBestDoDay: number
    allDoDayCount: number
    allThinkDayCount: number
    daysCount: number
    startDate: string
    dopaHistorys?:DopaHistory[]
}

