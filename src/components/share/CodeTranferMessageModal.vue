<template>
  <modal
    :animationType="'slide'"
    :transparent="true"
    :visible="modalVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'center'}">
      <view class="background-content" :style="{ width: widthScreen - 80, minHeight: 200, marginLeft: 40, justifyContent: 'center'}">
        <view :style="{alignItems: 'center'}">
          <nb-text :style="{paddingTop: 20, fontWeight: 'bold'}" v-if="title != ''">
            {{ title }}
          </nb-text>
          <nb-text :style="{padding: 20}" v-if="body != ''">
            {{ body }}
          </nb-text>
          <flat-list
              :data="options"
              :keyExtractor="(item, index) => index.toString()"
              :style="{paddingBottom: 5, paddingTop: 5}"
            >
              <view render-prop-fn="renderItem"
                :style="{borderTopWidth: 0.2, borderBottomColor: '#E7E7E7'}">
                <touchable-opacity :onPress="()=>onOptionPress(args.item.option)">
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
  import { Dimensions, Modal, Platform, Alert } from 'react-native'

  export default {
    components: {
      Modal
    },
    props: {
      options: {
        type: Array,
        default: []
      },
      title: {
        type:String,
        default: ''
      },
      body: {
        type: String,
        default: ''
      },
      onOptionPress: {
        type: Function,
        default: function(option) {}
      }
    },
    data() {
      return {
        widthScreen: Dimensions.get('window').width,
        modalVisible: false
      }
    },
    methods: {
      iosModal() {
        let self = this
        Alert.alert(
          self.title,
          '',
          this.options.map(function(item, i){
            return ({text: item.name, onPress: () => self.onOptionPress(item.option)})
          })
        )
      },
      showModal() {
        if (Platform.OS == "android")
          this.modalVisible = true
        else
            this.iosModal()
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
