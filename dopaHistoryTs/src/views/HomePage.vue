<template>
  <base-layout pageTitle="主页">
    <div class="main-body" @scroll="handleScroll">
      <app-date-time :dateToday="SqliteStore.dateToday"></app-date-time>
      <dopa-bar-main></dopa-bar-main>
      <dopa-case v-if="SqliteStore.dopaCaseActive" :dopamine="SqliteStore.dopaCaseActive"></dopa-case>
      <comment-box v-if="dataReady" :comments="SqliteStore.historyActive!.comments"></comment-box>
      <div class="action-btn-box">
        <action-fab :class="[{ 'hide': mainScrollTop},{ 'none': mainScrollTop>15}]"></action-fab>
      </div>


      <!--div class="action-btn-box" v-if="AppStore.testMode">
        <ion-button v-if="AppStore.testMode" color="primary" @click="passNextday">next day</ion-button>
        <ion-button v-if="AppStore.testMode" color="primary" @click="SqliteStore.getHistory(dopaCaseActive!.id)">get
          history</ion-button>
        <ion-button v-if="AppStore.testMode" color="primary" @click="textBtn">test</ion-button>
      </div-->
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
import ActionFab from '@/components/app/ActionFab.vue';




/* app main logic------------------------------------------------ */

import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()
const { dataReady, dopaCaseActive } = toRefs(SqliteStore)
import { useAppStore } from '@/stores/app'
const AppStore = useAppStore()
import CommentBox from '@/components/comment/CommentBox.vue';

const mainScrollTop = ref()

const dopaDo = async (n: number) => {
  SqliteStore.dopaDo(n)
}

const dopaThink = async (n: number) => {
  SqliteStore.dopaThink(n)
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

const handleScroll = (event: Event) => {
  // 获取滚动位置
  mainScrollTop.value = (event.target as HTMLInputElement).scrollTop
  //console.log('Scroll Y:', mainScrollTop.value);

}




</script>
<style lang="less" >
/*.action-btn-box {
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 50px;
  z-index: 1;
  width: 100%;
  flex-wrap: wrap;
}*/


.main-body {
  
  height: 100%;
  overflow-y: scroll;

}

.action-btn-box {
  position: absolute;
  bottom: 0px;
  z-index: 1;
  width: 100%;
  .action-btn {
      display: block;
      transition: transform 0.5s ease-in-out;
  }


}

.hide {
  .action-btn {
    transform: translateY(200px);
  }
}
.none{
  .action-btn {
    display: none;
  }
}
</style>