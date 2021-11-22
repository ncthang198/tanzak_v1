import { REWARDED_AD_UNIT_ID, REWARDED_AD_UNIT_ID_IOS } from './Config';
import { AdMobRewarded } from 'expo';
import { Platform } from 'react-native'

let RewardedAdmod = {
  startAd: function () {
    AdMobRewarded.setAdUnitID(Platform.OS === 'ios' ? REWARDED_AD_UNIT_ID_IOS : REWARDED_AD_UNIT_ID);
    // AdMobRewarded.setTestDeviceID('EMULATOR');
    AdMobRewarded.addEventListener('rewardedVideoDidRewardUser', this.onRewardedFinish)
    AdMobRewarded.addEventListener('rewardedVideoDidClose', this.onRewardedClose)
    AdMobRewarded.addEventListener('rewardedVideoDidOpen', this.onAdOpened)
    AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', this.onAdLoadFail)
    AdMobRewarded.requestAd()
    .then(()=>AdMobRewarded.showAd())
    .catch((error)=> { AdMobRewarded.showAd() });
  },
  onRewardedFinish: function () {},
  onRewardedClose: function () {},
  onCloseAdsUnExpected: function () {},
  onAdOpened: function() {},
  onAdLoadFail: function() {console.log("admod load fail")}
};

export {RewardedAdmod};
