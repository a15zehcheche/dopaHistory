<template>
    <ChildBaseLayout page-title="多巴案例">
        <template v-slot:actions-end>
            <ion-button id="open-modal">
                <ion-icon slot="icon-only" :icon="add"></ion-icon>
            </ion-button>
        </template>
        <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="1" :breakpoints="[0, 1]">
            <div class="block">
                <div>
                    <ion-input label="案例名称" v-model="dopaNameInput" label-placement="floating" :counter="true"
                        :maxlength="20"></ion-input>
                </div>
                <div class="action-btn">
                    <ion-button expand="block" color="danger" @click="close()">
                        取消
                    </ion-button>
                    <ion-button expand="block" color="success" @click="confirm()">
                        确认
                    </ion-button>
                </div>
            </div>
        </ion-modal>

    </ChildBaseLayout>
</template>
<script lang="ts" setup>
import { IonModal, IonButton, IonInput, IonIcon } from '@ionic/vue';
import { add } from "ionicons/icons";
import { ref } from 'vue'

import ChildBaseLayout from '@/components/app/ChildBaseLayout.vue';
const props = defineProps(['pageDefaultBackLink'])
const dopaNameInput = ref()
const modal = ref();

const close = () => { 
    dopaNameInput.value =''
    modal.value.$el.dismiss(); 
}
const confirm = () => modal.value.$el.dismiss();



</script>
<style>
.block {
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 0 20px;
}

ion-modal {
    --height: auto;
}

.action-btn {
    display: grid;
    grid-template-columns: auto auto;
}
</style>