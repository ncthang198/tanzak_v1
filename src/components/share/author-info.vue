<template>
  <view>
    <view v-for="role in data">
      <nb-text :style="{fontWeight: '100', fontSize: 14}" >{{ role.role_name }}: {{ role.name.join('/ ') }} </nb-text>
    </view>
  </view>
</template>

<script>
import { ParseAuthorData } from '../../common/helper.js'
export default {
  props: {
    data: Array
  }
};
</script>
