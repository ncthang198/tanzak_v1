<template>
  <view :style="{paddingTop: 10, marginBottom: -8}">
    <view :style="{backgroundColor: '#225e84', padding: 15, borderRadius: 10}">
      <text :style="{color: 'white', fontWeight: '500'}"> {{ message }} </text>
    </view>
    <view :style="{alignSelf: 'center'}">
      <view class='triangle'></view>
    </view>
  </view>
</template>

<script>

export default {
  props: ['message', 'handleParentCallBack', 'placeholder'],
  data() {
    return {
    }
  },
  methods: {

  }
};
</script>

<style scoped>
  .triangle {
    width: 0;
    height: 0;
    background-color: transparent;
    borderStyle: solid;
    borderLeftWidth: 10;
    borderRightWidth: 10;
    borderBottomWidth: 15;
    borderLeftColor: transparent;
    borderRightColor: transparent;
    borderBottomColor: #225e84;
    transform: rotate(180deg)
  }
</style>
