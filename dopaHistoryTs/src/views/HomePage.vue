<template>
  <div class="main-body">
    <app-date-time :dateNow="dateNow"></app-date-time>
    <dopa-case v-for="dopamine in dopamines" :dopamine="dopamine" :dopaHistorys="dopaHistorys"></dopa-case>

    <div class="action-btn-box">
      <ion-button color="danger" @click="dopaDo">Do</ion-button>
      <ion-button color="warning" @click="dopaThink">Think</ion-button>
    </div>
    <user-list :users="users" :onUpdateUser="handleUpdateUser" :onDeleteUser="handleDeleteUser"></user-list>
  </div>
</template>
  
<script lang="ts" setup>

import {
  defineComponent, ref, computed, getCurrentInstance, onMounted,
  onBeforeUnmount, watch, Ref
} from 'vue';
import { useIonRouter } from '@ionic/vue';
import {
  IonPage, IonHeader, IonToolbar, IonButton, IonBackButton, IonTitle,
  IonContent, IonCard
} from '@ionic/vue';
import { Toast } from '@capacitor/toast';
import { User } from '@/models/User';
import { Dopamine } from '@/models/Dopamine';
import { DopaHistory } from '@/models/DopaHistory';
//import UserForm from '@/components/UserForm.vue';
import UserList from '@/components/UserList.vue';
import { useQuerySQLite } from '@/hooks/UseQuerySQLite';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import AppDateTime from '../components/time/AppDateTime.vue';
import DopaCase from '../components/dopaItme/DopaCase.vue'
//new Date('2024-01-15T23:59:55'),


const dbNameRef = ref('');
const isInitComplete = ref(false);
const isDatabase = ref(false);
const db = ref(null);
const appInstance = getCurrentInstance();

const router = useIonRouter();

const sqliteServ = appInstance?.appContext.config.globalProperties.$sqliteServ;
const storageServ = appInstance?.appContext.config.globalProperties.$storageServ;

const dbInitialized = computed(() => !!db.value);
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

/* app main logic------------------------------------------------ */
const dopamines = ref<Dopamine[]>([]);
const dopaHistorys = ref<DopaHistory[]>([]);
let dateNow: Date = new Date() as Date;
let nextDate: Date;
let restMilliSecondsToNextDay: number;
let dateIterval: any;
let historyActive: DopaHistory;
let dopaCaseActive: Dopamine;
const isHistory = ref(false);

const dopaDo = () => {
  let updDopaHistory = historyActive
  updDopaHistory.doCount++
  handleUpdateDopaHistory(updDopaHistory)
  //console.log("do ++")
}

const dopaThink = () => {
  let updDopaHistory = historyActive
  updDopaHistory.thinkCount++
  handleUpdateDopaHistory(updDopaHistory)
  //console.log("think ++")
}
const addhistor = () => {
  let newhistory = {
    id: Date.now(),
    id_dopamine: 1,
    dateTime: dateToString(new Date()),
    lastDoDay: 0,
    lastThinkDay: 0,
    thinkCount: 0,
    doCount: 0,
  }
  handleAddHistory(newhistory)
  console.log(dopaHistorys)

}
const setDateIterval = () => {
  // set date check interval
  console.log('set date check intervel')
  if (dateIterval) {
    //console.log('clear old interval')
    clearInterval(dateIterval)
  }

  let element = this;
  dateIterval = setInterval(function () {
    dateNow = new Date()
    //console.log('interval')
    setUpNextDay()
  }, restMilliSecondsToNextDay);

}
const calNextDate = (actualDate: any) => {

  let nextDatelocal = new Date(actualDate.getTime())
  nextDatelocal.setTime(actualDate.getTime() + (24 * 60 * 60 * 1000));
  nextDatelocal.setHours(0)
  nextDatelocal.setMinutes(0)
  nextDatelocal.setSeconds(0)
  //console.log(nextDatelocal.toString())
  return nextDatelocal
}

const calRestMilliSecondsToNextDay = () => {
  //calulate next day
  nextDate = calNextDate(dateNow)
  restMilliSecondsToNextDay = nextDate.getTime() - dateNow.getTime()
  console.log(restMilliSecondsToNextDay)
}
const setUpNextDay = () => {
  calRestMilliSecondsToNextDay()
  setDateIterval()
  let today:Date = new Date()
  console.log("new day")
  if ((historyActive.doCount > 0 || historyActive.thinkCount > 0) /*&& dateToString(today)!= historyActive.dateTime */) {
    handleAddHistory(historyActive)
    let newhistory = {
      id: 1,
      id_dopamine: dopaCaseActive.id,
      dateTime: dateToString(new Date()),
      lastDoDay: 0,
      lastThinkDay: 0,
      thinkCount: 0,
      doCount: 0,
    }
    historyActive = newhistory
    handleUpdateDopaHistory(historyActive)
  } else {
    historyActive.dateTime = dateToString(new Date())
    handleUpdateDopaHistory(historyActive)
  }

}


/* end app main logic------------------------------------------------ */

const users = ref<User[]>([]);

