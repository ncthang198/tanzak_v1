<template>
  <view :style="{flex: 1}">
    <header-image :back=false :navigation="navigation" :main="mainHeader"/>
    <view :style="{flex: 1}"  v-if="!loading && deepLinkFetchDone">
      <image-background resizeMode="cover" :source="background">
        <scroll-view :removeClippedSubviews=true :refreshControl="refreshControl()">
          <view>
            <view :style="{flex: 1, height: widthScreen/2, marginBottom: 15}">
              <banner v-if="banner" :banner="banner" :navigation="navigation"/>
            </view>
            <touchable-opacity v-if="!currentSubscription" :onPress="()=> goToPremiumPlan()">
              <image :style="{width: '100%', height: getHeightImage(BannerOutline, 0, 0)}" resizeMode="contain" :source="BannerOutline" />
            </touchable-opacity>
            <book-list-item
              v-if="historyReading"
              :navigation="navigation"
              :data="historyReading"
              :isHistory=true
              :subscriptions="subscriptions"
              :isPremium="currentSubscription ? true : false"
            />
            <view :style="{flex: 3}" v-for="section in sections" :key="section.name">
              <book-list-item :navigation="navigation" :data="favoriteBooksSection" v-if="section.name == 'お気に入り'" />
              <book-list-item :navigation="navigation" :data="section" v-else />
            </view>
          </view>
        </scroll-view>
        <modal-survey :refreshSurvey="refreshSurvey" />
      </image-background>
    </view>
    <loading v-else />
    <suggest-story-modal
    :navigation="navigation"
    >
  </view>
</template>

