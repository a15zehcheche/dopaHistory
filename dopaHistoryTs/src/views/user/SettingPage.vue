<template>
    <ChildBaseLayout page-title="设置">
        <pre v-if="exportJsonFull">{{ pretty(exportJsonFull) }}</pre>
    </ChildBaseLayout>
</template>
<script lang="ts" setup>
import { IonToggle, IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import ChildBaseLayout from '@/components/app/ChildBaseLayout.vue';
const props = defineProps(['pageDefaultBackLink'])

import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()

import { Plugins, Capacitor } from '@capacitor/core';
const { CapacitorSQLite } = Plugins;
import { onMounted, ref } from 'vue';
import { App } from '@capacitor/app';
let jsonstr = '{"id":1,"name":"A green door","price":12.50,"tags":["home","green"]}'
const exportJsonFull = ref()

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
async function exportToJsonMd() {
    try {
        const database ='myuserdb'
        const jsonexportmode = 'full'; // or 'raw'
        const result = await CapacitorSQLite.exportToJson({database, jsonexportmode });
        console.log('Exported JSON:', result);
        exportJsonFull.value = result
    } catch (error) {
        console.error('Export JSON error:', error);
    }
}
onMounted(() => {
    let platform = Capacitor.getPlatform()
    switch (platform) {
        case 'web':
            exportToJson()
            break;
        case 'android':
        exportToJsonMd()
            break;
        case 'ios':
            break;
    }
})


</script>