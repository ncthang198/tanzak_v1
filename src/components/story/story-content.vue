<template>
  <view>
    <box-message
      v-if="isBox"
      :info="info"
      :setBoxColor="setBoxColor"
      :message="message"
      :isCharacter="isCharacter"
    />
    <view v-else>
      <view v-if="isCharacter">
        <character-message
          :avatar="getAvatar"
          :setColorName="setColorName"
          :message="message"
          :bubby="position"
          :position="setPossiton"
          :boxColorLeft="setBorderLeftColor"
          :boxColorRight="setBorderRightColor"
          :isImageInMessage="isImageInMessage"
          :classRender="classRender"
          :isNextChapter="isNextChapter"
          :isLeft="checkLeftPosition"
        />
      </view>
      <view v-else>
        <view v-if="isNextChapter" :style="[setPossiton, { marginTop: 20, alignItems: 'center'}]">
          <stamp-message v-if="isStamp" :message="message" />
        </view>

        <!-- Story teller box render -->
        <view v-else class="type_box" :style="{ shadowOffset: { width: 2,height: 2 } }">
          <view :style="[boxAndroid(), { backgroundColor: setBoxColorStoryCaller }]" class="type_box_view">
              <!-- <view
                class="box_content"
                :style="{ paddingBottom: 7 }"
              > -->
                <render-html
                  :row="1000"
                  :path_file="path_file"
                  :other_character="isOtherCharacter"
                  :paragraph="message.paragraph"
                  :isStoryCaller="!isStorytellerImage"
                  :textColor="setTextColor"
                />
              <!-- </view> -->
          </view>
        </view>
        <!-- Story teller box render -->

        <!-- <view
            v-else
            class="box_content"
            :style="{ paddingBottom: 7 }"
          >
                <render-html
                  :row="1000"
                  :path_file="path_file"
                  :other_character="isOtherCharacter"
                  :paragraph="message.paragraph"
                  :isStoryCaller="!isStorytellerImage"
                  :textColor="setTextColor"
                />
          </view> -->

      </view>
    </view>
  </view>
</template>
<script>
  import React from 'react'
  import DOMParser from 'react-native-html-parser'
  import RenderHtml from './render-html.vue'
  import BoxMessage from './box-message.vue'
  import CharacterMessage from './character-message.vue'
  import StampMessage from './stamp-message.vue'
  import NextChapterMessage from './next-chapter-message.vue'
  import { Platform } from "react-native"
  import * as FileSystem from 'expo-file-system'
  import { mapGetters } from 'vuex'

  const IS_STORY_CALLER_BG = '#e6edf4'

  export default {
    components: {RenderHtml, BoxMessage, NextChapterMessage, CharacterMessage, StampMessage},
    props: ['message', 'info', 'other_character', 'path_file'],
    data(){
      return{
        IS_STORY_CALLER_BG: IS_STORY_CALLER_BG,
        styleObj:{
          boxPlatform: {
            // paddingBottom: Platform.OS === "android" ? 10 : 0,
          },
          itemIn: {
            alignSelf: 'flex-start',
            flexDirection:'row'
          },
          itemOut: {
            alignSelf: 'flex-end',
            flexDirection:'row-reverse'
          }
        },
      }
    },
    computed: {
      ...mapGetters({
        getPathFile: 'bookDetail/getPathFile'
      }),
      isBox() {
        return this.message.box
      },
      isNextChapter() {
        return this.message.nextChapter
      },
      isComment() {
        return this.message.comment
      },
      isStamp() {
        return this.message.stamp
      },
      isCharacter() {
        return (this.info[this.message.character]) ? true : false
      },

      getAvatar(){
        const avatar = this.info[this.message.character]['avatar']
        if(avatar){
          if(this.info[this.message.character]['localImage'])
            return avatar
          return this.handleImage(avatar)
        }
        return null
      },
      isAvatar() {
        if (this.isCharacter)
          return (this.info[this.message.character]['avatar']) ? true : false
      },
      isFirstOrderMessage() {
        if (this.isCharacter)
          return (this.message.orderMessage == 1) ? true : false
      },
      setColorName() {
        if (this.isCharacter)
          return this.info[this.message.character]['namecolor']
      },
      isImageInMessage() {
        return this.message.paragraph.toString().includes('img')
      },
      setBoxColor() {
        if (this.isImageInMessage)
          return 'transparent'
        if (this.message.boxcolor)
          return this.message.boxcolor
        if (!this.isBox && !this.checkLeftPosition) {
          return '#85E249'
        }
        return '#fff'
      },
      setBoxColorStoryCaller() {
        box_color = this.message.boxcolor || IS_STORY_CALLER_BG
        return this.isStorytellerImage ? undefined : box_color
      },
      setTextColor(){
        return !this.isStorytellerImage ? this.message.textColor : ''
      },
      setBorderLeftColor() {
        return this.checkLeftPosition ? this.setBoxColor : "transparent"
      },
      setBorderRightColor() {
        return this.checkLeftPosition ? "transparent" : this.setBoxColor
      },
      setPossiton() {
        if(this.message.auto_stamp)
          return this.styleObj.itemIn
        if (this.isCharacter) {
          return this.checkLeftPosition ? this.styleObj.itemIn : this.styleObj.itemOut
        }
        if(this.message.book)
          return this.styleObj.itemIn
        if(this.message.comment || this.message.stamp)
          return this.styleObj.itemOut
      },
      checkLeftPosition() {
        try {
          let position = this.info[this.message.character]['position']
          if(!position)
            return true
          return (position == 'left') ? true : false
        } catch (error) {
          return false
        }
      },
      position() {
        return this.checkLeftPosition ? 'bubblyLeft' : 'bubblyRight'
      },
      classRender() {
        return this.isAvatar ? (this.checkLeftPosition ? 'render_chat_left' : 'render_chat_right') : 'render_chat'
      },
      isOtherCharacter() {
        return this.other_character = (this.message.character) ? this.message.character : ''
      },
      isStorytellerImage() {
        if (this.isOtherCharacter)
          return (this.message.paragraph.toString().includes('img')) ? true : false
        return false

      }
    },
    methods: {
      handleImage(url_img) {
        return {uri: `${FileSystem.documentDirectory}${this.getPathFile}${url_img}`}
      },

      boxAndroid() {
        return {}
        return (Platform.OS === "android") ? ((this.isImage()) ? {} : {borderBottomWidth: 1, borderRightWidth: 1}) : {}
      }
    }
  };
</script>
<style>
.box_content {
  marginTop: 15;
  paddingTop: 13;
  paddingLeft: 10;
  marginBottom: 2;
  paddingBottom: 2;
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

.type_box_view{
  width: 100%;
  paddingTop: 13;
  paddingLeft: 13;
  paddingRight: 13;
  paddingBottom: 5;
  borderRadius: 10;
  borderColor: 'rgba(0,0,0,0.1)';
}
</style>
