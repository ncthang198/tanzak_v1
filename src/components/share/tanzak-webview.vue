<template>
  <view :style="{flex: 1, zIndex: 2, position: 'absolute', width: '100%', height: '100%'}">
      <view :style="{flex: 1, top: 100}">
        <view :style="{backgroundColor: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomWidth: 1, borderColor: '#c7c6c6', padding: 10, flexDirection: 'row'}">
            <touchable-opacity :onPress="() =>  handleCloseBrowser()">
              <view class='closeWrapper'>
                <text class='closeBtn'> X </text>
              </view>
            </touchable-opacity>
            <view :style="{flex: 1, paddingLeft: 20, paddingRight: 20}"> <text :numberOfLines="1" :style="{color: 'gray', textAlign: 'center'}"> {{ externalLink }} </text></view>
        </view>
        <web-view
            :source="{uri: externalLink}"
            :style="{}"
            :javaScriptEnabled="false"
            :scalesPageToFit="true"
        />
      </view>

      <view class='overlay' :style="{height: heightScreen}" />
  </view>
</template>

<script>

import { Dimensions } from 'react-native'
import { mapActions, mapGetters } from 'vuex'
import { WebView } from 'react-native-webview';

export default {
  components: {
      WebView
  },

  props: [],
  data() {
    return {
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
    }
  }
};
</script>

<style scoped>
.overlay {
    flex: 1;
    position: absolute;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0.5;
    background-color: black;
    z-index: -1
  }

  .closeWrapper {
    width: 20px;
  }

  .closeBtn {
    font-weight: 900;
    color: gray;
    transform: scaleX(1.2)
  }

</style>
