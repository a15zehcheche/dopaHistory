<template>
    <div class="day-content">
        <!--div v-for="day in days" :key="day" class="day"></div-->
        <week-bar v-for="week in weekList" :key="week" :week="week"></week-bar>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import WeekBar from './WeekBar.vue'
const appStore = useAppStore()

const days = ref([])
for (let i = 0; i < 30; i++) {
    days.value.push(i)
}

//console.log(appStore.getDopaCaseActive())

const calNextDate = (actualDate: Date) => new Date(actualDate.getTime() + (24 * 60 * 60 * 1000))
const numDays = (y: number, m: number) => new Date(y, m, 0).getDate();
//console.log(numDays(2020, 2));

interface day {
    date: Date
    count: number
}
interface week {
    byMonth: Number
    days: day[]
}

let weekList: week[] = []

//拿到dopacase 的起始和最后history的日期
let dateInit = new Date('2024-1-21')
let dateFin = new Date('2024-05-23')

//把起始日期设置到1号，把最后history的日期设置成年的最后一天
dateInit.setDate(1)
dateFin.setMonth(11)
dateFin.setDate(numDays(dateFin.getFullYear(), dateFin.getMonth() + 1))


//计算起始日期的周一日期
let spaceBefore;
let initWeekDay = dateInit.getDay()
if (initWeekDay == 0) spaceBefore = 5
else spaceBefore = initWeekDay - 2
//设置日期
dateInit.setDate(-spaceBefore)


//计算结束日期的周天日期
let spaceAfter;
let endWeekDay = dateFin.getDay()
if (endWeekDay == 0) spaceAfter = 0
else spaceAfter = 7 - endWeekDay
//设置日期
dateFin.setDate(dateFin.getDate() + spaceAfter);


//生成天数的数组
//let days: day[] = []

//生成时间段内的所有周
while (dateInit.getTime() < dateFin.getTime()) {
    let tepmDays: day[] = [];
    let monthNumber = -1;
    for (let i = 0; i < 7; i++) {
        if (dateInit.getDate() == 1) monthNumber = dateInit.getMonth()
        tepmDays.push({
            date: dateInit,
            count: 0
        })
        dateInit = calNextDate(dateInit)
        //console.log(i)
    }

    weekList.push({
        byMonth: monthNumber,
        days: tepmDays
    })
}


/*console.log('-------------------------')

console.log(dateInit)
console.log(dateInit.getDay())

console.log(dateFin)
console.log(dateFin.getDay())*/

console.log(weekList)

</script>
<style lang="less">
.day-content {
    display: grid;
    justify-content: center;
    margin: 10px 0;

    //flex-wrap: wrap;
    .day {
        width: 25px;
        height: 25px;
        background-color: var(--app-stais-day-bg);
        margin: 2px;
        //flex-shrink: 0;

    }
}
</style>