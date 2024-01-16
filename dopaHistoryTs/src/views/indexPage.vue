<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" mode="ios">

        <ion-tab-button tab="home" @click="routerToHome" :class="{ 'tab-selected': isTabActive('home') }">
          <ion-icon aria-hidden="true" size="small" icon="assets/apps.svg" />
          <ion-label>首页</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="statistic" @click="routerToStatis" :class="{ 'tab-selected': isTabActive('statis') }">
          <ion-icon aria-hidden="true" size="small" icon="assets/stats.svg" />
          <ion-label>统计</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="comment" @click="routerToComment" :class="{ 'tab-selected': isTabActive('comment') }">
          <ion-icon aria-hidden="true" size="small" icon="assets/comment.svg" />
          <ion-label>记录</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="user" @click="routerToUser" :class="{ 'tab-selected': isTabActive('user') }">
          <ion-icon aria-hidden="true" size="small" icon="assets/user.svg" />
          <ion-label>我的</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { useBackButton, useIonRouter } from '@ionic/vue';
import { App } from '@capacitor/app';
import { useRoute } from 'vue-router';

const router = useIonRouter();
const vroute =useRoute();
const routerToHome = () => {
  router.replace('/pages/home')
}
const routerToUser = () => {
  router.replace('/pages/user')
}
const routerToStatis =()=>{
  router.replace('/pages/statis')

}
const routerToComment =()=>{
  router.replace('/pages/comment')
}

const isTabActive = (tabName:String) => {
  return vroute.name === tabName;
};

useBackButton(-1, () => {
  //console.log('按返回')
  if (!router.canGoBack()) {
    App.minimizeApp()
  }
})

</script>

<style>

</style>
