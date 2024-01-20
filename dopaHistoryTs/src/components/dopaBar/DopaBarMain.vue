<template>
    <ion-segment :scrollable="true" value="heart" v-model="SqliteStore.selectedDopaCaseSegment" @ionChange="handleSegmentChange">
        <ion-segment-button v-for="dopamine in SqliteStore.dopamines" :value="'d' + dopamine.id" @click="setSelectDopaCaseId(dopamine.id)">
            <ion-label>{{ dopamine.name }}</ion-label>
        </ion-segment-button>
    </ion-segment>
    <!--div class="dopa-bar-content">
        <div class="dopa-box">
            <dopa-bar-item v-for="dopamine in dopamines" :name="dopamine.name"></dopa-bar-item>
        </div>
    </div-->
</template>
<script lang="ts" setup>
import DopaBarItem from "./DopaBarItem.vue"
import { IonIcon, IonSegment, IonSegmentButton, IonLabel, IonItem } from '@ionic/vue';
import { useMySqliteStore } from '@/stores/sqlite'
const SqliteStore = useMySqliteStore()


console.log(localStorage.getItem('selectedDopaCaseSegment'))
const handleSegmentChange = (event: any) => {
    localStorage.setItem("selectedDopaCaseSegment", event.detail.value);
    //console.log('Selected segment:', event.detail.value);
}
const setSelectDopaCaseId =(dopaId:number)=>{
    SqliteStore.setDopaCaseActive(dopaId)
}


</script>
<style scoped>
.dopa-bar-content {
    width: 100%;
    height: 50px;
    /*border: 1px solid black;
    box-sizing: border-box;*/
    display: flex;
    align-items: center;
    overflow: hidden;
    overflow-x: scroll;
}

.dopa-bar-content::-webkit-scrollbar {
    display: none;
}

ion-segment::-webkit-scrollbar {
    display: none;
}

.dopa-box {
    padding: 0 10px;
    display: flex;
    grid-auto-flow: column;
}
</style>