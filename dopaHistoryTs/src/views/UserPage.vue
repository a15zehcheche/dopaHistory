<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>User</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Tab 1</ion-title>
                </ion-toolbar>
            </ion-header>
            <div>replace</div>
        </ion-content>
    </ion-page>
</template>
<script lang="ts" setup>

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { onMounted, ref } from 'vue'
import { useBackButton, useIonRouter } from '@ionic/vue';
import { App } from '@capacitor/app';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

let UserHardBackClickt=false
/*useBackButton(-1, () => {
    UserHardBackClickt = true
    console.log('user按返回')

})*/
/*
onBeforeRouteLeave((to, from, next) => {
    console.log('leave to user')
    console.log(UserHardBackClickt)
    if(UserHardBackClickt){
        next(false)
        UserHardBackClickt=false
        App.minimizeApp()
    }else{
        next(true)
    }
   
})*/





onMounted(() => {
   
    /*
    document.addEventListener('backbutton', function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('hello');

    }, false);
    */
})

</script>