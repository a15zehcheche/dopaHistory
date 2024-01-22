<template>
    <base-layout pageTitle="记录">
        <!--div class="comment-body">
            <img width="150px" height="150px" src="/assets/under-construction.png"  alt="">
            <span class="info" >页面施工中。。。</span>
        </div-->
        <comment-box v-for="dopahistory in SqliteStore.dopaCaseActive?.dopaHistorys"
            :dopaHistory="dopahistory"></comment-box>
    </base-layout>
</template>
<script lang="ts" setup>
import BaseLayout from '@/components/app/BaseLayout.vue';
import CommentBox from '@/components/comment/CommentBox.vue';
import { onMounted } from 'vue';
import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()

const getComment = async (historyIndex: number) => {
    let historyId = SqliteStore.dopaCaseActive?.dopaHistorys![historyIndex].id!
    let comments = await SqliteStore.handleGetCommentByHistoryId(historyId)
    //console.log(comments)
    SqliteStore.dopaCaseActive!.dopaHistorys![historyIndex].comments = comments
    console.log(SqliteStore.dopaCaseActive?.dopaHistorys![historyIndex].comments)
}
onMounted(() => {
    for (let i = 0; i < SqliteStore.dopaCaseActive?.dopaHistorys?.length!; i++) {
        getComment(i)
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