<template>
  <view :style="{ paddingBottom: 12, marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }">
    <view :style="{ flex: 2, flexDirection: 'row', textAlign: 'left'}">
      <view :style="{position: 'absolute', zIndex: 10, left: -10, top: -10}">
        <image resizeMode="contain" :style="{height: 56}" :source="coinIcon" />
      </view>

      <view :style="{minWidth: 100}">
        <touchable-opacity :onPress="()=> navigation.navigate('CoinShop')" :activeOpacity="0.8">
          <text class='coin-number' :style="{textAlign: 'right'}"> {{ formatCoinNumber(_totalCoin) }} 枚</text>
        </touchable-opacity>
      </view>

      <!-- TODO check coin > 30 -->
      <!-- <text class="text-coin" :style="{ fontSize: coinTextSize }">{{ _totalCoin > coinFull ? coinFull : _totalCoin }}</text> -->
      <!-- <view v-if="_totalCoin == coinFull" :class="'add-coin'">
        <text class="full-coin">FULL</text>
      </view>
      <view v-if="_totalCoin > coinFull" :class="'add-coin'">
        <text class="text-coin" :style="{ fontSize: coinTextSize}"> + {{ _totalCoin - coinFull }} </text>
      </view> -->

      <view :style="{flex: 1, flexDirection:'row', alignItems: 'center', marginLeft: '4%'} ">
        <image :style="{height: 15, width: 16}" :source="clockIcon" />
        <view v-if="_totalCoin < coinFull" :style="{marginLeft: '2%'}">
          <count-down-coin />
        </view>
        <text v-if="_totalCoin >= coinFull" :style="{fontSize: 13}"> 30枚未満で自動回復 </text>
      </view>
    </view>

    <view :style="{flex: 0.2, alignItems: 'flex-end'}">
      <touchable-opacity :onPress="() => handleHelpClick()" :hitSlop="{top: 20, bottom: 20, left: 50, right: 40}">
        <image :style="{height: 20, width: 20}" :source="helpIcon" />
      </touchable-opacity>
    </view>

    <!-- help modal -->
    <help-modal
      v-if="helpModalShow"
      :body="helpModalContent"
      :options="[{ text: 'OK', handle: handleCloseHelp }]">
    </help-modal>

  </view>
</template>

<script>

import CountDownCoin from "../share/count-down-coin"
import CoinHolder from "../../../assets/images/coin_holder.png"
import coinIcon from "../../../assets/images/coin_icon.png"
import AddIcon from "../../../assets/images/plus_icon.png"
import helpIcon from "../../../assets/images/help.png"
import clockIcon from "../../../assets/images/clock.png"
import HelpModal from '../share/tanzak-alert'
import { mapGetters } from 'vuex'
import { Icon } from 'native-base';
import { COUNT_DOWN_TIMER, COIN_FULL, BUY_COIN } from '../../common/Config.js';

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data() {
    return {
      coinFull: COIN_FULL,
      buyCoin: BUY_COIN,
      coinHolder: CoinHolder,
      addCoin: AddIcon,
      coinIcon: coinIcon,
      clockIcon: clockIcon,
      helpIcon: helpIcon,
      coinTextSize: 27,
      timer: null,
      helpModalShow: false,
      helpModalContent: 'コインは作品を読むために活用します。所持数が30枚未満になると40分に1枚自動で回復します。自動で回復するのは30枚までです。'
    }
  },
  components: {
    CountDownCoin,
    HelpModal
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/currentUser',
      timeLeft: 'user/timeCountDown',
      _totalCoin: 'user/totalCoin'
    })
  },
  watch: {
    _totalCoin: function(){
      this.timer = this.timeLeft
    }
  },
  mounted() {
    this.timer = this.timeLeft
  },

  created() {
    this.setUpCoinTextSize(this._totalCoin)
  },
  methods: {
    setUpCoinTextSize(value) {
      switch (value.toString().length) {
        case 3:
          this.coinTextSize = 22
          break
        case 4:
          this.coinTextSize = 17
          break
        case 5:
          this.coinTextSize = 14
          break
        case 6:
          this.coinTextSize = 12
          break
        case 7:
          this.coinTextSize = 10
          break
        default:
          this.coinTextSize = 27
      }
    },

    handleHelpClick(){
      this.helpModalShow = true
    },

    handleCloseHelp(){
      this.helpModalShow = false
    },
    formatCoinNumber(coin){
      if(coin > 999999){
        // 1.000.000
        return '1000K'
      }
      return coin
    }
  }

}
</script>

<style scoped>
.coin-number {
  fontSize: 15;
  fontWeight: bold;
  color: white;
  paddingLeft: 40px;
  paddingRight: 10px;
  paddingTop: 7px;
  paddingBottom: 7px;
  backgroundColor: #016087;
  borderRadius: 15;
  overflow: hidden;
}

.text-coin {
  fontWeight: bold;
  position: absolute;
  color: white;
}

.full-coin {
  fontSize: 27;
  fontWeight: bold;
  position: absolute;
  color: white;
}

.add-coin {
  flex: 2;
  justifyContent: center;
  alignItems: center;
  marginLeft: -20;
  borderRadius: 45;
  minHeight: 45;
  backgroundColor: #016087;
}


.buy-coin {
  position: absolute;
  top: 27;
  zIndex: 999;
  flex: 1;
  alignItems: center;
  right: -8;
}
</style>
