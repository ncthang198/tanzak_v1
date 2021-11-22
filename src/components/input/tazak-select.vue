<template>
  <view>
    <touchable-opacity :onPress="handleSelect">
      <view
        :style="{borderBottomWidth: 1, borderColor: '#c9c7c1', paddingBottom: 5, paddingTop: 5}"
      >
        <text :style="{color: '#000000'}">{{ currentSelect }}</text>
        <image :style="{ width: 18, height: 10, position: 'absolute', right: 5, top: 10 }" resizeMode="stretch" :source="dropdown" />
      </view>
    </touchable-opacity>
  </view>
</template>

<script>
import dropdown from '../../../assets/images/dropdown_icon.png'
import { ActionSheet } from "native-base"

export default {
  props: ['options', 'handleParentCallBack', 'placeholder'],
  data() {
    return {
      dropdown: dropdown,
      currentSelect: this.placeholder
    }
  },
  methods: {
    handleSelect() {
      ActionSheet.show(
        {
          options: this.options,
          cancelButtonIndex: this.options.length - 1
        },
        this.sortPressCallback.bind(this)
      );
    },
    sortPressCallback(index) {
      if(index == this.options.length - 1) { return }
      this.currentSelect = this.options[index]
      this.handleParentCallBack(index)
    },
  }
};
</script>
