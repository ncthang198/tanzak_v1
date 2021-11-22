<template>
  <text :style="{fontSize: fontSize, fontWeight: size > 0 ? 'normal' : 'bold'}">{{ timeLeft }}</text>
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
        intervalTimer: null,
        fontSize: 0
      }
    },
    computed: {
      ...mapGetters({ totalCoin: 'user/totalCoin' })
    },
    props: {
      time: Number,
      size: Number,
      type: String,
      story: Object
    },
    created() {
      this.fontSize = this.size ? this.size : 22
    },
    methods: {
      ...mapMutations({
        addCoin: 'user/incrementCoin',
        removeStoryHistory: 'bookDetail/removeStoryHistory',
      }),
      setTime(seconds) {
        clearInterval(this.intervalTimer);
        this.timer(seconds);
      },
      timer(seconds) {
        const now = Date.now();
        const end = now + seconds * 1000;
        this.displayTimeLeft(seconds);
        this.countdown(end);
      },
      displayTimeLeft(secondsLeft) {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;
        if (this.type == 'coin' && this.totalCoin < this.coinFull) {
          return this.timeLeft = `${zeroPadded(minutes)}:${zeroPadded(seconds)}`;
        }
        if (this.type == 'hire')
          this.timeLeft = `${zeroPadded(hours)}:${zeroPadded(minutes)}`;
      },
      countdown(end) {
        try {
          this.intervalTimer = setInterval(() => {
            const secondsLeft = Math.round((end - Date.now()) / 1000);
            if(secondsLeft === 0) {
              if (this.type == 'coin' && this.totalCoin < this.coinFull) {
                this.setTime(COUNT_DOWN_TIMER)
                this.addCoin()
              }
            }
            if(secondsLeft < 0) {
              clearInterval(this.intervalTimer);
              if (this.type == 'coin' && this.totalCoin < this.coinFull) {
                return this.timer(this.time)
              }
              if (this.type == 'hire') {
                // remove story in storyHistory
                this.removeStoryHistory(this.story)
                return
              };
            }
            this.displayTimeLeft(secondsLeft)
          }, 1000);
        }catch(error) {
          writeLog(axios, { event: 'countdown(end)', value: error, log_type: 'error' })
        }
      }
    },
    mounted() {
      this.setTime(this.time)
    },
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
