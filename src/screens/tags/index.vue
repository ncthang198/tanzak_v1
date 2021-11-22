<template>
  <nb-container :style="{flex: 1}">
    <header-image
      :navigation="navigation"
      :main="mainHeader" />
      <view :style="{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12}">
      <view :style="{backgroundColor: '#EBEBEB',marginVertical: 12, marginHorizontal: 12, borderRadius: 30, paddingHorizontal:12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }">
          <touchable-opacity :onPress="onPressSearch" >
          <nb-icon name="search" :style="{fontSize: 20}" />
          </touchable-opacity>
          <nb-input placeholder="タイトル、作家、キーワードで検索" 
          :style="{fontSize: 12, height: 35, marginLeft: 6}" 
          :onFocus="onFocus"
          :onChangeText="onChangeText"
          :onSubmitEditing="onSubmitEditing"
          returnKeyType="search"
          :value="txtSearch"
          />
          <touchable-opacity :onPress="onPressClose" v-if="showClose">
          <nb-icon active name="close-circle-outline" :style="{fontSize: 20}"/>
          </touchable-opacity>
      </view>
        <touchable-opacity :onPress="onPressCancel" v-if="showModal">
          <nb-text :style="{fontSize: 12}">キャンセル</nb-text>
        </touchable-opacity>
      </view>
      <view :style="{flex: 1}">
        <view :style="{flex: 1}" v-if="showSearch">
      <flat-list
        :data="books"
        :keyExtractor="(item, index) => index.toString()"
        :style="{ paddingLeft: 15, paddingRight: 15 }"
        :onEndReached="handleRefresh"
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
                  <image v-if="args.item.book.member_type == 'premium'" :source="premiumIcon" :style="{width: 25, height: 25, zIndex: 9999}" resizeMode="contain"/>
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

    <view v-if="!showSearch" :style="{flex: 1}">
      <flat-list
        :data="tags"
        :keyExtractor="(item, index) => index.toString()"
        :style="{flex: 1, paddingBottom: 10, marginBottom: 10}"
        :refreshing="refreshing"
        :onEndReached="handleLoadMore"
      >
        <view
          render-prop-fn="renderItem"
          :style="{borderBottomWidth: 1, borderBottomColor: '#E8E8E8'}"
        >
          <touchable-opacity :onPress="() => navToTagDetail(args.item)">
            <view :style="{borderBottomColor: '#E8E8E8', paddingLeft: 13, paddingRight: 13, paddingTop: 17, paddingBottom: 17 }">
              <view>
                <text :style="{fontSize: 13}">
                  {{ args.item.name }}
                </text>
                <text :style="{ position: 'absolute', right: 18, top: 4, fontSize: 11}">
                  {{args.item.books_count}}
                </text>
                <view :style="{ position: 'absolute', right: 0, top: 5 }">
                  <image :source="greaterIcon" :style="{width: 8, height: 10}" />
                </view>
              </view>
            </view>
          </touchable-opacity>
        </view>
      </flat-list>
    </view>
    <view v-if="showModal" :style="{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)' }">
     </view>
      </view>
      
      
  </nb-container>
</template>

<script>
import React from "react"
import { mapActions, mapState } from 'vuex'
import { Dimensions, Platform, View, Text, Modal, Keyboard} from 'react-native'
import { TouchableOpacity } from 'react-native'
import btnGoBack from '../../../assets/images/btnGoBack.png'
import greaterIcon from '../../../assets/images/greater_icon.png'
import backgroundHeader from '../../../assets/images/header.png'
import HeaderImage from "../../components/share/HeaderImage.vue"
import { ParseAuthorData, getRatioWidthFromHeight } from '../../common/helper.js'
import PremiumIcon from '../../../assets/modal/08sakuhin_01.png'
import AuthorInfo from '../../components/share/author-info'

const screenHeight = Dimensions.get("window").height
const IMAGE_HEIGHT = 162
const MAX_BOOK_IMAGE = 180

export default {
  props: ['navigation'],
  data() {
    return {
      tags: [],
      refreshing: false,
      currPage: 1,
      btnGoBack: btnGoBack,
      greaterIcon: greaterIcon,
      header: backgroundHeader,
      mainHeader: {text: 'キーワード一覧'},
      showModal: false,
      txtSearch: "",
      books: [],
      loading: true,
      setInterval: null,
      currPageBooks: 1,
      showSearch: false,
      premiumIcon: PremiumIcon,
      showClose: false,
      sortTextSize: Platform.OS === "android" ? 12 : 14, 
    }
  },
  components: {
    TouchableOpacity,
    HeaderImage,
    Dimensions,
    AuthorInfo
  },
  computed:{
    setHeightTop() {
      return (Platform.OS === "android") ? null : {height: 100}
    }
  },
  mounted() {
    this.fetchTags()
  },
  methods: {
    ParseAuthorData: ParseAuthorData,

    navToBook(book){
      this.navigation.navigate('BookDetail', {id: book.id})
    },
    onPressButton: () => {
      return this.props.navigation.navigate('Home')
    },
    fetchTags(){
      this.axios.get(`/api/tags?page=${this.currPage}`).then(({data}) => {
        this.tags = [ ...this.tags, ...data.data]
        this.refreshing = false
      }).catch((error) => console.log(error.data))
    },

    fetchBooks(search){
      this.axios.get(`/api/books/search?search=${search}&page=${this.currPageBooks}`).then(({data}) => {
        data.data.books.filter(item => {
          let bookSize = getRatioWidthFromHeight(IMAGE_HEIGHT, item.book.image_dimensions.small, MAX_BOOK_IMAGE)
          this.books.push({
            authors: item.authors,
            book: item.book,
            bookSize
          })
        })
        this.loading = false
        this.currPageBooks++
      }).catch((error) => {})
    },

    handleLoadMore(){
      this.refreshing = true
      this.currPage += 1
      this.fetchTags()
    },

    navToTagDetail(item){
      this.navigation.navigate('TagDetail', { tag: item })
    },

    onFocus() {
      this.showModal = true
      this.showClose = false
    },
    onPressClose() {
      this.books = []
      this.showModal = true
      this.showSearch = false
      this.showClose = false
      this.txtSearch = ""
    },
    async onPressCancel() {
      this.books = []
      this.showModal = false
      this.showSearch = false
      this.showClose = false
      this.txtSearch = ""
      await Keyboard.dismiss();
    },
    onChangeText(text) {
      this.showModal = true
      this.showClose = true
      this.txtSearch = text;
    },
    onEndEditing() {
    },
    onSubmitEditing() {
      this.currPageBooks = 1
      this.showSearch = true
      this.books = []
      this.showModal = false
      this.fetchBooks(this.txtSearch)
    },
    onPressSearch() {
      this.currPageBooks = 1
      this.showSearch = true
      this.books = []
      this.showModal = false
      this.fetchBooks(this.txtSearch)
    },
     handleRefresh(){
      this.fetchBooks(this.txtSearch)
    },
  }
}
</script>


