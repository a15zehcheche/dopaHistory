<template>
    <base-layout pageTitle="记录">
        <template v-slot:actions-end>
        </template>
        <div v-if='commentCount == 0' class="comment-body">
            <img width="250px" height="250px" src="/assets/planet.png" alt="">
            <span class="info">没有记录。。。</span>
        </div>
        <comment-box v-for="dopahistory in SqliteStore.dopaCaseActive?.dopaHistorys"
            :dopaHistory="dopahistory"></comment-box>
    </base-layout>
</template>
<script lang="ts" setup>
import BaseLayout from '@/components/app/BaseLayout.vue';
import CommentBox from '@/components/comment/CommentBox.vue';
import { onMounted, ref } from 'vue';
import { useMySqliteStore } from '@/stores/sqlite'
import { IonIcon } from '@ionic/vue';
import { useAppStore } from '@/stores/app'
const AppStore = useAppStore()
const SqliteStore = useMySqliteStore()
const commentCount = ref(0)
onMounted(()=>{
    console.log(SqliteStore.dopaCaseActive?.dopaHistorys)
    SqliteStore.dopaCaseActive?.dopaHistorys!.forEach(dopaHistory => {
        dopaHistory.comments.forEach(comment=>{
            commentCount.value ++;
        })
    });
})
</script>


<style lang="less">
.comment-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .info {
        margin-top: 20px;
        color: var(--ion-color-medium);
    }
}
</style>