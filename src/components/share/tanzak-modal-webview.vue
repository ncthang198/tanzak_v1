<template>
  <modal
    animationType="slide"
    :transparent="false"
    :visible="isVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex: 1, justifyContent: 'center', top: getStatusBarHeight()}">
      <view class="backgrund-content" :style="[{ width: widthScreen, height: heightScreen, justifyContent: 'center'}]">
        <view :style="{height: heightScreen}">
              <view class="webv-header-wrap">
                <touchable-opacity :onPress="() =>  handleCloseBrowser()">
                  <view class='closeWrapper'>
                    <text class='closeBtn'> X </text>
                  </view>
                </touchable-opacity>
                <!-- <view :style="{flex: 1, paddingLeft: 20, paddingRight: 20}"> <text :numberOfLines="1" :style="{color: 'white', textAlign: 'center'}">  </text></view> -->
            </view>
            <view :style="{overflow: 'hidden', flex: 1}">
                <web-view
                  :source="{uri: externalLink}"
                  :style="{}"
                  :javaScriptEnabled="true"
                  :scalesPageToFit="true"
                />
            </view>

        </view>
      </view>
    </view>
  </modal>
</template>

<script>
  import { Dimensions, Modal, Platform, Alert, StatusBar } from 'react-native'
  import { mapActions, mapGetters } from 'vuex'
  import { WebView } from 'react-native-webview';

  export default {
    components: {
      Modal,
      WebView
    },
    props: {
      closeModalFunction: {
        type: Function,
        default: function () {}
      },
      isVisible: Boolean,
    },
    data() {
      return {
        widthScreen: Dimensions.get('window').width,
        heightScreen: Dimensions.get('window').height,
      }
    },

    computed: {
      ...mapGetters({
        externalLink: 'user/externalLink'
      })
    },

    methods: {
      ...mapActions({
        updateShowWebview: 'user/updateShowWebview'
      }),

      handleCloseBrowser(){
        this.updateShowWebview(false)
      },

      getStatusBarHeight(){
        if(Platform.OS === 'ios') {
          return Dimensions.get('window').height >= 812 ? 44 : 20
        } else {
          return 10
        }
      },

      checkClose(event) {
        this.updateShowWebview(false)
      },
    }
  };

</script>
<style>
  .background-content {
    /* backgroundColor: rgba(255, 255, 255, 0.9); */
    backgroundColor: red;
    borderRadius: 10;
    overflow: hidden;
    shadowColor: black;
    shadowOpacity: 0.3;
    shadowRadius: 2;
    elevation: 13;
  }

  .closeWrapper {
    marginLeft: 5px;
  }

  .closeBtn {
    font-weight: 300;
    font-size: 25;
    color: gray;
    transform: scaleX(1.3)
  }
  .webv-header-wrap {
    backgroundColor: #f1f1f1;
    color: gray;
    borderTopLeftRadius: 8;
    borderTopRightRadius: 8;
    borderBottomWidth: 1;
    borderColor: #c7c6c6;
    padding: 10;
    flexDirection: row;
  }
</style>
