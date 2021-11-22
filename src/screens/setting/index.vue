<template>
  <nb-container>
    <modal-progress :isLoading="_isLoading"/>
    <header-image :navigation="navigation" :main="mainHeader"/>
    <modal-clear-cache ref="modalClearCache" />
    <scroll-view>
      <view>
        <view v-if="currentSubscription">
          <text class="session_title">ステータス</text>
          <view :style="{flexDirection: 'row', marginHorizontal: 24, marginVertical: 12, justifyContent: 'space-between'}">
            <view :style="{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}">
            <image :style="{width: 60, height: 60}" :source="iconP" />
            <text :style="{fontSize: 18, fontWeight: '500', marginLeft: 8}">プレミアム会員</text>
            </view>
            <view>
              <image :source="iconTwoPet" :style="{width: 110, height: 90, resizeMode: 'contain'}"/>
            </view>
          </view>
          <view :style="{justifyContent: 'center', alignItems: 'center', margin: 19}">
            <touchable-opacity :onPress="()=> navigation.navigate('CoinShop')">
              <view>
                <nb-text :style="{backgroundColor: '#165E83', justifyContent: 'center', alignItems: 'center', paddingTop: 7, paddingBottom: 7, paddingLeft: 12, paddingRight: 12, color: '#fff', fontSize: 13, fontWeight: '500' }">購入する</nb-text>
              </view>
            </touchable-opacity>
          </view>
        </view>
        <view v-else>
          <text class="session_title">コインについて</text>
          <view :style="{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 70, marginTop: 12 }">
            <image :style="{ width: 60 }" resizeMode="contain" :source="coinImage" />
            <nb-text :style="{ fontSize: 16, fontWeight: '500'}">{{ _totalCoin }}枚</nb-text>
          </view>
          <view :style="{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }">
            <view :style="{ flex: 1, alignItems: 'flex-end', paddingRight: 15 }">
              <nb-text class="content_coin">
                購入分 : {{ (currentUser && currentUser.paid_life) ? currentUser.paid_life: 0 }}枚
              </nb-text>
            </view>
            <view :style="{ flex: 1, alignItems: 'flex-start', paddingLeft: 15 }">
              <nb-text class="content_coin">
                無料配布分 : {{ (currentUser && currentUser.free_life) ? currentUser.free_life : 0 }}枚
              </nb-text>
            </view>
          </view>
          <view :style="{justifyContent: 'center', alignItems: 'center', margin: 19}">
            <touchable-opacity :onPress="()=> navigation.navigate('CoinShop')">
              <view>
                <nb-text :style="{backgroundColor: '#165E83', justifyContent: 'center', alignItems: 'center', paddingTop: 7, paddingBottom: 7, paddingLeft: 12, paddingRight: 12, color: '#fff', fontSize: 13, fontWeight: '500' }">購入する</nb-text>
              </view>
            </touchable-opacity>
          </view>
        </view>
        <view>
          <text class="session_title">このアプリについて</text>
          <view>
            <nb-list>
              <nb-list-item noIndent class="bg-style">
                <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="() => openLinking('news')">
                  <nb-left>
                    <nb-text class="content_text">お知らせ</nb-text>
                  </nb-left>
                  <nb-right>
                    <view :style="{ flexDirection: 'row' }">
                      <image class='greater-icon-style' resizeMode="contain" :source="greaterIcon" />
                   </view>
                  </nb-right>
                </touchable-opacity>
              </nb-list-item>
              <nb-list-item  noIndent class="bg-style">
                <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="() => openLinking('term')">
                  <nb-left>
                    <nb-text class="content_text">利用規約</nb-text>
                  </nb-left>
                  <nb-right>
                    <image class='greater-icon-style' resizeMode="contain" :source="greaterIcon" />
                  </nb-right>
                </touchable-opacity>
              </nb-list-item>
              <nb-list-item noIndent class="bg-style">
                <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="() => openLinking('privacy')">
                  <nb-left>
                    <nb-text class="content_text">プライバシーポリシー</nb-text>
                  </nb-left>
                  <nb-right>
                    <image class='greater-icon-style' resizeMode="contain" :source="greaterIcon" />
                  </nb-right>
                </touchable-opacity>
              </nb-list-item>
              <nb-list-item noIndent class="bg-style">
                <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="() => openLinking('psa')">
                  <nb-left>
                    <nb-text class="content_text">資金決済法に基づく表示</nb-text>
                  </nb-left>
                  <nb-right>
                    <image class='greater-icon-style' resizeMode="contain" :source="greaterIcon" />
                  </nb-right>
                </touchable-opacity>
              </nb-list-item>
              <nb-list-item noIndent class="bg-style">
                <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="() => openLinking('asct')">
                  <nb-left>
                    <nb-text class="content_text">特定商取引法に基づく表示</nb-text>
                  </nb-left>
                  <nb-right>
                    <image class='greater-icon-style' resizeMode="contain" :source="greaterIcon" />
                  </nb-right>
                </touchable-opacity>
              </nb-list-item>
              <nb-list-item noIndent class="bg-style">
                <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="() => openLinking('help')">
                  <nb-left>
                    <nb-text class="content_text">ヘルプ</nb-text>
                  </nb-left>
                  <nb-right>
                    <image class='greater-icon-style' resizeMode="contain" :source="greaterIcon" />
                  </nb-right>
                </touchable-opacity>
              </nb-list-item>
              <nb-list-item noIndent class="bg-style">
                <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="() => mergeSubscription()">
                  <nb-left>
                    <nb-text class="content_text">読み放題の復元</nb-text>
                  </nb-left>
                  <nb-right>
                    <image class='greater-icon-style' resizeMode="contain" :source="greaterIcon" />
                  </nb-right>
                </touchable-opacity>
              </nb-list-item>
              <nb-list-item noIndent class="bg-style">
                <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="() => handleClearCache()">
                  <nb-left>
                    <nb-text class="content_text">キャッシュを削除</nb-text>
                  </nb-left>
                  <nb-right>
                    <!-- <image class='greater-icon-style' resizeMode="contain" :source="greaterIcon" /> -->
                  </nb-right>
                </touchable-opacity>
              </nb-list-item>
            </nb-list>
          </view>
        </view>
        <view>
          <text class="session_title">読書モード</text>
          <view :style="{ paddingTop: 8, paddingBottom: 8 }">
            <nb-list-item icon :style="{ marginLeft: 15 }">
              <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" >
                <nb-left>
                  <nb-text class="content_text">読書モード</nb-text>
                </nb-left>
                <nb-body :style="{ borderBottomWidth: 0 }" />
                <nb-right :style="{ paddingRight: 15, borderBottomWidth: 0 }">
                  <switch          
                    :ios_backgroundColor="'#3e3e3e'"
                    :onValueChange="(value)=>{changeMode(value)}"
                    :value="scrollMode"
                  />         
                </nb-right>
              </touchable-opacity>
            </nb-list-item>
          </view>
        </view>
        <view>
          <text class="session_title">お問い合わせ</text>
          <view :style="{ paddingTop: 8, paddingBottom: 8 }">
            <nb-list-item icon :style="{ marginLeft: 15 }">
              <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="openMail">
                <nb-left>
                  <nb-text class="content_text">お問い合わせ</nb-text>
                </nb-left>
                <nb-body :style="{ borderBottomWidth: 0 }" />
                <nb-right :style="{ paddingRight: 15, borderBottomWidth: 0 }">
                </nb-right>
              </touchable-opacity>
            </nb-list-item>
          </view>
        </view>
        <!-- <view>
          <text class="session_title">ビューワー設定</text>
          <view :style="{ paddingTop: 8, paddingBottom: 8 }">
            <nb-list-item icon :style="{ marginLeft: 15 }">
              <nb-left>
                <nb-text class="content_text">ボックスサイズの拡大</nb-text>
              </nb-left>
              <nb-body :style="{ borderBottomWidth: 0 }" />
              <nb-right :style="{ paddingRight: 15, borderBottomWidth: 0 }">
                <nb-switch :value="switchValue" :onValueChange="handleSwitchOption" />
              </nb-right>
            </nb-list-item>
          </view>
        </view> -->
        <view :style="{display: 'none'}">
          <text class="session_title">引き継ぎコード</text>
          <view>
            <nb-list>
              <nb-list-item noIndent class="bg-style">
                <nb-left>
                  <nb-text class="content_text">コード</nb-text>
                </nb-left>
                <nb-button :style="{backgroundColor: '#165E83'}"
                  v-if="!isHaveCode && !isCodeTranferLoading"
                  :onPress="()=> { handleGetTranferCode() }"
                >
                  <nb-text class="transfer_text">コード生成</nb-text>
                </nb-button>
                <touchable-opacity :onPress="() => handleSaveToClipboard()">
                  <view class="flash_copied_wrapper" v-if="isCopiedCode">
                    <nb-text class="flash_copied">コピーしました</nb-text>
                    <view class="bubby_bottom" />
                  </view>
                  <nb-text
                    class="content_text"
                    v-if="isHaveCode && !isCodeTranferLoading"
                  >
                    {{ tranferCode }}
                  </nb-text>
                </touchable-opacity>
                <view v-if="isCodeTranferLoading">
                  <activity-indicator size="large" color="#0000ff" />
                </view>
              </nb-list-item>
              <nb-list-item  noIndent class="bg-style">
                <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="()=>{showCodeTranferInputModal()}">
                <nb-left>
                  <nb-text class="content_text">入力</nb-text>
                </nb-left>
                <nb-right>
                    <image
                      class='greater-icon-style'
                      resizeMode="contain"
                      :source="greaterIcon" />
                </nb-right>
                </touchable-opacity>
              </nb-list-item>
            </nb-list>
          </view>
        </view>
        <view>
          <text class="session_title">Version.{{ DeviceInfo.getVersion() }} ({{ DeviceInfo.getBuildNumber() }})</text>
        </view>
      </view>

      <!-- to show code tranfer input, set 'isShowCodeTranferInput = true' -->
      <code-tranfer-input-modal
        :title="'コードを入力してください'"
        v-if="isShowCodeTranferInput"
        :options="[{name: 'キャンセル', option: 'CANCLE'}, {name: 'Ok', option:'OK'}]"
        :onOptionPress="onCodeTranferInputOptionPress"/>

      <!-- show this modal when tranfer code success or fail -->
      <code-tranfer-message-modal
        :title="codeTranferMessageTitle"
        v-if="isShowCodeTranferMessage"
        :options="[{name: '閉じる', option: 'CLOSE'}]"
        :onOptionPress="onCodeTranferMessageOptionPress"/>
    </scroll-view>
  </nb-container>
