<template>
    <ion-content class="ion-padding">
        <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-button @click="cancel()">取消</ion-button>
                    </ion-buttons>
                    <ion-title>记录</ion-title>
                    <ion-buttons slot="end">
                        <ion-button :strong="true" @click="confirm()">创建</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <ion-item>
                    <ion-textarea ref="input" placeholder="在这里输入内容" :auto-grow="true" value="">
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
import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()

const modal = ref();
const input = ref();

const cancel = () => modal.value.$el.dismiss(null, 'cancel');

const confirm = () => {
    const content = input.value.$el.value;
    modal.value.$el.dismiss(content, 'confirm');
};

const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
    if (ev.detail.role === 'confirm') {
        console.log("confirm", ev.detail.data)
        addComment(ev.detail.data)
    }
    else if (ev.detail.role === 'cancel') {
        console.log("cancel", ev.detail.data)
    }
};

const addComment = async (content: string) => {
    let newComment = {
        id: new Date().getTime(),
        id_history: SqliteStore.historyActive?.id!,
        content: content
    }
    await SqliteStore.handleAddHistoryCommnet(newComment)
    await SqliteStore.dopaThink(1)
}
</script>