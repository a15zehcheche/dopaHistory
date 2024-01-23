<template>
    <div class="info-box">
        <span>Less</span>
        <div class="square" v-for="color in colores" :style="dayStyles(color)"></div>
        <span>More</span>
    </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
const colores =ref( ['#9be9a8','#F1D7AB', '#F2CB89', '#F3BF67', '#F4B245', '#F5A623','#F1ABAB', '#F28989', '#F36767', '#F44545', '#F52323'])
const dayStyles = (color: string) => {
    return {
        "background-color": color
    }
}
</script>

<style lang="less" scoped>
.info-box {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px ;
    .square {
        width: 15px;
        height: 15px;
        border-radius: 3px;
        background-color: var(--app-stais-day-bg);
        margin: 2px;
        //flex-shrink: 0;
    }
    span{
        margin: 0 10px;
        color: var(--ion-color-medium);
    }
}
</style>