<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex'
  import Loading from '../../components/share/LoadingScreen.vue'
  import BookListItem from '../../components/share/BookListItem.vue'
  import HeaderBackground from '../../../assets/images/logo_image.png'
  import LogoText from '../../../assets/images/logo_text.png'
  import Background from '../../../assets/top/bg_top.png'
  import Banner from '../../components/banner/index.vue'
  import BannerOutline from '../../../assets/stamp/sp_banner_outline.jpg'
  import SuggestStoryModal from '../../components/share/SuggestStoryModal.vue'
  import React from 'react'
  import { RefreshControl, Platform , Dimensions, Linking, AppState } from 'react-native'
  import AsyncStorage from '@react-native-community/async-storage'
  import HeaderImage from "../../components/share/HeaderImage.vue"
  import ModalSurvey from "../../components/share/ModalSurvey.vue"
  import { writeLog, getHeightImage } from '../../common/helper.js'
  import FastImage from 'react-native-fast-image'
  import * as LocalStoreData from '../../localstore/story.js';
  import Constants from 'expo-constants'
  import DeviceInfo from 'react-native-device-info';
  export default {
    components: {
      BookListItem,
      Banner,
      HeaderImage,
      Loading,
      ModalSurvey,
      FastImage,
      SuggestStoryModal
    },
    props: {
      navigation: {
        type: Object
      }
    },
    data() {
      return {
        mainHeader: {image: [HeaderBackground, LogoText]},
        sections: [],
        background: Background,
        banner: null,
        loading: true,
        refreshing: false,
        refreshSurvey: false,
        widthScreen: Dimensions.get('window').width,
        deepLinkRedirectCount: 0,
        BannerOutline: BannerOutline,
        subscriptions: [], 
      }
    },
    computed: {
      ...mapGetters({
        historyReading: 'booksLocal/currentReadingSection',
        favoriteBooksSection: 'booksLocal/favoriteBooksSection',
        isRefresh: 'booksLocal/needToRefresh',
        deepLinkBookId: 'user/deepLinkBookId',
        deepLinkFetchDone: 'user/deepLinkFetchDone',        
        currentSubscription: 'user/currentSubscription'
      })
    },

    methods: {
      getHeightImage,
      ...mapMutations({
        initBooksLocal: 'booksLocal/initBooks',
        saveUser: 'user/saveUser',
        saveCallbackRefreshReadingSection: 'booksLocal/saveCallbackRefreshReadingSection'
      }),

      ...mapActions({
        initBooksLocal: 'booksLocal/initBooks',
        saveFavoriteBooksFromServer: 'booksLocal/saveFavoriteBooksFromServer',
        setDeepLinkBookId: 'user/setDeepLinkBookId',
        _checkSubScription: 'user/checkSubScription',
      }),

      createHistoryReadingSection() {
        this.historyReadingSection = this.historyReading
      },
      createFavoriteSection(){
        f_section = this.sections.find((item) => item.name == 'お気に入り')
        this.saveFavoriteBooksFromServer(f_section)
      },

      fetchTopApi() {
        this.axios.get('/api/top').then(({data: res}) => {
          data = res.data          
          if(res.results.message === 'user_locked') return

          this.$root_cowndown(data.user.time_rest)
          this.sections = data.sections
          this.createFavoriteSection()
          this.saveUser(data.user)
          this.banner = data.banner
          this.refreshing = false
          this.loading = false
          this.refreshSurvey = true
        }).catch((error) => {
          console.log("error top api",error)
          writeLog(this.axios, { event: 'get top data failed', value: error, log_type: 'error' })
        })
      },

      fetchSubscriptionsApi() {
      this.axios
        .get("api/subscriptions")
        .then((res) => {
          this.subscriptions = res.data.data;
        })
        .catch((error) => {
          this.writeLog(this.axios, {
            event: "GET SUBSCRIPTIONS ERROR",
            value: error,
            log_type: "info",
          });
        });
      },


      onRefresh() {
        this.refreshing = true
        this.refreshSurvey = false
        this.fetchTopApi()
        this.fetchSubscriptionsApi()
      },

      refreshControl() {
        return (
          <RefreshControl
            refreshing={this.refreshing}
            onRefresh={() => this.onRefresh()}
          />
        )
      },

      getParams(name, url){
        try {
          data = {}
          var param = url.split("?")[1].split("&")
          param.forEach((item, index) =>  data[item.split('=')[0]] = item.split('=')[1])
          return data[name]
        }
        catch(err) {
          return null
        }
      },

      async handleOpenURL(url, newHandle = false){        
        if(url=='empty'){
          return;
        }
        //  Temp fix android trigger event listen 3 times
        if (Platform.OS === 'android') {
          this.deepLinkRedirectCount += 1

          if (this.deepLinkRedirectCount > 1) {
            if(this.deepLinkRedirectCount >= 3) { this.deepLinkRedirectCount = 0}
            return
          }
        }
        if(newHandle){          
          if(AppState.currentState === 'background'){
                    this.navigation.navigate('BookDetail', {id: url})
          } else {
                    this.setDeepLinkBookId(url)
          }
          await AsyncStorage.setItem('deeplink','empty')            
        }
        if(url){
          book_id = this.getParams('book_id', url)
          if(book_id) {
                if(AppState.currentState === 'background'){
                    this.navigation.navigate('BookDetail', {id: book_id})
                } else {
                    this.setDeepLinkBookId(book_id)
                }
          }
        }
      },

      goToPremiumPlan(){
        this.navigation.navigate('PremiumPlanScreen')
      },
      async checkDeeplink (){      
      const deepLinkURl = await AsyncStorage.getItem('deeplink')
      console.log(deepLinkURl, "deepLinkURl222")
      console.log(deepLinkURl&&deepLinkURl!=='empty', "checkkkk1")
      if(deepLinkURl&&deepLinkURl!='empty'){
        this.handleOpenURL(deepLinkURl, true)
        
        // const deepLinkURl = await AsyncStorage.getItem('deeplink')
        // console.log(deepLinkURl, "deepLinkURl2")
      }
    },
    },

    watch: {
      deepLinkBookId(newVal, OldVal){
        // Handle deep link when app not install, redirect after install
        if(newVal){
           this.navigation.navigate('BookDetail', {id: newVal})
        }
      },

      currentSubscription(newVal, oldVal){
        this.currentSubscription = newVal
      }
    },    
    async mounted() {
      const uuid = await LocalStoreData.getDataFromLocal('uuid');
      this.axios.post(`/api/logs/debug_crash`, {event: 'Splash success', value: uuid, log_type: 'info', device: Constants.deviceName + '=' + DeviceInfo.getUniqueId()})
      this._checkSubScription()
      await this.initBooksLocal()
      this.createHistoryReadingSection()
      this.fetchTopApi()  
      this.fetchSubscriptionsApi()      
      await this.checkDeeplink()      
      // Handle deep link when app already installed and app closed
      await Linking.getInitialURL().then(url => {      
        this.handleOpenURL(url)
      })
      // Handle deep link when app already installed and app opening
      // _this = this
      Linking.addEventListener('url', ({url}) => this.handleOpenURL(url), false);
    }
  };

</script>

<style>
.content {
  flex: 1
}

.text-button {
  color: white;
  font-size: 22px;
  font-weight: bold;
}
</style>
