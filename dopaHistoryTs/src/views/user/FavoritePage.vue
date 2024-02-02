<template>
    <ChildBaseLayout page-title="收藏">
        <comment-box :comments="comments"></comment-box>
    </ChildBaseLayout>
</template>
<script lang="ts" setup>
import { IonToggle, IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { ref, onMounted } from 'vue'
import ChildBaseLayout from '@/components/app/ChildBaseLayout.vue';
const props = defineProps(['pageDefaultBackLink'])

import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()

import CommentBox from '@/components/comment/CommentBox.vue';
import { HistoryComment } from '@/models/HistoryComment';
const comments = ref<HistoryComment[]>([])
onMounted(async() => {
    comments.value = await SqliteStore.getAllFavoriteComment()
    console.log(comments.value)
})

</script>