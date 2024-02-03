
<template>
    <ChildBaseLayout page-title="数据管理">
        <div class="content">
            <ion-card>
                <ion-card-header>
                    <ion-button @click="writeFile">倒出数据</ion-button>
                </ion-card-header>
                <ion-card-content>
                    <p>File Save in Folder: <span v-if="selectedFolder">{{ selectedFolder }}</span> </p>
                </ion-card-content>
            </ion-card>
            <ion-card>
                <ion-card-header>
                    <ion-button @click="restoreBackup">倒入数据</ion-button>
                </ion-card-header>
                <ion-card-content>
                    <input type="file" accept="" v-on:change="emitFileChange" ref="jsonFileInput" v-show="true" />
                    <pre v-if="false">{{ pretty(importJsonFile) }}</pre>
                </ion-card-content>
            </ion-card>
            <ion-card v-if="dataBackup.dopamines.length">
                <ion-list :inset="true">
                    <ion-item>
                        <ion-label>案例</ion-label>
                        <ion-note slot="end">{{ dataBackup.dopamines.length }}</ion-note>
                    </ion-item>
                    <ion-item>
                        <ion-label>记录</ion-label>
                        <ion-note slot="end">{{ dataBackup.historys.length }}</ion-note>
                    </ion-item>
                    <ion-item>
                        <ion-label>评论</ion-label>
                        <ion-note slot="end">{{ dataBackup.commets.length }}</ion-note>
                    </ion-item>
                </ion-list>
            </ion-card>
        </div>
    </ChildBaseLayout>
</template>
  
<script lang="ts" setup>
import ChildBaseLayout from '@/components/app/ChildBaseLayout.vue';
import {
    IonButton, toastController, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem,
    IonLabel, IonNote, IonList,
} from '@ionic/vue';


import { Plugins, Capacitor, } from '@capacitor/core';
import { Filesystem, FilesystemDirectory, FilesystemEncoding } from '@capacitor/filesystem'
import { ref, onMounted, watch } from 'vue'
const props = defineProps(['pageDefaultBackLink'])
const { CapacitorSQLite } = Plugins;

import { useMySqliteStore } from '@/stores/sqlite'
import { Dopamine } from '@/models/Dopamine';
import { HistoryComment } from '@/models/HistoryComment';
const SqliteStore = useMySqliteStore()

const selectedFolder = ref()

async function openFolderChooser() {

    if (Capacitor.isPluginAvailable('Filesystem')) {
        // 初始化 Capacitor 插件
        console.log('Filesystem load')
    } else {
        console.log('error load Filesystem')
    }
    try {
        const result = await Filesystem.getUri({ directory: FilesystemDirectory.Documents, path: '/' });
        const filePath = result.uri; // 获取所选文件路径
        //const folderPath = filePath.substring(0, filePath.lastIndexOf('/')); // 提取文件夹路径
        selectedFolder.value = filePath; // 显示所选文件夹路径
    } catch (error) {
        console.error('Error while selecting folder:', error);
    }
}

async function writeFile() {
    try {
        await exportToJson()
        const fileName = 'data.json';
        const content = exportJsonFull.value
        const directory = FilesystemDirectory.Documents;

        await Filesystem.writeFile({
            path: fileName,
            data: content,
            directory: directory,
            encoding: FilesystemEncoding.UTF8
        });

        const result = await Filesystem.getUri({ directory: FilesystemDirectory.Documents, path: '/' });

        selectedFolder.value = result.uri + fileName
        console.log('File written successfully!');
        result.uri
        presentToast('File written successfully!')
    } catch (error) {
        console.error('Error writing file', error);
        presentToast('Error writing file' + error)
    }
}
const presentToast = async (msg: string) => {
    const toast = await toastController.create({
        message: msg,
        duration: 1500,
        position: 'top',
    });

    await toast.present();
}


const exportJsonFull = ref()

async function exportToJson() {
    const result = await CapacitorSQLite.exportToJson({
        database: 'myuserdb',
        encrypted: false,
        jsonexportmode: 'full',
        jsonexportpath: 'path_to_export.json'
    });
    exportJsonFull.value = JSON.stringify(result)
    //console.log('Export result:', result);
}
const pretty = (value: JSON) => {
    return JSON.stringify(value, null, 2);
}

onMounted(async () => {
    await (await SqliteStore.backupController()).getDopamine('s')
    //exportToJson()
})

const file = ref(null)

const importJsonFile = ref()
const emitFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    importJsonFile.value = ''
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        //console.log(file)
        if (file.name.split('.').pop() == 'json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    importJsonFile.value = e.target.result.toString();
                }
            };
            reader.readAsText(file);
        }
        else {
            presentToast('请选择json格式的文件')
        }
    }
};

const dataBackup = ref({
    dopamines: [],
    historys: [],
    commets: []
})
const jsonFileInput = ref()
const restoreBackup = async () => {
    if (dataBackup.value.dopamines.length) {
        if (dataBackup.value.dopamines.length)
            await (await SqliteStore.backupController()).restoreDopamine(dataBackup.value.dopamines)
        if (dataBackup.value.historys.length)
            await (await SqliteStore.backupController()).restoreHistory(dataBackup.value.historys)
        if (dataBackup.value.commets.length)
            await (await SqliteStore.backupController()).restoreComment(dataBackup.value.commets)
        await SqliteStore.getAllDopamine()
        presentToast('数据导入成功')
        dataBackup.value = {
            dopamines: [],
            historys: [],
            commets: []
        }
    } else {
        presentToast('请选择倒入的json文件')
    }
}

const checkData = async (table: any) => {
    switch (table.name) {
        case 'dopamine':
            if (table.values)
                dataBackup.value.dopamines = table.values
            break;
        case 'history':
            if (table.values)
                dataBackup.value.historys = table.values
            break;
        case 'comment':
            if (table.values)
                dataBackup.value.commets = table.values
            break;
    }

}

watch(importJsonFile, (newJsonFile) => {
    if (newJsonFile) {
        //console.log(jsonFileInput.value)
        let backupJson = JSON.parse(importJsonFile.value)
        console.log(backupJson)
        if (backupJson.export.tables) {
            let dataTables = backupJson.export.tables
            if (Array.isArray(dataTables)) {
                dataTables.forEach((table: JSON) => {
                    //console.log(table)
                    checkData(table)
                });
            }

        }
    }

})

</script>

<style lang='less' scoped>
.content {
    display: flex;
    align-items: center;
    flex-direction: column;
}

ion-card {
    min-width: 300px;
    max-width: 500px;

    input {
        width: 200px;
    }
}
</style>