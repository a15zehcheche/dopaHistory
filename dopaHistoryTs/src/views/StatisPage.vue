<template>
    <base-layout pageTitle="统计">
        <div class="main-content">
            <history-bar></history-bar>
        </div>
        <square-info></square-info>
    </base-layout>
</template>
<script lang="ts" setup>
import BaseLayout from '@/components/app/BaseLayout.vue';
import HistoryBar from '@/components/statis/HistoryBar.vue'
import SquareInfo from '@/components/statis/SquareInfo.vue'

</script>
<style scoped>
.main-content {
    display: flex;
    justify-content: center;
}
</style>