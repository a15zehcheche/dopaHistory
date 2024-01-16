<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet name="pages"></ion-router-outlet>
      <AppMenu></AppMenu>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import AppMenu from '../components/app/AppMenu.vue'
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';


</script>

<style>

</style>
