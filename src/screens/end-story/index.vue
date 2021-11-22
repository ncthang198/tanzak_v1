<template>
  <view :style="{ flex: 1 }">
    <image-background :style="{flex: 1}" resizeMode="cover" :source="backgroundImage">
      <header-image
        :navigation="navigation"
        :goBack=true
        :overflow=true
        iconBack='close'
        otherIcon='shareWhite'
        :storyDetail="book"
        :currentStory="story"
      />

      <view>
        <TouchableWithoutFeedback :onPress="handleOverlayClick" v-if="showOverlay">
          <view  class='overlay' :style="{height: heightScreen}" />
        </TouchableWithoutFeedback>

        <scroll-view>
        <!-- Page content -->
        <view :style="{marginTop: 30, marginBottom: 30}">
          <text class='font-large' :style="{textAlign: 'center', marginBottom: 20, fontWeight: 'bold', color: '#145477' }">この話はお楽しみいただけましたか？</text>
          <!-- emoji -->
          <view class="action-icon" :style="{flexDirection: 'row', justifyContent: 'space-around'}">
            <touchable-opacity :onPress="() => handleStampClick()">
                <view class='item-emoji-wrapper'>
                  <view class='ic-emoji-wrapper'>
                    <image :source="stampIcon.icon" class="ic-emoji-image" key="stampIcon" />
                  </view>
                  <text class='font-small'> {{ stampIcon.text }} </text>
                </view>
            </touchable-opacity>

            <touchable-opacity :onPress="() => handleCommentClick()">
              <view class='item-emoji-wrapper'>
                <view class='ic-emoji-wrapper'>
                  <image :source="commentIcon.icon" class="ic-emoji-image" key="commentIcon" />
                </view>
                <text class='font-small'> {{ commentIcon.text }} </text>
              </view>
            </touchable-opacity>

            <touchable-opacity :onPress="() => handleFavoriteClick()">
              <view class='item-emoji-wrapper'>
                <view class='ic-emoji-wrapper' :style="{width: 51}">
                  <image :source="favoriteIcon.icon" class="ic-emoji-image" key="bookFavoritedIcon"/>
                </view>
                <text class='font-small'> {{ favoriteIcon.text }} </text>
              </view>
            </touchable-opacity>
          </view>
          <!--  emoji -->

          <!-- related books list -->
          <view>
            <book-list-item
              v-if="bookRelatedData"
              :isRelatedSection=true
              :navigation="navigation"
              :data="bookRelatedData"
              sectionTitle="オススメ作品"
              :showBookInfo="true"
              backBehavior="GoFromBook" />
          </view>
          <!-- related books list -->

             <!-- Button read -->
          <view :style="{margin: 12}">
            <next-chapter-button v-if="nextStory" :data="nextStory" />
          </view>
          <!-- Button read -->

          <!-- action reload -->
          <view :style="{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}">
            <view :style="{flexDirection: 'column'}">
              <touchable-opacity :onPress="() => goBackAndReload()">
                  <view class='ic-reload-wrapper'>
                    <view class='ic-reload-image-wrapper'>
                      <image :source="ICON_07_08" class='ic-reload-image' />
                    </view>
                    <view class='t-link'>
                      <text>最初から読み返す</text>
                    </view>
                  </view>
              </touchable-opacity>
              <touchable-opacity :onPress="() => goToStoryDetail()">
                  <view class='ic-reload-wrapper'>
                    <view class='ic-reload-image-wrapper'>
                      <image :source="ICON_07_09" class='ic-reload-image' />
                    </view>
                    <view class='t-link'>
                      <text>作品詳細に戻る</text>
                    </view>
                  </view>
              </touchable-opacity>
            </view>
          </view>
          <!-- action reload -->

          <!-- report link -->
          <touchable-opacity :onPress="() => gotToReport()">
            <view :style="{alignItems: 'center', marginBottom: 50, marginTop: 10, paddingBottom: 80}">
              <view class='t-link'>
                <text :style="{textAlign: 'center'}">この作品の問題を報告</text>
              </view>
            </view>
          </touchable-opacity>
          <!-- report link -->

        </view>
        <!-- End Page content -->
      </scroll-view>
      </view>

      <!-- stamp input -->
      <view
        v-if="showStampInput"
        :style="{height: 260, width: widthScreen, backgroundColor: '#fff', alignItems: 'center', position: 'absolute', bottom: 0, zIndex: 11}">
        <stamp :style="{padding: 20}" :displaySticker="saveStamp" />
      </view>
      <!--/ stamp input -->

      <!-- comment input -->
      <keyboard-avoiding-view
        v-if="showCommentInput"
        :style="[kb_AvoidViewStyle, { position: 'absolute', zIndex: 11, bottom: 0 }]"
        behavior="padding"
        :keyboardVerticalOffset="kb_AvoidViewOffset"
        :enabled="Platform.OS === 'ios' ? true : false"
      >
        <comment-input
          v-if="showCommentInput"
          :style="{ height: 50, width: '95%' }"
          :displayComment="saveComment"
          :book="book"
        />
      </keyboard-avoiding-view>
      <!--/ comment input -->

      <!-- Stamp modal -->
      <stamp-modal
        :visible="showStampModal"
        :closeModalFunction="closeStampModal"
        :bubble_type="bubbleType"
      />
      <!-- Stamp modal -->

      <!-- Favorite modal -->
      <favorite-modal
        :title="favoriteModalContent.title"
        :body="favoriteModalContent.body"
        :isVisible="showFavoriteModal"
      />
      <!-- Favorite modal -->

    </image-background>
  </view>
