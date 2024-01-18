import { defineStore } from 'pinia'
import { ref, computed } from 'vue';
import { Dopamine } from '@/models/Dopamine';
import { DopaHistory } from '@/models/DopaHistory';

export const useAppStore = defineStore('app', () => {
    const dopaCaseActive = ref<Dopamine>();
    const name = ref('Eduardo')
    const setDopaCase = async (dopacase: Dopamine) => {
        dopaCaseActive.value = dopacase
        //console.log('data recive',dopaCaseActive.value)
    }
    const getDopaCaseActive = () => {
        return dopaCaseActive.value
    }
    return { dopaCaseActive, setDopaCase, getDopaCaseActive }
})