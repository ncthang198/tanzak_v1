<template>
  <modal animationType="slide" :transparent="true" :visible="modalVisible" :onRequestClose="closeModal">
    <nb-container
      :style="{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8);',
        marginTop: getmarginTop(),
      }"
    >
      <scroll-view :style="{ flex: 1 }">
        <modal-progress :isLoading="_isLoading"/>
        <view :style="{ marginLeft: 15, marginTop: 15 }">
          <touchable-opacity :onPress="closeOutCoin">
            <image
              :style="{ width: 30, height: 30 }"
              resizeMode="contain"
              :source="btnClose"
            />
          </touchable-opacity>
        </view>
        <view
          :style="{
            alignItems: 'center',
            justifyContent: 'center',
            height: 150,
            marginBottom: 15,
          }"
        >
          <image
            resizeMode="contain"
            :style="{ width: '100%', height: '100%' }"
            :source="headerImage"
          />
        </view>
        <view v-if="isPremium || isLock" :style="{alignItems: 'center', paddingBottom: 20}">
          <nb-text class="textBanner" :style="{fontSize: normalize(21), marginBottom: 5}">プレミアム会員</nb-text>
          <nb-text class="textBanner" :style="{fontSize: normalize(21)}">限定コンテンツです</nb-text>
        </view>
        <view v-else>
          <view
            :style="{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }"
          >
            <image
              :style="{ width: 30, height: 30 }"
              resizeMode="contain"
              :source="CoinImage"
            />
            <nb-text class="textBanner" :style="{fontSize: normalize(19)}">コインが切れました</nb-text>
          </view>
          <view :style="{ padding: 25, alignItems: 'center' }">
            <nb-button
              :style="{
                backgroundColor: '#ffcc01',
                alignItems: 'center',
                height: 50,
                borderRadius: 25,
              }"
              :onPress="() => chooseAction()"
              block
            >
              <image
                v-if="!isBuyCoin"
                resizeMode="contain"
                :style="{ width: 30, height: 30 }"
                :source="cricleArrow"
              />
              <text
                :style="{
                  color: 'black',
                  marginLeft: 5,
                  fontSize: normalize(18),
                  fontWeight: 'bold',
                }"
                >{{ textBuyCoin }}</text
              >
              <icon v-if="isBuyCoin"></icon>
            </nb-button>
          </view>
        </view>
        <view :style="{ alignItems: 'center' }">
          <text v-if="!(isPremium || isLock)" :style="{ color: 'white', fontSize: normalize(13) }">または</text>
          <text class="textBanner" :style="{ marginTop: 10, marginBottom: 10, fontSize: normalize(18) }">今すぐ読み放題プランに加入する</text>
        </view>
        <view :style="{ paddingLeft: 25, paddingRight: 25, alignItems: 'center' }">
          <nb-button
            class="btnPlan"
            :style="{ backgroundColor: '#ffcc01', borderColor: '#ffcc01' }"
            block
            :onPress="() => handlePaySubscription(planMonth)"
          >
            <text class="textPlan" :style="{ fontSize: normalize(26), marginTop: 10 }">{{
              planMonth.duration +
              " " +
              subscription_count_units[planMonth.unit]
            }}</text>
            <text
              class="textPlan"
              :style="{ fontSize: normalize(26), marginBottom: 10 }"
              >{{ textPlan }}</text
            >
            <view class="textFree" :style="{ right: 15, top: 10 }">
              <text :style="{ color: 'white', fontWeight: 'bold' }">7日間無料</text>
            </view>
          </nb-button>
          <text class="textDuration"
                :style="{fontSize: normalize(17)}"
            >7日後 ￥{{
              formatNumber(planMonth.amount) +
              "/" +
              subscription_units[planMonth.unit]
            }}</text
          >
          <nb-button class="btnPlan" block :onPress="() => handlePaySubscription(planYear)">
            <text
              class="textPlan"
              :style="{ marginTop: 10, marginBottom: 10, fontSize: normalize(20) }"
              >{{
                planYear.duration +
                " " +
                subscription_count_units[planYear.unit] +
                " " +
                textPlan
              }}</text
            >
            <view class="textFree" :style="{ right: 15, top: -10 }">
              <text :style="{ color: 'white', fontWeight: 'bold' }">7日間無料</text>
            </view>
          </nb-button>
          <text class="textDuration"
                :style="{fontSize: normalize(17)}"
            >7日後 ￥{{
              formatNumber(planYear.amount) +
              "/"+ planYear.duration +"ヶ" +
              subscription_units[planYear.unit]
            }}</text
          >
          <nb-button class="btnPlan" block :onPress="() => handlePaySubscription(planWeek)">
            <text
              class="textPlan"
              :style="{ marginTop: 10, marginBottom: 10, fontSize: normalize(20) }"
              >{{
                planWeek.duration +
                " " +
                subscription_count_units[planWeek.unit] +
                " " +
                textPlan
              }}</text
            >
          </nb-button>
          <text class="textDuration"
                :style="{fontSize: normalize(17)}"
            >￥{{
              formatNumber(planWeek.amount) +
              "/" +
              subscription_units[planWeek.unit]
            }}</text
          >
          
          <text class="textBanner" :style="{ marginTop: 10, marginBottom: 10, fontSize: normalize(19) }" :onPress="() => _mergeSubscription()">すでに登録済みの方はこちら</text>
        </view>
        <view
          :style="{
            marginTop: 10,
            padding: 20,
            opacity: 0.6,
            paddingBottom: 150,
          }"
        >
          <nb-text
            :style="{
              color: 'white',
              fontSize: normalize(10),
              textAlign: 'justify',
              lineHeight: 20,
            }"
            >{{ regulations }}</nb-text
          >
        </view>
      </scroll-view>
    </nb-container>
  </modal>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import Close from "../../../assets/images/close.png";
