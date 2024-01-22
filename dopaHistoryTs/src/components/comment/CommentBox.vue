<template>
    <div class="comment-box" v-if="dopaHistory.comments?.length > 0">
        <div class="comment-box-title">
            <div>{{ dopaHistory.dateTime }}</div>
            <div>
                <span class="dopa-do">{{ dopaHistory.doCount }}</span>
                &nbsp;-&nbsp;
                <span class="dopa-think">{{ dopaHistory.thinkCount }}</span>
            </div>
        </div>

        <ion-card color="light" v-for=" comment in  dopaHistory.comments">
            <!--ion-card-header>
            <ion-card-title>Card Title</ion-card-title>
            <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
        </ion-card-header-->
            <ion-card-content> {{ comment.content }}</ion-card-content>
        </ion-card>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';

const props = defineProps(['dopaHistory'])
import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()

</script>

<style lang="less" scoped>
.comment-box {
    border-bottom: 1px solid var(--ion-color-light-shade);
    margin: 30px 0;
    background-color: var(--ion-color-medium-tint);

    .comment-box-title {
        font-size: 20px;
        display: flex;
        justify-content: space-between;
        height: 50px;
        align-items: center;
        padding: 0 20px;
        background-color: var(--ion-color-light-shade);
    }
}
</style>