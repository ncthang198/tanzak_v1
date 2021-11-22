<template>
   <view :style="{flex: 1}">
    <header-image :main="mainHeader"/>
    <nb-tabs 
        :tab-container-style="{height: 45}" 
        :tab-bar-underline-style="{backgroundColor: '#155e83', width: '40%', justifyContent: 'center', alignItems: 'center', marginLeft: '4%'}" 
        tab-bar-inactive-text-color='#959595' 
        tab-bar-active-text-color='#155e83'
    >
      <nb-tab heading="総合" :tab-style="{backgroundColor: '#fff'}" :active-tab-style="{ backgroundColor: '#fff' }" >
          <tab-one :navigation="navigation"/>
      </nb-tab>
      <nb-tab heading="TanZakオリジナル" :tab-style="{backgroundColor: '#fff'}" :active-tab-style="{ backgroundColor: '#fff' }">
          <tab-two :navigation="navigation"/>
      </nb-tab>
    </nb-tabs>
    </view>
</template>

<script>
import HeaderImage from "../../components/share/HeaderImage.vue"
import TabOne from "./tab-one.vue"
import TabTwo from "./tab-two.vue"
export default {
    props: ['navigation'],
    components: {
        HeaderImage, TabOne, TabTwo
    },
    data: {
        mainHeader: {
           text: "ランキング"
        }
    }

}
</script>

<style>

</style>