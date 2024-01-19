<template>
    <div class="history-bar-week">
        <div class="day" v-for="day in week.days" :style="dayStyles(day.count)"></div>
        <div v-if="week.byMonth != -1" class="monthTitle">{{ monthTitle[week.byMonth] }}</div>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, computed } from 'vue'
const props = defineProps(['week'])
let monthTitle = ['Jan', 'Fer', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']
const intensityColor = ['#D6E587', '#A8C66F', '#7AA757', '#4B883E', '#1D6926']


const dayStyles = (count: number) => {
    count = count >= 5 ? 4 : count
    if (count == 0) return {}
    else return {
        "background-color": intensityColor[count - 1]
    }
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