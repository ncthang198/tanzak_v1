<template>
  <view v-if="bookInfoData">
    <!-- Top container -->
    <view :style="styleTopContainer">
      <!-- Image display -->
      <view :style="{height: 280, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginLeft: -20, marginRight: -20, marginTop: -15}">
          <view :style="{flex: 1}">
            <image :source="{ uri: bookInfoData.image_url.url}" :style="{height:'100%', opacity: 0.8 }" resizeMode="cover" :blurRadius="5" />
          </view>
          <view :style="[imageContainer, {position: 'absolute', margin: 'auto'}]">
            <fast-image :source="{ uri: bookInfoData.image_url.url}" :style="styleImage" />
          </view>
      </view>
      <!-- / Image display -->

      <view :style="{marginTop: 20}">
        <view :style="{ flex: 1}">
          <!-- Title display -->
          <view :style="{flexDirection: 'row', marginBottom: 10}">
            <image v-if="isPremium()" :source="premiumIcon" :style="{width: 30, height: 30}" resizeMode="contain"/>
            <text :style="{fontSize: 17, fontWeight: 'bold', marginRight: 30, lineHeight: 24}">{{ bookInfoData.title }}</text>
            <!-- Favorite -->
            <view :style="{position: 'absolute', right: 0}">
              <touchable-opacity :onPress="() => handleFavoriteClick()" :hitSlop="{top: 20, bottom: 20, left: 50, right: 40}">
                <image :source="bookFavorited ? favoriteIconActive : favoriteIconDeactive" :style="{width: 22, height: 20.5}" :key="bookFavorited" />
              </touchable-opacity>
            </view>
            <!-- Favorite -->
          </view>
          <!-- / Title display -->

          <view :style="{ flex: 1 }">
            <!-- Author display -->
            <view v-if="isAuthorWritterPresent" :style="{marginVertical: 5, marginBottom: 15}">
              <view v-for="(role, i) in getAuthorsWrittersFormat" :key="i">
                <!-- <text>{{ role.role_name }}: {{ role.name.join(',') }}{{ (i+1 &lt; getAuthorsWrittersFormat.length) ? '/ ' : '' }} </text> -->
                 <text>{{ role.role_name }}: {{ role.name.join('/ ') }}</text>
              </view>
            </view>
            <!-- / Author display -->
            <!-- Tag display -->
            <view :style="[{flexWrap: 'wrap', alignItems: 'flex-start', flexDirection:'row'}, isAuthorWritterPresent ? '' : {marginTop: 5}]">
                <view v-for="tag in getTagsFormat" :key="tag.id" :style="{ marginRight: 5, flexWrap: 'wrap'}">
                  <touchable-opacity :onPress="() => handleTagPress(tag)">
                    <text :style="{color: '#016e8e'}">#{{ tag.name }}</text>
                  </touchable-opacity>
                </view>
            </view>
            <!-- / Tag display -->
          </view>
        </view>
      </view>
    </view>
    <!-- / Top container -->

    <!-- Button read -->
    <nb-button
      :onPress="buttonPressed"
      :style="{backgroundColor: '#225e84', marginTop: 10, marginBottom: 8, paddingHorizontal: 10,  alignItems: 'center'}"
      block
      v-if="storyLast"
    >
      <text :numberOfLines=1 :class="'text-button'" v-if="storyLast.title">
        続きから読む ({{ storyLast.title }})
      </text>
      <text :numberOfLines=1 :class="'text-button'" v-else>はじめから読む（無料）</text>
    </nb-button>
    

    <view :style="{ alignItems: 'center'}">
      <text :style="{fontSize: 17, fontWeight: 'bold', paddingTop: 10, paddingBottom: 15, lineHeight: 24}">
        {{ bookInfoData.catch_copy }}
      </text>

      <!-- Book summary with truncate -->
      <view :style="{ flexDirection: 'row', height: truncateHeight, flex: 1, overflow: isTruncate ? 'hidden' : undefined}" :onLayout="(event) => verifyLineHeight(event)">
        <touchable-opacity :onPress="() => handleTruncate()">
          <text :style="{fontSize: 14, lineHeight: 20, fontWeight: '200', textAlign: 'justify', marginBottom: -10, flex: 1, paddingLeft: 1, paddingRight: 1}">
            {{ bookInfoData.summary.trim() }}
          </text>
        </touchable-opacity>
      </view>

      <touchable-opacity :onPress="() => handleTruncate()">
        <view v-if="shouldTruncate && isTruncate" :style="{paddingTop: 10, paddingLeft: '10%', paddingRight: '10%', marginBottom: -10 }">
          <image :source="dropdownIcon" :style="{height: 10}" resizeMode='contain' />
        </view>
       </touchable-opacity>
      <!-- / Book summary with truncate -->
    </view>

    <favorite-modal
      :title="favoriteModalContent.title"
      :body="favoriteModalContent.body"
      :isVisible="favoriteModalShow"
    />
  </view>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import {Dimensions} from 'react-native';
