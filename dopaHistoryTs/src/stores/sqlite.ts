import { defineStore } from 'pinia'
import {
  ref, computed, getCurrentInstance, watch
} from 'vue';
import { Toast } from '@capacitor/toast';

export const useCounterStore = defineStore('Counter', () => {
  const count = ref(0)
  const name = ref('Eduardo')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, name, doubleCount, increment }
})

export const useMySqliteStore = defineStore('mySqlite', () => {

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

  return { db, dbNameRef, isDatabase, storageServ, sqliteServ, initConnection, ClearConnection }

})