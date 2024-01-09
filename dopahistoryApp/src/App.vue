<template>
  <ion-app>
    <ion-router-outlet animated="true" mode="ios" />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';



export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  data() {
    return {
    }
  }
});
</script>