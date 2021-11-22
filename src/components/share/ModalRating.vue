<template>
  <modal
    :animationType="'slide'"
    :transparent="true"
    :visible="modalVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'center'}">
      <view class="background-content" :style="{ width: widthScreen - 80, minHeight: 340, borderRadius: 20, marginLeft: 40}">
        <view :style="{flex: 1, alignItems: 'center'}">
          <image :source="appLogo" :style="{width: 100, height: 100, borderRadius: 10, marginTop: 20, borderWidth: 1}" />
          <text :style="{marginTop: 20, marginHorizontal: 50, textAlign: 'center'}">星をタップして評価してください。</text>
          <airbnb-rating 
            :showRating="false"
            :onFinishRating="(star) => onFinishRating(star)" 
            :starContainerStyle="{marginTop: 20}" 
            :ratingCount="5" 
            :defaultRating="0" 
          />
        </view>
        <view :style="{minHeight: 1}" class="line"></view>
        <touchable-opacity :disabled="disable" :onPress="() => {submitRating()}" :style="{height: 40, alignItems: 'center', justifyContent: 'center', opacity: opacity}">
          <text>送信する </text>
        </touchable-opacity>
        <view class="line" :style="{minHeight: 1}"></view>
        <touchable-opacity  :onPress="() => {hideModal()}" :style="{height: 40, alignItems: 'center', justifyContent: 'center'}">
          <text>今はしない </text>
        </touchable-opacity>
      </view>
    </view>
  </modal>
</template>
<script>
  import {Modal, Dimensions, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
  import { AirbnbRating } from 'react-native-ratings';
  import AppLogo from '../../../assets/icon_app.png'
  import * as LocalStoreData from '../../localstore/story.js';
  export default {
    components: {
      Modal, AirbnbRating, TouchableOpacity, TouchableWithoutFeedback
    },
     data() {
      return {
        widthScreen: Dimensions.get('window').width,
        modalVisible: false,
        appLogo: AppLogo,
        star: 0,
        disable: true,
        opacity: 0.4
      }
    },
    mounted() {
    },
     methods: {
       showModal() {
        this.modalVisible = true
      },
      hideModal() {
        this.modalVisible = false
      },
      onFinishRating(star) {
        this.star = star
        this.disable = false
        this.opacity = 1
      },
      submitRating() {
        this.axios.post('api/ratings', {
          rate: this.star
        }).then(async (response) => {
            this.modalVisible = false;
            LocalStoreData.saveDataSetting('@Rated', true);
        })
        .catch(error => {
          this.modalVisible = false;
        })
      }
     }
  }
</script>
<style>
  .background-modal {
    backgroundColor: rgba(128, 128, 128, 0.5);
  }
  .background-content {
    backgroundColor: #fff;
    borderRadius: 2;
  }
  .line {
     backgroundColor: black
  }
</style>
