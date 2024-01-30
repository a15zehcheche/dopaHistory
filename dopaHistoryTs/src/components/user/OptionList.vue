<template>
    <div class="option-list-box">
        <ion-item class="list-item" :router-link="`/dopaCase`">
            <ion-icon aria-hidden="true" size="small" icon="assets/dopaItem3.svg" />
            <ion-label class="laber">多巴案例</ion-label>
            <ion-icon aria-hidden="true" size="small" icon="assets/angle-right.svg" />
        </ion-item>
        <ion-item class="list-item" :router-link="`/favorite`">
            <ion-icon aria-hidden="true" size="small" icon="assets/star.svg" />
            <ion-label class="laber">收藏</ion-label>
            <ion-icon aria-hidden="true" size="small" icon="assets/angle-right.svg" />
        </ion-item>
        <ion-item class="list-item" :router-link="`/setting`">
            <ion-icon aria-hidden="true" size="small" icon="assets/settings.svg" />
            <ion-label class="laber">设置</ion-label>
            <ion-icon aria-hidden="true" size="small" icon="assets/angle-right.svg" />
        </ion-item>
    </div>
</template>
<script setup lang="ts">
import { IonIcon, IonItem, IonLabel } from "@ionic/vue";
</script>
<style lang="less">
.option-list-box {
    .list-item {
        border-top: 1px solid var(--ion-color-medium);
        border-bottom: 1px solid var(--ion-color-medium);
        margin-bottom: 5px;

        .laber {
            margin-left: 10px;
        }
    }

}
</style>