</template>
<script>

import backgroundImage from "../../../assets/top/bg_top.png"
import ICON_07_01 from "../../../assets/modal/07_01.png"
import ICON_07_02 from "../../../assets/modal/07_02.png"
import ICON_07_03 from "../../../assets/modal/07_03.png"
import ICON_07_04 from "../../../assets/modal/07_04.png"
import ICON_07_05 from "../../../assets/modal/07_05.png"
import ICON_07_06 from "../../../assets/modal/07_06.png"
import ICON_07_08 from "../../../assets/modal/07_08.png"
import ICON_07_09 from "../../../assets/modal/07_09.png"

import HeaderImage from "../../components/share/HeaderImage.vue"
import BookListItem from '../../components/share/BookListItem.vue'
import Stamp from '../../components/stamp'
import StampModal from '../../components/share/stamp-modal'
import CommentInput from '../../components/story/comment-input'
import FavoriteModal from '../../components/share/tanzak-modal'
import NextChapterButton from '../../components/story/next-chapter-button'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import * as LocalStoryData from '../../localstore/story.js'
import { KeyboardAvoidingView, Platform, Dimensions } from 'react-native'

export default {
  props: [
    'navigation'
  ],
  components: {
    HeaderImage,
    backgroundImage,
    BookListItem,
    Stamp,
    StampModal,
    CommentInput,
    KeyboardAvoidingView,
    FavoriteModal,
    NextChapterButton
  },
  data() {
    return {
      backgroundImage: backgroundImage,
      ICON_07_01: ICON_07_01,
      ICON_07_02: ICON_07_02,
      ICON_07_03: ICON_07_03,
      ICON_07_04: ICON_07_04,
      ICON_07_05: ICON_07_05,
      ICON_07_06: ICON_07_06,
      ICON_07_08: ICON_07_08,
      ICON_07_09: ICON_07_09,
      widthScreen: Dimensions.get('window').width,
      heightScreen: Dimensions.get('window').height,
      bubbleType: null,
      showStampModal: false,
      showStampInput: false,
      showCommentInput: false,
      showOverlay: false,
      showFavoriteModal: false,
      Platform: Platform,
      favoriteModalContent: {},
      kb_AvoidViewStyle: {
        width: Dimensions.get('window').width, marginBottom: Platform.OS === 'ios' ? 15 : 0, alignItems: 'center', justifyContent: 'center'
      },
      kb_AvoidViewOffset: Platform.OS === 'ios' && Dimensions.get('window').height >= 812 ? 15 : 5,
      currentStamp: null,
      currentComment: null,
      book: null,
      story: null,
      bookRelatedData: null,
      nextStory: null,
      isPremium: false
    }
  },

  async created(){
    this.book = this.navigation.getParam('book')
    this.story = this.navigation.getParam('story')

    // Set size big for related books
    let related_books = await this.navigation.getParam('related_books_q')
    if(related_books){
      related_books['size'] = 'big'
      this.bookRelatedData = related_books
    }

    let nextChapterData = await this.navigation.getParam('nextChapterData')
    // Only show next story, not display if type == book
    if(nextChapterData && nextChapterData.type === 'story'){
      this.nextStory = {
        chapter: nextChapterData,
        book: this.book,
        navigation: this.navigation,
        id: this.story.id
      }
    }

    data = await LocalStoryData.getDataFromLocal(`@ReadingHistory:${this.book.id}_${this.story.id}`)

    if(data && data['sticker']) { this.currentStamp = data['sticker'] }
    if(data && data['comment']) { this.currentComment = data['comment'] }
  },

  computed: {
    ...mapGetters({
      favoriteBooksSection: 'booksLocal/favoriteBooksSection',
      bookFavorited: 'bookDetail/bookFavorited',
      getRelatedBooks: 'bookDetail/getRelatedBooks'
    }),

    stampIcon(){
      if(this.currentStamp) { return { icon: this.ICON_07_01, text: 'スタンプ送信済み' } }
      return { icon: this.ICON_07_04, text: 'スタンプを送る' }
    },

    commentIcon(){
      if(this.currentComment) { return { icon: this.ICON_07_02, text: '感想送信済み' } }
      return { icon: this.ICON_07_05, text: '感想を送る' }
    },

    favoriteIcon(){
      if(this.bookFavorited) { return { icon: this.ICON_07_03, text: 'お気に入り追加済み' } }
      return { icon: this.ICON_07_06, text: 'お気に入りに追加' }
    }
  },

  methods: {
    ...mapActions({
      updateFavorite: 'bookDetail/updateFavorite',
      updateFavoriteBooksSection: 'booksLocal/updateFavoriteBooksSection'
    }),

    goToStoryDetail()  {
      this.navigation.replace("BookDetail", { id: this.book.id })
    },

    gotToReport()  {
      this.navigation.navigate("ReportScreen", { story_title: this.story.title, story_id: this.story.id })
    },

    goBackAndReload() {
      this.navigation.goBack();
      this.navigation.state.params.reloadStory();
    },

    handleStampClick() {
      this.showOverlay = true

      if(this.currentStamp) {
        this.bubbleType = 'stamp'
        this.showStampModal = true
        return
      }

      this.showStampInput = true
    },

    handleCommentClick() {
      this.showOverlay = true

      if(this.currentComment) {
        this.bubbleType = 'comment'
        this.showStampModal = true
        return
      }

      this.showCommentInput = true
    },

    handleFavoriteClick() {
      this.axios.post(`/api/favorites/`, {
        book_id: this.book.id
      }).then( async function (res) {
      }).catch(function (error) {});

      if(this.bookFavorited){
        this.favoriteModalContent = { title: '削除済み', body: 'この作品を"お気に入り"から削除しました。' }
      }else{
        this.favoriteModalContent = { title: '追加済み', body: 'この作品を"お気に入り"に追加しました。ホーム画面最下部に表示されます。' }
      }

      this.updateFavorite(!this.bookFavorited)

      this.showFavoriteModal = true
      this.showOverlay = true
      setTimeout(() => {
        this.showFavoriteModal = false
        this.showOverlay = false
      }, 2000);

      data = {
        state: this.bookFavorited ? 'add' : 'remove',
        book: this.book
      }
      this.updateFavoriteBooksSection(data)
    },

    saveStamp(uri) {
      LocalStoryData.saveDataLocal(`@ReadingHistory:${this.book.id}_${this.story.id}`, {sticker: uri})
      this.currentStamp = uri
      this.bubbleType = 'stamp'
      this.showStampInput = false
      this.showStampModal = true
    },

    saveComment(content) {
      LocalStoryData.saveDataLocal(`@ReadingHistory:${this.book.id}_${this.story.id}`, {comment: content})
      this.currentComment = content
      this.bubbleType = 'comment'
      this.showCommentInput = false
      this.showStampModal = true
    },

    closeStampModal() {
      this.showStampModal = false
      this.showOverlay = false
    },

    handleOverlayClick() {
      this.showStampInput = false
      this.showCommentInput = false
      this.showOverlay = false
    },
    fetchUserSubscription() {
      this.axios.get('api/users/subscription').then(res => {
        this.isPremium = true
      }).catch(error =>{
        this.isPremium = false
      })
    },
  },

  mounted(){
    this.fetchUserSubscription()
  }
}
</script>

<style>
  .font-small {
    font-size: 12
  }
  .font-large {
    font-size: 16
  }
  .text_header {
    color: #fff;
  }
  .text-button {
    fontWeight: bold;
    fontSize: 17;
    color: #fff;
  }
  .ic-reload-wrapper {
    flex-direction: row;
    align-items: center;
    margin-bottom: 15
  }
  .ic-reload-image-wrapper {
    width: 20;
    height: 20;
    margin-right: 5
  }
  .ic-reload-image {
    width: 100%;
    height: 100%;
  }
  .ic-emoji-wrapper {
    width: 50;
    height: 50;
    align-self: center;
    margin-bottom: 10
  }
  .ic-emoji-image {
    width: 100%;
    height: 100%
  }
  .item-emoji-wrapper {
    margin-bottom: 10;
    justify-content: flex-start
  }
  .t-link {
    border-bottom-width: 1;
  }
  .overlay {
    flex: 1;
    position: absolute;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0.5;
    background-color: black;
    z-index: 10
  }
</style>
