<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" mode="ios">
        <ion-tab-button tab="home" @click="routerToHome">
          <ion-icon aria-hidden="true" size="small" icon="assets/apps.svg" />
          <ion-label>首页</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="user" @click="routerToUser">
          <ion-icon aria-hidden="true" size="small" icon="assets/user.svg"/>
          <ion-label>我的</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import {useBackButton, useIonRouter } from '@ionic/vue';
import { App } from '@capacitor/app';
const router = useIonRouter();

const routerToHome = ()=>{
  router.replace('/pages/home')
}
const routerToUser = ()=>{
  router.replace('/pages/user')
}

useBackButton(-1, () => {
  //console.log('按返回')
  if(!router.canGoBack()){
    App.minimizeApp()
  }
})

</script>
