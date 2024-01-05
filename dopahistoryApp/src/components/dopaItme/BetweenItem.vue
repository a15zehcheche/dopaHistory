<template>
    <div class="item-box">
        <div class="item-layer">
            <div class="item-cicle">
                <div><span class="dopa-think">1</span></div>
                <div><span class="dopa-do">2</span></div>
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

.item-cicle {
    height: 60px;
    width: 60px;
    border: 1px solid black;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: white;
    margin-left: 50px;
}

.item-cicle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}
.item-line {
    width: 100%;
    height: 5px;
    background-color: black;
    z-index: 1;
}</style>