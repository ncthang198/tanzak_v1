<template>
  <view :style="{flex: 1}">
    <image-background resizeMode="cover" :source="backgroundImage" :style="{flex: 1}">
      <flat-list
        :data="books"
        :keyExtractor="(item, index) => index.toString()"
        :style="{paddingHorizontal: 6, marginBottom: 12 }"
        :numColumns="numColumns"
        :key="numColumns"
      >
        <view render-prop-fn="renderItem">
          <touchable-opacity :on-press="() => goToBookDetail(args.item.id)">
            <view :style="{ width: widthItem, paddingHorizontal: 6, marginTop: 20 }">
              <view :style="{height: 244}">
                <fast-image
                  :source="{uri: args.item.image_url.url}"
                  :style="{width: '100%', height: '100%', resizeMode: 'contain' }"
                />
              </view>
              <view
                :style="{
                position: 'absolute', 
                top: 0, 
                left: 6, 
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderRightWidth: 64,
                borderTopWidth: 64,
                borderRightColor: 'transparent',
                borderTopColor: 'yellow',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flex:1
              }"
              ></view>
              <view :style="{position: 'absolute', left: 6, top:6, flexDirection: 'row', width: 40, alignItems: 'center', justifyContent: 'center'}">
                <text :style="{color: '#000', fontSize: 20, fontWeight: 'bold', lineHeight: 20, padding: 0}">{{args.item.index}}</text>
                <text :style="{color: '#000', fontSize: 10, fontWeight: 'bold', lineHeight: 20, padding: 0}">位</text>
              </view>

              <view :style="{marginTop: 8}">
                <text :style="{fontWeight: '800', fontSize: 18, width: '100%', lineHeight: 20}">{{args.item.title}}</text>
                <view :style="{flexDirection: 'row', marginTop:8, alignItems: 'center' }">
                  <view
                    :style="{flexDirection: 'row', paddingVertical:2, paddingHorizontal:5, backgroundColor: '#155e83', borderRadius: 4, alignItems: 'center'  }"
                  >
                    <text :style="{color: '#fff', fontSize: 14, fontWeight: '500'}">{{args.item.total_stories}}</text>
                    <text :style="{color: '#fff', fontWeight: '500', fontSize: 14}">話</text>
                  </view>
                  <view :style="{flex: 1, flexDirection: 'row-reverse', alignItems: 'center'}">
                     <text :style="{fontSize: 14, color: '#111', marginLeft:2 }">{{args.item.page_view_date}}件</text>
                    <image
                      :source="iconReading"
                      :style="{ width: 24, height: 14, marginLeft: 8, resizeMode: 'contain'}"
                    />
                  </view>
                </view>
              </view>
            </view>
          </touchable-opacity>
        </view>
      </flat-list>
    </image-background>
  </view>
</template>

<script>
import React from "react";
import {
  Dimensions,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import IconReading from "../../../assets/images/ic_reading.png";
import BackgroundImage from "../../../assets/top/bg_top.png";
import FastImage from 'react-native-fast-image';
const windowWidth = Dimensions.get("window").width;

export default {
  props: ['navigation'],
  data() {
    return {
      books: [],
      loading: true,
      numColumns: 2,
      iconReading: IconReading,
      backgroundImage: BackgroundImage,
      widthItem: (windowWidth - 12) / 2
    };
  },
  mounted() {
    this.fetchBooks();
    this.numColumns = Math.floor(windowWidth / 160);
    if (this.numColumns > 2) {
      this.widthItem = Math.floor((windowWidth - 12) / this.numColumns);
    }
  },
  components: {
    FastImage
  },
  methods: {
    goToBookDetail(id) {
      this.navigation.navigate('BookDetail', {id: id})
    },
    fetchBooks() {
      this.loading = true;
      this.axios
        .get(`/api/date_rankings/1`)
        .then(({ data }) => {
          data.data.books.filter((item, index) => {
            this.books.push({
            ...item,
            index: index + 1
            });
          });
          this.loading = false;
        })
        .catch(error => {});
    },
  }
};
</script>

<style>

</style>