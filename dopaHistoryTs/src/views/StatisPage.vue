<template>
    <base-layout pageTitle="统计">
    <div class="main-content">
        <history-bar></history-bar>
    </div>
      
    </base-layout>
</template>
<script lang="ts" setup>
import BaseLayout from '@/components/app/BaseLayout.vue';
import HistoryBar from '@/components/statis/HistoryBar.vue'


</script>
<style scoped>
.main-content{
    display: flex;
    justify-content: center;
}
</style>