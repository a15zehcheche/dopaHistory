<template>
    <div class="dopa-case-btn">{{ name }}</div>
</template>
<script lang="ts" setup>
const props = defineProps(['name'])

</script>
<style scoped>
.dopa-case-btn {
    display: inline-flex;
    align-items: center;
    width: auto;
    height: 35px;
    padding: 0 20px;
    margin: 0 10px;
    /* flex-shrink: 0; 
     border: 1px solid black;
    box-sizing: border-box;
    */
    white-space: nowrap;
    border-radius: 10px;
    background-color: darkseagreen;
  
}
</style>