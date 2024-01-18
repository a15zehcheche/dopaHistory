<template>
    <div class="history-bar-week">
        <div class="day" v-for="day in week.days"></div>
        <div v-if="week.byMonth != -1" class="monthTitle">{{ monthTitle[week.byMonth] }}</div>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, computed } from 'vue'
const props = defineProps(['week'])
let monthTitle = ['Jan', 'Fer', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']
</script>

<style lang="less" scoped>
.history-bar-week {
    display: flex;

    .monthTitle {
        transform-origin: top left;
        transform: translate(12px) rotate(90deg);
        margin: 2px;
        font-size: 12px;
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