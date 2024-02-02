import {HistoryComment} from './HistoryComment'
export interface DopaHistory {
    id: string
    id_dopamine: string
    dateTime: string
    lastDoDay: number
    lastThinkDay: number
    thinkCount: number
    doCount: number
    comments:HistoryComment[]
}