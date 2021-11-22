<template>
  <modal
    :animationType="'fade'"
    :transparent="true"
    :visible="visible"
  >
    <touchable-without-feedback :onPress="() => closeModal()">
      <view class="background-modal" :style="{ flex: 1, justifyContent: 'center'}">
        <view class="background-content" :style="{ width: widthScreen - 80, minHeight: 50, marginLeft: 40, justifyContent: 'center'}">
          <view :style="{alignItems: 'center', paddingBottom: 20, paddingTop: 20}">
            <!-- <top-bubble :message="bubble_message"></!-->
            <image
              :style="{width: 180, height: 180}"
              :source="ICON_07_13"
              resizeMode='contain'
            />
            <!-- TODO: setting options press here -->
            <!-- / options press -->
          </view>
        </view>
      </view>
    </touchable-without-feedback>
  </modal>
</template>

<script>
  import { Dimensions, Modal, Platform, Alert } from 'react-native'
  import { Sticker } from '../../common/Config.js'
  import TopBubble from '../../components/share/top-bubble'
  import ICON_07_13 from "../../../assets/modal/07_13.png"

  export default {
    components: {
      Modal,
      TopBubble
    },
    props: {
      title: String,
      body: String,
      closeModalFunction: {
        type: Function,
        default: function () {}
      },
      visible: Boolean,
      bubble_type: String
    },
    data() {
      return {
        ICON_07_13: ICON_07_13,
        widthScreen: Dimensions.get('window').width,
        stickers: Sticker
      }
    },

    computed: {
      bubble_message() {
        if(this.bubble_type == 'comment') {
          return '感想ありがとう'
        } else if(this.bubble_type == 'stamp') {
          return '応援ありがとう'
        } else {
          return ''
        }
      }
    },

    methods: {
      closeModal() {
        this.closeModalFunction()
      }
    }
  };

</script>
<style>
  .background-modal {
    shadowColor: black;
    shadowOpacity: 0.32;
    shadowRadius: 5.46;
    elevation: 13
  }

  .background-content {
    backgroundColor: rgba(255, 255, 255, 0.9);
    borderRadius: 10;
    overflow: hidden;
    shadowColor: black;
    shadowOpacity: 0.3;
    shadowRadius: 2;
    elevation: 13;
  }
</style>