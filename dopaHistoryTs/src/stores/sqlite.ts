import { defineStore } from 'pinia'
import {
  Ref, ref, computed, getCurrentInstance, watch
} from 'vue';
import { Toast } from '@capacitor/toast';
import { useQuerySQLite } from '@/hooks/UseQuerySQLite';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Dopamine } from '@/models/Dopamine';
import { DopaHistory } from '@/models/DopaHistory'


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


  //my app variables

  const dopaCaseActive = ref<Dopamine>();
  const dataReady = ref(false);
  const dopamines = ref<Dopamine[]>([]);
  let historyActive: DopaHistory;
  const dateToday = ref<Date>(new Date());
  const selectedDopaCaseSegment = ref<any>(null);

  const getAllDopamine = async (db: Ref<SQLiteDBConnection | null>) => {
    const stmt = 'SELECT * FROM dopamine';
    const values: any[] = [];
    const fetchData = await useQuerySQLite(db, stmt, values);
    dopamines.value = fetchData;
    //console.log(dopamines.value)
    if (dopamines.value.length == 0) {
      console.log("2- not dopamine found Crear first dopamine")
      const newDapamine = {
        id: Date.now(), // do not care about the id value (generated by sqlite)
        name: "Dopamine",
        startDate: dateToString(new Date()),
        recordBestThinkDay: 0,
        recordBestDoDay: 0,
        allDoDayCount: 0,
        allThinkDayCount: 0,
        daysCount: 0,
        dopaHistorys: []
      };
      await handleAddDopamine(newDapamine)
      await getAllDopamine(db)
    } else {
      console.log("3 - dopamine set dopaCaseActive")
      selectedDopaCaseSegment.value = selectedDopaCaseSegment.value ? selectedDopaCaseSegment.value : 'd1'
      let DopaActiveId = selectedDopaCaseSegment.value.replace("d", '')
      dopaCaseActive.value = dopamines.value.find((element) => element.id == DopaActiveId);
      await getHistoryByDopamineId(dopaCaseActive.value!.id)

    }

  }
  const getHistoryByDopamineId = async (dopamineId: number) => {
    console.log('4 - get Dopa history by id :' + dopamineId)
    const stmt = `SELECT * FROM history WHERE id_dopamine=${dopamineId}`;
    const values: any[] = [];
    const fetchData = await useQuerySQLite(db, stmt, values);
    dopaCaseActive!.value!.dopaHistorys = fetchData.reverse() as DopaHistory[]

    //console.log(dopaCaseActive!.value!.dopaHistorys)
    if (dopaCaseActive!.value!.dopaHistorys.length == 0) {
      console.log("5 - not dopaHistorys found creat first dopaHistory")
      let newhistory = {
        id: Date.now(),
        id_dopamine: dopaCaseActive.value!.id,
        dateTime: dateToString(new Date()),
        lastDoDay: 0,
        lastThinkDay: 0,
        thinkCount: 0,
        doCount: 0,
      }
      await handleAddHistory(newhistory)
      getHistoryByDopamineId(dopamineId)
    } else {
      console.log("6 - set history active")
      historyActive = dopaCaseActive!.value!.dopaHistorys[0]
      console.log(dopaCaseActive)
      dataReady.value = true
    }
  };


  watch(isDatabase, (newIsDatabase) => {
    if (newIsDatabase) {
      console.log("App db ready")
      //console.log('locastorage : ', localStorage.getItem("selectedDopaCaseSegment"))
      selectedDopaCaseSegment.value = localStorage.getItem("selectedDopaCaseSegment")
      if (selectedDopaCaseSegment.value == null) localStorage.setItem("selectedDopaCaseSegment", "d1");

      getAllDopamine(db).then(() => {


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

  //new day check
  const convertToTwoDigit = (number: number) => {
    return number < 10 ? '0' + number.toString() : number.toString();
  }

  const dateToString = (date: Date) => {
    return `${date.getFullYear()}-${convertToTwoDigit(date.getMonth() + 1)}-${convertToTwoDigit(date.getDate())}`
  }
  const calNextDate = (actualDate: Date) => {
    let nextDatelocal = new Date(actualDate.getTime())
    nextDatelocal.setTime(actualDate.getTime() + (24 * 60 * 60 * 1000));
    nextDatelocal.setHours(0)
    nextDatelocal.setMinutes(0)
    nextDatelocal.setSeconds(0)
    //console.log(nextDatelocal.toString())
    return nextDatelocal
  }

  const calCountDay = (): number => {
    let countDay = new Date(dateToString(dateToday.value)).getTime() - new Date(dopaCaseActive!.value!.startDate).getTime()
    countDay = countDay / 86400000
    countDay = parseInt(countDay.toString())
    console.log(countDay)
    return countDay
  }

  const checkBestRecord = async (dopaHistory: DopaHistory) => {
    if (dopaHistory.lastDoDay > dopaCaseActive?.value!.recordBestDoDay!) {
      dopaCaseActive!.value!.recordBestDoDay = dopaHistory.lastDoDay
    }
    if (dopaHistory.lastThinkDay > dopaCaseActive?.value!.recordBestThinkDay!) {
      dopaCaseActive!.value!.recordBestThinkDay = dopaHistory.lastThinkDay
    }
    //-await handleUpdateDopamine(dopaCaseActive!.value!)
  }


  const calRestMilliSecondsToNextDay = (): number => {
    //calulate next day
    let nextDate = calNextDate(dateToday.value)
    let restMilliSecondsToNextDay = nextDate.getTime() - new Date().getTime()
    console.log(restMilliSecondsToNextDay)
    return restMilliSecondsToNextDay
  }

  let dateIterval: any;

  const setDateIterval = (restMilliSecondsToNextDay: number) => {
    // set date check interval
    //console.log('set date check intervel')
    if (dateIterval) {
      //console.log('clear old interval')
      clearInterval(dateIterval)
    }

    dateIterval = setInterval(function () {
      //console.log('interval')
      dateToday.value = calNextDate(dateToday.value)
      console.log('pass to next date' + dateToday.value.toString())
      checkIsPassNextDay()
    }, restMilliSecondsToNextDay);

  }
  const differenceBetweenDays = (date1: Date, date2: Date) => {

    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //console.log(diffTime + " milliseconds");
    //console.log(diffDays + " days");
    return diffDays
  }

  const checkIsPassNextDay = async () => {
    console.log("检查是不是同一天")
    console.log(dateToString(new Date(historyActive.dateTime)), dateToString(dateToday.value))
    if (dateToString(new Date(historyActive.dateTime)) != dateToString(dateToday.value)) {
      console.log('新的一天')
      //dateToday.value = new Date()
      let dayPast = differenceBetweenDays(dateToday.value, new Date(historyActive.dateTime))
      if (historyActive.doCount > 0 || historyActive.thinkCount > 0) {
        console.log("Creat new Dopa History")
        let lastDoDay = historyActive.doCount > 0 ? dayPast : (historyActive.lastDoDay + dayPast)
        let lastThinkDay = historyActive.thinkCount > 0 ? dayPast : (historyActive.lastThinkDay + dayPast)
        const newHistory = ref({
          id: Date.now(),
          id_dopamine: dopaCaseActive!.value!.id,
          dateTime: dateToString(dateToday.value),
          lastDoDay: lastDoDay,
          lastThinkDay: lastThinkDay,
          thinkCount: 0,
          doCount: 0,
        })
        let lastId = await handleAddHistory(newHistory.value)
        if (lastId != 0) {
          newHistory.value.id = lastId
          dopaCaseActive!.value!.dopaHistorys!.unshift(newHistory.value);
          historyActive = newHistory.value
        }
        checkBestRecord(newHistory.value)
      } else {
        historyActive.dateTime = dateToString(dateToday.value)
        historyActive.lastDoDay = dayPast + historyActive.lastDoDay;
        historyActive.lastThinkDay = dayPast + historyActive.lastThinkDay;
        await checkBestRecord(historyActive)
        console.log('set history active date : ' + dateToString(dateToday.value))
        await handleUpdateDopaHistory(historyActive)
      }
      dopaCaseActive!.value!.daysCount = calCountDay()
      await handleUpdateDopamine(dopaCaseActive!.value!)
    } else {
      console.log("同一天不修改任何当前数据")

    }
    console.log('更新check intervar.')
    let milliSecoundsReal = calRestMilliSecondsToNextDay()
    setDateIterval(milliSecoundsReal)


    console.log('history actualizat set today date')

    //getHistoryByDopamineId(dopaCaseActive!.id)

  }

  //testData check
  const getHistory = async (dopamineId: number) => {
    console.log('4 - get Dopa history by id :' + dopamineId)
    const stmt = `SELECT * FROM history WHERE id_dopamine=${dopamineId}`;
    const values: any[] = [];
    const fetchData = await useQuerySQLite(db, stmt, values);
    console.log(fetchData)
  }
  const passNextday = () => {
    dateToday.value = calNextDate(dateToday.value)
    console.log(dateToday.value)
    checkIsPassNextDay()
  }



  //handle
  const handleDeleteDopamine = async (id: number) => {
    if (db.value) {
      await handleDeleteHistoryByDopamineId(id)
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      const lastId = await storageServ.deleteDopamineById(id);
      dopamines.value = dopamines.value.filter(dopamine => (dopamine as Dopamine).id !== id);
    }
  };
  const handleAddDopamine = async (newDopamine: Dopamine) => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      const lastId = await storageServ.addDopamine(newDopamine);
      newDopamine.id = lastId;
      dopamines.value.push(newDopamine as never);
    }
  };
  const handleUpdateDopamine = async (updDopamine: Dopamine) => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      await storageServ.updateDopamine(updDopamine);
    }
  };
  const handleDeleteHistoryByDopamineId = async (id: number) => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      const lastId = await storageServ.deleteHistoryByDopamineId(id);
    }
  };

  const handleAddHistory = async (newHistory: DopaHistory): Promise<number> => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      const lastId = await storageServ.addDopaHistory(newHistory);
      //historyActive.id = lastId as number;
      return lastId
    }
    return 0
  };
  const handleUpdateDopaHistory = async (updDopaHistory: DopaHistory) => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      await storageServ.updateHistoryById(updDopaHistory);
    }
  };


  //action
  const dopaDo = async () => {
    historyActive.doCount++
    if (historyActive.thinkCount == 0) {
      //if do, think +1
      historyActive.thinkCount++
      await addAllThinkCount()
    }
    await handleUpdateDopaHistory(historyActive)
    addAllDoCount()
    //console.log("do ++")
  }

  const dopaThink = async () => {
    historyActive.thinkCount++
    await handleUpdateDopaHistory(historyActive)
    addAllThinkCount()
    //console.log("think ++")
  }
  const addAllDoCount = async () => {
    dopaCaseActive!.value!.allDoDayCount++
    await handleUpdateDopamine(dopaCaseActive!.value!)
  }
  const addAllThinkCount = async () => {
    dopaCaseActive!.value!.allThinkDayCount++
    await handleUpdateDopamine(dopaCaseActive!.value!)
  }
  const setDopaCaseActive = async (dopaId: number) => {
    dopaCaseActive.value = dopamines.value.find((element) => element.id == dopaId);
    await getHistoryByDopamineId(dopaCaseActive.value!.id)
    checkIsPassNextDay()
  }
  return {
    dateToday, dopamines, dataReady, dopaCaseActive, selectedDopaCaseSegment,
    initConnection, ClearConnection,
    getAllDopamine, handleAddDopamine, setDopaCaseActive, handleDeleteDopamine,
    dopaDo, dopaThink, checkIsPassNextDay, getHistory, passNextday
  }

})