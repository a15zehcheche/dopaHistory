<template>
    <div class="date-time-box">

        <div class="date">
            <div>{{ fullDate }}</div>
        </div>
        <div class="day">
            {{ dayNames[dateToday.getDay()] }}
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup(){

    },
    props: {
        dateToday:{
            type:Date,
            required: true
        }
    },
    data() {
        return {
            dateIterval: null,
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            //dateToday:new Date()
        }
    },
    created() {
        //this.dateToday = new Date()
        //this.startDateIterval()
    },
    methods: {
        setdateToday() {
            //this.dateToday= new Date();
        },
        convertToTwoDigit(number: number) {
            return number < 10 ? '0' + number.toString() : number.toString();
        },

    },
    computed: {

        fullDate() {
            let date = this.convertToTwoDigit(this.dateToday.getDate());
            let month = this.convertToTwoDigit(this.dateToday.getMonth() + 1)
            let year = this.dateToday.getFullYear()
            return `${date} / ${month} / ${year}`
        },
        fullTime() {
            let hours = this.convertToTwoDigit(this.dateToday.getHours());
            let minutes = this.convertToTwoDigit(this.dateToday.getMinutes());
            let seconds = this.convertToTwoDigit(this.dateToday.getSeconds());
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