const getAllUsers = async (db: Ref<SQLiteDBConnection | null>) => {
  const stmt = 'SELECT * FROM users';
  const values: any[] = [];
  const fetchData = await useQuerySQLite(db, stmt, values);
  users.value = fetchData;

}
const handleAddUser = async (newUser: User) => {
  if (db.value) {
    const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
    const lastId = await storageServ.addUser(newUser);
    newUser.id = lastId;
    users.value.push(newUser as never);
  }
};
const handleUpdateUser = async (updUser: User) => {
  if (db.value) {
    const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
    await storageServ.updateUserById(updUser.id.toString(), updUser.active);
    users.value = users.value.map((user: User) => {
      if (user.id === updUser.id) {
        // Clone the user and update the active property
        return { ...user, active: updUser.active };
      } else {
        return user;
      }
    });
  }
};

const handleDeleteUser = async (userId: number) => {
  if (db.value) {
    const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
    await storageServ.deleteUserById(userId.toString());
    users.value = users.value.filter(user => (user as User).id !== userId);
  }
};



// dopamine handle api-----------------------------------------------
const dateToString = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const getAllDopamine = async (db: Ref<SQLiteDBConnection | null>) => {
  const stmt = 'SELECT * FROM dopamine';
  const values: any[] = [];
  const fetchData = await useQuerySQLite(db, stmt, values);
  dopamines.value = fetchData;
  //console.log(dopamines.value)
  if (dopamines.value.length == 0) {
    console.log("not dopamine found")
    const newDapamine = {
      id: Date.now(), // do not care about the id value (generated by sqlite)
      name: "Dopamine",
      startDate: dateToString(new Date()),
      recordBestThinkDay: 0,
      recordBestDoDay: 0,
      allDoDayCount: 0,
      allThinkDayCount: 0,
      daysCount: 0,
    };
    await handleAddDopamine(newDapamine)
    getAllDopamine(db)
  }else{
    dopaCaseActive = dopamines.value[0]
    await getHistoryByDopamineId(dopaCaseActive.id)
    isHistory.value = true
  }

}
const handleAddDopamine = async (newDopamine: Dopamine) => {
  if (db.value) {
    const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
    const lastId = await storageServ.addDopamine(newDopamine);
    newDopamine.id = lastId;
    dopamines.value.push(newDopamine as never);
  }
};


//history ------------------------------------------
const handleAddHistory = async (newHistory: DopaHistory) => {
  if (db.value) {
    const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
    const lastId = await storageServ.addDopaHistory(newHistory);
    newHistory.id = lastId;
    dopaHistorys.value.push(newHistory as never);
  }
};
const getHistoryByDopamineId = async (dopamineId: number) => {
  console.log('git history')
  const stmt = `SELECT * FROM history WHERE id_dopamine=${dopamineId}`;
  const values: any[] = [];
  const fetchData = await useQuerySQLite(db, stmt, values);
  dopaHistorys.value = fetchData;
  if (dopaHistorys.value.length == 0) {
    console.log("not dopaHistorys found")
    let newhistory = {
      id: Date.now(),
      id_dopamine: 1,
      dateTime: dateToString(new Date()),
      lastDoDay: 0,
      lastThinkDay: 0,
      thinkCount: 0,
      doCount: 0,
    }
    await handleAddHistory(newhistory)
  }

  console.log(dopaHistorys.value)
  historyActive = dopaHistorys.value[0]
  console.log(historyActive)
  //isHistory.value = true

};
const handleUpdateDopaHistory = async (updDopaHistory: DopaHistory) => {
  if (db.value) {
    const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
    await storageServ.updateHistoryById(updDopaHistory);
    dopaHistorys.value = dopaHistorys.value.map((dopaHistory: DopaHistory) => {
      if (dopaHistory.id === dopaHistory.id) {
        // Clone the user and update the active property
        return {
          ...dopaHistory
          , doCount: updDopaHistory.doCount
          , thinkCount: updDopaHistory.thinkCount
          , lastDoDay: updDopaHistory.lastDoDay
          , lastThinkDay: updDopaHistory.lastThinkDay
        };
      } else {
        return dopaHistory;
      }
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
watch(isHistory, (newIsHistory) => {
  if (newIsHistory) {
    console.log(historyActive)
    setUpNextDay()
  }

})
watch(isDatabase, (newIsDatabase) => {
  if (newIsDatabase) {
    getAllDopamine(db).then(() => {
    })
    getAllUsers(db).then(() => {

    }).catch((error: any) => {
      const msg = `close database:
                          ${error.message ? error.message : error}`;
      console.error(msg);
      Toast.show({
        text: msg,
        duration: 'long'
      });
    });
  } else {
    const msg = `newDb is null`;
    console.error(msg);
    Toast.show({
      text: msg,
      duration: 'long'
    });
  }
});


/* return {
   isInitComplete, dbInitialized, users, handleAddUser,
   handleUpdateUser, handleDeleteUser,
   dopamines, dopaHistorys, dateNow,
   dateToString, handleAddHistory, handleUpdateDopaHistory,
   dopaDo,dopaThink
 }*/

</script>
<style scoped>
.action-btn-box {
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  z-index: 1;
  width: 100%;
}

.main-body {
  position: relative;
  height: 100%;
}
</style>