<template>
  <ion-app>
    <ion-router-outlet animated="true" mode="ios" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {
  ref, onMounted, onBeforeUnmount, watch, toRefs, getCurrentInstance
} from 'vue';
import { Toast } from '@capacitor/toast';
import { App } from '@capacitor/app';

// import { useMySqliteStore } from '@/stores/sqlite'
// const SqliteStore = useMySqliteStore()


import { useAppStore } from '@/stores/app'
const AppStore = useAppStore()


const isInitComplete = ref(false);
const appInstance = getCurrentInstance();
//const dbInitialized = computed(() => !!db.value);
const dbNameRef = ref('');
const isDatabase = ref(false);
const db = ref(null);
const sqliteServ = appInstance?.appContext.config.globalProperties.$sqliteServ;
const storageServ = appInstance?.appContext.config.globalProperties.$storageServ;
const platform = sqliteServ.getPlatform();

const openDatabase = async () => {
  try {
    const dbUsersName = storageServ.getDatabaseName();
    dbNameRef.value = dbUsersName;
    const version = storageServ.getDatabaseVersion();

    const database = await sqliteServ.openDatabase(dbUsersName, version, false);
    db.value = database;
    isDatabase.value = true;
  } catch (error) {
    const msg = `Error open database: ${error}`;
    console.error(msg);
    Toast.show({
      text: msg,
      duration: 'long'
    });
  }
};
const initConnection = () => {
  const initSubscription = storageServ.isInitCompleted.subscribe(async (value: boolean) => {
    isInitComplete.value = value;
    if (isInitComplete.value === true) {
      const dbUsersName = storageServ.getDatabaseName();
      if (platform === "web") {
        customElements.whenDefined('jeep-sqlite').then(async () => {
          await openDatabase();
        }).catch((error) => {
          const msg = `Error open database: ${error}`;
          console.log(msg);
          Toast.show({
            text: msg,
            duration: 'long'
          });
        });
      } else {
        await openDatabase();
      }
    }
  });
}
const ClearConnection = () => {
  sqliteServ.closeDatabase(dbNameRef.value, false)
    .then(() => {
      isDatabase.value = false;
    }).catch((error: any) => {
      const msg = `Error close database:
                            ${error.message ? error.message : error}`;
      console.error(msg);
      Toast.show({
        text: msg,
        duration: 'long'
      });
    });
}
watch(isDatabase, (newIsDatabase) => {
  if (newIsDatabase) {
    console.log("App db ready")
    AppStore.db = db.value
    AppStore.initAppData()

  }
});

onMounted(() => {
  //SqliteStore.initConnection()
  initConnection()
});

onBeforeUnmount(() => {
  ClearConnection()
  //SqliteStore.ClearConnection()
});



// let stateChangeCount = 0;
// App.addListener('appStateChange', ({ isActive }) => {
//   if (isActive) {
//     //if (!AppStore.testMode) SqliteStore.dateToday = new Date()
//     SqliteStore.checkIsPassNextDay()
//     console.log('App state changed.', stateChangeCount);
//     stateChangeCount++
//   }
// });
</script>
