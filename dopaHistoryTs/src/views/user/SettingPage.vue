<template>
    <ChildBaseLayout page-title="设置">
        <pre v-if="exportJsonFull">{{ pretty(exportJsonFull) }}</pre>
    </ChildBaseLayout>
</template>
<script lang="ts" setup>
import { IonToggle, IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import ChildBaseLayout from '@/components/app/ChildBaseLayout.vue';
const props = defineProps(['pageDefaultBackLink'])

import { useAppStore } from '@/stores/app'
const AppStore = useAppStore()

import { Plugins } from '@capacitor/core';
import { onMounted, ref } from 'vue';
let jsonstr = '{"id":1,"name":"A green door","price":12.50,"tags":["home","green"]}'
const exportJsonFull = ref()
const { CapacitorSQLite } = Plugins;
async function exportToJson() {
    const result = await CapacitorSQLite.exportToJson({
        database: 'myuserdb',
        encrypted: false,
        jsonexportmode: 'full',
        jsonexportpath: 'path_to_export.json'
    });
    exportJsonFull.value = result
    console.log('Export result:', result);
}
const pretty = (value: JSON) => {
    return JSON.stringify(value, null, 2);
}
onMounted(() => {
    exportToJson()
})


</script>