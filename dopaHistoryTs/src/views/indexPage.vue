<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" mode="ios">
        <ion-tab-button tab="home" href="/pages/home">
          <ion-icon aria-hidden="true" size="small" icon="assets/apps.svg" />
          <ion-label>首页</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="user" href="/pages/user">
          <ion-icon aria-hidden="true" size="small" icon="assets/user.svg"/>
          <ion-label>我的</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';


</script>
