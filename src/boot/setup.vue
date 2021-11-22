<template>
  <view class="container">
    <app-loading
      v-if="!isAppReady"
      :startAsync="_loadAssetsAsync"
      :onFinish="onFinish"
      :onError="console.warn"
    />
      <app v-if="isAppReady && !isUserLock"></app>

      <!-- Show popup update -->
      <touchable-opacity
        v-if="touchFullVisible"
        :style="{flex: 1, zIndex: 1000, position: 'absolute', width: '100%', height: '100%'}"
        :onPress="() =>  handleFullScreenPress()"
      />
      <modal-update
          ref='modalUpdate'
          :checkUpdateVersion="checkUpdateVersionParent"
      />
     <!-- Show popup update -->

    <lock-old-device-modal
      v-if="isExitApp"
      :clearData="clearData"
    />

    <tanzak-modal-webview :isVisible="showWebview" />

  </view>
</template>

<script>
import Vue from "vue-native-core";
import axios from "axios";
import VueAxios from "vue-axios";
import { VueNativeBase, Toast } from "native-base";
import { AppLoading } from "expo";
import { AppRegistry,Platform, BackHandler, Alert,Linking } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import store from "../store";
import { KEY_HASH256, EXPIRE_TOKEN_TIME } from '../common/Config.js';
import Config from '../common/Config.js';
import JWT from 'expo-jwt';
import api from '../common/RestfulAPI.js'
import App from "../App.vue";
import DeviceInfo from 'react-native-device-info';
import CodeTranferMessageModal from '../components/share/CodeTranferMessageModal.vue'
import LockOldDeviceModal from '../components/share/LockOldDeviceModal.vue'
import SplashScreen from 'react-native-splash-screen'
import ModalUpdate from '../components/share/modal-update'
import messaging from '@react-native-firebase/messaging'
import firebase from '@react-native-firebase/app'
import bgMessaging from './bgMessaging'
import { COIN_FULL, COUNT_DOWN_TIMER } from '../common/Config.js'
import appsFlyer from 'react-native-appsflyer';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset'
import Constants from 'expo-constants'
import * as Font from 'expo-font'
import { mapActions, mapGetters } from 'vuex'
import TanzakModalWebview from '../components/share/tanzak-modal-webview'
import NavigationService from '../services/NavigationService.js'
import * as LocalStoreData from '../localstore/story.js';
import SplashImage from '../../assets/images/app_splash.png'
import notifee, { EventType }  from '@notifee/react-native'
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';

// registering all native-base components to the global scope of the Vue
Vue.use(VueNativeBase);
Vue.prototype.$store = store
Vue.use(VueAxios, axios);

// New task registration
// AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);

// Register cowndown for all child countdown component in book detail
let intervalTimer = null
const setRootCowndown = (time_left) => {
  clearInterval(intervalTimer)
  let secondsLeft = time_left
      try {
          intervalTimer = setInterval(() => {
            secondsLeft--

            let totalCoin = Vue.prototype.$store.getters['user/totalCoin']
            if(secondsLeft === 0) {
              if(totalCoin < COIN_FULL) {
                clearInterval(intervalTimer)
                setRootCowndown(COUNT_DOWN_TIMER)
                Vue.prototype.$store.commit('user/incrementCoin')
                // Vue.prototype.$store.commit('user/incrementCoinFromCountDown')
              }
            }
            if(secondsLeft < 0) {
              clearInterval(intervalTimer);
              return
              // if(totalCoin < COIN_FULL) {
              //   return setRootCowndown(Vue.prototype.$store.state.user.timeLeft || 0)
              // }
            }

            Vue.prototype.$store.commit('user/setCountdown', secondsLeft)

          }, 1000);
        }catch(error) {
          clearInterval(intervalTimer)
          console.log('error set inteval countdown')
          return
      }
}

Vue.prototype.$root_cowndown = setRootCowndown
// End register countdown component

