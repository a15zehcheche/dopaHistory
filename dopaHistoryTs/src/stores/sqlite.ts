import { defineStore } from 'pinia'
import {
  Ref, ref, computed, getCurrentInstance, watch
} from 'vue';
import { Toast } from '@capacitor/toast';
import { useQuerySQLite } from '@/hooks/UseQuerySQLite';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Dopamine } from '@/models/Dopamine';
import { DopaHistory } from '@/models/DopaHistory'
import { HistoryComment } from '@/models/HistoryComment';

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
  let historyActive = ref<DopaHistory>();
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
        dateTime: dateToString(new Date(dopaCaseActive.value!.startDate)),
        lastDoDay: 0,
        lastThinkDay: 0,
        thinkCount: 0,
        doCount: 0,
        comments: []
      }
      await handleAddHistory(newhistory)
      getHistoryByDopamineId(dopamineId)
    } else {
      console.log("6 - set history active")
      historyActive.value = dopaCaseActive!.value!.dopaHistorys[0]
      console.log(dopaCaseActive)
      dopaCaseActive!.value!.dopaHistorys.forEach(async dopaHistory => {
        dopaHistory.comments = await handleGetCommentByHistoryId(dopaHistory.id)
      })
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

  const dateIterval = ref<any>();

  const setDateIterval = (restMilliSecondsToNextDay: number) => {
    // set date check interval
    //console.log('set date check intervel')

    clearInterval(dateIterval.value)

    dateIterval.value = setInterval(function () {
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
    console.log("---------check is same day--------")
    dateToday.value = new Date()
    console.log(dateToString(new Date(historyActive.value!.dateTime)), dateToString(dateToday.value))
    if (dateToString(new Date(historyActive.value!.dateTime)) != dateToString(dateToday.value)) {
      console.log('新的一天')
      let dayPast = differenceBetweenDays(new Date(dateToString(dateToday.value)), new Date(historyActive.value!.dateTime))
      console.log('pass day :', dayPast)
      if (historyActive.value!.doCount > 0 || historyActive.value!.thinkCount > 0) {
        console.log("Creat new Dopa History")
        let lastDoDay = historyActive.value!.doCount > 0 ? dayPast : (historyActive.value!.lastDoDay + dayPast)
        let lastThinkDay = historyActive.value!.thinkCount > 0 ? dayPast : (historyActive.value!.lastThinkDay + dayPast)
        const newHistory = ref({
          id: Date.now(),
          id_dopamine: dopaCaseActive!.value!.id,
          dateTime: dateToString(dateToday.value),
          lastDoDay: lastDoDay,
          lastThinkDay: lastThinkDay,
          thinkCount: 0,
          doCount: 0,
          comments: []
        })
        let lastId = await handleAddHistory(newHistory.value)
        if (lastId != 0) {
          newHistory.value.id = lastId
          dopaCaseActive!.value!.dopaHistorys!.unshift(newHistory.value);
          historyActive.value = newHistory.value
        }
        await checkBestRecord(newHistory.value)
      } else {
        historyActive.value!.dateTime = dateToString(dateToday.value)
        historyActive.value!.lastDoDay = dayPast + historyActive.value!.lastDoDay;
        historyActive.value!.lastThinkDay = dayPast + historyActive.value!.lastThinkDay;
        await checkBestRecord(historyActive.value!)

        await handleUpdateDopaHistory(historyActive.value!)
      }
      dopaCaseActive!.value!.daysCount = calCountDay()
      await handleUpdateDopamine(dopaCaseActive!.value!)
    } else {
      console.log("同一天不修改任何当前数据")

    }
    console.log('更新check intervar.', dateIterval.value)
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
      //删除所有的comment
      const stmt = `SELECT * FROM history WHERE id_dopamine=${id}`;
      const values: any[] = [];
      const fetchData = await useQuerySQLite(db, stmt, values)
      let dopaHistorys = fetchData as DopaHistory[]
      for (let i = 0; i < dopaHistorys.length; i++) {
        await handleDeleteCommentByHistoryId(dopaHistorys[i].id)
      }

      //删除所有history
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
  const handleAddHistoryCommnet = async (historyComment: HistoryComment): Promise<number> => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      const lastId = await storageServ.addComment(historyComment);
      //historyActive.id = lastId as number;
      return lastId
    }
    return 0
  };
  const handleGetCommentByHistoryId = async (historyId: number): Promise<HistoryComment[]> => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      const fetchData = await storageServ.getCommentByHistoryId(historyId);
      return fetchData.reverse() as HistoryComment[]
    }
    return [] as HistoryComment[]
  }
  const handleDeleteCommentByHistoryId = async (id: number) => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      const lastId = await storageServ.deleteCommentByHistoryId(id)
    }
  };
  const handleGetHistoryId = async (id: number) => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      const fetchData = await storageServ.getHistoryId(id);
      return fetchData as History[]
    }
    return []
  };
  const handleDeleteCommentById = async (commentId: number) => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      const lastId = await storageServ.deleteCommentById(commentId)
      dopamines.value = dopamines.value.map(dopamine => {
        // 使用 map 方法遍历 dopaHistorys 数组
        dopamine.dopaHistorys = dopamine.dopaHistorys!.map(history => {
          // 使用 map 方法遍历 comments 数组
          history.comments = history.comments.filter(comment => comment.id !== commentId);
          return history;
        });
        return dopamine;
      });
    }
  };
  const handleUpdatComment = async (updHistoryCommnet: HistoryComment) => {
    if (db.value) {
      const isConn = await sqliteServ.isConnection(dbNameRef.value, false);
      await storageServ.updateCommentById(updHistoryCommnet);
      dopamines.value = dopamines.value.map(dopamine => {
        // 使用 map 方法遍历 dopaHistorys 数组
        dopamine.dopaHistorys = dopamine.dopaHistorys!.map(history => {
          // 使用 map 方法遍历 comments 数组
          history.comments = history.comments.map(comment => {
            // 如果 comment 的 id 等于目标 id，则进行修改
            if (comment.id === updHistoryCommnet.id) {
              // 修改 comment 对象的属性
              comment = {...updHistoryCommnet}
              return { ...comment, /* 修改的属性 */ };
            } else {
              return comment;
            }
          });
          return history;
        });
        return dopamine;
      });

    }
  };


  //action
  const dopaDo = async (n: number) => {
    historyActive.value!.doCount += n

    if (historyActive.value!.doCount < 0) {
      historyActive.value!.doCount = 0
    }
    if (historyActive.value!.thinkCount == 0 && n > 0) {
      //if do, think +1
      await dopaThink(1)
    }
    await handleUpdateDopaHistory(historyActive.value!)
    await addAllDoCount(n)
  }

  const dopaThink = async (n: number) => {
    let count = historyActive.value!.thinkCount + n

    if (count < 0) {
      historyActive.value!.thinkCount = 0
    }
    console.log(count, historyActive.value!.comments.length)
    if (count >= historyActive.value!.comments.length) {
      historyActive.value!.thinkCount = count
      await handleUpdateDopaHistory(historyActive.value!)
      await addAllThinkCount(n)
    }
  }
  const addAllDoCount = async (n: number) => {
    dopaCaseActive!.value!.allDoDayCount += n
    if (dopaCaseActive!.value!.allDoDayCount < 0) {
      dopaCaseActive!.value!.allDoDayCount = 0
    }
    await handleUpdateDopamine(dopaCaseActive!.value!)
  }
  const addAllThinkCount = async (n: number) => {
    dopaCaseActive!.value!.allThinkDayCount += n
    if (dopaCaseActive!.value!.allThinkDayCount < 0) {
      dopaCaseActive!.value!.allThinkDayCount = 0
    }
    await handleUpdateDopamine(dopaCaseActive!.value!)
  }
  const setDopaCaseActive = async (dopaId: number) => {
    dopaCaseActive.value = dopamines.value.find((element) => element.id == dopaId);
    await getHistoryByDopamineId(dopaCaseActive.value!.id)
    checkIsPassNextDay()
  }
  const getComment = async (historyIndex: number) => {
    let historyId = dopaCaseActive.value!.dopaHistorys![historyIndex].id
    let comments = await handleGetCommentByHistoryId(historyId)
    //console.log(comments)
    dopaCaseActive.value!.dopaHistorys![historyIndex].comments = comments
    console.log(dopaCaseActive.value!.dopaHistorys![historyIndex].comments)
  }
  const getCommentById = async (commentId: Number): Promise<DopaHistory[]> => {
    const stmt = `SELECT * FROM comment WHERE id=${commentId}`;
    const values: any[] = [];
    const fetchData = await useQuerySQLite(db, stmt, values);
    return fetchData as DopaHistory[];
  }

  return {
    dateToday, dopamines, dataReady, dopaCaseActive, selectedDopaCaseSegment, historyActive,
    initConnection, ClearConnection,
    getAllDopamine, handleAddDopamine, setDopaCaseActive, handleDeleteDopamine, handleUpdateDopamine,
    handleGetCommentByHistoryId, handleAddHistoryCommnet, handleGetHistoryId, handleDeleteCommentById,
    handleUpdatComment,
    dopaDo, dopaThink, checkIsPassNextDay, getHistory, passNextday, getComment, getCommentById
  }

})