<template>
  <modal
    animationType="fade"
    :transparent="true"
    :visible="modalVisible"
    :onRequestClose="(event) => {checkClose(event)}"
  >
    <view class="background-modal" :style="{ flex:1, justifyContent: 'center'}">
      <view class="background-content" :style="{ width: widthScreen - 80, minHeight: 200, marginLeft: 40, justifyContent: 'center'}">
        <view :style="{alignItems: 'center'}">
          <nb-text :style="{paddingTop: 20, fontWeight: 'bold'}">{{ titleModal }}</nb-text>
          <nb-text :style="{padding: 20}">{{ modalDesc }}</nb-text>
          <flat-list
            :data="options"
            :keyExtractor="(item, index) => item.type.toString()"
            :style="{paddingBottom: 5, paddingTop: 5}"
          >
            <view render-prop-fn="renderItem"
              :style="{borderTopWidth: 0.2, borderBottomColor: '#E7E7E7'}">
              <touchable-opacity :onPress="() => chooseAction(args.item.type)">
                <view :style="{ width: widthScreen - 80, padding: 13, alignItems: 'center'}">
                  <nb-text :style="{ color: '#0794ff', fontWeight: 'bold'}"> {{ args.item.name }} </nb-text>
                </view>
              </touchable-opacity>
            </view>
          </flat-list>
        </view>
      </view>
    </view>
  </modal>
</template>

