<template>
  <base-layout pageTitle="主页">
    <div class="main-body">
      <app-date-time :dateToday="SqliteStore.dateToday"></app-date-time>
      <dopa-bar-main></dopa-bar-main>
      <dopa-case v-if="SqliteStore.dopaCaseActive" :dopamine="SqliteStore.dopaCaseActive"></dopa-case>

      <div class="action-btn-box">
        <ion-button color="danger" @click="dopaDo">Do</ion-button>
        <ion-button color="warning" @click="dopaThink">Think</ion-button>
        <ion-button v-if="AppStore.testMode" color="primary" @click="passNextday">next day</ion-button>
        <ion-button v-if="AppStore.testMode" color="primary" @click="SqliteStore.getHistory(dopaCaseActive!.id)">get
          history</ion-button>
        <ion-button v-if="AppStore.testMode" color="primary" @click="textBtn">test</ion-button>


      </div>
      <!--user-list :users="users" :onUpdateUser="handleUpdateUser" :onDeleteUser="handleDeleteUser"></user-list-->

    </div>
  </base-layout>
</template>
  
<script lang="ts" setup>
const toSetting = () => {
  router.push('/setting')
}

import {
  defineComponent, ref, computed, getCurrentInstance, onMounted,
  onBeforeUnmount, watch, Ref, toRefs
} from 'vue';
import { useBackButton, useIonRouter } from '@ionic/vue';
import {
  IonPage, IonHeader, IonToolbar, IonButton, IonBackButton, IonTitle,
  IonContent, IonCard
} from '@ionic/vue';
import { Toast } from '@capacitor/toast';
import { User } from '@/models/User';
import { Dopamine } from '@/models/Dopamine';
import { DopaHistory } from '@/models/DopaHistory';
//import UserForm from '@/components/UserForm.vue';
import { useQuerySQLite } from '@/hooks/UseQuerySQLite';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import AppDateTime from '../components/time/AppDateTime.vue';
import DopaCase from '../components/dopaItme/DopaCase.vue'
import DopaBarMain from '../components/dopaBar/DopaBarMain.vue'
import BaseLayout from '@/components/app/BaseLayout.vue';
//new Date('2024-01-15T23:59:55'),
const router = useIonRouter();




/* app main logic------------------------------------------------ */

import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()
const { dataReady, dopaCaseActive } = toRefs(SqliteStore)
import { useAppStore } from '@/stores/app'
const AppStore = useAppStore()





const dopaDo = async () => {
  SqliteStore.dopaDo()
}

const dopaThink = async () => {
  SqliteStore.dopaThink()
}


const textBtn = () => {
  console.log(SqliteStore.dateToday)
}
const passNextday = () => {
  console.log('to next day')
  SqliteStore.passNextday()


}

watch(dataReady, (newIsHistory) => {
  if (newIsHistory) {
    console.log("Whatch check next day interval")
    SqliteStore.checkIsPassNextDay()
  }
})





</script>
<style scoped>
.action-btn-box {
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 10px;
  z-index: 1;
  width: 100%;
  flex-wrap: wrap;
}

.action-btn-box ion-button {
  width: 150px;
}

.main-body {
  position: relative;
  height: 100%;
}
</style>