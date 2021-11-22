<template>
  <modal
    :animationType="'slide'"
    :transparent="true"
    :visible="isVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'center'}">
      <view class="background-content" :style="{ width: widthScreen - 80, minHeight: 200, marginLeft: 40, justifyContent: 'center'}">
        <view :style="{alignItems: 'center'}">
          <nb-text :style="{paddingTop: 20, fontWeight: 'bold'}">{{ title }}</nb-text>
          <nb-text :style="{padding: 20}">{{ body }}</nb-text>
          <flat-list
            :data="options"
            :keyExtractor="(item, index) => item.type.toString()"
            :style="{paddingBottom: 5, paddingTop: 5}"
          >
            <view render-prop-fn="renderItem"
              :style="{borderTopWidth: 0.2, borderBottomColor: '#E7E7E7'}">
              <touchable-opacity :onPress="() => chooseAction(args.item.type)">
                <view :style="{ width: widthScreen - 80, padding: 13, alignItems: 'center'}">
                  <nb-text :style="{ color: '#0794ff', fontWeight: 'bold'}"> {{ args.item.name }} </nb-text>
                </view>
              </touchable-opacity>
            </view>
          </flat-list>
        </view>
      </view>
    </view>
  </modal>
</template>

<script>
  import { Dimensions, Modal, Platform, Alert } from 'react-native';
  export default {
    components: {
      Modal
    },
    props: {
      title: String,
      body: String,
      closeModalFunction: {
        type: Function,
        default: function () {}
      }
    },
    data() {
      return {
        options: [{ name: '閉じる', type: 'ok' }],
        widthScreen: Dimensions.get('window').width,
        isVisible: false
      }
    },
    methods: {
      chooseAction(type) {
        this.closeModalFunction()
      },
      showIOSAlert() {
        Alert.alert(
          this.title,
          this.body,
          [
            {
              text: '閉じる',
              onPress: ()=> {
                this.closeModalFunction()
              }
            }
          ]
        )
      },
      showModal() {
        if (Platform.OS == "android") {
          this.isVisible = true
        } else {
          this.showIOSAlert()
        }
      }
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
