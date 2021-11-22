<template>
  <view>
  <touchable-opacity :onPress="goToBookDetail">
    <view :style="{flex: 1, width: parseFloat(widthResize), marginRight: 10}" >
      <view :style="{}">
        <fast-image
          :style="{height: parseFloat(height), borderWidth: 0.5, borderColor: '#c8c8c8'}"
          resizeMode='contain'
          :source="{uri: book.image_url.url}"
        />
      </view>
      <view :style="{}" v-if="showBookInfo">
        <text :numberOfLines="line" ellipsizeMode="tail" :style="{fontSize: largeText, fontWeight: '700', marginTop: 5, lineHeight: 20, height: heightTitle}">
          {{book.title}}
        </text>
        <text :numberOfLines="2" ellipsizeMode="tail" :style="{fontSize: smallText, fontWeight: '200', marginTop: 3, lineHeight: 20}">
          {{book.catch_copy}}
        </text>
      </view>
    </view>
  </touchable-opacity>
    <modal-purchase
      v-if="showModalPurchase && isHistory"
      :book="bookDataForNavigationHistory"
      :currentStory="currentStory"
      :navigation="navigation"
      :closeModal="closeModal"
      :setLoading="setAdLoading"
      :relatedBooksQ="relatedBooksQ"
      :openBuyCoin="openBuyCoin"
      :openViewAds="openViewAds"
      :isPremium="isPremium"
    />
    <modal-out-coin
      v-if="showModalOutCoin"
      :subscriptions="subscriptions"
      :closeModal="close"
      :isBuyCoin="isBuyCoin"
      :navigation="navigation"
      :currentStory="currentStory"
      :setLoading="setAdLoading"
      :isPremium="isPremium"
      :onEndAds="onEndAds"
    />
    <modal-progress :isLoading="isAdLoading"/>
  </view>
</template>

<script>
import React, { Component } from 'react'
import { TouchableWithoutFeedback, Platform, Alert } from 'react-native'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import ModalProgress from "../../components/share/ModalProgress.vue"
import ModalPurchase from "../../components/share/ModalPurchaseStory.vue"
import ModalOutCoin from "../../components/share/ModalOutCoin.vue";
import FastImage from 'react-native-fast-image';

