<template>
    <base-layout pageTitle="记录">
        <template v-slot:actions-end>
        </template>
        <div v-if='commentCount==0' class="comment-body">
            <img width="250px" height="250px" src="/assets/planet.png"  alt="">
            <span class="info" >没有记录。。。</span>
        </div>
        <comment-box  :commentCount="commentCount" v-for="dopahistory in SqliteStore.dopaCaseActive?.dopaHistorys"
            :dopaHistory="dopahistory"></comment-box>
    </base-layout>
</template>
<script lang="ts" setup>
import BaseLayout from '@/components/app/BaseLayout.vue';
import CommentBox from '@/components/comment/CommentBox.vue';
import { onMounted, ref } from 'vue';
import { useMySqliteStore } from '@/stores/sqlite'
import { IonIcon } from '@ionic/vue';

const SqliteStore = useMySqliteStore()
let commentCount = ref(0)

onMounted(() => {
    for (let i = 0; i < SqliteStore.dopaCaseActive?.dopaHistorys?.length!; i++) {
        commentCount.value += SqliteStore.dopaCaseActive?.dopaHistorys![i].comments.length!
    }
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