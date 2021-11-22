<template>
  <view :style="{ position: 'absolute', backgroundColor: 'transparent', width: '100%', height: '100%'}">
    <view :style="{ position: 'absolute', left: '50%', marginLeft: -18, top: '50%', marginTop: -40}"><nb-text :style="{color: '#ccc', fontSize: 60, fontWeight: '100'}">+</nb-text></view>
    <view class="touchTopLeft" :style="{height: 25, width: 25}"></view>
    <view class="touchTopRight" :style="{height: 25, width: 25}"></view>
    <view class="touchBottomLeft" :style="{height: 25, width: 25}"></view>
    <view class="touchBottomRight" :style="{height: 25, width: 25}"></view>
  </view>
</template>
<style>
.touchTopLeft {
  top: 20;
  left: 20;
  position: absolute;
  borderTopWidth: 3;
  borderLeftWidth: 3;
  borderColor: #ccc;
  borderTopLeftRadius: 15;
}
.touchTopRight {
  top: 20;
  right: 20;
  position: absolute;
  borderTopWidth: 3;
  borderRightWidth: 3;
  borderColor: #ccc;
  borderTopRightRadius: 15;
}
.touchBottomLeft {
  left: 20;
  bottom: 20;
  position: absolute;
  borderBottomWidth: 3;
  borderLeftWidth: 3;
  borderColor: #ccc;
  borderBottomLeftRadius: 15;
}
.touchBottomRight {
  right: 20;
  bottom: 20;
  position: absolute;
  borderBottomWidth: 3;
  borderRightWidth: 3;
  borderColor: #ccc;
  borderBottomRightRadius: 15;
}
</style>