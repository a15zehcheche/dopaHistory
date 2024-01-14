<template>
    <div class="dopa-bar-content">
        <div class="dopa-box">
            <dopa-bar-item v-for="dopamine in dopamines" :name="dopamine.name"></dopa-bar-item>
        </div>
    </div>
</template>
<script lang="ts" setup>
import DopaBarItem from "./DopaBarItem.vue"
const props = defineProps(['dopamines'])

</script>
<style scoped>
.dopa-bar-content {
    width: 100%;
    height: 50px;
    /*border: 1px solid black;
    box-sizing: border-box;*/
    display: flex;
    align-items: center;
    overflow: hidden;
    overflow-x: scroll;
}

.dopa-bar-content::-webkit-scrollbar {
    display: none;
}

.dopa-box {
    padding: 0 10px;
    display: flex;
    grid-auto-flow: column;

}

</style>