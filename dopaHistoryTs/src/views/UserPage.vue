<template>
    <base-layout pageTitle="用户">
        <ion-button router-link='/setting'>to setting</ion-button>
    </base-layout>
</template>
<script lang="ts" setup>
import BaseLayout from '@/components/app/BaseLayout.vue';
import { useRouter } from 'vue-router';
import { useIonRouter, IonButton} from '@ionic/vue';
const router = useRouter();

const toSetting = () => {
    router.push('/setting')
}
</script>