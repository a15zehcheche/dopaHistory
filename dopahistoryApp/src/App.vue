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
      customAnimation: (baseEl, presentingEl, duration, direction) => {
        const animation = new AnimationBuilder()
          .addElement(presentingEl)
          .duration(duration)
          .keyframes([
            { offset: 0, opacity: '0', transform: 'translateY(100%)' },
            { offset: 1, opacity: '1', transform: 'translateY(0)' },
          ])
          .easing('ease-in-out')
          .fromTo('opacity', 0, 1)
          .fromTo('transform', 'translateY(100%)', 'translateY(0)');

        return animation.play();
      },
    }
  }
});
</script>