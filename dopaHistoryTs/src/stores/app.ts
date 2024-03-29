import { defineStore } from 'pinia'
import { ref, computed } from 'vue';
import { Dopamine } from '@/models/Dopamine';
import { DopaHistory } from '@/models/DopaHistory';
import DopamineController from '@/controllers/DopamineController';
import { nanoid } from 'nanoid';

interface day {
    date: Date
    count: Object
}
interface week {
    byMonth: Number
    days: day[]
}

export const useAppStore = defineStore('app', () => {
    const weekList = ref<week[]>([])
    const testMode = ref(false);
    const db = ref()
    const initAppData = async () => {
        const newDapamine = {
            id: nanoid(), // do not care about the id value (generated by sqlite)
            name: "Dopamine",
            startDate: dateToString(new Date()),
            recordBestThinkDay: 0,
            recordBestDoDay: 0,
            allDoDayCount: 0,
            allThinkDayCount: 0,
            daysCount: 0,
            dopaHistorys: []
        };

        await new DopamineController(db).addDopamines(newDapamine)
        await new DopamineController(db).getDopamines()
    }
    const convertToTwoDigit = (number: number) => {
        return number < 10 ? '0' + number.toString() : number.toString();
    }

    const dateToString = (date: Date) => {
        return `${date.getFullYear()}-${convertToTwoDigit(date.getMonth() + 1)}-${convertToTwoDigit(date.getDate())}`
    }
    return { db, initAppData, weekList, testMode }
})