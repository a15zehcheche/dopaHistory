<template>
    <ion-card color="light" v-for=" comment in comments" :router-link="`/comment/detail/${comment.id}`">
        <ion-card-content>
            {{ comment.content }}
        </ion-card-content>
        <ion-card-header>
            <!--ion-card-title>Card Title</ion-card-title-->
            <ion-card-subtitle>
                <div class="comment-box-info">
                    <div>{{ formatDateTime(comment.dateTime) }}</div>
                    <ion-icon v-if="comment.stars" size="small" icon="assets/star.svg" color="warning"></ion-icon>
                </div>
            </ion-card-subtitle>
        </ion-card-header>
    </ion-card>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, watch } from 'vue'
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon } from '@ionic/vue';

const props = defineProps(['comments'])
import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()
import { useAppStore } from '@/stores/app'
const AppStore = useAppStore()
const { dataReady, } = toRefs(SqliteStore)

const formatDateTime = (dateTime: number) => {
    const date = new Date(dateTime);
    // 获取年、月、日、小时和分钟
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // 格式化为  的字符串
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDateTime;
}
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