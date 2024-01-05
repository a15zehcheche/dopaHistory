<template>
    <div class="dopa-title">
        <span>Dopamine</span>
        <span>10 day</span>
    </div>
    <div class="history-box">
        <BetweenItem></BetweenItem>
        <BetweenItem></BetweenItem>
        <BetweenItem></BetweenItem>
    </div>
    <div class="dopa-info">
        <div class="totalCount">
            <img width="30px" src="@/assets/total.svg" />
            <span class="dopa-do">3</span>&nbsp;-&nbsp;<span class="dopa-think">5</span>
        </div>
        <div class="bestDaysCount">
            <img width="30px" src="@/assets/chess-queen.svg" />
            <span class="dopa-do">3</span>&nbsp;-&nbsp;<span class="dopa-think">5</span>
        </div>
    </div>
</template>

<script>
import BetweenItem from './BetweenItem.vue';
export default {
    components: {
        BetweenItem
    }
}
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
    height: 150px;
    width: 100%;
    box-sizing: border-box;
    border-color: black;
    border-style: solid;
    border-width: 1px 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    overflow-x: scroll;
    
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
}</style>