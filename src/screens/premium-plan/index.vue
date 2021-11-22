<template>
  <view :style="{flex: 1}">
    <modal-progress :isLoading="isLoading"/>
    <image-background v-if="isIOS()" resizeMode="cover" :source="bgHeader">
      <view :style="{height: getStatusBarHeight()}">
        <safe-area-view :style="{flex: 1}">
          <status-bar bar-style="dark-content" translucent="false" />
        </safe-area-view>
      </view>
    </image-background>
    <image-background resizeMode="cover" :source="BackgroundImage" :style="{flex: 1}">
      <scroll-view>
        <view>
        <touchable-opacity :onPress="handleBack" class="backButton">
              <image
                resizeMode="contain"
                :style="{width: 25, height: 20}"
                :source="BackIcon" />
          </touchable-opacity>
        <image :style="{width: '100%',height: getHeightImage(mainHeader, 0, 0) }" resizeMode="stretch" :source="mainHeader" />
        </view>
        <view :style="{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginLeft: 30, marginRight: 30 }">
          <view 
            v-for="(subscription, index) in subscriptions"
            :key="index.toString()"
          >
            <view v-if="subscription.choose" class="border" :style="{borderWidth: 2, borderColor: '#009999' }">
              <view v-if="index > 0" class="triangleCorner">
              </view>
              <text v-if="index > 0" class="textRoate" :style="{fontSize: normalize(8)}">オススメ</text>
              <text class="textPlan" :style="{fontSize: normalize(16)}">{{ subscription.duration + subscriptionCountUnits[subscription.unit] }}</text>
              <text class="textPlan" :style="{fontSize: normalize(16)}">読み放題</text>
              <text class="textPlan" :style="{fontSize: normalize(10), paddingTop: 10, fontWeight: '400'}">
                {{showTextSubscription(subscription.amount, subscription.duration, subscriptionUnits[subscription.unit])}}
              </text>
              <view class="arrowChooseLeft" ></view>
              <view class="arrowChooseRight"></view>
            </view>
            <touchable-opacity v-else  :onPress="() => chooseSubscription(index)">
              <view class="border" :style="{borderWidth: 1, borderColor: 'black'}">
                <view v-if="index > 0" class="triangleCorner">
                </view>
                <text v-if="index > 0" class="textRoate" :style="{fontSize: normalize(8)}">オススメ</text>
                <text class="textNormal" :style="{fontSize: normalize(16)}">{{ subscription.duration + subscriptionCountUnits[subscription.unit] }}</text>
                <text class="textNormal" :style="{fontSize: normalize(16)}">読み放題</text>
                <text class="textNormal" :style="{fontSize: normalize(10), paddingTop: 10}">
                  {{showTextSubscription(subscription.amount, subscription.duration, subscriptionUnits[subscription.unit])}}
                </text>
                <view class="arrowNormalLeft" ></view>
                <view class="arrowNormalRight" ></view>
              </view>
            </touchable-opacity>
          </view>
        </view>
        <touchable-opacity :onPress="()=> handlePaySubscription(subscriptionChoose)">
          <view :style="{flex: 1, marginLeft: 20, marginRight: 20, alignItems: 'center', justifyContent: 'center'}">
            <image :style="{width: '100%'}" resizeMode="contain" :source="BackgroundButton" />
            <text :style="{fontWeight: 'bold', fontSize: normalize(23), position: 'absolute'}">{{textPlanButton}}</text>
          </view>
        </touchable-opacity>
        <view :style="{alignItems: 'center', marginTop: -15}">
          <text :style="{marginTop: 3, color: 'dimgray', fontSize: normalize(10)}">{{textSubscription}}</text>
        </view>
        <view :style="{ backgroundColor: 'white', margin: 10, borderRadius: 5, padding: 20, marginTop: 25}">
          <image resize='stretch' :style="{width: '100%', height: 40}" :source="ImageText"/>
          <view v-for="(endowPlan, key) in endowPlans" :key="key" :style="{marginTop: 10, flex: 1}">
            <text :style="{position: 'absolute', zIndex: 1, color: 'white', fontSize: normalize(14), fontWeight: '800', top: 12, left: endowPlan.left}">
              {{endowPlan.text}}
            </text>
            <image resize='stretch' :style="{width: '100%', height: getHeightImage(endowPlan.image, 30, 30)}" :source="endowPlan.image"/>
            <text :style="{lineHeight: 20, paddingTop: 5, paddingLeft: 13, paddingRight: 8, fontSize: normalize(12), color: '#5f5f60' }">
              {{endowPlan.content}}
            </text>
          </view>
        </view>
        <view :style="{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginLeft: 30, marginRight: 30 }">
          <view 
            v-for="(subscription, index) in subscriptions"
            :key="index.toString()"
          >
            <view v-if="subscription.choose" class="border" :style="{borderWidth: 2, borderColor: '#009999' }">
              <view v-if="index > 0" class="triangleCorner">
              </view>
              <text v-if="index > 0" class="textRoate" :style="{fontSize: normalize(8)}">オススメ</text>
              <text class="textPlan" :style="{fontSize: normalize(16)}">{{ subscription.duration + subscriptionCountUnits[subscription.unit] }}</text>
              <text class="textPlan" :style="{fontSize: normalize(16)}">読み放題</text>
              <text class="textPlan" :style="{fontSize: normalize(10), paddingTop: 10, fontWeight: '400'}">
                {{showTextSubscription(subscription.amount, subscription.duration, subscriptionUnits[subscription.unit])}}
              </text>
              <view class="arrowChooseLeft" ></view>
              <view class="arrowChooseRight"></view>
            </view>
            <touchable-opacity v-else  :onPress="() => chooseSubscription(index)">
              <view class="border" :style="{borderWidth: 1, borderColor: 'black'}">
                <view v-if="index > 0" class="triangleCorner">
                </view>
                <text v-if="index > 0" class="textRoate" :style="{fontSize: normalize(8)}">オススメ</text>
                <text class="textNormal" :style="{fontSize: normalize(16)}">{{ subscription.duration + subscriptionCountUnits[subscription.unit] }}</text>
                <text class="textNormal" :style="{fontSize: normalize(16)}">読み放題</text>
                <text class="textNormal" :style="{fontSize: normalize(10), paddingTop: 10}">
                  {{showTextSubscription(subscription.amount, subscription.duration, subscriptionUnits[subscription.unit])}}
                </text>
                <view class="arrowNormalLeft" ></view>
                <view class="arrowNormalRight" ></view>
              </view>
            </touchable-opacity>
          </view>
        </view>
        <touchable-opacity :onPress="()=> handlePaySubscription(subscriptionChoose)">
          <view :style="{flex: 1, marginLeft: 20, marginRight: 20, alignItems: 'center', justifyContent: 'center'}">
            <image :style="{width: '100%'}" resizeMode="contain" :source="BackgroundButton" />
            <text :style="{fontWeight: 'bold', fontSize: normalize(23), position: 'absolute'}">{{textPlanButton}}</text>
          </view>
        </touchable-opacity>
        <view :style="{alignItems: 'center', marginTop: -15}">
          <text :style="{marginTop: 3, color: 'dimgray', fontSize: normalize(10)}">{{textSubscription}}</text>
        </view>
        <view :style="{alignItems: 'center', marginTop: 40}">
          <text :style="{fontSize: normalize(22), fontWeight: 'bold', marginBottom: 20, color: '#555555'}">よくある質問</text>
          <view v-for="(goodQuestion, key) in goodQuestions" :key="key" :style="{marginBottom: 15}">
            <view :style="{ marginLeft: 30, flexDirection: 'row', marginTop: 10}">
              <image resize="contain" :style="{width: 25, height: 30}" :source="ImageQuestion"/>
              <text :style="{fontSize: normalize(15), fontWeight: 'bold', marginLeft: 10, marginRight: 35, lineHeight: lineHeight(normalize(14)), color: '#555555'}">{{goodQuestion.question}}</text>
            </view>
            <view :style="{ marginLeft: 30, flexDirection: 'row', marginTop: 10 }">
              <image resize="contain" :style="{width: 25, height: 30}" :source="ImageAnswer"/>
              <text :style="{fontSize: normalize(14), color: '#5f5f60' ,marginLeft: 10, marginRight: 35, lineHeight: lineHeight(normalize(14)), fontWeight: '300'}">{{goodQuestion.answer}}</text>
            </view>
          </view>
        </view>
        <view :style="{alignItems: 'center', marginTop: 20, paddingLeft: 20, paddingRight: 20}">
          <text :style="{fontSize: normalize(22), fontWeight: 'bold', marginBottom: 20, color: '#555555'}">注意事項</text>
          <text :style="{
            color: '#555555',
            fontSize: normalize(10),
            textAlign: 'justify',
            lineHeight: lineHeight(normalize(10)),
          }">{{ regulations }}</text>
        </view>
        <view :style="{alignItems: 'center', marginTop: 50, marginBottom: 20}">
          <text :style="{fontSize: normalize(10), color: '#5f5f60', fontWeight: '400'}">©SHUEISHA Inc. All right reserved</text>
        </view>
      </scroll-view>
    </image-background>
  </view>
