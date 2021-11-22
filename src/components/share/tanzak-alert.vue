<template>
  <modal
    animationType="fade"
    :transparent="true"
    :visible="modalVisible"
    :onRequestClose="(event) => {}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'center', borderRadius: 10}">
      <view class="background-content" :style="{ width: widthScreen - 80, minHeight: 200, marginLeft: 40, justifyContent: 'center'}">
        <view :style="{alignItems: 'center'}">
          <text> {{ title }} </text>
          <text :style="{padding: 20}"> {{ body }} </text>

          <view  :style="{borderTopWidth: 0.2, borderBottomColor: '#E7E7E7'}" v-for="option in options">
              <touchable-opacity :onPress="()=> option.handle()">
                <view :style="{ width: widthScreen - 80, padding: 13, alignItems: 'center'}">
                  <text :style="{ color: '#0794ff', fontWeight: 'bold'}"> {{ option.text }} </text>
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

  export default {
    props: ['title', 'body', 'handleCloseModal', 'options'],
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
      showIosModal() {
        Alert.alert(
          this.title,
          this.body,
          this.options.map((item, i) => { return ({ text: item.text, onPress: () => item.handle() }) }),
          {cancelable: false}
        )
      },
    },

    mounted() {
      if (Platform.OS == "android")
        this.modalVisible = true
      else
        this.showIosModal()
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
