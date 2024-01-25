<template>
    <ion-card color="light" v-for=" comment in dopaHistory.comments" :router-link="`/comment/detail/${comment.id}`">
        <ion-card-content>
            {{ comment.content }}
        </ion-card-content>
        <ion-card-header>
            <!--ion-card-title>Card Title</ion-card-title-->
            <ion-card-subtitle>
                <div class="comment-box-info">
                    <div>{{ dopaHistory.dateTime }}</div>
                    <div>
                        <span class="dopa-do">{{ dopaHistory.doCount }}</span>
                        &nbsp;-&nbsp;
                        <span class="dopa-think">{{ dopaHistory.thinkCount }}</span>
                    </div>
                </div>
            </ion-card-subtitle>
        </ion-card-header>
    </ion-card>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, watch } from 'vue'
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';

const props = defineProps(['dopaHistory'])
import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()
import { useAppStore } from '@/stores/app'
const AppStore = useAppStore()
const { dataReady, } = toRefs(SqliteStore)

</script>

<style lang="less" scoped>
.comment-box-info {
    color: var(--ion-color-medium);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

ion-card-content {
    text-align: justify;
}
</style>