<template>
    <div class="date-time-box">
        <div>{{fullDate}}</div>
        <div>{{ fullTime }}</div>
    </div>
    <img  width="20px" src="@/assets/total.svg"/>
    <img  width="20px" src="@/assets/chess-queen.svg"/>

  
</template>
<script>
export default {
    props:[],
    data(){
        return{
            dateNow:null,
            dateIterval:null
        }
    },
    created(){
        this.dateNow = new Date()
        this.startDateIterval()
    },
    methods:{
        setDateNow(){
            this.dateNow = new Date();
        },
        convertToTwoDigit(number) {
            return number < 10 ? '0' + number.toString() : number.toString();
        },
        startDateIterval(){        
            let element = this;  
            this.dateIterval = setInterval(function(){
                element.dateNow = new Date()
                //console.log('interval')
            }, 1000);
        }
    },
    computed:{

        fullDate(){
            let date = this.convertToTwoDigit(this.dateNow.getDate());
            let month = this.convertToTwoDigit(this.dateNow.getMonth()+1)
            let year = this.dateNow.getFullYear()
            return `${date} / ${month} / ${year}`
        },
        fullTime(){
            let hours=this.convertToTwoDigit(this.dateNow.getHours());
            let minutes=this.convertToTwoDigit(this.dateNow.getMinutes());
            let seconds=this.convertToTwoDigit(this.dateNow.getSeconds());
            return `${hours} : ${minutes} : ${seconds}`
        }
    }

}
</script>
<style scoped>
.date-time-box{
    display: flex;
    justify-content: space-between;
    padding: 10px;
    font-size: 24px;
}
</style>