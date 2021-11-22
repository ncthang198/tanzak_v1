<template>
  <view class="box_content" :style="[position, { alignSelf: position.alignSelf, marginBottom: 0, paddingBottom: 0 }]" >
    <nb-thumbnail :style="{width: 40, height: 40, borderRadius: 20}" v-if="avatar" :source="avatar" />
    <view>
      <nb-text
        v-if="message.character !== 'readerUser' && !isBotCharacter()"
        class="name_character"
        :style="[position, { color: setColorName ? setColorName : '#fff', fontWeight: 'bold', fontSize: 13 }]">
        {{ message.character }}
      </nb-text>
      <view v-if="isImageInMessage == false">
        <view
          :class="bubby"
          :style="[{ borderRightColor: boxColorLeft, borderLeftColor: boxColorRight }, bubble_style()]"
        />
        <!-- <view :class="classRender" :style="{backgroundColor: setBoxColor(), borderRadius: 20}" v-if="isNextChapter">
          <next-chapter-message :message="message" />
        </view> -->
        <render-html
          :row="12"
          :paragraph="message.paragraph"
          :class="classRender"
          :style="[{ backgroundColor: setBoxColor()}, boxStyle()]"
          :textColor="setTextColor()"
        />
      </view>
      <view v-else>
        <render-html
          :row="12"
          :paragraph="message.paragraph"
          :class="classRender"
          :style="[{backgroundColor: setBoxColor(), borderRadius: 20 }, imageMargin()]"
          :textColor="setTextColor()"
        />
      </view>
    </view>
  </view>
</template>
<script>

import RenderHtml from './render-html.vue'
import NextChapterMessage from './next-chapter-message.vue'
import { Platform } from 'react-native'

export default {
  props: [
    'setColorName',
    'isImageInMessage',
    'bubby',
    'message',
    'isCharacter',
    'avatar',
    'position',
    'boxColorLeft',
    'boxColorRight',
    'classRender',
    'isNextChapter',
    'isLeft'
  ],
  components: {RenderHtml, NextChapterMessage},
  methods: {
    isBotCharacter(){
      return ['07', '08'].includes(this.message.character)
    },
    // set color for text message
    setTextColor(){
      return this.message.textColor
    },
    // set color for message box
    setBoxColor() {
      if (this.isImageInMessage)
        return 'transparent'
      if (this.message.boxcolor)
        return this.message.boxcolor
      return this.isLeft ? '#fff' : '#85E249'
    },
    imageMargin() {
      if(this.classRender.includes('left')) {
        return {
          marginLeft: -5
        }
      }
      if(this.classRender.includes('right')) {
        return {
          marginRight: -5
        }
      }
      // Case no avatar
      return {
        marginRight: 0
      }
    },
    boxStyle(){
      if(Platform.OS === 'ios'){
        return {
          borderRadius: 20,
          paddingTop: 13,
          paddingBottom: 5,
          paddingLeft: 16,
          paddingRight: 16
        }
      }else{
        return {
          borderRadius: 20,
          paddingTop: 18,
          paddingBottom: 8,
          paddingLeft: 20,
          paddingRight: 20
        }
      }
    },
    bubble_style() {
      if(!this.avatar) {
        if(this.bubby == 'bubblyRight'){ return { top: 9, right: 0 }}
        if(this.bubby == 'bubblyLeft'){ return { left: 0, top: 9 }}
      }
      return {}
    }
  }
}
</script>
<style>
.name_character {
  fontSize: 16;
  marginLeft: 10;
  marginRight: 10;
}
.box_content {
  marginTop: 3;
  paddingTop: 13;
  paddingLeft: 10;
  marginBottom: 5;
  paddingBottom: 5;
}
.render_chat {
  marginTop: 3;
  marginLeft: 8;
  paddingTop: 13;
  marginRight: 8;
  paddingLeft: 12;
  paddingRight: 12;
  paddingBottom: 2;
}
.render_chat_left{
  marginTop: 3;
  marginLeft: 15;
  paddingTop: 13;
  marginRight: 5%;
  paddingLeft: 12;
  paddingRight: 0;
  paddingBottom: 2;
}
.render_chat_right{
  marginTop: 3;
  marginLeft: 5%;
  paddingTop: 13;
  marginRight: 15;
  paddingLeft: 12;
  paddingRight: 5;
  paddingBottom: 2;
}
.bubblyRight{
  top: 15;
  right: 7;
  position: absolute;
  borderTopWidth: 0;
  borderRightWidth: 0;
  borderLeftWidth: 15;
  borderBottomWidth: 20;
  borderTopRightRadius: 10;
  borderBottomRightRadius: 50;
  borderTopColor: transparent;
  borderRightColor: transparent;
  borderBottomColor: transparent;
}
.bubblyLeft{
  left: 7;
  top: 15;
  position: absolute;
  borderTopWidth: 0;
  borderLeftWidth: 0;
  borderRightWidth: 15;
  borderBottomWidth: 20;
  borderTopLeftRadius: 10;
  borderBottomLeftRadius: 50;
  borderTopColor: transparent;
  borderLeftColor: transparent;
  borderBottomColor: transparent;
}
</style>
