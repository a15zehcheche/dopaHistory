<template>
    <base-layout pageTitle="记录">
    <!--count {{counterStore.count}}
    <button @click="counterStore.increment()">add</button-->
        <div class="comment-body">
            <img width="150px" height="150px" src="/assets/under-construction.png"  alt="">
            <span class="info" >页面施工中。。。</span>
        </div>
    </base-layout>
</template>
<script lang="ts" setup>
import BaseLayout from '@/components/app/BaseLayout.vue';
import { useCounterStore } from '@/stores/sqlite'
const counterStore = useCounterStore()


</script>
<style lang="less">
.comment-body{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .info{
        margin-top: 20px;
        color: var(--ion-color-medium);
    }
}
</style>