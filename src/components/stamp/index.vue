<template>

  <modal
    :animationType="'fade'"
    :transparent="true"
    :visible="showStampInput"
    :onRequestClose="(event) => {
      console.log('hahaha')
      checkClose(event)
    }"
  >
   <touchable-opacity     
   :style="{flex:1}"        
      :activeOpacity="1"
      :onPressOut="handleOverlayClick"
    >    
    <view class="background-modal" :style="{ flex:1, justifyContent: 'flex-end', alignItems:'center',}">
      <view class="background-content" :style="{ width: widthScreen, minHeight: 280, borderRadius: 10, backgroundColor:'white', paddingHorizontal: 20,paddingTop:10}">
        
        <TouchableWithoutFeedback>
                <!-- <view :style="{wight:100, height:100, backgroundColor:'green'}"> -->
<view v-if="!isOverlay" :style="{flex: 1}">
    <view :style="{flexWrap: 'wrap', alignItems: 'center'}">
      <view :style="{width: '33.333333%'}" v-for="(sticker, index) in stickersData">
        <touchable-opacity :on-press="() => setSticker(sticker)" >
          <image 
            :style="{width: 110, height: 110}"
            :source="sticker.static"
            resizeMode='contain'
          />
        </touchable-opacity>
      </view>
    </view>
  </view>

  <view v-else :style="{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}">
    <view :style="{marginTop: -15, marginRight: -5, width: '100%', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}">
      <touchable-opacity :on-press="toggleOverlay">
        <nb-icon :style="{fontSize: 40, color: 'gray'}" name='close' />
      </touchable-opacity>
    </view>
    <view :style="{flexDirection: 'row', flex: 5, alignItems: 'flex-start', justifyContent: 'center'}">
      <touchable-opacity :on-press="() => displaySticker(currentSticker.static)">
        <image
          :style="{width: 185, height: 185}"
          :source="currentSticker.static"
          resizeMode="contain"
        />
      </touchable-opacity>
    </view>
  </view>
                <!-- </view> -->
              </TouchableWithoutFeedback>
        
      </view>
    </view>                
   </touchable-opacity>
    
  </modal>
</template>

<script>

import { Image, TouchableOpacity, TouchableHighlight, Modal, ImageBackground,Dimensions } from 'react-native';
import { Sticker } from '../../common/Config.js';
import { Icon } from 'native-base';

export default {
  components: { Image, Sticker, TouchableOpacity, Modal, ImageBackground, TouchableHighlight },
  data: function() {
    return {
      currentSticker: '',
      stickersData: Sticker,
      isOverlay: false,
      widthScreen: Dimensions.get('window').width,
    }
  },
  props: {
    displaySticker: Function,
    showStampInput:Boolean,
    handleOverlayClick: Function
  },
  methods: {
    toggleOverlay() {
      this.isOverlay = !this.isOverlay
    },
    setSticker(sticker) {
      this.currentSticker = sticker
      this.isOverlay = true
    },
  },
  mounted() {
  }
};

</script>

<style>
  .background-modal {
    backgroundColor: rgba(128, 128, 128, 0.5);
  }
  .background-content {
    backgroundColor: #fff;
    borderRadius: 0.5;
  }
  .line {
     backgroundColor: rgb(196, 194, 194)
  }
  .container{
    display: flex;
    flex-direction: row;
    justify-content:center;
    align-self: center;
    align-items: center;
    /* background-color:red; */
  }
</style>