</template>

<script>
import HeaderBackground from '../../../assets/stamp/plan_header.png';
import bgHeader from "../../../assets/top/bg_header.png";
import Background from '../../../assets/top/bg_top.png'
import BackgroundButton from '../../../assets/stamp/plan_button.png'
import ImageText from '../../../assets/stamp/sp_LP_5b_Text.png'
import Image001 from '../../../assets/stamp/001.png'
import Image002 from '../../../assets/stamp/002.png'
import Image003 from '../../../assets/stamp/003.png'
import Image004 from '../../../assets/stamp/004.png'
import ImageQuestion from '../../../assets/stamp/plan_ques.png'
import BackIcon from '../../../assets/images/back_icon.png'
import ImageAnswer from '../../../assets/stamp/plan_answer.png'
import React from 'react';
import { Platform, Dimensions, StatusBar, PixelRatio, Alert } from 'react-native';
import { writeLog, formatNumber, normalize, getHeightImage } from '../../common/helper.js';
import { SUBSCRIPTION_UNIT, SUBSCRIPTION_COUNT_UNIT, SUBSCRIPTION_REGULATIONS } from '../../common/Constant.js';
import InAppBilling from "react-native-billing"
import ModalProgress from "../../components/share/ModalProgress.vue"
import { mapActions } from 'vuex';

