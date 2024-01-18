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
const intensity = ['#D6E587', '#A8C66F', '#7AA757', '#4B883E', '#1D6926']

</script>
<style scoped>
.main-content{
    display: flex;
    justify-content: center;
}
</style>