export default {
  props: {
    item: Object,
    navigation: {
      type: Object
    },
    width: String,
    height: String,
    size: String,
    isHistory: {
      type: Boolean,
      default: false
    },
    showBookInfo: {
      type: Boolean,
      default: true
    },
    backBehavior: String,
    subscriptions: Array,
    isPremium: Boolean,
    isSmall: Boolean
  },
  data() {
    return {
      heightTitle: this.isSmall ? 44: 22,
      line: this.isSmall ? 2 : 1,
      isAdLoading: false,
      setAdLoading: function () {},
      book: null,
      authors: null,
      smallText: (Platform.OS === 'ios') ? 13 : 12,
      largeText: (Platform.OS === 'ios') ? 14 : 13,
      heightResize: 1,
      widthResize: 1,
      timeoutDuplacate: false,
      showModalPurchase: false,
      currentStory: null,
      bookDataForNavigationHistory: null,
      relatedBooksQ: null,
      isBuyCoin: true,
      showModalOutCoin: false,
    };
  },
  components: {
    TouchableWithoutFeedback,
    ModalPurchase,
    ModalProgress,
    ModalOutCoin,
    FastImage
  },
  created() {
    this.book = this.item.book
    this.author = this.item.authors
    this.handleImageResize()
    this.setAdLoading = this.setLoading.bind(this)
  },
  computed: {
    ...mapGetters({
      lastReadStory: 'booksLocal/lastReadStory',
      nextReadStory: 'booksLocal/nextReadStory'
    }),
  },
  methods: {
    setLoading(isLoading) {
      this.isAdLoading = isLoading
    },
    closeModal(foo=false) {
      this.showModalPurchase = false;
    },
    handleImageResize() {
      let sizeImage = []
      let dimensions = this.book.image_dimensions
      if(dimensions) {
        sizeImage = (this.size == 'small') ? dimensions.small.split("x") : dimensions.big.split("x")
        this.widthResize = sizeImage[0]
        this.heightResize = sizeImage[1]
      }
    },

    openBuyCoin() {
      this.showModalOutCoin = true;
      this.isBuyCoin = true;
    },

    openViewAds() {
      this.showModalOutCoin = true;
      this.isBuyCoin = false;
    },

    close() {
      this.showModalOutCoin = false;
    },

    async onEndAds() {
      this.setCurrentBookId(this.book.id)
      const data = await this.initBook(this.book.id)
        // Check books unpublish
      if(data.code && data.message) {
        Alert.alert('', data.message)
        return
      } else {
        this.setStoryHistories({storyHistories: data.story_histories, bookId: data.book.id})
        this.bookDataForNavigationHistory = data.book

        nextStory = this.nextReadStory(data.book.id)

        if(nextStory) {          
          this.currentStory = data.stories.filter(item => item.id === nextStory['id'])[0]
        } else {             
          this.currentStory = data.stories.filter(item => item.id === this.lastReadStory(data.book.id).id)[0]
        }

        // check story unpublish
        // TODO: remove story away from localstore if need
        if(!this.currentStory){
          Alert.alert('この作品は発行期間が終了しました。' )
          return
        }

        books = []
        data.related_books.forEach(book => books.push({'book': book}))
        this.relatedBooksQ = { 'books': books, 'size': 'small' }
        this.showModalPurchase = true;
      }
    },

    ...mapActions({
      loadLocalBook: 'booksLocal/loadBook',
      initBook: 'bookDetail/initBook',
      checkExpireAds: 'user/checkExpireAds',
    }),
    ...mapMutations({
      setCurrentStory: 'bookDetail/setCurrentStory',
      setCurrentBookId: 'booksLocal/setCurrentBookId',
      setStoryHistories: 'bookDetail/setStoryHistories',
    }),
    async goToBookDetail() {
      if (this.isHistory) {
        this.setCurrentBookId(this.book.id)
        const data = await this.initBook(this.book.id)

        // Check books unpublish
        if(data.code && data.message) {
          Alert.alert('', data.message)
          return
        } else {
          this.setStoryHistories({storyHistories: data.story_histories, bookId: data.book.id})
          this.bookDataForNavigationHistory = data.book

          nextStory = this.nextReadStory(data.book.id)

          if(nextStory) {
            console.log(nextStory['id'], "nextStory['id']")
            this.currentStory = data.stories.filter(item => item.id === nextStory['id'])[0]
          } else {
            console.log(this.lastReadStory(data.book.id).id , '222222')       
            this.currentStory = data.stories.filter(item => item.id === this.lastReadStory(data.book.id).id)[0]
          }
          // check story unpublish
          // TODO: remove story away from localstore if need
          if(!this.currentStory){
            Alert.alert('この作品は発行期間が終了しました。' )
            return
          }

          // Set related_books for end-story screen
          books = []
          data.related_books.forEach(book => books.push({'book': book}))
          this.relatedBooksQ = { 'books': books, 'size': 'small' }
          // console.log(data.stories, "data.stories")
          this.showModalPurchase = true
          // let status = await this.checkExpireAds()
          // if(status) {
          //   this.showModalOutCoin = true;
          //   this.isBuyCoin = false;
          // } else {
          //   this.showModalOutCoin = true;
          //   this.isBuyCoin = true;
          // }
        }
      } else {
        if(this.backBehavior) {
           this.navigation.replace('BookDetail', { id: this.book.id, backBehavior: 'GoFromBook' })
        } else {
          this.navigation.push("BookDetail", { id: this.book.id })
        }
      }
    },
  },

};
</script>
