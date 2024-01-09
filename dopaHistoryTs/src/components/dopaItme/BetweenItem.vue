<template>
    <div class="item-box">
        <div class="item-layer cicle-layer">
            <div class="item-cicle-box">
                <div class="item-cicle">
                    <div><span class="dopa-think">1</span></div>
                    <div><span class="dopa-do">2</span></div>
                </div>
                <span class="item-date">01/01/2024</span>
            </div>

            <div class="item-days">
                <div><span class="dopa-think">1 days</span></div>
                <div><span class="dopa-do">2 days</span></div>
            </div>
        </div>
        <div class="item-layer">
            <div class="item-line"></div>
        </div>

    </div>
</template>
<style scoped>
.item-box {
    height: 100px;
    width: 300px !important;
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

.item-days {
    display: grid;
    justify-content: center;
}

.item-days div:first-child {
    margin-bottom: 5px;
}

.item-days div:last-child {
    margin-top: 5px;
}

.item-line {
    width: 100%;
    height: 5px;
    background-color: black;
    z-index: 1;
}
</style>