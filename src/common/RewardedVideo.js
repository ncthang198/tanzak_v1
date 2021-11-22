import { NativeModules, NativeEventEmitter, Platform } from 'react-native'
import { APPLOVIN_ID_TEST_IOS , APPLOVIN_ID_TEST_ANDROID } from './Config';

const RewardVideoEmitter = new NativeEventEmitter(NativeModules.RewardedVideo);
const Ads = NativeModules.RewardedVideo
let rewardSub;
let openSub;
let failSub;
let loadSuccessSub;
let adCloseSub;

const RewardedAdmod = {
  startAd: function () {
    Ads.setAdUnitId(Platform.OS === 'ios' ? APPLOVIN_ID_TEST_IOS : APPLOVIN_ID_TEST_ANDROID);  // Applovin Unit Id
    Ads.initAd()
    rewardSub = RewardVideoEmitter.addListener('rewardedVideoDidRewardUser', this.onRewardedUser)
    adCloseSub = RewardVideoEmitter.addListener('rewardedVideoAdClosed', this.onRewardedClose)
    openSub = RewardVideoEmitter.addListener('rewardedVideoAdVideoStarted', this.onRewardedOpen)
    failSub = RewardVideoEmitter.addListener('rewardedVideoAdFailedToLoad', this.onAdLoadFail)
    loadSuccessSub = RewardVideoEmitter.addListener('rewardedVideoAdLoaded', this.onAdLoadSuccess)
  },
  showAd() {
    Ads.showAd() 
    loadSuccessSub.remove()
  },
  onRewardedUser: function () {
  },
  onAdLoadSuccess: function () {
    Ads.showAd()
    loadSuccessSub.remove()
  },
  onRewardedClose: function () {
  },
  onRewardedOpen: function () {
  },
  onAdLoadFail: function() {console.log("admod load fail")}
};

export default RewardedAdmod;
