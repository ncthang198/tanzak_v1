<template>
  <nb-container>
    <header-image
      :navigation="navigation"
      :goBack=true
      :overflow=true
      iconBack='close'
      otherIcon='shareWhite'
      :storyDetail="book"
      :currentStory="currentStory"      
      :related_books="related_books"
      :previous_route = "previous_route"
      :read= "read"
      :fromWebtoon="true"
      :newModeReading="true"
    />
      <loading v-if="!isStoryLoaded" />
      <modal
        animationType="fade"
        :transparent="true"
        :visible="timerLoad"
        :onRequestClose="(event) => {checkClose(event)}"
      >
        <view :style="{backgroundColor:'gray', opacity:0.8, flex:1, justifyContent:'center', alignItems:'center'}">
          <activity-indicator size="large" color="white"/>
        </view>

      </modal>      
    
      <view :style="{flex: 1, alignItems: 'center', justifyContent: 'center'}" v-if="isStoryLoaded && getError.length > 0">
        <text :style="{fontSize: 20, fontWeight: 'bold'}">{{ getError }}</text>
      </view>    
      <scroll
      v-if="loadChild && getError.length == 0"
      :id="currentStory.id"
      :content_story="parent_getStoryContentJSON"
      :book="book"
      :initCharacter="parent_getInfoCharacter"
      :navigation="navigation"      
      :related_books="related_books"
      :style="{ marginTop: 1}"
      :previous_route = "previous_route"
      :read = "read"
      :current_story="currentStory"
      :timerShowEndStory="timerShowEndStory"
    />  
    
  </nb-container>
</template>
<script>

import Scroll from '../../components/scroll'
import Loading from '../../components/share/LoadingScreen.vue';
import { mapGetters, mapActions } from 'vuex'
import { Dimensions, Platform, Modal,ActivityIndicator,BackHandler } from 'react-native'
import btnClose from '../../../assets/images/close.png'
import btnUp from '../../../assets/images/up.png'
import backgroundHeader from '../../../assets/images/header.png'
import ShareApp from '../../components/share/ShareApp.vue'
import HeaderImage from "../../components/share/HeaderImage.vue"
import * as LocalStoryData from '../../localstore/story.js'

export default {
  props: ['navigation'],
  components: { ShareApp, Loading, HeaderImage,Scroll,Modal,ActivityIndicator },
  data() {
    return {
      currentStory: null,
      book: null,
      related_books: {},
      widthScreen: Dimensions.get('window').width,
      heightTop: Platform.OS === "android" ? 50 : 45,
      closeMargin: Platform.OS === "android" ? 0 : 2,
      headerMargin: Platform.OS === "android" ? -4 : -10,
      btnclose: btnClose,
      btnup: btnUp,
      header: backgroundHeader,
      parent_getStoryContentJSON: null,
      parent_getInfoCharacter: null,
      loadChild: false,
      previous_route: null,
      read: null,
      timerLoad:true,
      timerShowEndStory:false
    }
  },

  created(){
    this.book = this.navigation.getParam('book')
    this.currentStory = this.navigation.getParam('story')
   
           
    this.related_books = this.navigation.getParam('related_books_q')            
    this.clearStory()   
    this.fetchStory({id: this.currentStory.id, navigation: this.navigation})
    this.previous_route = this.navigation.getParam('previous_route')
    this.read = this.navigation.getParam('read');
  },
  async mounted() {
    let num = await LocalStoryData.getDataFromLocal('@NumReading');
    if(num === null) {
      num = 1;
    } else {
      num = num + 1;
    }

    await LocalStoryData.saveDataSetting('@NumReading', num);
    setTimeout(()=>{
      this.timerLoad=false      
    },1000)
    setTimeout(()=>{      
      this.timerShowEndStory=true      
    },6000)

    BackHandler.addEventListener(
      'hardwareBackPress', ()=>{
        console.log("stop default back")
        // return this.navigation.navigate("Home")
        return this.navigation.pop()
        return true
      }
    );

  },
  watch: {
    isStoryLoaded(newVal, oldVal){
      if(newVal && !this.loadChild ){
        this.parent_getStoryContentJSON = this.getStoryContentJSON
        
        this.parent_getInfoCharacter = this.getInfoCharacter
        this.loadChild = true
        let read_story = null

        if(this.currentStory.type !== 'free') {
          data = LocalStoryData.getDataFromLocal(`@ReadingHistory:${this.currentStory.book_id}_${this.currentStory.id}`)

          data.then(function(value) {
            read_story = value
          });

          if(read_story == null && this.read == null){
            this.buyStory(this.currentStory)
          }
        }
      }
    }
  },

  computed:{
    ...mapGetters({
      getStoryContentJSON: 'downloadStory/getContentStoryJSON',
      isStoryLoaded: 'downloadStory/getStatus',
      getInfoCharacter: 'downloadStory/getInfoCharacter',
      getError: 'downloadStory/getError',
      getNextChapter: 'downloadStory/getNextChapter',
      findStories: 'booksLocal/findStories',
    }),
    setHeightTop() {
      return (Platform.OS === "android") ? null : {height: 100}
    }
  },
  methods: {
    ...mapActions({
      fetchStory: 'downloadStory/fetchStory',
      clearStory: 'downloadStory/clearStory',
      buyStory: 'bookDetail/buyStory',
    }),
    clearStoryAndGoback() {
      this.navigation.goBack()
    },
  }
}
</script>

<style>
  .text_header {
    color: #fff;
  }
</style>
