<template>
  <nb-container>
    <image-background :style="{flex: 1}" resizeMode="cover" :source="background">
    <header-image
      :navigation="navigation"
      :goBack=true
      :main="mainHeader"
      otherIcon='shareWhite'
      :storyDetail="bookInfoData"
      :rightIconStyle="{marginRight: 18}"
    />
      <nb-content v-if="loadDone && !getBookListLocal">
        <view :style="{margin: 15}">
          <book-info
            :lastReadStory="lastReadStory"
            :goToStory="goToStory"
            :goToWebtoon="goToWebtoon"
            :goToScroll="goToScroll"
            :bookInfoData="bookInfoData"
            :bookTags="bookTags"
            :navigation="navigation"
            :openModal="openModalOutCoin"/>
        </view>
        <view
          v-if="bookImagesData.length > 0"
          :style="{marginTop: 10, paddingHorizontal: 15, paddingTop: 10, paddingBottom: 15, backgroundColor: 'white'}"
        >
          <book-images :bookImagesData="bookImagesData" :book="bookInfoData" :openModal="openModalOutCoin" :isPremium="currentSubscription ? true : false"/>
        </view>
        <view v-if="currentSubscription">
          <view :style="{flex: 1, alignItems: 'center', marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'center'}">
            <image
              :source="unLock"
              :style="{height: 60, width: 40}"
              resize="contain"
            />
            <text :style="{marginLeft: 25, fontWeight: 'bold'}">
              読み放題（プレミアム会員）
            </text>
          </view>
        </view>
        <view v-else>
          <view v-if="!isBookPremium" :style="{margin: 15}">
            <coin :navigation="navigation" />
          </view>
        </view>
        <view :style="{marginTop: isBookPremium ? -10 : 0}">
          <book-section
            :book="bookInfoData"
            :sections="bookSectionData"
            :stories="bookStoriesData"
            :readStoriesList="readStoriesList"
            :goToStory="goToStory"
            :navigation="navigation"
            :isUserPremium="currentSubscription ? true : false"/>
        </view>
        <view :style="{marginTop: -5, paddingTop: 5}">
          <book-list-item :isRelatedSection=true :navigation="navigation" :data="bookRelatedData" :isPremium="currentSubscription ? true : false"/>
        </view>
        <modal-purchase
          v-if="showModalPurchase"
          :book="bookInfoData"
          :currentStory="currentStory"
          :navigation="navigation"
          :closeModal="closeModal"
          :setLoading="setAdLoading"
          :readStoriesList="readStoriesList"
          :relatedBooksQ="bookRelatedData"
          :openBuyCoin="openBuyCoin"
          :openViewAds="openViewAds"
          :isPremium="currentSubscription ? true : false"
        />
        <modal-out-coin 
          v-if="showModalOutCoin" 
          :subscriptions="subscriptions" 
          :closeModal="close" 
          :isBuyCoin="isBuyCoin" 
          :navigation="navigation"
          :currentStory="currentStory"
          :setLoading="setAdLoading"
          :isPremium="bookInfoData.member_type=='premium'"
          :isLock="isLock"
        />
        <modal-progress :isLoading="isAdLoading"/>
      </nb-content>
    <loading v-else />
    </image-background>
    <notification-modal
          title=""
          body="この作品は発行期間が終了しました。"
          v-if="isNotificationModalVisible"
          :closeModalFunction="closeModalFunction"/>
  </nb-container>
</template>

