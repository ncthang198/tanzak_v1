<template>
  <animated:view :style="{opacity: opacity}">
    <view :style="{marginTop: 20}">
      <view :style="{ paddingLeft: 6, marginLeft: 5, marginRight: 5, width: '95%', borderRadius: 20}">
        <fast-image :style="{height: 200, width: 200, resizeMode: 'stretch'}" :source="message.uri" />
      </view>
    </view>
  </animated:view>
</template>

<script>
import { Animated, Easing } from 'react-native';
import FastImage from 'react-native-fast-image'
export default {
  props: ['message'],
  components: {
    Animated,
    FastImage
  },
  created(){
    this.opacity = new Animated.Value(0)
  },
  mounted(){
    Animated.timing(this.opacity, {
        toValue: 1,
        duration: 2000,
        delay: 500,
        easing: Easing.linear
      }).start(() => {

      })
  }
}
</script>
<style></style>
