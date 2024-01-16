<template>
    <base-layout pageTitle="用户">
        <OptionList></OptionList>
    </base-layout>
</template>
<script lang="ts" setup>
import OptionList from '@/components/user/OptionList.vue';
import BaseLayout from '@/components/app/BaseLayout.vue';
import { useRouter } from 'vue-router';
import { useIonRouter, IonButton} from '@ionic/vue';
const router = useRouter();


</script>