import Coin from "../../../assets/images/coin_icon.png";
import CircleArrow from "../../../assets/images/icon_arrow_cricle.png";
import HeaderImage1 from "../../../assets/auto-stamp/sp_info_1.png";
import HeaderImage2 from "../../../assets/auto-stamp/sp_info_2.png";
import HeaderImage3 from "../../../assets/auto-stamp/image_premium.png"
import { Ionicons } from "@expo/vector-icons";
import { SUBSCRIPTION_UNIT, SUBSCRIPTION_COUNT_UNIT, SUBSCRIPTION_REGULATIONS } from "../../common/Constant.js";
import Banner from "../../components/banner/index.vue";
import React from "react";
import { NativeModules, Modal, Platform, Dimensions, StatusBar, PixelRatio, Alert } from "react-native";
import { formatNumber, writeLog, normalize } from "../../common/helper.js";
import RewardedAdmod from "../../common/RewardedVideo";
const { InAppUtils } = NativeModules;
import InAppBilling from "react-native-billing";
import ModalProgress from "../../components/share/ModalProgress.vue"

export default {
  components: {
    Modal,
    ModalProgress,
    Icon: () => { 
      return (
        <Ionicons
          style={{ marginLeft: 3, marginTop: 2, marginRight: 2 }}
          name="ios-arrow-forward"
          size={30}
          color="black"
        />
      );
    },
    ModalProgress
  },

  props: {
    subscriptions: Array,
    closeModal: Function,
    isBuyCoin: Boolean,
    navigation: Object,
    currentStory: Object,
    setLoading: {
      type: Function,
      default: function () {},
    },
    isPremium: Boolean,
    isLock: Boolean,
    onEndAds: {
      type: Function,
      default: function () {},
    },
  },
  data() {
    return {
      modalVisible: false,
      btnClose: Close,
      CoinImage: Coin,
      cricleArrow: CircleArrow,
      headerImage: HeaderImage1,
      regulations: SUBSCRIPTION_REGULATIONS,
      subscription_units: SUBSCRIPTION_UNIT,
      subscription_count_units: SUBSCRIPTION_COUNT_UNIT,
      planWeek: this.subscriptions[0],
      planMonth: this.subscriptions[1],
      planYear: this.subscriptions[2],
      textPlan: "読み放題",
      textBuyCoin: "",
      story: null,
      isLoading: false,
    };
  },

  methods: {
    formatNumber,
    normalize,
    writeLog,

    ...mapActions({
      watchVideos: "bookDetail/watchVideos",
      _subscription: "user/subscription", 
      _mergeSubscription: 'user/mergeSubscription',
      _getCurrentSubscription: 'user/getCurrentSubscription', 
    }),
    closeAds() {
      console.log('end ads')
      this.closeModal();
      this.onEndAds && this.onEndAds();
    },
    updateCoin() {
      if (this.story) {
        this.watchVideos(this.story);
        this.setLoading(false);
        this.closeAds();
      }
    },

    getmarginTop(){
      if(Platform.OS === 'ios') {
        return Dimensions.get('window').height >= 812 ? 44 : 20
      } else {
        return StatusBar.currentHeight - 24
      }
    },

    closeOutCoin() {
      this.closeModal();
    },

    buyCoin() {
      this.closeModal();
      this.navigation.navigate("CoinShop");
    },

    startRewardedAdmod() {
      // this.closeModal();
      this.setLoading(true);
      RewardedAdmod.startAd();
    },

    chooseAction() {
      // console.log()
      if (this.isBuyCoin) {
        this.buyCoin();
      } else {
        this.startRewardedAdmod();
      }
    },
    async handlePaySubscription(subscription){
      if(this.isLoading)
        return
      await this.axios.post('/api/logs/event_log', {event: 'BUY_SUBCRIPTION_OUT_COIN', value: subscription , device: Constants.deviceName + '=' + DeviceInfo.getUniqueId(), log_type: 'info' })
      await this._subscription(subscription)
      await this._getCurrentSubscription()
    },
  },

  mounted() {
    this.modalVisible = true;
    if (this.isPremium || this.isLock){
      this.headerImage = HeaderImage3;
      return
    }
    if (this.isBuyCoin) {
      this.headerImage = HeaderImage2;
      this.textBuyCoin = "コインを購入して続きを読む";
    } else {
      this.headerImage = HeaderImage1;
      this.textBuyCoin = "広告を見て続きを読む";
    }
  },

  created() {
    this.story = this.currentStory;
    RewardedAdmod.onRewardedUser = this.updateCoin.bind(this);
    RewardedAdmod.onRewardedClose = function () {
      this.setLoading(false);
      this.closeAds();
    }.bind(this);
    RewardedAdmod.onRewardedOpen = function () {
      this.setLoading(false);
    }.bind(this);
    RewardedAdmod.onAdLoadFail = function () {
      this.setLoading(false);
      alert("Ads load failed");
    }.bind(this);
  },
  watch: {
    _isLoading(newVal, oldVal){
      this._isLoading = newVal
    }
  },
  computed: {
    ...mapGetters({
      _isLoading: 'user/isLoading'
    })
  }
};
</script>

<style>
.btnPlan {
  background-color: white;
  border-radius: 15;
  border-color: white;
  flex-direction: column;
  justify-content: center;
  min-width: 70;
  height: auto;
}

.textDuration {
  font-size: 22;
  color: white;
  margin-bottom: 20;
  margin-top: 3;
}

.textPlan {
  font-size: 24;
  font-weight: bold;
}

.textBanner {
  color: white;
  font-weight: bold;
}

.textFree {
  position: absolute;
  border-width: 1;
  background-color: red;
  border-color: red;
  border-radius: 5;
  padding-top: 2;
  padding-bottom: 2;
  padding-left: 8;
  padding-right: 8;
}
</style>
