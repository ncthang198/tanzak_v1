<template>
  <view :style="{flexDirection: 'row', alignItems: 'flex-start'}">
    <text :style="{fontSize: fontSize, minWidth: 42}">{{ timeLeft }}</text>
    <text :style="{fontSize: fontSize}">で1枚回復 </text>
  </view>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { mapGetters } from 'vuex'
  import { COIN_FULL, COUNT_DOWN_TIMER } from '../../common/Config.js'
  import { writeLog } from '../../common/helper.js'
  import axios from 'axios'


  export default {
    data() {
      return {
        timeLeft: '00:00',
        coinFull: COIN_FULL,
        fontSize: 0
      }
    },
    computed: {
      ...mapGetters({
        totalCoin: 'user/totalCoin',
        timeCountDown: 'user/timeCountDown'
      })
    },

    watch: {
      timeCountDown(newVal, oldVal){
        this.timeLeft = this.displayTimeLeft(newVal)
      }
    },
    props: {
      size: Number,
    },
    created() {
      this.fontSize = this.size ? this.size : 15
    },

    methods: {
      displayTimeLeft(secondsLeft) {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;

        if(this.totalCoin < this.coinFull) {
          return this.timeLeft = `${zeroPadded(minutes)}:${zeroPadded(seconds)}`;
        }
      }
    }
  };

function zeroPadded(num) {
    // 4 --> 04
    return num < 10 ? `0${num}` : num;
}

function hourConvert(hour) {
    // 15 --> 3
    return (hour % 12) || 12
}

</script>