export default {
  components: { App, AppLoading, SplashScreen, ModalUpdate, CodeTranferMessageModal, LockOldDeviceModal, TanzakModalWebview },
  data: function() {
    return {
      isAppReady: false,
      CONSTANSTS: Constants,
      KEY: KEY_HASH256,
      Config: Config,
      EXPIRE_TOKEN_TIME: EXPIRE_TOKEN_TIME,
      isExitApp: false,
      Asset: Asset,
      touchFullVisible: false,
      isUserLock: false,
      notificationDisplayedListener: null,
      messageListener: null,
      SplashImage: SplashImage
    };
  },

  computed: {
    ...mapGetters({
      showWebview: 'user/showWebview'
    })
  },

  mounted: async function() {
    await this.initAppsFlyer()
    await this.checkATT();
    let uuid = DeviceInfo.getUniqueId() + "-" +Date.now()
    await LocalStoreData.saveDataSetting('@uuid', uuid);
    this.axios.post(`/api/logs/debug_crash`, {event: 'Splash', value: uuid, log_type: 'info', device: Constants.deviceName + '=' + DeviceInfo.getUniqueId()})
    this.loadFonts();
    await this.checkPermisstionNotify()
    // const channel = new firebase.messaginnotifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
    // .setDescription('My apps test channel');
    // messaging().notifications().android.createChannel(channel);
    messaging().subscribeToTopic('all')

    this.notificationListener()

    // Remove all delivered notifications when open app
    // firebase.notifications().removeAllDeliveredNotifications(() => {})

    this.loadAndCacheAppAssets()
    await this.checkSubScription();
    await this.getCurrentSubscription();
  },
  methods: {
    ...mapActions({
      setDeepLinkBookId: 'user/setDeepLinkBookId',
      updateDeepLinkFetchDone: 'user/updateDeepLinkFetchDone',
      getCurrentSubscription: 'user/getCurrentSubscription', 
      checkSubScription: 'user/checkSubScription', 
      _updateNotificationType: 'user/updateNotificationType'
    }),

    async checkATT(){
      try{
        const trackingStatus = await getTrackingStatus();
        console.log(trackingStatus, "trackingStatus2")
        if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
          // enable tracking features          
        }else{
          const requestTrackingStatus = await requestTrackingPermission();
          console.log(requestTrackingStatus, "trackingStatus22")
          if (requestTrackingStatus === 'authorized' || requestTrackingStatus === 'unavailable') {
            // enable tracking features
          }
        }
      }catch(error){
        console.log(error, "loi roi")
      }          
    },

    initAppsFlyer() {
      idUser = DeviceInfo.getUniqueId()
      // Option for test local and staging
      // const options = {
      //   devKey: Config.DEV_KEY_APPSFLYER,
      //   isDebug: true,
      //   appId: '002402400'
      // };
      const options = { devKey: Config.DEV_KEY_APPSFLYER }
      if (Platform.OS === 'ios') { options.appId = Config.APPSFLYER_ID_TEST_IOS }

      // Tracking latest app install date
      appsFlyer.onInstallConversionData(data => {
        this.updateDeepLinkFetchDone(true)
        if(data['data']['is_first_launch'] === 'true' || data['data']['is_first_launch'] === true){
          this.axios.post(`/api/reports/update_page_view/`, { installed_date: new Date() })
                    .then(function(res) {})

          if(data['data']['book_id']) {
            this.setDeepLinkBookId(data['data']['book_id'])
          }
        }
      })

      appsFlyer.initSdk(options,
        (result) => {
          appsFlyer.setCustomerUserId(idUser, (response) => {
          });
        },
        (error) => { console.error('initsdk appsflyer error: ', error); }
      )
    },
    async checkPermisstionNotify() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          fcmToken = await this.getFcmToken()
      //     idUser = DeviceInfo.getUniqueId()
      // console.log(idUser, "fcmToken device1: ", fcmToken)
          this.sendNotifyTokenToServer(fcmToken)
        }
    },
    async getFcmToken() {
      const fcmToken = await messaging().getToken();
      console.log("fcmToken device: ", fcmToken)
      if (fcmToken) {
        return fcmToken
      } else {
        return ''
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
    notificationListener() {
      messaging().onMessage(async remoteMessage => {     
        console.log("onMessage A new FCM message arrived")   
        // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
      messaging().onNotificationOpenedApp(async remoteMessage => {
        if(remoteMessage.data){
              if(remoteMessage.data.book){
                await AsyncStorage.setItem('deeplink',remoteMessage.data.book)                                                          
                console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
              }                   
            }      
      });
    // Display a notification
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.title,
          data: remoteMessage.data,
          android: {
            channelId,
          },
        });
      });
      // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {          
          // setTimeout(()=>{
            console.log("setDeeplink")
            if(remoteMessage.data){
              if(remoteMessage.data.book){
                await AsyncStorage.setItem('deeplink',remoteMessage.data.book)            
                console.log("zooooooo: ", remoteMessage.notification.body)
              // },700)
                console.log(
                  'Notification caused app to open from quit state:',
                  remoteMessage,
                );  
              }
                    
            }
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        // setLoading(false);
      });
      messaging().setBackgroundMessageHandler(async remoteMessage => {});
      // notifee.onForegroundEvent(({ type, detail }) => {
      //   console.log(detail, "detail1")
      //   switch (type) {
      //     case EventType.PRESS:
      //       const {data} = detail.notification;
      //       if(data) {
      //         if(data.notification_type) {
      //           switch(data.notification_type) {
      //             case 'book':
      //               NavigationService.navigate('BookDetail', {'id': data.book});
      //               break;
      //           }
      //         }
      //       }
      //       break;
      //   }
      // });
      // notifee.onBackgroundEvent(async ({type, detail}) => {
      //   const { notification, pressAction } = detail;
      //   console.log(detail, "detail2")
      //   if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
      //     const {data} = notification;
      //     if(data) {
      //         if(data.notification_type) {
      //           switch(data.notification_type) {
      //             case 'book':
      //               NavigationService.navigate('BookDetail', {'id': data.book});
      //               break;
      //           }
      //         }
      //       }
      //     await notifee.cancelNotification(notification.id);
      //   }
      // });
    },
    clearData() {
      AsyncStorage
        .clear()
        .then(() => {
          this.loadIdToken()
          this.isAppReady = false
          this.isUserLock = false
        })
    },
    handleFullScreenPress() {
      this.$refs.modalUpdate.showModal()
    },

    checkUpdateVersionParent(status) {
      this.touchFullVisible = status
    },

    onFinish() {
      this.isAppReady = true;
      SplashScreen.hide();
    },
    cacheImages(images) {
      const _this = this
      return images.map(image => {
        if (typeof image === 'string') {
          return Image.prefetch(image);
        } else {
          return _this.Asset.fromModule(image).downloadAsync();
        }
      });
    },
    async _loadAssetsAsync() {
      await this.loadIdToken()
      const imageAssets = this.cacheImages([
        require('../../assets/top/t_setting_active.png'),
        require('../../assets/top/t_home_active.png'),
        require('../../assets/top/t_tag_active.png'),
        require('../../assets/icon_app.png'),
        require('../../assets/top/bg_top.png'),
        require('../../assets/top/bg_footer.png'),
        require('../../assets/top/t_setting.png'),
        require('../../assets/top/t_home.png'),
        require('../../assets/top/t_tag.png'),
        require('../../assets/images/up.png'),
        require('../../assets/images/close.png'),
        require('../../assets/images/back_icon.png'),
        require('../../assets/images/iconCoin.png'),
        require('../../assets/images/coin_icon.png'),
        require('../../assets/images/greater_icon.png'),
        require('../../assets/images/guideline.png'),
        require('../../assets/stamp/01.png'),
        require('../../assets/stamp/02.png'),
        require('../../assets/stamp/03.png'),
        require('../../assets/stamp/04.png'),
        require('../../assets/stamp/05.png'),
        require('../../assets/stamp/06.png'),
        require('../../assets/images/clock.png'),
        require('../../assets/images/help.png'),
        require('../../assets/images/dropdown_icon2.png'),
        require('../../assets/images/favorite_active.png'),
        require('../../assets/images/favorite_deactive.png'),
        require('../../assets/images/share_icon_2.png'),
        require('../../assets/stamp/plan_header.png'),
        require('../../assets/stamp/plan_button.png'),
        require('../../assets/stamp/sp_LP_5b_Text.png'),
        require('../../assets/stamp/001.png'),
        require('../../assets/stamp/002.png'),
        require('../../assets/stamp/003.png'),
        require('../../assets/stamp/004.png'),
        require('../../assets/stamp/plan_ques.png'),
        require('../../assets/stamp/plan_answer.png'),
        require('../../assets/images/icon_arrow_cricle.png'),
        require('../../assets/auto-stamp/sp_info_1.png'),
        require('../../assets/auto-stamp/sp_info_2.png'),
        require('../../assets/stamp/07.png'),
        require('../../assets/stamp/sp_banner_outline.jpg'),
        require('../../assets/modal/08sakuhin_01.png'),
        require('../../assets/modal/08sakuhin_02.png'),
        require('../../assets/modal/08sakuhin_03.png'),
        require('../../assets/auto-stamp/image_premium.png'),
        require('../../assets/images/ic_P.png'),
        require('../../assets/images/ic_two_pet.png'),
        require('../../assets/images/un_lock.png'),
        require('../../assets/top/t_ranking.png'),
        require('../../assets/top/t_ranking_active.png'),
        require('../../assets/top/t_search.png'),
        require('../../assets/top/t_search_active.png'),
        require('../../assets/images/logo_text.png'),
        require('../../assets/images/logo_image.png'),
         require('../../assets/images/app_splash.png'),
         require('../../assets/images/app_spash2.png'),
         require('../../assets/images/app_spash3.png'),
         
      ]);

      //const fontAssets = cacheFonts([FontAwesome.font]);

      await Promise.all([...imageAssets]);
    },

    // This function - should run background when app started
    loadAndCacheAppAssets() {
      this.cacheImages([
        require('../../assets/top/bg_header.png'),
        require('../../assets/modal/07_01.png'),
        require('../../assets/modal/07_02.png'),
        require('../../assets/modal/07_03.png'),
        require('../../assets/modal/07_04.png'),
        require('../../assets/modal/07_05.png'),
        require('../../assets/modal/07_06.png'),
        require('../../assets/modal/07_07.png'),
        require('../../assets/modal/07_08.png'),
        require('../../assets/modal/07_09.png'),
        require('../../assets/modal/07_13.png'),
        require('../../assets/images/app_splash.png')
      ]);
    },

    configHeaders: function(id_token) { 
      Vue.axios.defaults.headers.common['X-User-Token'] = id_token
      Vue.axios.defaults.baseURL = Config.URL.api
      Vue.axios.defaults.timeout = 10000
      console.log(id_token, "tokennnnnnn")
      Vue.axios.interceptors.response.use(
        (response) => {
          // check user token is invalid in IF condition
          try {
            if (response.data.results.message == 'user_locked') {
              this.isExitApp = true
              this.isUserLock = true
            }
          } catch (error) {

          }
          return response;
        },
        function (error) {
          // Toast.show({
          //   text: error.toString(),
          //   buttonText: "Okay",
          //   type: "warning",
          //   duration: 3000
          // });
          return Promise.reject(error.response);
        });
    },
    loadIdToken: async function() {
      try {
        let id_token = await AsyncStorage.getItem('id_token');
        console.log(id_token, "id_token231")
        if (id_token == null) {
          let deviceToken = '';
          deviceToken = DeviceInfo.getUniqueId()

          const hashed_token = JWT.encode(
            {
              idfv: deviceToken,
              exp: this.EXPIRE_TOKEN_TIME
            },
            this.KEY,
            { algorithm: 'HS256' }
          );
          const request = new api('', { 'Authorization': hashed_token });
          await request.POST('/api/users').then((res) => {
            try {
               id_token = res.result.token
               AsyncStorage.setItem('id_token', id_token)
               this.configHeaders(id_token)
             } catch (error) {
               console.log("set_id_token", error)
             }
          }).catch(error => console.log("create_user_failed:", error))
        }

        this.configHeaders(id_token)
      } catch (error) {
         console.log("loadIdToken failed: ", error)
      }
    },
    loadFonts: async function() {
      try {
        await Font.loadAsync({
          Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
          Ionicons: Ionicons
        });

      } catch (error) {
        console.log("some error occured", error);
      }
    },

    sendNotifyTokenToServer(fcmToken) {
        if(!fcmToken){ return }
        this.axios.post(`/api/devices/update_device_token/`, {
            device_token: fcmToken,
            device_os: Platform.OS
          }).then( function (res) {
          }).catch(function (error) {
          })
    }

  }
};
</script>
<style>
  .container {
    flex: 1;
  }
</style>
