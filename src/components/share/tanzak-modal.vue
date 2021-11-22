<template>
  <modal
    :animationType="'fade'"
    :transparent="true"
    :visible="isVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex: 1, justifyContent: 'center'}">
      <view class="background-content" :style="[{ width: widthScreen - 80, minHeight: 50, marginLeft: 40, justifyContent: 'center'}, contentStyle]">
        <view :style="{alignItems: 'center'}">
          <view v-if="title">
            <text :style="{paddingTop: 20, fontWeight: 'bold'}">{{ title }}</text>
          </view>

          <text :style="{padding: 20, textAlign: 'center'}">{{ body }}</text>
          <!-- TODO: setting options press here -->
          <!-- / options press -->
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
      title: String,
      body: String,
      closeModalFunction: {
        type: Function,
        default: function () {}
      },
      isVisible: Boolean,
      contentStyle: Object
    },
    data() {
      return {
        widthScreen: Dimensions.get('window').width,
      }
    }
  };

</script>
<style>
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
