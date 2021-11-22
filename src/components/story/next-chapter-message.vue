<template>
  <view>
  <touchable-opacity :onPress="showModal" v-if="showChapter">
    <view class="character-next-chapter">
      <view :style="{maxWidth: widthBook, height: imageStyle.height, alignItems: 'flex-start'}">
        <fast-image :style="imageStyle" :source="{uri: getUri()}"  />
      </view>
      <view :style="{maxWidth: '60%', alignItems: 'flex-start', paddingHorizontal: '2%'}">
        <text :numberOfLines=3 :style="{fontSize: 18}"> {{ message.nextChapter.chapter.title }} </text>
      </view>
      <view v-if="nextChapter.chapter.type === 'book'" :style="{maxWidth: '5%', alignItems: 'flex-end'}">
        <image :source="greaterIcon" resizeMode="contain" :style="{width: 15, alignSelf: 'flex-end'}">
      </view>
    </view>
  </touchable-opacity>
  <modal-purchase
    :book="nextChapter.book"
    :currentStory="nextChapter.chapter"
    :navigation="nextChapter.navigation"
    :closeModal="closeModal"
    :isNext=true
    :isPremium="isPremium"
    v-if="nextChapter.chapter.type !== 'book' && showModalPurchase"
  />
  </view>
</template>

<script>
import { mapActions } from 'vuex'
import GreaterIcon from '../../../assets/images/greater_icon.png'
import ModalPurchase from "../../components/share/ModalPurchaseStory.vue"
import FastImage from 'react-native-fast-image'

export default {
  props: ['message'],
  components: { ModalPurchase, FastImage },
  created() {
    const next = this.message.nextChapter
    if(next.chapter.type == 'book') {
      this.updateDoneBook(next.id)
      const dimension = next.chapter.image_dimensions.small.split('x')
      this.widthBook = ( 144 / dimension[1] ) * dimension[0]
      this.imageStyle = { height: 144, width: this.widthBook }
    } else {
      this.widthBook = 92
      this.imageStyle = { height: 64, width: this.widthBook }
    }
  },
  data(){
    return{
      showModalPurchase: false,
      nextChapter: this.message.nextChapter,
      showChapter: this.message.nextChapter.chapter.id || this.message.nextChapter.chapter.book_id,
      widthBook: null,
      imageStyle: null,
      greaterIcon: GreaterIcon,
      type: this.message.nextChapter.chapter.type,
      id: this.message.nextChapter.chapter.id,
      isPremium: false
    }
  },
  methods: {
    showModal() {
      if(this.nextChapter.chapter.type === 'book')
        return this.nextChapter.navigation.push('BookDetail', {id: this.nextChapter.chapter.id})
      this.showModalPurchase = true
    },
    closeModal(foo=false) {
      this.showModalPurchase = foo
    },
    ...mapActions({
      updateDoneBook: 'booksLocal/updateDoneBook',
    }),
    getUri(){
      chapter = this.message.nextChapter.chapter
      src = (chapter.type == 'book') ? ((chapter || {}).image_url || {}).url : ((chapter || {}).cover || {}).url
      return src
    },
    fetchUserSubscription() {
      this.axios.get('api/users/subscription').then(res => {
        this.isPremium = true
      }).catch(error =>{
        this.isPremium = false
      })
    },
  },
}
</script>
<style>
.character-next-chapter {
  marginBottom: 10;
  marginRight: 10;
  alignItems: center;
  flexDirection: row;
  justifyContent: space-between;
}
</style>
