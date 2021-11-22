<template>
  <modal
    :animationType="'slide'"
    :transparent="true"
    :visible="modalVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'center', borderRadius: 10}">
      <view class="background-content" :style="{ width: widthScreen - 80, minHeight: 200, marginLeft: 40, justifyContent: 'center'}">
        <view :style="{alignItems: 'center'}">
          <nb-text>アップデートのお知らせ</nb-text>
          <nb-text :style="{padding: 20}">アプリの安定性向上のため、最新バージョンへのアップデートをお願いいたします</nb-text>

          <view  :style="{borderTopWidth: 0.2, borderBottomColor: '#E7E7E7'}">
              <touchable-opacity :onPress="()=> openStoreAndroid()">
                <view :style="{ width: widthScreen - 80, padding: 13, alignItems: 'center'}">
                  <nb-text :style="{ color: '#0794ff', fontWeight: 'bold'}"> アップデート </nb-text>
                </view>
              </touchable-opacity>
          </view>

        </view>
      </view>
    </view>
  </modal>
</template>

<script>
  import { Dimensions, Modal, Platform, Alert, Linking } from 'react-native'
  import Constants from 'expo-constants'

  import DeviceInfo from 'react-native-device-info';
  import { IOS_BUILD, ANDROID_BUILD } from '../../common/Constant.js';

  export default {
    props: ['checkUpdateVersion'],
    components: {
      Modal
    },
    data() {
      return {
        widthScreen: Dimensions.get('window').width,
        modalVisible: false
      }
    },

    methods: {
      checkClose(event) {
        console.log('Modal has been closed.')
      },

      showModal() {
        if(this.hasNewVersion()) {}
          if (Platform.OS == "android") {
            this.modalVisible = true
          } else {
            this.showIosModal()
          }
      },

      showIosModal() {
        Alert.alert(
          'アップデートのお知らせ',
          `アプリの安定性向上のため、最新バージョンへのアップデートをお願いいたします`,
            [ {text: 'アップデート', onPress: () => Linking.openURL('itms-beta://itunes.apple.com/')}],
            {cancelable: false}
        )
      },

      openStoreAndroid(){
        Linking.openURL('market://details?id=host.exp.exponent')
      },

      hasNewVersion(){
        // TODO: remove this when android app is avaible on google play store
        if(Platform.OS == "android") { return false }

        currVersion = DeviceInfo.getVersion()
        currBuildNumber = DeviceInfo.getBuildNumber()
        // expo_currVersion = Constants.platform.version
        // expo_currBuildNumber = Constants.manifest.version
        expo_currVersion = Platform.OS == "android" ? ANDROID_BUILD.version : IOS_BUILD.version
        expo_currBuildNumber = Platform.OS == "android" ? ANDROID_BUILD.buildNumber : IOS_BUILD.buildNumber
        return currVersion != expo_currVersion || currBuildNumber != expo_currBuildNumber
      }
    },


    mounted() {
      if(this.hasNewVersion()) {
        this.checkUpdateVersion(true)
      } else {
        this.checkUpdateVersion(false)
      }
    }
  };

</script>
<style>
  .background-modal {
    backgroundColor: rgba(128, 128, 128, 0.5);
  }
  .background-content {
    backgroundColor: #ececec;
    borderRadius: 2;
  }
</style>
