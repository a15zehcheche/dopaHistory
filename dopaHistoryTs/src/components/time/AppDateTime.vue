<template>
    <div class="date-time-box">

        <div class="date">
            <div>{{ fullDate }}</div>
        </div>
        <div class="day">
            {{ dayNames[dateNow.getDay()] }}
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup(){

    },
    props: {
        dateNow:{
            type:Date,
            required: true
        }
    },
    data() {
        return {
            dateIterval: null,
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            //dateNow:new Date()
        }
    },
    created() {
        //this.dateNow = new Date()
        //this.startDateIterval()
    },
    methods: {
        setDateNow() {
            //this.dateToday= new Date();
        },
        convertToTwoDigit(number: number) {
            return number < 10 ? '0' + number.toString() : number.toString();
        },

    },
    computed: {

        fullDate() {
            let date = this.convertToTwoDigit(this.dateNow.getDate());
            let month = this.convertToTwoDigit(this.dateNow.getMonth() + 1)
            let year = this.dateNow.getFullYear()
            return `${date} / ${month} / ${year}`
        },
        fullTime() {
            let hours = this.convertToTwoDigit(this.dateNow.getHours());
            let minutes = this.convertToTwoDigit(this.dateNow.getMinutes());
            let seconds = this.convertToTwoDigit(this.dateNow.getSeconds());
            return `${hours} : ${minutes} : ${seconds}`
        }
    }

})
</script>
<style scoped>
.date-time-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    font-size: 24px;
}
</style>