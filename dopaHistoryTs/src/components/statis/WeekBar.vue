<template>
    <div class="history-bar-week">
        <div class="day" v-for="day in week.days" :style="dayStyles(day)"></div>
        <div v-if="week.byMonth != -1" class="monthTitle">{{ monthTitle[week.byMonth] }}</div>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, computed } from 'vue'
const props = defineProps(['week'])
let monthTitle = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const thinkColor = ['#F1D7AB', '#F2CB89', '#F3BF67', '#F4B245', '#F5A623']
const doColor = ['#F1ABAB', '#F28989', '#F36767', '#F44545', '#F52323']
import { useMySqliteStore } from '@/stores/sqlite'
import { Style } from '@capacitor/status-bar';
const SqliteStore = useMySqliteStore()
interface day {
    date: Date
    count: {
        do: number
        think: number
    }
    betweenDay: boolean
}
const convertToTwoDigit = (number: number) => {
    return number < 10 ? '0' + number.toString() : number.toString();
}
const dateToString = (date: Date) => {
    return `${date.getFullYear()}-${convertToTwoDigit(date.getMonth() + 1)}-${convertToTwoDigit(date.getDate())}`
}

const dayStyles = (thisDay: day) => {
    let doCount = thisDay.count.do > 4 ? 4 : thisDay.count.do
    let thinkCount = thisDay.count.think > 4 ? 4 : thisDay.count.think
    let dgColor = '#D9D9D9' //基础色
    if (doCount > 0) {
        dgColor = doColor[doCount];
    } else if (thinkCount > 0) {
        dgColor = thinkColor[thinkCount];
    } else if (thisDay.betweenDay) {
        dgColor = '#40c463' //已过天
    }

    if (dateToString(SqliteStore.dateToday) == dateToString(thisDay.date)) {
        return {
            'box-shadow': '0px 0px 5px 0px rgba(100,100,100,1)',
            "background-color": dgColor
        }
    } else {
        return {
            "background-color": dgColor
        }
    }

}
const todayStile = () => {

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