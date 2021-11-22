<template>
  <touchable-opacity :onPress="handlePress">
    <view :class="'story_container'" :style="[seenStyle || isRead ? read : '']">
      <view :style="{flex: 3, width: 115, marginLeft: -10}">
        <fast-image :source="{uri: story.cover.url || imageUrl}" :style="styleImage" />
      </view>
      <view :style="{flex: 4, marginLeft: -10, marginRight: 10, alignItems: 'flex-start', justifyContent: 'center'}">
        <text :style="{ fontSize: 13, paddingLeft: textPadding}" :numberOfLines=2 >
          {{ story.title }}
        </text>
      </view>
      <view v-if="!isUserPremium" :class="'story-type'">
        <image v-if="isPremium()" :source="premiumIcon" :style="{width: 40, height: 40}" resizeMode="contain"/>
        <image-background v-else :style="{flex: 1, minWidth: 40, alignItems: 'center', justifyContent: 'center'}" resizeMode="contain" :source="storyTypeIcon">
          <text v-if="story.story_type != 'coin'" :style="{fontSize: 10, color: 'black', fontWeight: 'bold'}">
            無料
          </text>
          <view v-else>
            <text v-if="!checkTimeLeft(story)" :style="{fontSize: 16, color: 'black', fontWeight: 'bold'}">
              {{ story.coin }}
            </text>
            <count-down :story="story" v-else :size=10 type="hire" :time="timeLeft" />
          </view>
        </image-background>
      </view>
    </view>
  </touchable-opacity>
</template>

<script>
import CountDown from '../share/Count-Down.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex'
import FreeStory from '../../../assets/images/free_story.png'
import PaidStory from '../../../assets/images/pay_story.png'
import { Platform } from 'react-native'
import PremiumIcon from '../../../assets/modal/08sakuhin_03.png'
import FastImage from 'react-native-fast-image'

export default {
  components: {
    CountDown,
    FastImage
  },
  props: ['goToStory', 'story', 'imageUrl', 'isRead', 'book', 'isUserPremium'],
  computed: {
    ...mapGetters({
      checkTimeLeft: 'bookDetail/checkTimeLeft',
    }),
    timeLeft() {
      if(this.checkTimeLeft(this.story)) {
        time = this.checkTimeLeft(this.story).time_rest.split(':')
        return parseInt(time[0]) * 60 * 60 + parseInt(time[1]) * 60 + parseInt(time[2])
      }
    }
  },
  data(){
    return{
      storyHire: {
        backgroundColor: '#f5e68b'
      },
      storyFree: {
        backgroundColor: '#84c7ef'
      },
      styleImage: {
        resizeMode: 'cover',
        width: 115,
        height: 70,
        marginVertical: 5
      },
      seenStyle: false,
      read: {
        backgroundColor: '#DCDCDC',
      },
      active: false,
      storyTypeIcon: this.story.story_type == 'coin' ? PaidStory : FreeStory,
      textPadding: (Platform.OS === 'ios') ? 0 : 5,
      premiumIcon: PremiumIcon,
    }
  },
  methods: {
    handlePress() {
      this.goToStory(this.story.id, this.story.story_type == 'coin' ? !this.checkTimeLeft(this.story) : false, )
    },

    isPremium(){
      return this.book.member_type == 'premium'
    }
  },
}

</script>

<style>
.story_container {
  flex: 1;
  flexDirection: row;
  alignItems: center;
  justifyContent: space-between;
  paddingLeft: 25;
  paddingVertical: 3;
  borderBottomWidth: 1;
  borderBottomColor: #ccc;
}

.story-type {
  flex: 1;
  alignItems: center;
  justifyContent: center;
  marginRight: 10;
}
</style>
