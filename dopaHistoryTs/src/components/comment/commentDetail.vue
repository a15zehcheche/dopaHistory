<template>
    <ChildBaseLayout page-title="详情">
        <template v-slot:actions-end> <ion-icon id="open-action-sheet" size="small"
                icon="assets/menu-dots.svg"></ion-icon></template>
        <ion-action-sheet trigger="open-action-sheet" header="操作" :buttons="actionSheetButtons"
            @didDismiss="logResult($event)"></ion-action-sheet>
        <ion-card color="light" v-if="dataReady">
            <ion-card-content :id="'comentLaber' + comment.id" contenteditable="true" class="laber"
                @blur="updateDopaName($event, comment)">
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
    </ChildBaseLayout>
</template>
<script lang="ts" setup>
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonIcon, IonActionSheet, toastController } from '@ionic/vue';
import ChildBaseLayout from '@/components/app/ChildBaseLayout.vue';
const props = defineProps(['pageDefaultBackLink'])

import { useAppStore } from '@/stores/app'
const AppStore = useAppStore()
import { useMySqliteStore } from '@/stores/sqlite'
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { HistoryComment } from '@/models/HistoryComment';

const SqliteStore = useMySqliteStore()
const route = useRoute()
const router = useRouter()

const dataReady = ref(false)
const comment = ref()
const history = ref()
onMounted(async () => {
    dataReady.value = false
    comment.value = await SqliteStore.getCommentById(parseInt(route.params.id as string))
    comment.value = comment.value[0]
    history.value = await SqliteStore.handleGetHistoryId(comment.value.id_history)
    history.value = history.value[0]
    console.log(route.params.id, comment.value, history.value)
    dataReady.value = true
})
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

const actionSheetButtons = [
    {
        text: '删除',
        role: 'destructive',
        data: {
            action: 'delete',
        },
    },
    {
        text: '收藏',
        role: 'favorite',
        data: {
            action: 'favorite',
        }
    },
    {
        text: '取消',
        role: 'cancel',
        data: {
            action: 'cancel',
        },
    },
];
const logResult = async (ev: CustomEvent) => {
    console.log(JSON.stringify(ev.detail, null, 2));
    switch (ev.detail.role) {
        case 'destructive':
            console.log('delete');
            await deleteCommet()
            router.back()
            break;
        case 'favorite':
            console.log('favorite');
            await starCommet()
            break;
        case 'backdrop':
            break;
    }
};

const deleteCommet = () => {
    SqliteStore.handleDeleteCommentById(comment.value.id)

}

const starCommet = async () => {
    comment.value.stars = !comment.value.stars
    await SqliteStore.handleUpdatComment(comment.value)

}


const updateDopaName = async (event: Event, comment: HistoryComment) => {
    event.preventDefault()
    let dopaLaber = document.getElementById('comentLaber' + comment.id) as HTMLInputElement
    //console.log('Update', event, dopaLaber.textContent)

    if (comment.content != dopaLaber.textContent) {
        comment.content = dopaLaber.textContent!
        SqliteStore.handleUpdatComment(comment)

        const toast = await toastController.create({
            message: '更新成功!',
            duration: 500,
            position: 'top',
        });
        await toast.present();
    }
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