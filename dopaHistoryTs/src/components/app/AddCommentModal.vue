<template>
    <ion-content class="ion-padding">
        <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-button @click="cancel()">Cancel</ion-button>
                    </ion-buttons>
                    <ion-title>Welcome</ion-title>
                    <ion-buttons slot="end">
                        <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <ion-item>
                    <ion-textarea ref="input" placeholder="Type something here" :auto-grow="true"
                        value="">
                    </ion-textarea>
                </ion-item>
            </ion-content>
        </ion-modal>
    </ion-content>
</template>
  
<script lang="ts" setup>
import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonItem,
    IonInput,
    IonTextarea
} from '@ionic/vue';
import { OverlayEventDetail } from '@ionic/core/components';
import { ref } from 'vue';


const modal = ref();
const input = ref();

const cancel = () => modal.value.$el.dismiss(null, 'cancel');

const confirm = () => {
    const name = input.value.$el.value;
    modal.value.$el.dismiss(name, 'confirm');
};

const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
    if (ev.detail.role === 'confirm') {
        console.log("confirm", ev.detail.data)
    }
    else if (ev.detail.role === 'cancel') {
        console.log("cancel", ev.detail.data)
    }
};
</script>