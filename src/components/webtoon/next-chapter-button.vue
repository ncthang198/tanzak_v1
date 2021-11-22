<template>
  <view>
    <nb-button
      :onPress="showModal"
      :style="{backgroundColor: '#225e84', marginTop: 10, marginBottom: 8, paddingHorizontal: 16 }"
      block
      v-if="showChapter"
    >
        <text :numberOfLines=1 :class="'text-button'" :style="{paddingRight: 10}">
          次の話を読む
        </text>
        <view :style="{width: 18, height: 20, marginLeft: 5, position: 'absolute', right: 8, top: 12}">
            <image :source="ICON_07_07" :style="{ width: '100%', height: '100%' }" />
        </view>
    </nb-button>

    <modal-out-coin 
      v-if="showModalOutCoin" 
      :subscriptions="subscriptions" 
      :closeModal="close" 
      :isBuyCoin="isBuyCoin" 
      :navigation="data.navigation"
      :currentStory="data.chapter"
      :setLoading="setAdLoading"
      :isPremium="currentSubscription ? true : false"
    />

    <modal-purchase
      :book="data.book"
      :currentStory="data.chapter"
      :navigation="data.navigation"
      :closeModal="closeModal"
      :isNext=true
      v-if="data.chapter.type !== 'book' && showModalPurchase"
      :relatedBooksQ="relatedBooksQ"
      :openBuyCoin="openBuyCoin"
      :openViewAds="openViewAds"
      :isPremium="currentSubscription ? true : false"
    />
  </view>
</template>

<script>
import ModalPurchase from "../../components/share/ModalPurchaseStory.vue"
import ICON_07_07 from "../../../assets/modal/07_07.png"
import ModalOutCoin from '../../components/share/ModalOutCoin.vue'
import { mapActions, mapGetters,mapMutations } from 'vuex'
export default {
  props: ['data'],
  components: { ModalPurchase, ModalOutCoin },
  data(){
    return{
      showModalPurchase: false,
      showChapter: this.data.chapter.id || this.data.chapter.book_id,
      ICON_07_07: ICON_07_07,
      relatedBooksQ: null,
      subscriptions: [],
      isBuyCoin: true,
      showModalOutCoin: false,
      setAdLoading: function () {},
    }
  },

  computed: {
    ...mapGetters({
      currentSubscription: 'user/currentSubscription'
    }),
  },

  watch: {
    currentSubscription(newVal, oldVal){
      this.currentSubscription = newVal
    }
  },

  created() {
    this.relatedBooksQ = this.data.navigation.getParam('related_books_q')    
    if(!this.relatedBooksQ){
      this.relatedBooksQ = this.data.navigation.getParam('related_books')      
    }
  },

  methods: {
    ...mapActions({
      checkExpireAds: 'user/checkExpireAds',
      addStory: 'booksLocal/addStory',
    }),
    ...mapMutations({
        setCurrentStory: 'bookDetail/setCurrentStory',
      }),
    async showModal() {            
      if(this.data.chapter.type === 'book') {
        return this.data.navigation.push('BookDetail', {id: this.data.chapter.id})
    } else {      
      this.showModalPurchase = true              
      // this.validNavigateStory()      
      }
    },
    // validNavigateStory() {       
    //   if (!this.data.chapter) return;
    //   const bookInfo = {
    //     id: this.data.chapter.book_id,
    //     image_url: this.data.book.image_url,
    //     catch_copy: this.data.book.catch_copy,
    //     title: this.data.book.title,
    //     image_dimensions: this.data.book.image_dimensions,
    //   };
    //   this.addStory({
    //     id: this.data.chapter.id,
    //     title: this.data.chapter.title,
    //     bookInfo: bookInfo,
    //   });
    //   this.setCurrentStory(this.data.chapter);
    //   read = false;
    //   if (
    //     this.readStoriesList &&
    //     this.readStoriesList.indexOf(this.data.chapter.id) >= 0
    //   ) {   
    //     read = true;
    //   }      
    //   return this.data.navigation.replace("Webtoon", {
    //         story: this.data.chapter,
    //         book: this.data.book,
    //         previous_route: this.data.navigation.state.routeName,
    //         read: read,
    //         related_books_q: this.relatedBooksQ,
    //       });      
    // },
    closeModal(foo=false) {
      this.showModalPurchase = false
    },

     setLoading(isLoading) {
      this.isAdLoading = isLoading
    },

    fetchSubscriptionsApi(){
      this.axios.get('api/subscriptions').then((res) => {
        this.subscriptions = res.data.data
      }).catch((error) => {
        this.writeLog(this.axios, { event: 'GET SUBSCRIPTIONS ERROR', value: error, log_type: 'info' })
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
  },

  mounted(){
    this.fetchSubscriptionsApi()
    this.setAdLoading = this.setLoading.bind(this)
  }
}
</script>
<style>
  .text-button {
    fontWeight: bold;
    fontSize: 17;
    color: #fff;
  }
</style>
