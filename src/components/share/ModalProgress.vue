<template>
  <modal :onRequestClose="() => null" :visible="isLoading" :transparent="true">
     <view class="background-modal" :style="{ flex: 1, alignItems: 'center', justifyContent: 'center' }">
      <view class="background-content" :style="{ padding: 25 }">
        <text :style="{ fontSize: 20, fontWeight: '200' }">読み込み中...</text>
        <activity-indicator size="large" />
      </view>
    </view>
  </modal>
</template>

<script>
  import { Modal, ActivityIndicator } from 'react-native';
  import ModalProgress from "./ModalProgress.vue"
  export default {
    components: {
      Modal,
      ActivityIndicator
    },
    props: {
      isLoading: Boolean
    }
  };

</script>

<style>
.background-modal {
  backgroundColor: rgba(0, 0, 0, 0.5);
}
.background-content {
  backgroundColor: #ececec;
  borderRadius: 10;
}
</style>
