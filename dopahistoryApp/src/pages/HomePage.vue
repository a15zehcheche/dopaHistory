<template>
    <base-layout page-title="Home">
        <AppDateTime :dateNow="dateNow"></AppDateTime>
       
        <DopaCase></DopaCase>
        
    </base-layout>
</template>
  
<script>


import AppDateTime from '../components/time/AppDateTime.vue';
import DopaCase from '../components/dopaItme/DopaCase.vue'
//new Date('2024-01-05T23:59:55'),
export default {
    components: {
        AppDateTime,
        DopaCase
    },
    data() {
        return {
            dateNow: new Date(),
            nextDate: '',
            restMilliSecondsToNextDay: 0,
            dateIterval:null,
        };
    },
    created() {
        this.calRestMilliSecondsToNextDay()
        //set check interval
        this.setDateIterval()

    },
    methods: {
        setDateIterval() {
            // set date check interval
            console.log('set date check intervel')
            if(this.dateIterval){
                //console.log('clear old interval')
                clearInterval(this.dateIterval)
            }

            let element = this;
            this.dateIterval = setInterval(function () {
                element.dateNow = new Date()
                //console.log('interval')
                element.setUpNextDay()
            }, this.restMilliSecondsToNextDay);
            
        },
        calNextDate(actualDate) {
            let nextDatelocal = actualDate.addDays(1)
            nextDatelocal.setHours(0)
            nextDatelocal.setMinutes(0)
            nextDatelocal.setSeconds(0)
            return nextDatelocal
        },
        calRestMilliSecondsToNextDay() {
            //calulate next day
            this.nextDate = this.calNextDate(this.dateNow)
            this.restMilliSecondsToNextDay = this.nextDate.getTime() - this.dateNow.getTime()
            console.log(this.restMilliSecondsToNextDay)
        },
        setUpNextDay() {
            this.calRestMilliSecondsToNextDay()
            this.setDateIterval()
            console.log("new day")
        }
    },
    computed: {

    },
};
</script>