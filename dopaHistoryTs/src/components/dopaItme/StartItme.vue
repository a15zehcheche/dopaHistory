<template>
    <div class="item-box">
        <div class="item-layer cicle-layer">
            <div class="item-cicle-box">
                <div class="item-cicle">
                    <img width="30px" src="@/assets/flag-checkered.svg" />
                </div>
                <span class="item-date">01/01/2024</span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.item-box {
    height: 100px;
    width: 60px !important;
    position: relative;
    flex-shrink: 0;
}

.item-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
}

.cicle-layer {
    display: grid;
    grid-template-columns: 60px auto;
}
.item-cicle-box{
    position: relative;
    display: flex;
    justify-content: center;
}
.item-date{
    position: absolute;
    justify-content: center;
    bottom: -25px;
}
.item-cicle {
    height: 60px;
    width: 60px;
    border: 1px solid black;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: white;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

</style>