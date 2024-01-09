<template>
  <div class="main-body">
    <app-date-time :dateNow="dateNow"></app-date-time>
    <dopa-case v-for="dopamine in dopamines" :dopamine="dopamine"></dopa-case>

    <div class="action-btn-box">
      <ion-button color="warning" @click="adduser">add user</ion-button>
      <ion-button color="danger" @click="addDopamine">add dopamine</ion-button>
    </div>
    <user-list :users="users" :onUpdateUser="handleUpdateUser" :onDeleteUser="handleDeleteUser"></user-list>
  </div>
</template>
  
<script lang="ts">

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

//import UserForm from '@/components/UserForm.vue';
import UserList from '@/components/UserList.vue';
import { useQuerySQLite } from '@/hooks/UseQuerySQLite';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import AppDateTime from '../components/time/AppDateTime.vue';
import DopaCase from '../components/dopaItme/DopaCase.vue'
//new Date('2024-01-05T23:59:55'),
export default defineComponent({
  components: {
    AppDateTime,
    DopaCase,
    IonButton,
    UserList
  },
  data() {
    return {
      dateNow: new Date() as any,
      nextDate: null as any,
      restMilliSecondsToNextDay: 0,
      dateIterval: null as any,
    };
  },
  created() {
    this.calRestMilliSecondsToNextDay()
    //set check interval
    this.setDateIterval()
  },
  methods: {
    addDopamine() {
      console.log('Add dopamine')
    },
    adduser() {
      let user: User
      user = {
        id: Date.now(),
        name: 'zehao che',
        active: 1
      }
      this.handleAddUser(user)

    },
    setDateIterval() {
      // set date check interval
      console.log('set date check intervel')
      if (this.dateIterval) {
        //console.log('clear old interval')
        clearInterval(this.dateIterval)
      }

      let element = this;
      this.dateIterval = setInterval(function () {
        element.dateNow = new Date()
        //console.log('interval')
        element.setUpNextDay()
      }, this.restMilliSecondsToNextDay);

    },
    calNextDate(actualDate: any) {

      let nextDatelocal = new Date(actualDate.getTime())
      nextDatelocal.setTime(actualDate.getTime() + (24 * 60 * 60 * 1000));
      nextDatelocal.setHours(0)
      nextDatelocal.setMinutes(0)
      nextDatelocal.setSeconds(0)
      //console.log(nextDatelocal.toString())
      return nextDatelocal
    },
    calRestMilliSecondsToNextDay() {
      //calulate next day
      this.nextDate = this.calNextDate(this.dateNow)
      this.restMilliSecondsToNextDay = this.nextDate.getTime() - this.dateNow.getTime()
      console.log(this.restMilliSecondsToNextDay)
    },
    setUpNextDay() {
      this.calRestMilliSecondsToNextDay()
      this.setDateIterval()
      console.log("new day")
    }
  },
  computed: {

  },
  setup() {
    const dbNameRef = ref('');
    const isInitComplete = ref(false);
    const isDatabase = ref(false);
    const users = ref<User[]>([]);
    const dopamines = ref<Dopamine[]>([]);
    const db = ref(null);
    const appInstance = getCurrentInstance();

    const router = useIonRouter();

    const sqliteServ = appInstance?.appContext.config.globalProperties.$sqliteServ;
    const storageServ = appInstance?.appContext.config.globalProperties.$storageServ;

    const dbInitialized = computed(() => !!db.value);
    const platform = sqliteServ.getPlatform();

    const getAllUsers = async (db: Ref<SQLiteDBConnection | null>) => {
      const stmt = 'SELECT * FROM users';
      const values: any[] = [];
      const fetchData = await useQuerySQLite(db, stmt, values);
      users.value = fetchData;

    }

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

    // dopamine handle api
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
        handleAddDopamine(newDapamine)
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
        getAllDopamine(db)
        getAllUsers(db).then(() => {

        })
          .catch((error: any) => {
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

    return {
      isInitComplete, dbInitialized, users, handleAddUser,
      handleUpdateUser, handleDeleteUser,dopamines
    }
  },

})
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