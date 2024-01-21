<template>
    <ChildBaseLayout page-title="设置">
        <!--ion-toggle v-model="AppStore.testMode" @ionChange="changeTestMode()" >Test Mode</ion-toggle-->
    </ChildBaseLayout>
</template>
<script lang="ts" setup>
import { IonToggle, IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import ChildBaseLayout from '@/components/app/ChildBaseLayout.vue';
const props = defineProps(['pageDefaultBackLink'])

import { useAppStore } from '@/stores/app'
const AppStore = useAppStore()

const changeTestMode=()=>{
    //console.log('change mode',AppStore.testMode)
}
    

</script>