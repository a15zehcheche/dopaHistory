<template>
    <div class="comment-box" v-if="dopaHistory.comments?.length > 0">
        <ion-card color="light" v-for=" comment in dopaHistory.comments">
            <ion-card-content >
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
    .comment-box-info {
        color: var(--ion-color-medium);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    ion-card-content{
        text-align: justify;
    }
}
</style>