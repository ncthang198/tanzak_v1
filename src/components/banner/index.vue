<template>
  <view v-if="!loading">
    <carousel
      layout="default"
      :layoutCardOffset="layoutCardOffset"
      :data="banners"
      :sliderWidth="windowWidth"
      :itemWidth="windowWidth"
      :renderItem="renderItem"
      :onSnapToItem="snapToItem"
      :loop="loop"
      :autoplay="autoplay"
      :autoplayInterval="autoplayInterval"
      ref="refme"
    />
    <pagination
      :dotsLength="banners.length"
      :activeDotIndex="activeSlide"
      :containerStyle="containerStyle"
      :dotStyle="dotStyle"
      :dotContainerStyle="dotContainerStyle"
      :inactiveDotStyle="inactiveDotStyle"
      :activeDotScale="activeDotScale"
      :inactiveDotScale="inactiveDotScale"
    />
  </view>
</template>

<script>
  import React from 'react'
  import { Text, View, Image, Platform, TouchableWithoutFeedback, Dimensions } from 'react-native'
  import { writeLog } from '../../common/helper.js'
  import Carousel, { Pagination } from 'react-native-snap-carousel';
  import { Linking } from 'expo';
  import { mapActions } from 'vuex'
  import FastImage from 'react-native-fast-image';

  export default {
    components: {
      Carousel,
      Pagination
    },
    props: ['navigation', 'banner'],
    mounted() {
      this.initBanner()
    },
    watch: {
      banner(newVal, oldVal) {
        this.initBanner()
      }
    },
    data() {
      return {
        loop: true,
        autoplay: true,
        autoplayInterval: 5000,
        layoutCardOffset: 0,
        activeSlide: 0,
        containerStyle: {
          backgroundColor: 'transparent',
          marginTop: -25
        },
        activeDotScale: 1,
        inactiveDotScale: 1,
        inactiveDotStyle: {
          backgroundColor: 'grey'
        },
        dotStyle: {
          width: 6,
          height: 6,
          borderRadius: 5,
          marginHorizontal: (Platform.OS === 'ios') ? -15 : 0,
          backgroundColor: '#225e83'
        },
        dotContainerStyle: {
          marginHorizontal: (Platform.OS === 'ios') ? -6 : 3,
        },
        windowWidth: Dimensions.get('window').width,
        banners: [],
        loading: true,
        isIOS: Platform.OS === "ios"
      }
    },
    methods: {
       ...mapActions({
          updateExternalLink: 'user/updateExternalLink',
          updateShowWebview: 'user/updateShowWebview'
      }),
      initBanner() {
        this.banners = this.banner
        this.loading = false
        this.bannerLastIndex = this.banner.length - 1
        if(this.isIOS)
          this.activeSlide = this.bannerLastIndex
      },
      snapToItem(index) {
        this.activeSlide = this.isIOS ? (this.bannerLastIndex - index) : index
      },
      renderItem({item, index}) {
        return (
          <TouchableWithoutFeedback onPress={() => this.handlePress(item)}>
            <FastImage resizeMode="cover"
              style={{backgroundColor: '#cecece', height: '100%'}}
              source={{ uri: item.image_url.url }} />
          </TouchableWithoutFeedback>
        );
      },
      trackingBanner(banner) {
        this.axios
          .put(`/api/top_banners/${banner.id}/update_page_views`)
          .then((res) => {})
          .catch((error) => writeLog(this.axios, { event: 'tracking banner failed', value: banner, log_type: 'error' }))
      },
      handlePress(banner) {
        this.trackingBanner(banner)
        if(banner.banner_type == 'external_url') {
          this.updateExternalLink(banner.jump_to)
          this.updateShowWebview(true)
          return
          // Linking.canOpenURL(banner.jump_to).then(supported => {
          //   if (supported) {
          //     Linking.openURL(banner.jump_to);
          //     this.$refs.refme.startAutoplay(true)
          //   } else {
          //     console.log("Don't know how to open URI: " + banner.jump_to);
          //   }
          // });
        } else {
          this.navigation.navigate('BookDetail', {id: banner.jump_to})
        }
      },
    },
  };

</script>

<style>
</style>
