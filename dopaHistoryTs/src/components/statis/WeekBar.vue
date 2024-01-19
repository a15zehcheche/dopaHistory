<template>
    <div class="history-bar-week">
        <div class="day" v-for="day in week.days" :style="dayStyles(day)"></div>
        <div v-if="week.byMonth != -1" class="monthTitle">{{ monthTitle[week.byMonth] }}</div>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, computed } from 'vue'
const props = defineProps(['week'])
let monthTitle = ['Jan', 'Fer', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']
const intensityColor = ['#D9D9D9','#D6E587', '#A8C66F', '#7AA757', '#4B883E', '#1D6926']
import { useMySqliteStore } from '@/stores/sqlite'
import { Style } from '@capacitor/status-bar';
const SqliteStore = useMySqliteStore()
interface day {
    date: Date
    count: number
}
const convertToTwoDigit = (number: number) => {
    return number < 10 ? '0' + number.toString() : number.toString();
}
const dateToString = (date: Date) => {
    return `${date.getFullYear()}-${convertToTwoDigit(date.getMonth() + 1)}-${convertToTwoDigit(date.getDate())}`
}

const dayStyles = (thisDay: day) => {
    let count = thisDay.count >= 5 ? 4 : thisDay.count
    if (dateToString(SqliteStore.dateToday) == dateToString(thisDay.date)){
        return {
            'box-shadow': '0px 0px 5px 0px rgba(29,105,38,1)',
            "background-color": intensityColor[count]
        } 
    }else{
        return {
            "background-color": intensityColor[count]
        }
    }
        
}
const todayStile =()=>{

}

</script>

<style lang="less" scoped>
.history-bar-week {
    display: flex;
    position: relative;

    .monthTitle {
        transform-origin: top left;
        transform: translate(45px, 1px) rotate(90deg);
        margin: 2px;
        font-size: 12px;
        position: absolute;
        right: 0;
        width: 30px;
    }

    .day {
        width: 25px;
        height: 25px;
        background-color: var(--app-stais-day-bg);
        margin: 2px;
        //flex-shrink: 0;

    }
}
</style>