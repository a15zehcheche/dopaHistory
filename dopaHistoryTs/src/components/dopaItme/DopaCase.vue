<template>
    <div class="dopa-title">
        <span>{{ dopamine.name }}</span>
        <span>{{ dopamine.daysCount }} day</span>
    </div>
    <div class="history-box">
        <div class="item-content">
            <BetweenItem v-for="dopahistory in dopaHistorys" :dopaHistory="dopahistory"></BetweenItem>
            <StartItme :startDate="dopamine.startDate"></StartItme>
        </div>

    </div>
    <div class="dopa-info">
        <div class="totalCount">
            <img width="30px" src="@/assets/total.svg" />
            <span class="dopa-do">{{ dopamine.allDoDayCount }}</span>
            &nbsp;-&nbsp;
            <span class="dopa-think">{{ dopamine.allThinkDayCount }}</span>
        </div>
        <div class="bestDaysCount">
            <img width="30px" src="@/assets/chess-queen.svg" />
            <span class="dopa-do">{{ dopamine.recordBestDoDay }}</span>
            &nbsp;-&nbsp;
            <span class="dopa-think">{{ dopamine.recordBestThinkDay }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BetweenItem from './BetweenItem.vue';
import StartItme from './StartItme.vue';
import { defineComponent, ref, Ref, watch,defineProps } from 'vue'
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { useQuerySQLite } from '@/hooks/UseQuerySQLite';

import { Dopamine } from '@/models/Dopamine';
import { DopaHistory } from '@/models/DopaHistory';
const props = defineProps(['dopamine','dopaHistorys'])
console.log(props)
</script>

<style scoped>
.history-box::-webkit-scrollbar {
    display: none;
}

.dopa-title {
    display: flex;
    justify-content: space-between;
    padding: 10px;
}

.history-box {
    height: 120px;
    width: 100%;
    box-sizing: border-box;
    border-color: black;
    border-style: solid;
    border-width: 1px 0;
    display: flex;
    /*align-items: center;*/
    overflow: hidden;
    overflow-x: scroll;
}

.item-content {
    display: flex;
    padding: 0 50px;
}

.dopa-info {
    display: flex;
    justify-content: space-between;
    padding: 10px;
}

.dopa-info img {
    padding-right: 10px;
}

.totalCount,
.bestDaysCount {
    display: flex;
    align-items: center;
}
</style>