<template>
  <ion-app>
    <ion-router-outlet animated="true" mode="ios" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {
  ref, onMounted, onBeforeUnmount, watch,
} from 'vue';
import { Toast } from '@capacitor/toast';
import { App } from '@capacitor/app';

import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()


onMounted(() => {
  SqliteStore.initConnection()
});
onBeforeUnmount(() => {
  SqliteStore.ClearConnection()
});


let stateChangeCount =0
App.addListener('appStateChange', ({ isActive }) => {
  if (isActive) {
    //if (!AppStore.testMode) SqliteStore.dateToday = new Date()
    SqliteStore.checkIsPassNextDay()
    console.log('App state changed.', stateChangeCount);
    stateChangeCount++
  }

});
</script>
