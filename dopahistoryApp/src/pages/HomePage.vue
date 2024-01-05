<template>
    <base-layout page-title="Home">
        <AppDateTime></AppDateTime>
    </base-layout>
</template>
  
<script>
import AppDateTime from '../components/time/AppDateTime.vue';
export default {
    components: {
        AppDateTime,
    },
    data() {
        return {};
    },
    computed: {

    },
};
</script>