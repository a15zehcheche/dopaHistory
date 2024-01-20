import { defineStore } from 'pinia'
import { ref, computed } from 'vue';
import { Dopamine } from '@/models/Dopamine';
import { DopaHistory } from '@/models/DopaHistory';
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

    return { weekList, testMode }
})