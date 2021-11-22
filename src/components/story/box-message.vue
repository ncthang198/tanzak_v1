<template>
  <view class="type_box" :style="{ shadowOffset: { width: 2,height: 2 } }">
    <view :style="[boxAndroid(), { backgroundColor: setBoxColor }]" class="type_box_view">
      <nb-text v-if="isCharacter" :style="{ color: setColorName(), marginBottom: 10, fontSize: 13 }">
        {{ message.character }}
      </nb-text>
      <view>
        <render-html type="box" :row="18" :paragraph="message.paragraph" :textColor="setTextColor()" :style="{ paddingBottom: 7}" />
      </view>
    </view>
  </view>
</template>
<script>
import RenderHtml from './render-html.vue'
import { Platform } from "react-native";
export default {
  props: ['message', 'isCharacter', 'setBoxColor', 'info'],
  components: {RenderHtml},
  methods: {
    setTextColor() {
      return this.message.textColor
    },
    setColorName() {
      return this.info[this.message.character]['namecolor']
    },
    isImage() {
      return (this.message.paragraph.includes('<img')) ? true : false
    },
    boxAndroid() {
      return (Platform.OS === "android") ? ((this.isImage()) ? {} : {borderBottomWidth: 1, borderRightWidth: 1}) : {}
    }
  }
}
</script>
<style>
.type_box_view{
  width: 100%;
  paddingTop: 13;
  paddingLeft: 12;
  paddingRight: 12;
  paddingBottom: 0;
  borderRadius: 10;
  borderColor: 'rgba(0,0,0,0.1)';
}
.type_box{
  marginLeft: 18;
  marginRight: 18;
  marginTop: 15;
  marginBottom: 2;
  alignItems: center;
  justifyContent: center;
  shadowColor: black;
  shadowOpacity: 0.3;
  shadowRadius: 2;
  elevation: 13;
}

</style>
