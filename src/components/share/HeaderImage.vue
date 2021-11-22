<template>
  <view>
    <image-background v-if="isIOS()" resizeMode="cover" :source="bgHeader">
      <view :style="{height: getStatusBarHeight()}">
        <safe-area-view :style="{flex: 1}">
          <status-bar bar-style="dark-content" translucent="false" />
        </safe-area-view>
      </view>
    </image-background>

    <image-background :style="{height: 45}" resizeMode="cover" :source="background">
       <status-bar bar-style="dark-content" :translucent="false" />
      <view :style="{flex: 1, flexDirection: 'row', alignItems: 'center'}">
        <view class="back-icon" :style="{flex: 0.8}">
          <touchable-opacity v-if="goBack" :onPress="handleBack" :style="{flex: 1}">
            <view :style="{height: 45, flex: 1, justifyContent: 'center', alignItems: 'center'}">
              <image
                resizeMode="contain"
                :style="{width: 25, height: 20, marginLeft: iconBack == 'close' ? 0 : -5}"
                :source="backIconDefault" />
            </view>
          </touchable-opacity>
        </view>
        <view class="main" :style="{flex: 5, alignItems: 'center'}">
          <view :style="{flexDirection: 'row'}"  v-if="main && main.image">
            <image v-if="main.image[0]" :style="{width: 50, height: 50}" resizeMode="contain" :source="main.image[0]" />
            <image v-if="main.image[1]"  :style="{width: 130, height: 50}" resizeMode="contain" :source="main.image[1]" />
          </view>
          <text :style="{fontSize: 16, fontWeight: 'bold', color: '#fff'}" v-if="main && main.text"> {{ main.text }} </text>
          <view v-if="!main && storyDetail" :style="{alignSelf: 'center'}">
            <nb-title :allowFontScaling="false" class="text_header" :style="{fontSize: 14, color: '#fff'}">
              {{ storyDetail.title }}
            </nb-title>
            <nb-subtitle :allowFontScaling="false" class="text_header" :style="{ fontSize: 13, color: '#fff', textAlign: 'center'}">
              {{ currentStory.order }}/{{ storyDetail.total_stories }}
            </nb-subtitle>
          </view>
        </view>
        <view class="back-icon" :style="{flex: 0.8}">
          <view v-if="storyDetail" :style="[{paddingLeft: 9, height: 45, flex: 1, justifyContent: 'center', alignItems: 'center'}, rightIconStyle]">

            <share-app :styleProps="styleProps" :bookId="storyDetail.id" type='white' 
            :navigation="navigation"   
             :CurrentStory="currentStory"    
             :StoryDetail="storyDetail"   
             :Stories="stories"
             :PreviousRoute="previous_route"
             :Read="read"
             :related_books="related_books"
             :newModeReading="newModeReading"
             />
          </view>
        </view>
      </view>
    </image-background>
  </view>
</template>

<script>

import Background from '../../../assets/top/bg_footer.png'
import BackIcon from '../../../assets/images/back_icon.png'
import bgHeader from "../../../assets/top/bg_header.png"
import ShareWhite from "../../../assets/images/share_icon_2.png"
import btnClose from '../../../assets/images/close.png'
import ShareApp from '../share/ShareApp.vue'
import { Platform, Dimensions, StatusBar } from 'react-native';
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: ['currentStory', 'storyDetail','stories','previous_route','read','related_books', 'iconBack', 'overflow', 'navigation', 'goBack', 'main', 'backIcon', 'otherIcon', 'rightIconStyle','fromWebtoon', 'newModeReading'],
  components: {ShareApp},
  computed:{
    ...mapGetters({
      getStoryImage: 'stories/storyImage',
      getNextChapter: 'downloadStory/getNextChapter'
    })
  },
  created() {    
    if(this.backIcon)
      this.backIconDefault = this.backIcon
    if(this.otherIcon == 'shareWhite')
      this.shareWhite = ShareWhite
    if(this.iconBack == 'close')
      this.backIconDefault = btnClose
  },
  data() {
    return {
      backIconDefault: BackIcon,
      background: Background,
      bgHeader: bgHeader,
      ShareWhite: null,
      styleProps: {alignItems: 'center'},

    }
  },
  methods: {
    ...mapMutations({
      setStoryImage: 'stories/setStoryImage'
    }),
    isIOS(){
      return (Platform.OS === "ios")
    },
    handleBack() {
      if(!!this.getStoryImage){
        this.setStoryImage('')
        return false
      }      
      if(this.fromWebtoon){
        return this.navigation.pop()
      }else{
        return this.navigation.goBack()
      }
    },
    getStatusBarHeight(){
      if(Platform.OS === 'ios') {
        return Dimensions.get('window').height >= 812 ? 44 : 20
      } else {
        return StatusBar.currentHeight
      }
    }
  }
}
</script>
