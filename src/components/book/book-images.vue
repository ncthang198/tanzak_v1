<template>
  <flat-list
    :data="bookImagesLocal"
    :horizontal=true
    :showsHorizontalScrollIndicator=false
    :keyExtractor="(item, index) => index.toString()"
    v-if="!viewFull"
  >
    <view :style="{justifyContent: 'space-between'}" render-prop-fn="renderItem">
      <view :style="{alignItems: 'center', marginRight: 10}">
        <touchable-opacity :onPress="() => handlePress(args.item)">
          <view>
            <fast-image
              :source="{uri: args.item.image_url.thumb ? args.item.image_url.thumb.url : args.item.image_url.url}"
              :style="{height: 152, width: args.item.width, borderWidth: 0.5, borderColor: '#DCDCDC'}"
            />
            <view v-if="!isPremium" :style="{
              width: args.item.width,
              height: 152,
              backgroundColor: 'rgba(22, 94, 132, 0.7);',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center'
            }">
              <image
              :source="lock"
              :style="{height: 30, width: 20}"
              resize="contain"
            />
            </view>
          </view>
        </touchable-opacity>
      </view>
    </view>
  </flat-list>
  <modal :onRequestClose="() => viewFull= false" v-else animationType="slide" :visible="viewFull" :transparent=true>
    <!-- Close button -->
    <view :style="{zIndex: 1000, position: 'absolute', top: 40, left: 10}">
      <touchable-opacity :onPress="() => onCancel()">
        <view class='btnWrap'>
          <text class="closeBtn">X</text>
        </view>
      <touchable-opacity />
    </view>
    <!-- Close button / -->
    <image-viewer
      :imageUrls="imageUrls"
      :onCancel="onCancel"
      :enableSwipeDown="true"
      :loadingRender="loadingRender"
      :index="currentIdx"
    >
    </image-viewer>
  </modal>
</template>

<script>

import { Modal, Dimensions } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import React from 'react'
import { Icon, Spinner } from 'native-base';
import Lock from '../../../assets/modal/08sakuhin_02.png'
import FastImage from 'react-native-fast-image'

const HEIGHT = 152

export default {
  props: {
    bookImagesData: Array,
    book: Object,
    openModal: Function,
    isPremium: Boolean
  },
  components: {Modal, ImageViewer, FastImage},
  data() {
    return {
      bookImagesLocal: [],
      imageUrls: [],
      viewFull: false,  
      currentIdx: 0,
      lock: Lock
    }
  },
  methods: {
    loadingRender() {
      return (
        <Spinner color='white' />
      );
    },
    handlePress(item) {
      if (!this.isPremium) {
        this.openModal(isLock = true)
      }else{
        this.currentIdx = this.bookImagesData.findIndex(x => x.id === item.id)
        this.imageUrls = this.bookImagesData.map((item) => {
            const dimension = item.image_dimensions.big.split('x')
            const windowWidth = Dimensions.get('window').width
            const originalWidth = dimension[0]
            const originalHeight = dimension[1]
            const widthChange = windowWidth / originalWidth
            const newWidth = (widthChange * originalWidth)
            const newHeight = (widthChange * originalHeight)
            return {
              url: item.image_url.url,
              width: newWidth,
              height: newHeight,
              freeHeight: true
            }
          }
        )
        this.viewFull = true
      }
    },
    onCancel() {
      this.viewFull = false
    },
    // isShowLock(){
    //   return !this.currentUser.is_premium
    // }
  },
  created() {
    if(this.bookImagesData) {
      this.bookImagesData.forEach((book) => {
        sizeImage = book.image_dimensions.small.split("x")
        ratio = HEIGHT / sizeImage[1]
        newWidth = ratio * sizeImage[0]
        this.bookImagesLocal.push({...book, width: newWidth, lock: true})
      })
    }
  }
}
</script>

<style>
.btnWrap {
  background-color: gray;
  padding: 3;
  width: 22;
  height: 22;
  borderRadius: 11;
  justify-content: center;
  align-items: center;
}
.closeBtn {
  fontSize: 9;
  transform: scaleX(1.3);
  color: black;
}
</style>

