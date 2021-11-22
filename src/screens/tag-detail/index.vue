<template>
  <nb-container :style="{flex: 1}">
    <header-image
      :navigation="navigation" 
      :goBack=true
      :main="{text: '#' + tag.name}"/>

    <view :style="{marginRight: 15, marginTop: 15}">
      <touchable-opacity :onPress="handleSortPress">
        <view
          :style="{width: 75, backgroundColor: '#D0D4D8', justifyContent: 'center', alignSelf: 'flex-end', paddingTop: 3, paddingBottom: 3, paddingLeft: 5, borderRadius: 2}"
        >
          <nb-text :style="{color: '#000000', fontSize: sortTextSize}">{{currSortMode}}</nb-text>
          <image :style="{ width: 10, position: 'absolute', right: 5 }" resizeMode="contain" :source="dropdown" />
        </view>
      </touchable-opacity>
    </view>
    <view :style="{flex: 1}" v-if="!loading">
      <flat-list
        :data="books"
        :keyExtractor="(item, index) => index.toString()"
        :style="{ paddingLeft: 15, paddingRight: 15 }"
        :refreshing="refreshing"
        :onEndReached="handleRefresh"
        :onEndThreshold="0.5"
      >
        <view
          render-prop-fn="renderItem"
          :style="{ paddingTop: 8, paddingBottom: 8, flexDirection: 'row', flex: 1, borderBottomColor: '#E8E8E8', borderBottomWidth: 1}"
        >
          <touchable-opacity :style="{flex: 1, flexDirection: 'row'}" :onPress="() => navToBook(args.item.book)">
            <view :style="{ alignItems: 'center', position: 'relative' }">
              
              <touchable-opacity :onPress="() => navToBook(args.item.book)">
                <nb-thumbnail
                  :style="{ height: args.item.bookSize.height, width: args.item.bookSize.width }" 
                  :source="{ uri: args.item.book.image_url.url }"
                  square
                />
              </touchable-opacity>
            </view>

            <view :style="{ marginLeft: 15, flex: 1}">
              
              <touchable-opacity :onPress="() => navToBook(args.item.book)">
                <view  :style="{flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 22,}">
                  <fast-image v-if="args.item.book.member_type == 'premium'" :source="premiumIcon" :style="{width: 25, height: 25, zIndex: 9999}" resizeMode="contain"/>
                  <nb-text :style="{fontSize: 17, fontWeight: 'bold', color: '#606060', lineHeight: 24, marginLeft: 3}">
                    {{ args.item.book.title }}
                  </nb-text>
                </view>
                
                <nb-text
                  :numberOfLines=5
                  :style="{fontSize: 14, marginBottom: 5, fontWeight: '200'}"
                >
                  {{ args.item.book.catch_copy }}
                </nb-text>
                <author-info :data="ParseAuthorData(args.item.authors)"></author-info>
              </touchable-opacity>
            </view>
          </touchable-opacity>
        </view>
      </flat-list>
    </view>
  </nb-container>
</template>

<script>
import story from '../../seeds/story'
import React from "react";
import { Picker, Icon } from "native-base";
import { TouchableOpacity } from 'react-native'
import { ParseAuthorData, getRatioWidthFromHeight } from '../../common/helper.js'
import AuthorInfo from '../../components/share/author-info'
import { ActionSheet } from "native-base";
import { Dimensions, Platform } from 'react-native'
import btnGoBack from '../../../assets/images/btnGoBack.png'
import backgroundHeader from '../../../assets/images/header.png'
import HeaderImage from "../../components/share/HeaderImage.vue"
import DropDown from '../../../assets/images/dropdown_icon.png'
import PremiumIcon from '../../../assets/modal/08sakuhin_01.png'
const NEWEST_SORT = { val: 'created_at', title: '新作順' }
const MOSTVIEW_SORT = { val: 'page_views', title: '閲覧数順' }
import FastImage from 'react-native-fast-image';

const IMAGE_HEIGHT = 162
const MAX_BOOK_IMAGE = 180

export default {
  props: ['navigation'],
  components: {
    Item: Picker.Item,
    TouchableOpacity,
    AuthorInfo,
    HeaderImage,
    FastImage
  },
  data() {
    return {
      books: [],
      loading: true,
      tag: this.navigation.getParam('tag'),
      selected: NEWEST_SORT.val,
      sortOptions: [MOSTVIEW_SORT.title, NEWEST_SORT.title, 'キャンセル'],
      currSortMode: NEWEST_SORT.title,
      cancelIndex: 2,
      refreshing: false,
      currPage: 1,
      btnGoBack: btnGoBack,
      header: backgroundHeader,
      headerMargin: Platform.OS === "android" ? -4 : -10,
      closeMargin: Platform.OS === "android" ? 0 : 2,
      dropdown: DropDown,
      sortTextSize: Platform.OS === "android" ? 12 : 14, 
      premiumIcon: PremiumIcon
    }
  },
  mounted() {
    this.fetchBooks(this.selected)
  },
  computed:{
    setHeightTop() {
      return (Platform.OS === "android") ? null : {height: 100}
    }
  },
  watch: {
    selected() {
      this.onValueChange(this.selected)
    }
  },

  methods: {
    ParseAuthorData: ParseAuthorData,

    navToBook(book){
      this.navigation.navigate('BookDetail', {id: book.id})
    },

    handleSortPress () {
      ActionSheet.show(
        {
          options: this.sortOptions,
          cancelButtonIndex: this.cancelIndex
        },
        this.sortPressCallback.bind(this)
      );
    },

    sortPressCallback(index) {
      /**
       * sortOptions: ['閲覧数順', '新作順', 'Cancel']
       * index = 0 <=> created_at <=> 閲覧数順
       * index = 1 <=> page_views <=> 新作順
       * index = 2 <=> Cancel
       */
      switch (index) {
        case 0:
          this.currSortMode = MOSTVIEW_SORT.title
          this.selected = MOSTVIEW_SORT.val
          break
        case 1:
          this.currSortMode = NEWEST_SORT.title
          this.selected = NEWEST_SORT.val
          break
        default:
          break
      }
    },

    onValueChange(value) {
      this.books = []
      this.currPage = 1
      this.fetchBooks(value)
    },

    getIosIcon: function() {
      return <Icon name="arrow-down" style={{ color: "#007aff", fontSize: 25 }} />;
    },

    async fetchBooks(type){
      this.refreshing = true
      this.axios.get(`/api/tags/${this.tag.id}?type=${type}/desc&page=${this.currPage}`).then(({data}) => {
        data.data.filter(item => {
          console.log('item',item)
          let bookSize = getRatioWidthFromHeight(IMAGE_HEIGHT, item.book.image_dimensions.small, MAX_BOOK_IMAGE)
          this.books.push({
            authors: item.authors,
            book: item.book,
            bookSize
          })
        })
        this.loading = false
        this.refreshing = false
        this.currPage++
      }).catch((error) => console.log(error))
    },

    handleRefresh(){
      this.fetchBooks(this.selected)
    },
  }
}
</script>