</template>

<script>
import HeaderImage from "../../components/share/HeaderImage.vue"
import CoinImage from '../../../assets/images/iconCoin.png'
import IconP from "../../../assets/images/ic_P.png"
import IconTwoPet from "../../../assets/images/ic_two_pet.png"
import GreaterIcon from '../../../assets/images/greater_icon.png'
import NotificationIcon from '../../../assets/images/notification_icon.png'
import * as LocalData from '../../localstore/story.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import CodeTranferInputModal from '../../components/share/CodeTranferInputModal.vue'
import CodeTranferMessageModal from '../../components/share/CodeTranferMessageModal.vue'
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Clipboard } from 'react-native'
import axios from 'axios';
import DeviceInfo from 'react-native-device-info'
import * as MailComposer from 'expo-mail-composer'
import { Platform, Linking, ActivityIndicator } from 'react-native'
import { Toast } from "native-base";
import { SUPPORT_MAIL_ADDRESS } from '../../common/Config.js';
import ModalProgress from "../../components/share/ModalProgress.vue"
import ModalClearCache from "../../components/share/ModalClearCache.vue"
const SUCCESS_MESSAGE_TITLE = '引き継ぎが完了しました'
const FAIL_MESSAGE_TITLE = '引き継ぎコードが正しくありません'

