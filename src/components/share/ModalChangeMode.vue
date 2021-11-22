<template>
  <modal
    :animationType="'slide'"
    :transparent="true"
    :visible="modalVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'center'}">
      <view class="background-content" :style="{ width: widthScreen - 80, minHeight: 210, borderRadius: 10, marginLeft: 40}">

        <touchable-opacity  :onPress="() => {optionStory()}" :style="{height: 40, alignItems: 'center', justifyContent: 'center'}">
        <view class="container">
        <image :source="specificIcon" /> 
        <text>タップモード</text>
        </view>
        </touchable-opacity>
        <view class="line" :style="{minHeight: 1}"></view>

        <touchable-opacity :onPress="() => {optionScroll()}"  :style="{height: 40, alignItems: 'center', justifyContent: 'center'}">
         <view class="container">
         <image :source="settingModeIcon" /> <text>スクロールモード </text>
         </view>
        </touchable-opacity>
        <view class="line" :style="{minHeight: 1}"></view>

        <touchable-opacity :onPress="() => {hideModal()}"  :style="{height: 55, alignItems: 'center', justifyContent: 'center', opacity:opacity}">
          <text>キャンセル </text>
        </touchable-opacity>
      </view>
    </view>
  </modal>
  
</template>
<script>
  import {Modal, Dimensions, TouchableOpacity, TouchableWithoutFeedback,Share} from 'react-native';
  import { AirbnbRating } from 'react-native-ratings';
  import AppLogo from '../../../assets/icon_app.png'
  import { mapGetters } from 'vuex'
  import * as LocalStoreData from '../../localstore/story.js';
  import SpecificIcon from '../../../assets/images/book-search-3.png'
  import SettingModeIcon from '../../../assets/images/settings-2.png'
  import ShareIcon from '../../../assets/images/export.png'
  

  export default {
    props:['navigation','book','currentStory','storyDetail','stories','previous','read','related_books'],
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
        opacity: 0.4,
        specificIcon: SpecificIcon,
        settingModeIcon: SettingModeIcon,
        shareIcon: ShareIcon,
        OneLink: {
        Staging: "https://tanzak.onelink.me/M8Pn/af854e3d", // for local vs staging test
        Production: "https://tanzak.onelink.me/FWVh/19d649a9"
      }
      }
    }
    ,
    computed:{
      ...mapGetters({
        nextChapterData: 'downloadStory/getNextChapter'
      })
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
      optionStory(){
         
        },
      optionScroll(){
       
      },
      async handleShare(){
        try{
       const result = await Share.share({
        // message for local vs staging test
        // message: `| サクッと読めるベストセラー小説アプリ『TanZak』| https://tanzak.onelink.me/M8Pn/af854e3d?book_id=${this.bookId}&af_force_deeplink=true`

        // message for honban
        message: `| サクッと読めるベストセラー小説アプリ『TanZak』| ${this.OneLink.Production}?book_id=${this.bookId}&af_force_deeplink=true`
      })
        }
        catch(error){
          alert(error.message)
        }
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
    borderRadius: 0.5;
  }
  .line {
     backgroundColor: rgb(196, 194, 194)
  }
  .container{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
</style>