export default {
  props: {
    navigation: {
      type: Object
    }
  },

  components: {
    ModalProgress
  },
  data() {
    return {
      mainHeader: HeaderBackground,
      bgHeader: bgHeader,
      BackgroundImage: Background,
      BackgroundButton: BackgroundButton,
      ImageText: ImageText,
      Image001: Image001,
      Image002: Image002,
      Image003: Image003,
      Image004: Image004,
      ImageQuestion: ImageQuestion,
      ImageAnswer: ImageAnswer,
      subscriptionChoose: {},
      textSubscription: '',
      textPlanButton: '',
      BackIcon: BackIcon,
      endowPlans: [
        {
          image: Image001, 
          text: '全作品読み放題',
          left: 30,
          content: 'オリジナル作品から漫画原作の公式スピンオフ作品まで、合計1,000話以上の作品が全作品制限なしで今すぐ読み放題！'
        },
        {
          image: Image002, 
          text: '会員限定ストーリー',
          left: 15,
          content: '会員限定のオリジナル作品やTanZakだけの公式スピンオフが読める！会員登録してもっとTanZakを楽しもう！'
        },
        {
          image: Image003, 
          text: '特典画像公開',
          left: 40,
          content: '口絵や設定資料など様々な特典画像が見られる！お気に入りの作品をさらに楽しもう！'
        },
        {
          image: Image004, 
          text: '広告非表示',
          left: 45,
          content: 'アプリ内に表示される広告がすべて非表示に。より快適に作品を読み進めることができます。'
        },
      ],
      goodQuestions: [
        {
          question: '無料期間はどのようにカウントされ ますか？',
          answer: '無料期間は登録日を1日目として7日間となります。例えば5/29に登録した場合、6/4までが無料期間となり、6/5から定額読み放題へ自動移行となります。'
        },
        {
          question: '読み放題が反映されません。',
          answer: '稀に通信環境の影響でご利用の端末とスト\
ア（AppleやGoogle ）との通信が失敗する場合があり、購入が反映されないことがございます。その場合には、アプリの【設定】→【読み放題の復元】をタップいただくことで端末との再通信が行われ、購入データが反映されます。\n\
万一それでも読み放題が反映されない場合は、アプリ内のお問い合わせより詳細をご記載のうえ、ご連絡いただけますと幸いです。'
        }
      ],
      subscriptions: [],
      subscriptionUnits: SUBSCRIPTION_UNIT,
      subscriptionCountUnits: SUBSCRIPTION_COUNT_UNIT,
      regulations: SUBSCRIPTION_REGULATIONS,
      isLoading: false,
    }
  },
  mounted(){
  },
  methods: {
    writeLog,
    formatNumber,
    normalize,
    getHeightImage,
    ...mapActions({
      _subscription: 'user/subscription',
      _getCurrentSubscription: 'user/getCurrentSubscription', 
    }),
    handleBack() {
      return this.navigation.goBack()
    },
    getStatusBarHeight(){
      if(Platform.OS === 'ios') {
        return Dimensions.get('window').height >= 812 ? 44 : 20
      } else {
        return StatusBar.currentHeight
      }
    },

    isIOS(){
      return (Platform.OS === "ios")
    },

    lineHeight(fontSize) {
      const multiplier = (fontSize > 20) ? 1.5 : 1;
      return parseInt((fontSize + (fontSize * multiplier))*0.75, 10);
    },

    fetchSubscriptionsApi(){
      this.axios.get('api/subscriptions').then((res) => {
        this.subscriptions = res.data.data
        this.subscriptions.forEach((subscription, index) => {
          if (index == 1) {
            subscription = Object.assign(subscription, {choose: true})
            this.subscriptionChoose = subscription
            this.getTextSubsctiption(subscription)
          }else{
            subscription = Object.assign(subscription, {choose: false})
          }
        })
      }).catch((error) => {
        this.writeLog(this.axios, { event: 'GET SUBSCRIPTIONS ERROR', value: error, log_type: 'info' })
      })
    },

    showTextSubscription(amount, duration, unit){
      if (duration > 1) {
          durationText = duration
          unit = unit == '月' ? 'ヶ月' : unit
        }else{
          durationText = ''
        }
        return "￥" + formatNumber(amount) + '/' + durationText + unit
    },

    toBuyCoin(){
      this.navigation.navigate('CoinShop')
    },
    chooseSubscription(index){
      this.subscriptions.forEach((subscription, key) => {
        if (key == index) {
          subscription.choose = true
          this.getTextSubsctiption(subscription)
          this.subscriptionChoose = subscription
        } else {
          subscription.choose = false
        }
      })
    },
    getTextSubsctiption(subscription){
      switch (subscription.unit) {
        case 'week':
          this.textSubscription = ''
          this.textPlanButton = '登録する'
          break;
        case 'month':
          this.textSubscription = `無料体験後、${subscription.duration}ヶ月ごとに¥${formatNumber(subscription.amount)}が課金されます。`
          this.textPlanButton = '7日間無料'
          break;
        case 'year':
          this.textSubscription = `無料体験後、1年ごとに¥${formatNumber(subscription.amount)}が課金されます。`
          this.textPlanButton = '7日間無料'
          break;
      }
    },

    async handlePaySubscription(subscription){
      if(this.isLoading)
        return      
      await this._subscription(subscription);
      await this._getCurrentSubscription()
    },
  },

  mounted(){
    this.fetchSubscriptionsApi()
  }
}
</script>
<style>
  .text {
    flex-direction: column;
  }

  .textPlan{
    color: #009999;
    font-weight: bold;
    padding-top: 5;
  }

  .textNormal{
    color: black;
    padding-top: 5;
    font-weight: 200;
  }

  .border {
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 10;
    padding-top: 15;
    padding-bottom: 15
  }

  .arrowChooseLeft{
    width: 10;
    height: 13;
    position: absolute;
    bottom: -12.5;
    border-left-width: 10;
    border-left-color: transparent;
    border-right-width: 10;
    border-right-color: transparent;
    border-top-width: 13;
    border-top-color: #009999;
  }

  .arrowChooseRight{
    width: 10;
    height: 13;
    position: absolute;
    bottom: -12.5;
    border-left-width: 7;
    border-left-color: transparent;
    border-right-width: 7;
    border-right-color: transparent;
    border-top-width: 10;
    border-top-color: white;
  }

   .arrowNormalLeft{
    width: 10;
    height: 13;
    position: absolute;
    bottom: -12.5;
    border-left-width: 10;
    border-left-color: transparent;
    border-right-width: 10;
    border-right-color: transparent;
    border-top-width: 13;
    border-top-color: black;
  }

  .arrowNormalRight{
    width: 10;
    height: 13;
    position: absolute;
    bottom: -12.5;
    border-left-width: 9;
    border-left-color: transparent;
    border-right-width: 9;
    border-right-color: transparent;
    border-top-width: 12;
    border-top-color: white;
  }

  .backButton{
    position: absolute;
    top: 5%;
    z-index: 50;
  }

  .triangleCorner {
    position: absolute;
    width: 0;
    height: 0;
    top: -2;
    left: -2;
    background-color: transparent;
    border-right-width: 50;
    border-top-width: 50;
    border-right-color: transparent;
    border-top-color: #e60000;
   }

  .textRoate {
    color: white;
    font-weight: 500;
    top: 8;
    left: -4;
    transform: rotate(315deg);
    z-index: 1;
    position: absolute;
  }
</style>