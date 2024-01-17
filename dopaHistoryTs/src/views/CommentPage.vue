<template>
    <base-layout pageTitle="记录">
    count {{counterStore.count}}
    <button @click="counterStore.increment()">add</button>
    </base-layout>
</template>
<script lang="ts" setup>
import BaseLayout from '@/components/app/BaseLayout.vue';
import { useCounterStore } from '@/stores/sqlite'
const counterStore = useCounterStore()


</script>