export default {
  components: {
    HeaderImage,
    CodeTranferInputModal,
    CodeTranferMessageModal,
    TouchableOpacity,
    ModalProgress,
    ModalClearCache
  },
  props: {
    navigation: {
      type: Object
    }
  },
  data() {
    return {
      mainHeader: {text: '設定'},
      coinImage: CoinImage,
      iconP: IconP,
      iconTwoPet: IconTwoPet,
      greaterIcon: GreaterIcon,
      notificationIcon: NotificationIcon,
      freeLife: 0,
      paidLife: 0,
      totalLife: 0,
      switchValue: false,
      isShowCodeTranferMessage: false,
      codeTranferMessageTitle: '',
      onCodeTranferMessageOptionPress: function() {},
      isShowCodeTranferInput: false,
      onCodeTranferInputOptionPress: function(option, tranferCode) {},
      isCodeTranferLoading: false,
      tranferCode: '',
      isCopiedCode: false,
      DeviceInfo: DeviceInfo,
      isSubscription: false,
      loadingSubscription: true,
      scrollMode:false
    }
  },
  async created() {
    this.switchValue = await LocalData.getDataSetting('settingLine')
    this.onCodeTranferInputOptionPress = this.handleCodeTranferInputOptionPress.bind(this)
    this.onCodeTranferMessageOptionPress = this.handleCodeTranferMessageOptionPress.bind(this)
    this.loadTranferCode()
    let readingMode = await AsyncStorage.getItem('@reading_mode');
    this.scrollMode = readingMode=='scroll_mode'?true:false    
  },
  // async mounted() {            
      
  // },
  computed: {
    ...mapGetters({
      currentUser: 'user/currentUser',
      _totalCoin: 'user/totalCoin', 
      currentSubscription: 'user/currentSubscription', 
      _isLoading: 'user/isLoading'
    }),

    isHaveCode() {
      return this.tranferCode != ''
    }
  },
  watch: {
    currentSubscription(newVal, oldVal){
      this.currentSubscription = newVal
    }, 
    _isLoading (newVal, oldVal){
      this._isLoading = newVal
    }
  },
  methods: {
    ...mapMutations({
      saveUser: 'user/saveUser',
    }),
    ...mapActions({
      updateExternalLink: 'user/updateExternalLink',
      updateShowWebview: 'user/updateShowWebview', 
      _mergeSubscription: 'user/mergeSubscription'      
    }),
    mergeSubscription(){
      this._mergeSubscription();
    },
    async handleClearCache(){            
      this.showModalClearCache()
    },
    openLinking(source) {
      url = ''
      switch(source) {
        case 'news':
          url = 'https://news.kaznat.jp/'
          break;
        case 'term':
          url = 'https://tanzak.jp/term'
          break;
        case 'privacy':
          url = 'https://www2.shueisha.co.jp/privacy/privacy.html'
          break;
        case 'psa':
          url = 'https://tanzak.jp/psa'
          break;
        case 'asct':
          url = 'https://tanzak.jp/asct'
          break;
        case 'help':
          url = 'https://tanzak.jp/help'
          break;
        default:
          break;
      }
      this.updateExternalLink(url)
      this.updateShowWebview(true)
      return
      // Linking.canOpenURL(url).then(supported => {
      //   if (supported) {
      //     Linking.openURL(url);
      //   } else {
      //     console.log("Error");
      //   }
      // });
    },

    // Please test this on real device, not work on simulator
    async openMail() {
      bodyContent = [
        `<p>----------<br>
          <b>IDFV:</b> ${DeviceInfo.getUniqueId()}<br>
          <b>OSバージョン:</b> ${Platform.OS}<br>
          <b>アプリバージョン:</b> ${DeviceInfo.getVersion()}<br>
          ----------<br>
          ※ここから上は消さないでください。<br>
          ※上記が消えている場合、お問い合わせのご対応ができませんのでご注意ください。<br>
          ※万が一消してしまった場合には、お手数ですが改めてお問い合わせを再送いただけますと幸いです。<br>
          ▼お問い合わせ内容をご入力ください。<br><br>`
      ]
      options = {
        recipients: [SUPPORT_MAIL_ADDRESS],
        subject: 'TanZakに関するお問い合わせ',
        isHtml: true,
        body: bodyContent.join('')
      }
      try {
        resultMail = await MailComposer.composeAsync(options)
        /*
          IOS status: sent, save, cancelled
          Andrdoi status: sent
        */
          // console.log(resultMail)
          // if(Platform.OS === 'ios') {
          //   alert(`Mail has been ${resultMail.status}.`)
          // } else {
          //   alert('Thankyou!')
          // }
      } catch(err) {
        alert('お問い合わせをするには、Appleのメールアプリでサインインする必要があります')
      }
    },
    async saveReadingMode(){
      try{
        let readingMode = this.scrollMode==true?'scroll_mode':'tab_mode';
        let text = ""
        await AsyncStorage.setItem('@reading_mode', readingMode);                                
        if(readingMode=='scroll_mode'){
          text= "スクロールモードをオンにする";
        }else{
          text= "スクロールモードをオフにする";
        }       
        Toast.show({
            text: text,            
            duration: 3000
        });
        
        }catch(err){
          console.log(err)
        }        
    },
    changeMode(value){       
        this.scrollMode= value;    
        this.saveReadingMode()
    },      
    async loadTranferCode() {
      this.isCodeTranferLoading = true
      let code = await AsyncStorage.getItem('TranferCode');
      if (code != null) {
        console.log(code)
        this.tranferCode = code
      }
      this.isCodeTranferLoading = false
    },
    async amountCurrentCoin() {
      await this.axios.get('/api/coins/amount_current_coin').then( ({data: res}) => {
        this.freeLife = res.data.free_life
        this.paidLife = res.data.paid_life
        this.totalLife = this.freeLife + this.paidLife
      }).catch((error) => console.log("get data failed: ", error))
    },
    async handleSwitchOption() {
      this.switchValue = !this.switchValue
      await LocalData.saveDataSetting('settingLine', this.switchValue)
    },
    handleCodeTranferInputOptionPress(option, tranferCodeInput) {
      this.isShowCodeTranferInput = false
      switch (option) {
        case "OK":
          console.log("ok")
          this.doTranferCode(tranferCodeInput)
          break
        case "CANCLE":
          console.log("CANCLE")
        default:
          break
      }
    },
    doTranferCode(tranferCodeInput) {
      // TODO: get API to check code tranfer
      self = this
      axios.put('api/tranfer_codes/do_tranfer_code', {code: tranferCodeInput} ).then(({data: res}) => {
        if (res.data.status) {
          self.showCodeTranferMessage(SUCCESS_MESSAGE_TITLE)
          // update tranfer code of current user
          self.tranferCode = tranferCodeInput
          this.saveUser(res.data.user)
          AsyncStorage.setItem('TranferCode', tranferCodeInput)
        } else if (res.data.message) {
          self.showCodeTranferMessage(res.data.message)
        } else {
          self.showCodeTranferMessage(FAIL_MESSAGE_TITLE)
        }
      }).catch(error => {
        self.showCodeTranferMessage(FAIL_MESSAGE_TITLE)
      })
    },
    handleCodeTranferMessageOptionPress(option) {
      // because this have only one option (CLOSE), so don't need to use switch
      this.isShowCodeTranferMessage = false
    },
    showCodeTranferMessage(title) {
      this.codeTranferMessageTitle = title
      this.isShowCodeTranferMessage = true
    },
    showCodeTranferInputModal () {
      this.isShowCodeTranferInput = true
    },
    generateTranferCode(numberLetter) {
      let result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < numberLetter; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    async handleGetTranferCode() {
      // TODO: generate code, call API to store tranfer code
      self = this
      this.isCodeTranferLoading = true
      let newTranferCode = this.generateTranferCode(9)
      axios.post('/api/tranfer_codes', { code: newTranferCode }).then(({data: res}) => {
        if (res.status == 200) {
          // success, store tranfer code to app
          AsyncStorage.setItem('TranferCode', newTranferCode)
          this.tranferCode = newTranferCode
        }
        self.isCodeTranferLoading = false
      }).catch(error => {
        self.isCodeTranferLoading = false
      })
    },
    async handleSaveToClipboard() {
      await Clipboard.setString(this.tranferCode);

      // show copied content notification to user
      this.isCopiedCode = true
      self = this
      setTimeout(() => { self.isCopiedCode = false }, 3000);
    },
  
    async showModalClearCache() {
      this.$refs.modalClearCache.showModal();
    },
  }
};
</script>
<style>
.session_title {
  padding: 8px;
  font-size: 13px;
  padding-left: 15px;
  background-color: #e1e1e1;
}

.padding_item {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 15px;
  padding-right: 15px;
}

.content_coin {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
}
.content_text {
  font-size: 13px;
  font-weight: 100;
}
.greater-icon-style {
  width: 12px
}
.bg-style {
  height: 60px;
}
.transfer_text {
  justifyContent: center;
  alignItems: center;
  paddingTop: 10;
  paddingBottom: 7;
  paddingLeft: 12;
  paddingRight: 12;
  color: #fff;
  fontSize: 13;
  font-weight: 500;
}
.flash_copied_wrapper {
  position: absolute;
  top: -40;
  backgroundColor: #165E83;
  paddingTop: 10;
  paddingBottom: 10;
  paddingLeft: 10;
  paddingRight: 10;
  border-radius: 5;
}
.flash_copied {
  color: #fff;
  font-size: 10;
  font-weight: 500;
}
.bubby_bottom {
  top: 27;
  right: 35;
  position: absolute;
  borderLeftWidth: 10;
  borderRightWidth: 10;
  borderTopWidth: 10;
  borderRightColor: #165E83;
  borderLeftColor: #165E83;
  borderTopColor: #165E83;
  borderLeftColor: transparent;
  borderRightColor: transparent;
}
</style>
