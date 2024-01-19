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

import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()


onMounted(() => {
  SqliteStore.initConnection()
});
onBeforeUnmount(() => {
  SqliteStore.ClearConnection()
});

</script>