<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex'
  import { Dimensions, Modal, Platform, Alert} from 'react-native';
  import RewardedAdmod from '../../common/RewardedVideo'
  import CoinShop from "../../screens/coin-shop/index.vue"
  import AsyncStorage from '@react-native-community/async-storage'
  export default {
    components: {
      Modal
    },
    props: {
      book: Object,
      navigation: Object,
      currentStory: Object,
      closeModal: Function,
      isNext: Boolean,
      setLoading: {
        type: Function,
        default: function() {}
      },
      readStoriesList: Array,
      relatedBooksQ: Object,
      openViewAds: Function,
      openBuyCoin: Function,
      isPremium: Boolean
    },
    data() {
      return {
        titleModal: 'コインが足りません！',
        modalDesc: 'コインが不足しているため次の話を読めません。コインを補充してください。',
        options: null,
        widthScreen: Dimensions.get('window').width,
        modalVisible: false,
        story: null,
        reading_mode:null
      }
    },

    computed: {
      ...mapGetters({
        checkTimeLeft: 'bookDetail/checkTimeLeft',
        getCurrUser: 'user/currentUser',
      }),
    },
    methods: {
      ...mapActions({
        addStory: 'booksLocal/addStory',
        buyStory: 'bookDetail/buyStory',
        watchVideos: 'bookDetail/watchVideos',
        decrementCoin: 'user/decrementCoin',
        checkExpireAds: 'user/checkExpireAds',
      }),
      ...mapMutations({
        setCurrentStory: 'bookDetail/setCurrentStory',
      }),
      closeAds() {
        this.closeModal(true)
      },
      buyCoin() {
        this.closeModal(true)
        this.navigation.navigate('CoinShop')
      },
      updateCoin() {
        if(this.story) {
          this.watchVideos(this.story)
          this.validNavigateStory()
          this.setLoading(false)
          this.closeAds()
        }
      },
      startRewardedAdmod() {
        this.setLoading(true)
        RewardedAdmod.startAd()
      },
      chooseAction(type) {
        switch (type) {
          case 'shop':
            this.openBuyCoin()
            this.closeModal(true)
            break
          case 'ads':
            this.openViewAds()
            this.closeModal(true)
            break
          case 'yes':
            this.buyingStory()
            break
          default:
            this.closeModal(false)
            break
        }
      },
      osModal() {
        let self = this
        Alert.alert(
          self.titleModal,
          self.modalDesc,
          this.options.map(function(item, i){
            return ({text: item.name, onPress: () => self.chooseAction(item.type)})
          })
        )
      },
      async getPurchaseData() {
        const status = await this.checkExpireAds()
        if(status) {
          // this.options = [
          //   {type: 'shop', name: 'ショップでコインを購入　'},
          //   {type: 'ads', name: '動画を見てこの話を読む '},
          //   {type: 'cancel', name: 'キャンセル'},
          // ]
          this.openViewAds()
          this.closeModal(true)
        } else {
          // this.options = [
          //   {type: 'shop', name: 'ショップでコインを購入　'},
          //   {type: 'cancel', name: 'キャンセル'},
          // ]
          this.openBuyCoin()
          this.closeModal(true)
        }
        // this.options = [
        //   {type: 'shop', name: 'ショップでコインを購入　'},
        //   {type: 'ads', name: '動画を見てこの話を読む '},
        //   {type: 'cancel', name: 'キャンセル'},
        // ]

        // if (Platform.OS == "android")
        //   this.modalVisible = true
        // else
        //   this.osModal()
      },
      purchaseStory() {
        optionsAndroid = [
          {type: 'yes', name: 'はい '},
          {type: 'no', name: 'いいえ'},
        ]
        optionsIos = [
          {type: 'no', name: 'いいえ'},
          {type: 'yes', name: 'はい '},
        ]
        this.options = Platform.OS === 'ios' ? optionsIos : optionsAndroid
        this.titleModal = this.story.title
        this.modalDesc = `${this.story.coin}コインを使用して閲覧しますか？\n閲覧した話は72時間読み返し可能です。`

        if (Platform.OS == "android")
          this.modalVisible = true
        else
          this.osModal()
      },
      buyingStory() {
        const bookInfo = {id: this.story.book_id, image_url: this.book.image_url, catch_copy: this.book.catch_copy, title: this.book.title, image_dimensions: this.book.image_dimensions}
        this.addStory({ id: this.story.id, title: this.story.title, bookInfo: bookInfo })
        this.setCurrentStory(this.story)
        this.closeModal()
        if (!this.isNext) {        
        if (this.story.webtoon_type) {
          return this.navigation.navigate("Webtoon", {story: this.story,book: this.book,previous_route: this.navigation.state.routeName, related_books_q: this.relatedBooksQ});
        } else {
          if(this.reading_mode=='scroll_mode'){
            return this.navigation.navigate('Scroll', { 
            story: this.story,
            book: this.book,
            previous_route: this.navigation.state.routeName,            
            related_books_q: this.relatedBooksQ,
            });
          }else{
            return this.navigation.navigate("Story", {
            story: this.story,
            book: this.book,
            previous_route: this.navigation.state.routeName,            
            related_books_q: this.relatedBooksQ,
            }); 
          }          
        }
      } else {        
        if (this.story.webtoon_type) {
          return this.navigation.replace("Webtoon", { story: this.story, book: this.book, previous_route: this.navigation.state.routeName, related_books_q: this.relatedBooksQ, backBehavior: "GoFromStory"});
        } else {
          if(this.reading_mode=='scroll_mode'){
            return this.navigation.replace('Scroll', { 
              story: this.currentStory, 
              book: this.book ,
              previous_route:this.previous,              
              related_books_q:this.relatedBooksQ,
              backBehavior: "GoFromStory",
            });
          }else{
            return this.navigation.replace("Story", {
              story: this.story,
              book: this.book,
              previous_route: this.navigation.state.routeName,              
              related_books_q: this.relatedBooksQ,
              backBehavior: "GoFromStory",
            });
          }          
        }
      }
      },
      isOutOfCoin() {
        let currUser = this.getCurrUser
        return (currUser.free_life + currUser.paid_life < this.story.coin)
      },
      validNavigateStory() {       
      if (!this.story) return;
      const bookInfo = {
        id: this.story.book_id,
        image_url: this.book.image_url,
        catch_copy: this.book.catch_copy,
        title: this.book.title,
        image_dimensions: this.book.image_dimensions,
      };
      this.addStory({
        id: this.story.id,
        title: this.story.title,
        bookInfo: bookInfo,
      });
      this.setCurrentStory(this.story);
      read = false;
      if (
        this.readStoriesList &&
        this.readStoriesList.indexOf(this.story.id) >= 0
      ) {   
        read = true;
      }                  
      if (!this.isNext) {        
        if (this.story.webtoon_type) {
          return this.navigation.navigate("Webtoon", {
            story: this.story,
            book: this.book,
            previous_route: this.navigation.state.routeName,
            read: read,
            related_books_q: this.relatedBooksQ,            
          });
        } else {
          if(this.reading_mode=='scroll_mode'){
            return this.navigation.navigate('Scroll', { 
            story: this.story,
            book: this.book,
            previous_route: this.navigation.state.routeName,
            read: read,
            related_books_q: this.relatedBooksQ,
            });
          }else{
            return this.navigation.navigate("Story", {
            story: this.story,
            book: this.book,
            previous_route: this.navigation.state.routeName,
            read: read,
            related_books_q: this.relatedBooksQ,
            }); 
          }
        }
      } else {        
        if (this.story.webtoon_type) {
          return this.navigation.replace("Webtoon", {
            story: this.story,
            book: this.book,
            previous_route: this.navigation.state.routeName,
            read: read,
            related_books_q: this.relatedBooksQ,
            backBehavior: "GoFromStory",            
          });
        } else {
          if(this.reading_mode=='scroll_mode'){
            return this.navigation.replace('Scroll', { 
              story: this.currentStory, 
              book: this.book ,
              previous_route:this.previous,
              read:this.read,
              related_books_q:this.relatedBooksQ,
              backBehavior: "GoFromStory",
            });
          }else{
            return this.navigation.replace("Story", {
              story: this.story,
              book: this.book,
              previous_route: this.navigation.state.routeName,
              read: read,
              related_books_q: this.relatedBooksQ,
              backBehavior: "GoFromStory",
            });
          }
        }
      }
    },
      checkStoryExist() {
        let checkStoryExist = this.checkTimeLeft(this.story)
        if(checkStoryExist || this.story.story_type === 'free')
          return true
        return false
      }
    },
    beforeDestroy() {
      this.story = null
    },
    async mounted() {
      let currUser = this.getCurrUser
      this.reading_mode = await AsyncStorage.getItem('@reading_mode')      
      if (this.book.member_type == 'premium' && !this.isPremium)
        return
      if (this.checkStoryExist() || this.isPremium) {
        this.validNavigateStory()       
        this.closeModal()
      } else if (!this.isOutOfCoin()){
        this.closeModal()
        this.buyingStory()
      } else {
        this.isOutOfCoin() ? this.getPurchaseData() : this.purchaseStory()
      }
    },
    created() {
      this.story = this.currentStory
      RewardedAdmod.onRewardedUser = this.updateCoin.bind(this)
      RewardedAdmod.onRewardedClose = (function() {
        this.setLoading(false)
        this.closeAds()
      }).bind(this)
      RewardedAdmod.onRewardedOpen = (function () { this.setLoading(false) }).bind(this)
      RewardedAdmod.onAdLoadFail = (function () {
        this.setLoading(false)
        alert('Ads load failed')
      }).bind(this)
    }
  };

</script>
<style>
  .background-modal {
    backgroundColor: rgba(128, 128, 128, 0.5);
  }
  .background-content {
    backgroundColor: #ececec;
    borderRadius: 2;
  }
</style>
 
