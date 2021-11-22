<template>
<view>
  <modal
    :animationType="'slide'"
    :transparent="true"
    :visible="modalVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'center'}">
      <view class="background-content" :style="{ width: widthScreen - 80, minHeight: 210, borderRadius: 10, marginLeft: 40}">
        <view  :style="{height: 45, alignItems: 'center', justifyContent: 'center', opacity: opacity}">
          <text :style="{fontSize: 20, fontWeight: 'bold', color:'black'}">メニュー</text>
        </view>
        <view :style="{minHeight: 1}" class="line"></view>


        <touchable-opacity  :onPress="() => {optionStory()}" :style="{height: 40, alignItems: 'center', justifyContent: 'center'}">
        <view class="container">
        <image :source="specificIcon" /> 
        <text :style="{marginLeft: 10}">作品詳細を見る</text>
        </view>
        </touchable-opacity>
        <view class="line" :style="{minHeight: 1}"></view>

        <touchable-opacity :onPress="() => {optionMode()}"  :style="{height: 40, alignItems: 'center', justifyContent: 'center'}">
         <view class="container">
         <image :source="settingModeIcon" /> <text :style="{marginLeft: 10}">ビューワーモードを変更する </text>
         <modal-change-mode 
         ref="modalChangeMode"
         :navigation="navigation"
         />
         </view>
         
        </touchable-opacity>
        <view class="line" :style="{minHeight: 1}"></view>

        <touchable-opacity :onPress="() => {handleShare()}" :style="{height: 40, alignItems: 'center', justifyContent: 'center'}">
         <view class="container">
         <image :source="shareIcon" /> <text :style="{marginLeft: 10}">エビソードをシェアする </text>
         </view>
        </touchable-opacity>
         <view class="line" :style="{minHeight: 1}"></view>

        <touchable-opacity :onPress="() => {hideModal()}"  :style="{height: 55, alignItems: 'center', justifyContent: 'center', opacity:opacity}">
          <!-- <text>キャンセル </text> -->
          <text :style="{fontSize: 18, fontWeight: 'bold', color:'black'}">キャンセル</text>
        </touchable-opacity>
        
      </view>
    </view>
  </modal>
 <modal
    :animationType="'fade'"
    :transparent="true"
    :visible="modalVisible2"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'center', alignItems:'center'}">
      <view class="background-content" :style="{ width: widthScreen - 90, minHeight: 130, borderRadius: 10}">
        <view :style="{justifyContent: 'center', alignItems:'center', height:50}">
          <text :style="{fontSize:18, fontWeight:'bold'}" >スクロールモード</text>
        </view>
        
        <view class="line" :style="{minHeight: 1}"></view>
        <view :style="{alignItems: 'center', justifyContent: 'center', height:100, }">
        <switch
          
          :ios_backgroundColor="'#3e3e3e'"
          :onValueChange="(value)=>{changeMode(value)}"
          :value="scrollMode"
        />         
        <text :style="{marginTop:10}">{{scrollMode ? "On":"Off"}}</text>         
        </view>        
        <view class="line" :style="{minHeight: 1}"></view>
        <view :style="{flexDirection:'row', justifyContent:'space-between'}">
          <touchable-opacity :onPress="() => {hideModalOption()}"  :style="{height: 50, alignItems: 'center', justifyContent: 'center', opacity:opacity, flex:5}">
              <text :style="{fontSize:16, fontWeight:'bold'}">キャンセル </text>
          </touchable-opacity>
          <!-- Save -->
          <touchable-opacity :onPress="() => {saveReadingMode()}"  :style="{height: 50, alignItems: 'center', justifyContent: 'center', opacity:opacity, flex:5}">
              <text :style="{fontSize:16, fontWeight:'bold'}">保存</text> 
          </touchable-opacity>
        </view>
        
      </view>
    </view>
  </modal>
</view>
  
  
</template>
<script>
  import {Modal, Dimensions, TouchableOpacity, TouchableWithoutFeedback,Share,Switch,AsyncStorage} from 'react-native';
  import { AirbnbRating } from 'react-native-ratings';
  import AppLogo from '../../../assets/icon_app.png'
  import { mapGetters } from 'vuex'
  import * as LocalStoreData from '../../localstore/story.js';
  import SpecificIcon from '../../../assets/images/book-search-3.png'
  import SettingModeIcon from '../../../assets/images/settings-2.png'
  import ShareIcon from '../../../assets/images/export.png'
  import ModalChangeMode from './ModalChangeMode'

  export default {
    props:['navigation','book','currentStory','storyDetail','stories','previous','read','related_books'],
    components: {
      Modal, AirbnbRating, TouchableOpacity, TouchableWithoutFeedback,
        ModalChangeMode, Switch
    },
     data() {
      return {
        widthScreen: Dimensions.get('window').width,
        modalVisible: false,
        modalVisible2: false,
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
        },
        scrollMode:false
      }
    }
    ,
    computed:{
      ...mapGetters({
        nextChapterData: 'downloadStory/getNextChapter'
      })
    },
    async mounted() {            
      let readingMode = await AsyncStorage.getItem('@reading_mode');
      this.scrollMode = readingMode=='scroll_mode'?true:false      
    },
     methods: {
       checkClose(event) {
         this.hideModal()
         this.hideModalOption()
      },
       showModal() {
        this.modalVisible = true;
      },
      hideModal() {
        this.modalVisible = false;
      },
      showModalOption(){
        this.modalVisible2=true;
      },
      hideModalOption(){
        this.modalVisible2=false;
      },
      async saveReadingMode(){
        try{
        let readingMode = this.scrollMode==true?'scroll_mode':'tab_mode';
        await AsyncStorage.setItem('@reading_mode', readingMode);                
        this.hideModalOption();        
        if(readingMode=='scroll_mode'){
          this.ScrollMode()
        }else{
          this.TapMode()
        }
        
        }catch(err){
          console.log(err)
        }        
      },    
      optionStory(){
      //    
       this.hideModal();
        },
       async optionMode(){
         this.hideModal();
         this.showModalOption();
        
        //  this.navigation.replace('Scroll', { story: this.currentStory, book: this.storyDetail ,stories:this.stories,previous_route:this.previous,read:this.read,related_books:this.related_books});
       // after changed the screens , modal will be disable 
       
      },
      TapMode(){
         this.navigation.replace('Story', { story: this.currentStory, book: this.storyDetail, previous_route:this.previous,read:this.read,related_books_q:this.related_books, backBehavior: "GoFromStory",});
      },
      ScrollMode(){
         this.navigation.replace('Scroll', { story: this.currentStory, book: this.storyDetail ,previous_route:this.previous,read:this.read,related_books_q:this.related_books,backBehavior: "GoFromStory",});
      },      
      changeMode(value){       
        this.scrollMode= value;              
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
    justify-content:center;
    align-self: center;
    align-items: center;
    /* background-color:red; */
  }
</style>
