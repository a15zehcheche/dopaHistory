<template>
  <ion-page mode="ios">
    <ion-header :translucent="true" class="app-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            text=""
            :default-href="pageDefaultBackLink"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
        <ion-buttons slot="end">
          <slot name="actions-end"></slot>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
        <slot />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
} from "@ionic/vue";

const props = defineProps(['pageDefaultBackLink','pageTitle'])

</script>