<script>
  import BackgroundDetail from "../../../assets/top/bg_top.png"
  import Loading from '../../components/share/LoadingScreen.vue';
  import HeaderBackground from '../../../assets/top/header_top.png'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import Coin from "../../components/book/coin.vue"
  import BookListItem from "../../components/share/BookListItem.vue"
  import HeaderImage from "../../components/share/HeaderImage.vue"
  import BookSection from "../../components/book/book-section.vue"
  import BookInfo from "../../components/book/book-info.vue"
  import BookImages from "../../components/book/book-images.vue"
  import UnLock from "../../../assets/images/un_lock.png"
  import { ActionSheet } from "native-base";
  import ModalPurchase from "../../components/share/ModalPurchaseStory.vue"
  import ModalProgress from "../../components/share/ModalProgress.vue"
  import { isUnpublish } from "../../common/helper.js"
  import NotificationModal from "../../components/share/notification-modal"
  import ModalOutCoin from '../../components/share/ModalOutCoin.vue'

  // TODO: change title to Japanese here

  export default {
    props: {
      navigation: {
        type: Object
      },
      story: {
        type: Object
      }
    },
    components: {
      ModalPurchase,
      Coin,
      BookSection,
      BookInfo,
      BookImages,
      BookListItem,
      HeaderImage,
      Loading,
      ModalProgress,
      NotificationModal,
      ModalOutCoin
    },
    data() {
      return {
        currentStoryId: null,
        currentStory: null,
        loadDone: false,
        bookInfoData: null,
        bookTags: null,
        bookImagesData: null,
        bookSectionData: null,
        bookStoriesData: null,
        bookRelatedData: null,
        related_books: null,
        mainHeader: {text: '作品詳細'},
        loading: false,
        background: BackgroundDetail,
        timeoutDuplacate: true,
        showModalPurchase: false,
        readStoriesList: null,
        isAdLoading: false,
        setAdLoading: function () {},
        isNotificationModalVisible: false,
        closeModalFunction: function () {},
        subscriptions: [],
        isBuyCoin: true,
        showModalOutCoin: false,
        isLock: false,
        unLock: UnLock
      }
    },
    async created() {
      await this.closeOldScreen()
      const id = this.navigation.getParam('id')
      await this.loadLocalBook(id)
      await this.fetchBook(id)
      this.readStoriesList = this.readStories(id)      
      this.lastReadStory = this.getLastReadStory(id)
      this.closeModalFunction = this.closeNotificationModal.bind(this)
    },
    mounted() {
      this.update_page_views()
      this.sendReportToServer()
      this.fetchSubscriptionsApi()
      this.setAdLoading = this.setLoading.bind(this)
    },
    computed: {
      ...mapGetters({
        getBookListLocal: 'booksLocal/getStatus',
        readStories: 'booksLocal/getStories',
        getLastReadStory: 'booksLocal/lastReadStory',
        currentSubscription: 'user/currentSubscription',
      }),

      lastReadStory(){
        return this.getLastReadStory(this.navigation.getParam('id'))
      }
    },
    watch: {
      readStories(newList, oldList) {        
        if(this.bookInfoData){
          this.readStoriesList = newList(this.bookInfoData.id)
        }
      },

      currentSubscription(newVal, oldVal){
        this.currentSubscription = newVal
      }
    },
    methods: {
      setLoading(isLoading) {
        this.isAdLoading = isLoading
      },
      fetchBook(id) {
        this.initBook(id).then((data) => {
          if(data.code && data.message) {
            alert(data.message)
            return
          }
          this.saveUser(data.user)
          this.setStoryHistories({storyHistories: data.story_histories, bookId: data.book.id})
          this.bookInfoData = data.book
          this.bookTags = data.tags
          this.bookImagesData = data.book_images
          this.bookSectionData = data.sections
          this.bookStoriesData = data.stories
          this.isBookPremium = this.bookInfoData.member_type =='premium'
          const books = []
          this.related_books = data.related_books
          data.related_books.forEach(book => books.push({'book': book}))
          this.bookRelatedData = {'books': books, 'size': 'small'}
          this.loadDone = true
        })
      },

      openBuyCoin(){
        this.showModalOutCoin = true
        this.isBuyCoin = true
      },

      openViewAds(){
        this.showModalOutCoin = true
        this.isBuyCoin = false
      },

      close(){
        this.showModalOutCoin = false
      },

      openModalOutCoin(isLock = false){
        this.showModalOutCoin = true
        this.isLock = isLock
      },

      fetchSubscriptionsApi(){
        this.axios.get('api/subscriptions').then((res) => {
          this.subscriptions = res.data.data
        }).catch((error) => {
          this.writeLog(this.axios, { event: 'GET SUBSCRIPTIONS ERROR', value: error, log_type: 'info' })
        })
      },

      ...mapActions({
        loadLocalBook: 'booksLocal/loadBook',
        initBook: 'bookDetail/initBook',
        closeOldScreen: 'bookDetail/closeOldScreen',
        updateLastReadStory: 'booksLocal/updateLastReadStory',
        sendReportToServer: 'user/sendReportToServer',
        checkExpireAds: 'user/checkExpireAds',
      }),
      ...mapMutations({
        saveUser: 'user/saveUser',
        updateBooksRouter: 'bookDetail/updateBooksRouter',
        setStoryHistories: 'bookDetail/setStoryHistories',
        setRefreshBookLocal: 'booksLocal/refresh',
        setCurrentStory: 'bookDetail/setCurrentStory',
      }),
      update_page_views(){
        id = this.navigation.getParam('id')
        this.axios.put(`/api/books/${id}/update-page-views`).catch((error) => console.log(error.data))
      },
      async goToStory(story=null, timeLeft) {
        // if book is premium and user not premium: buy subscription
        if (this.bookInfoData.member_type =='premium' && !this.currentSubscription){
          this.showModalOutCoin = true;
        } else {
          this.isLock = false
          // if book is unpublish: show notification: 'book is unpublish, then go to home screen'
        if (isUnpublish(new Date(this.bookInfoData.stop_publication_at))) {
            this.showNotificationModal()
            return    
          }

          // else: if book is not unpublish then go to story of this book
          selectedStory = story
          if(!selectedStory) {
            selectedStory = this.bookStoriesData[0]
            if (!selectedStory) {
              return
            }
          } else {
            selectedStory = this.bookStoriesData.filter(item => item.id === story)[0]
          }          
          if(this.timeoutDuplacate) {
            this.currentStory = selectedStory            
            this.currentStory.isWebtoon = false;            
            this.showModalPurchase = true;
            this.timeoutDuplacate = false
            setTimeout(() => { this.timeoutDuplacate = true}, 300)
          }
        }
      },
      async goToScroll(story=null, timeLeft) {
        // if book is premium and user not premium: buy subscription
        if (this.bookInfoData.member_type =='premium' && !this.currentSubscription){
          this.showModalOutCoin = true;
        } else {
          this.isLock = false
          // if book is unpublish: show notification: 'book is unpublish, then go to home screen'
        if (isUnpublish(new Date(this.bookInfoData.stop_publication_at))) {
            this.showNotificationModal()
            return    
          }

          // else: if book is not unpublish then go to story of this book
          selectedStory = story
          if(!selectedStory) {
            selectedStory = this.bookStoriesData[0]
            if (!selectedStory) {
              return
            }
          } else {
            selectedStory = this.bookStoriesData.filter(item => item.id === story)[0]
          }          
          if(this.timeoutDuplacate) {
            this.currentStory = selectedStory            
            this.currentStory.isWebtoon = false;            
            this.showModalPurchase = true;
            this.timeoutDuplacate = false
            setTimeout(() => { this.timeoutDuplacate = true}, 300)
          }
        }
      },
      
      async goToWebtoon(story=null, timeLeft) {
        // if book is premium and user not premium: buy subscription
        if (this.bookInfoData.member_type =='premium' && !this.currentSubscription){
          this.showModalOutCoin = true;
        } else {
          this.isLock = false
          // if book is unpublish: show notification: 'book is unpublish, then go to home screen'
          if (isUnpublish(new Date(this.bookInfoData.stop_publication_at))) {
            this.showNotificationModal()
            return
          }

          // else: if book is not unpublish then go to story of this book
          selectedStory = story
          if(!selectedStory) {
            selectedStory = this.bookStoriesData[0]
            if (!selectedStory) {
              return
            }
          } else {
            selectedStory = this.bookStoriesData.filter(item => item.id === story)[0]
          }
          console.log(timeLeft);
          if(this.timeoutDuplacate) {
            this.currentStory = selectedStory
            this.currentStory.isWebtoon = true;            
            this.showModalPurchase = true;
            this.timeoutDuplacate = false
            setTimeout(() => { this.timeoutDuplacate = true}, 300)
          }
        }
      },
      closeModal(isGoToStorySuccess=false) {
        this.showModalPurchase = false
        if(isGoToStorySuccess) {
          this.lastReadStory = this.currentStory
        }
      },
      closeNotificationModal() {
        this.isNotificationModalVisible = false
        this.navigation.goBack()
      },
      showNotificationModal() {
        this.isNotificationModalVisible = true
      }
    },
  };

</script>
