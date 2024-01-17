<template>
  <ion-app>
    <ion-router-outlet animated="true" mode="ios" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {
  ref, getCurrentInstance, onMounted, onBeforeUnmount, watch,
} from 'vue';
import { Toast } from '@capacitor/toast';

const dbNameRef = ref('');
const isInitComplete = ref(false);
const isDatabase = ref(false);
const db = ref(null);
const appInstance = getCurrentInstance();
const sqliteServ = appInstance?.appContext.config.globalProperties.$sqliteServ;
const storageServ = appInstance?.appContext.config.globalProperties.$storageServ;

//const dbInitialized = computed(() => !!db.value);
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
onMounted(() => {
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
});
onBeforeUnmount(() => {
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
});

watch(isDatabase, (newIsDatabase) => {
  if (newIsDatabase) {
    console.log("App db ready")
    /*getAllUsers(db).then(() => {

    })*/

    /*getAllDopamine(db).then(() => {
    }).catch((error: any) => {
      const msg = `close database:
                          ${error.message ? error.message : error}`;
      console.error(msg);
      Toast.show({
        text: msg,
        duration: 'long'
      });
    });*/
  } else {
    const msg = `newDb is null`;
    console.error(msg);
    Toast.show({
      text: msg,
      duration: 'long'
    });
  }
});


</script>
