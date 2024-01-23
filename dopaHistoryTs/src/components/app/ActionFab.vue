<template>
  <div>
    <ion-fab class="action-btn" horizontal="center" vertical="bottom">
      <ion-fab-button>
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button id="open-modal">
          <!--ion-button expand="block">Open</ion-button-->
          <ion-icon src="/assets/comment-alt-edit.svg"></ion-icon>
        </ion-fab-button>
      </ion-fab-list>
      <ion-fab-list side="start">
        <ion-fab-button color="danger" @click="dopaDo(-1)">
          <ion-icon :icon="chevronDown"></ion-icon>
        </ion-fab-button>
        <ion-fab-button color="danger" @click="dopaDo(1)">
          <ion-icon :icon="chevronUp"></ion-icon>
        </ion-fab-button>
      </ion-fab-list>
      <ion-fab-list side="end">
        <ion-fab-button color="warning" @click="dopaThink(1)">
          <ion-icon :icon="chevronUp"></ion-icon>
        </ion-fab-button>
        <ion-fab-button color="warning" @click="dopaThink(-1)">
          <ion-icon :icon="chevronDown"></ion-icon>
        </ion-fab-button>
      </ion-fab-list>
    </ion-fab>
    <AddCommentModal />
  </div>
</template>
  
<script lang="ts" setup>
import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/vue';
import { add, chevronBack, chevronDown, chevronForward, chevronUp } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useMySqliteStore } from '@/stores/sqlite'
import AddCommentModal from './AddCommentModal.vue'
const SqliteStore = useMySqliteStore()

const dopaDo = async (n: number) => {
  SqliteStore.dopaDo(n)
}

const dopaThink = async (n: number) => {
  SqliteStore.dopaThink(n)
}



</script>