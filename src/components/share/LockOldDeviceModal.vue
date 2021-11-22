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
          <nb-text>OKを押すと新しいアプリになります。</nb-text>
          <view  :style="{borderTopWidth: 0.2, borderBottomColor: '#E7E7E7'}">
              <touchable-opacity :onPress="()=> clearData()">
                <view :style="{ width: widthScreen - 80, padding: 13, alignItems: 'center'}">
                  <nb-text :style="{ color: '#0794ff', fontWeight: 'bold'}"> OK </nb-text>
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

  export default {
    components: {
      Modal
    },
    props: {
      clearData: Function
    },
    data() {
      return {
        widthScreen: Dimensions.get('window').width,
        modalVisible: false
      }
    },
    methods: {
      iosModal() {
        Alert.alert(
          ``,
          'OKを押すと新しいアプリになります。',
            [ {text: 'OK', onPress: () => this.clearData()}],
            {cancelable: false}
        )
      },
      showModal() {
        if (Platform.OS == "android")
          this.modalVisible = true
        else
            this.iosModal()
      },
    },
    mounted() {
      this.showModal()
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