import ShareApp from '../share/ShareApp.vue'
import dropdownIcon from "../../../assets/images/dropdown_icon2.png"
import favoriteIconActive from "../../../assets/images/favorite_active.png"
import favoriteIconDeactive from "../../../assets/images/favorite_deactive.png"
import FavoriteModal from '../share/tanzak-modal'
import { Text } from 'react-native';
import PremiumIcon from '../../../assets/modal/08sakuhin_01.png'
import FastImage from 'react-native-fast-image'

const TRUNCATE_HEIGHT = 42

// Disable text scale on device user
// Text.defaultProps = Text.defaultProps || {}; // this not working on android
// Text.defaultProps.allowFontScaling = false; // this not working on android
if (Text.defaultProps === null || Text.defaultProps === undefined)
  Text.defaultProps = {};

Text.defaultProps.allowFontScaling = false;

export default {
  components: { ShareApp, FavoriteModal, Text, FastImage },
  props: [ 'lastReadStory', 'goToStory','goToWebtoon', 'bookInfoData', 'navigation', 'bookTags'],
  created() {
    const widthScreen = Dimensions.get('window').width
    const imageDimension = this.bookInfoData.image_dimensions.big.split('x')
    if (imageDimension[0] <= (widthScreen / 2)) {
      this.imageContainer['width'] = parseInt(imageDimension[0])
    } else {
      this.imageContainer['width'] = widthScreen / 2
    }
  },
  data(){
    return {
      storyLast: null,
      pendingStory: null,
      styleTopContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 5,
        backgroundColor: 'transparent',
        marginLeft: 0,
        paddingLeft: 0
      },
      imageContainer: {
        backgroundColor: '#e1e1e1',
      },
      styleImage: {
        resizeMode: 'cover',
        width: '100%',
        height: 245,
      },
      lastReadStoryLoaded: false,
      dropdownIcon: dropdownIcon,
      favoriteIconActive: favoriteIconActive,
      favoriteIconDeactive: favoriteIconDeactive,
      isTruncate: false,
      firstCheckTruncate: true,
      shouldTruncate: false,
      favoriteModalContent: {},
      favoriteModalShow: false,
      truncateHeight: undefined,
      premiumIcon: PremiumIcon
    }
  },
  watch: {
    lastReadStory(newStory, oldStory) {
      this.storyLast = newStory
    }
  },
  mounted() {
    this.storyLast = this.lastReadStory
  },
  computed: {
    ...mapGetters({
      getBook: 'bookDetail/getBook',
      getAuthorsWrittersFormat: 'bookDetail/getAuthorsWrittersFormat',
      bookFavorited: 'bookDetail/bookFavorited',
    }),
    isAuthorWritterPresent() {
      return this.getAuthorsWrittersFormat.length > 0
    },
    getTagsFormat() {
      const tagData = []
      if(this.bookTags) {
        this.bookTags.filter(tag => tagData.push({ name: tag.name, id: tag.id }))
      }
      return tagData
    }
  },
  methods: {
    ...mapActions({
      updateFavoriteBooksSection: 'booksLocal/updateFavoriteBooksSection',
      updateFavorite: 'bookDetail/updateFavorite'
    }),

    buttonPressed() {  
      this.goToStory(this.storyLast.id)
    },
    handleGoToWebtoon() {
      this.goToWebtoon(this.storyLast.id)
    },

    handleTagPress(item){ 
      this.navigation.navigate('TagDetail', { tag: item })
    },

    handleTruncate(){
      if(!this.shouldTruncate){ return }
      if(this.truncateHeight == TRUNCATE_HEIGHT) {
        this.truncateHeight = undefined
        this.isTruncate = false
      }else{
        this.truncateHeight = TRUNCATE_HEIGHT
        this.isTruncate = true
      }
    },

    verifyLineHeight(event){
      lineheight = 22  * 1.5
      if(this.firstCheckTruncate){
        if(event.nativeEvent.layout.height > lineheight) {
          this.truncateHeight = TRUNCATE_HEIGHT
          this.shouldTruncate = true
          this.isTruncate = true
        } else {
          this.truncateHeight = undefined
          this.isTruncate = false
          this.shouldTruncate = false
        }
        this.firstCheckTruncate = false
      }
    },

    handleFavoriteClick(){
      this.apiFavorite()

      if(this.bookFavorited){
        this.favoriteModalContent = { title: '削除済み', body: 'この作品を"お気に入り"から削除しました。' }
      }else{
        this.favoriteModalContent = { title: '追加済み', body: 'この作品を"お気に入り"に追加しました。ホーム画面最下部に表示されます。' }
      }

      // Update data for book on vuex store
      this.updateFavorite(!this.bookFavorited)

      this.favoriteModalShow = true
      setTimeout(() => {
        this.favoriteModalShow = false
      }, 2000);

      // Add or remove book from favorite list on home screen
      data = {
        state: this.bookFavorited ? 'add' : 'remove',
        book: this.bookInfoData
      }
      this.updateFavoriteBooksSection(data)
    },

    apiFavorite(){
        this.axios.post(`/api/favorites/`, {
          book_id: this.bookInfoData.id
        }).then( async function (res) {
        }).catch(function (error) {});
    },
    isPremium(){
      return this.bookInfoData.member_type == 'premium'
    }
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
