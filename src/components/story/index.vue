<template>
  <nb-container>
    <view
      v-if="showImage"
      :style="{alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f5d84', position: 'absolute', zIndex: 100, width: widthScreen, height: heightList}">
      <fast-image resizeMode='cover' :style="storyImageSize"  :source="getStoryImage.url" />
    </view>
      <view
        v-if="testNextItem"
        :onLayout="(event) => handleLayoutChange1(event)"
        :style="{opacity: 0, backgroundColor: 'gray', position: 'absolute', zIndex: -100, top: 200}"
      >
        <story-content  :message="testNextItem.body" :info="infoCharacter" :path_file="pathFile"/>

      </view>


    <view :style="{flex: 1, backgroundColor: '#ccc', position: 'relative'}">
      <view :style="{flex: 1, backgroundColor: '#0f5d84', position: 'relative', zIndex: 1}"
        :onLayout="(event) => setHeightList(event)"
      >
        <image-background
          :style="{flex: 3}"
          :imageStyle="{resizeMode: 'cover'}"
          :source="handleImageBackground()"
        >

        <touchable-opacity
          :onLongPress="handleAutoLoad"
          :onPress="enableLoadMore"
          :activeOpacity="1"
          :style="{ zIndex: 1, width: '100%', flex: 1 }"
          >

            <flat-list
              :style="{}"
              :data="pages"
              :inverted="true"
              ref="scrollView"
              :showsHorizontalScrollIndicator="false"
              :keyExtractor="(item, index) => (pages.length - index).toString() + 'key'"
              :extraData="extraData"
              :initialNumToRender="10"
              :progressViewOffset="10"
              :maxToRenderPerBatch="10"
              :onViewableItemsChanged="handleViewableItemsChanged"
              :contentContainerStyle="{ justifyContent: 'flex-end', flexGrow: 1}"
              :removeClippedSubviews="true"
              :ListHeaderComponent="() => renderItemQ()"
              :onContentSizeChange="(contentWidth, contentHeight) => handleContentSize(contentWidth, contentHeight)"
            >
              <touchable-opacity
               :activeOpacity="1"
               render-prop-fn="renderItem"
               :onLongPress="handleAutoLoad"
               :onPress="enableLoadMore"
              >

              <view
                render-prop-fn="renderItem"
                :style="{opacity: setOpacity}"
              >
                  <story-content  :message="args.item" :info="infoCharacter" :path_file="pathFile" />

              </view>

              </touchable-opacity>
            </flat-list>

            </touchable-opacity>
        </image-background>

        <!-- comment input -->
        <!-- <keyboard-avoiding-view
          :style="kb_AvoidViewStyle"
          v-if="showComment"
          behavior="padding"
          :keyboardVerticalOffset="kb_AvoidViewOffset"
          :enabled="Platform.OS === 'ios' ? true : false"
        >
          <comment-input
            v-if="showComment"
            :style="{ width: '90%', alignSelf: 'center'}"
            :displayComment="displayComment"
            :book="book"
          />
        </keyboard-avoiding-view> -->
         <!-- / comment input -->


        <!-- stamp input -->
        <!-- <view v-if="showStamp" :style="{height: 260, width: widthScreen, backgroundColor: '#fff', alignItems: 'center'}">
          <stamp :style="{padding: 20}" :displaySticker="displaySticker" />
        </view> -->
        <!--/ stamp input -->
      </view>

      <!-- Tap area  -->
      <view v-if="showTouchable"
        :style="{height: heightTouch, position: 'absolute', zIndex: 4, bottom: 0, width: widthScreen, backgroundColor: 'transparent'}"
        :onLayout="(event) => heightTouchEvent(event)"
      >
        <view v-if="showGuide" :style="{height: '100%', zIndex: 999, width: widthScreen, justifyContent: 'center', alignItems: 'center'}">
          <touchable-opacity :activeOpacity="1" :style="{height: '100%', flex: 1,  width: widthScreen, justifyContent: 'center', alignItems: 'center'}" :onPress="disableShowGuide">
            <animated:view :style="{flex: 1, justifyContent: 'center', alignItems: 'center', opacity: opacityGuideline}">
              <image
                :style="{height: 250, width: 400, position: 'absolute'}"
                resizeMode="contain"
                :source="require('../../../assets/images/guideline_new.png')" />                
            </animated:view>
          </touchable-opacity>
        </view>
        <view :style="{ position: 'absolute', opacity: 0.1, backgroundColor: '#fff', width: '100%', height: '100%'}"></view>
        <view :style="{alignItems: 'center', position: 'absolute', zIndex: 2, left: '50%', marginLeft: -25, top: '50%', marginTop: -25}">
          <feather v-if="checkActionLoading(pauseLoading)" :onPress="statusLoading" name="pause-circle" :size="50" color="green" />
          <feather v-if="checkActionLoading(playLoading)" :onPress="statusLoading" name="play-circle" :size="50" color="green" />
        </view>
        <touchable-opacity
          :onPress="enableLoadMore"
          :onLongPress="handleAutoLoad"
          :activeOpacity="1"
          :style="{flex: 1, zIndex: 1, width: '100%'}"
        />
      </view>
      <!-- / Tap area  -->
    </view>
  </nb-container>
</template>

<script>
  import StoryContent from './story-content.vue'
  import CommentInput from './comment-input.vue'
  import { Dimensions, KeyboardAvoidingView, Platform, Animated, Easing, View, TouchableOpacity, BackHandler } from 'react-native'
  import AsyncStorage from '@react-native-community/async-storage'
  import Stamp from '../stamp'
  import { Feather } from '@expo/vector-icons'
  import { removeElementFromArray, writeLog } from '../../common/helper.js'
  import StorySeed from '../../seeds/story-content.js'
  const backgroundDefault = '../../../assets/images/default.png'
  import * as FileSystem from 'expo-file-system'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import * as LocalStoryData from '../../localstore/story.js'
  import TouchBox from './touch-box.vue'
  import React from 'react'
  import { AutoSticker } from '../../common/Config.js'
  import FastImage from 'react-native-fast-image'

  export default {
    props: [
      'info',
      'id',
      'content_story',
      'book',
      'current_story',
      'initCharacter',
      'navigation',
      'previous_route',
      'read'
    ],
    components: {
      Stamp,
      Feather,
      TouchBox,
      StoryContent,
      CommentInput,
      KeyboardAvoidingView,
      Animated,
      FastImage,
    },
    data(){
      return {
        showGuide: false,
        Platform: Platform,
        pages: [],
        continueRead: null,
        nextItem: 0,
        nextContent: 0,
        nextParagraph: 0,
        loading: false,
        showStamp: false,
        showComment: false,
        stopLoading: false,
        currentSticker: null,
        currentComment: null,
        showTouchable: true,
        isContentBox: false,
        playLoading: 'play',
        pauseLoading: 'pause',
        infoCharacter: {},
        arrayButtonLoading: [],
        story: null,
        enableAutoLoad: Function,
        checkImagePages: Object,
        backgroundStory: require(backgroundDefault),
        heightContentOffset: 0,
        scrollDown: false,
        pathFile: '',
        enableTap: false,
        touchNextChapter: false,
        firstLoad: true,
        heightTouch: 200,
        marignLastChild: 0,
        marginNextPage: 0,
        widthScreen: Dimensions.get('window').width,
        heightScreen: Dimensions.get('window').height,
        checkNextPage: 0,
        heightLast: 0,
        imageUrl: '',
        heightList: 0,
        extraData: false,
        isScroll: true,
        setOpacity: 1,
        feedBackDisplay: false,
        nextHeight: 0,
        currentPosition: 0,
        nextChapterData: null,
        flatListPadding: 0,
        testNextItem: null,
        nextItemHeight: 0,
        prepareDataFlatlist: [],
        currentIndex: 0,
        currentPadding: 0,
        doubleMessage: false,
        kb_AvoidViewStyle: {
          width: Dimensions.get('window').width, marginBottom: Platform.OS === 'ios' ? -15 : 0, alignItems: 'center', justifyContent: 'center'
        },
        kb_AvoidViewOffset: Platform.OS === 'ios' && Dimensions.get('window').height >= 812 ? 105 : 70,
        trackingTouch: null,
        timeout: 0,
        nextPageFlag: false,
        touchableActive: true,
        canTab: true,
        doublePress: false,
        timeoutDouble: null,
        timeoutNavigate: null,
      }
    },
    computed:{
      ...mapGetters({
        getStoryImage: 'stories/storyImage',
        nextChapter: 'bookDetail/nextChapter',
        getReply: 'bookDetail/getReply',
        getNextChapter: 'downloadStory/getNextChapter'
      }),
      indexCharacters() {
        let character = {}
        this.story.characters.forEach(function(object) {
          character[object['name']] = object
        })
        return this.infoCharacter = Object(character)
      },
      showImage(){
        return !!this.getStoryImage
      },
      storyImageSize(){
        let width = this.widthScreen
        let height = width * this.getStoryImage.size.height / this.getStoryImage.size.width
        if(height > this.heightList) {
          height = this.heightList
          width = height * this.getStoryImage.size.width / this.getStoryImage.size.height
        }
        return this.showImage ? {width: width, height: height} : {}
      },
      setMargin(){
        return index => {
          if(index == 0)
            return this.nextHeight + this.marignLastChild
          return 0
        }
      }
    },

    async created() {
      this.story = await this.content_story;
      this.infoCharacter = this.initCharacter

      // Setup position first load
      // this.heightTouch = (this.heightScreen / 4)
      // this.marignLastChild = this.heightTouch
      // opacity guideline
      this.opacityGuideline = new Animated.Value(1)
    },

    async mounted() {
      // await AsyncStorage.clear()

      await this.fetchPositionReading()
      this.doubleMessage = await LocalStoryData.getDataSetting('settingLine')
      // Next chapter was moved to new screen
      // this.nextChapterData = this.getNextChapter
      // await this.pushChapterToEndJson()

      await this.processData()
      this.trackingTouch = await AsyncStorage.getItem(`@TrackStoryTouch:${this.id}`)
      if(!this.trackingTouch) {
        await AsyncStorage.setItem(`@TrackStoryTouch:${this.id}`, JSON.stringify(0))
        this.trackingTouch = 0
      } else {
        this.trackingTouch = parseInt(this.trackingTouch)
      }
      data = await LocalStoryData.getDataFromLocal(`@ReadingHistory:${this.book.id}_${this.id}`)

      // if(data && data['position']) { this.trackingTouch = parseInt(data['position']) }

      // Stamp and comment were moved to new screen
      // if(data && data['sticker']) { this.currentSticker = data['sticker'] }
      // if(data && data['comment']) { this.currentComment = data['comment'] }

      this.loadMore()
      // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
      this.trackingStoryPV()
    },
    methods: {
      ...mapActions({
        updateNextReadStory: 'booksLocal/updateNextReadStory',
        removeNextReadStory: 'booksLocal/removeNextReadStory',
      }),

      goToEndStoryScreen(){
        // if(this.touchableActive) {
        //   this.touchableActive = false;
          this.updateStoryPageView();
          setTimeout(() => {
            this.touchableActive = true
            this.navigation.navigate('EndStoryScreen', {
              reloadStory: () => this.reloadStory(),
              story: this.current_story,
              book: this.book,
              nextChapterData: this.getNextChapter,
              related_books_q: this.navigation.getParam('related_books_q')
          })
          }, 2000);
        // }

      },

      reloadStory() {
        this.pages = []
        this.testNextItem = null
        this.firstLoad = true
        this.currentIndex = 0
        this.currentPadding = 0
        this.nextHeight = 0
        this.nextItemHeight = 0
        this.removeNextReadStory(this.book.id)
        this.loadMore()
      },

      disableShowGuide(isLoadMore = true) {
        if(isLoadMore)
          this.loadMore()
        Animated.timing(this.opacityGuideline, {
          toValue: 0,
          duration: 1500,
          delay: 100,
          easing: Easing.linear
          }).start(() => {

          })
        setTimeout(() => this.showGuide = false, 2000)
      },
      resetTimeout(){
        return this.timeout+=600
      },
      ...mapMutations({
        setStoryImage: 'stories/setStoryImage'
      }),
      trackingStoryPV() {
        this.axios
          .put(`/api/story_tracks/${this.id}/update_page_views`)
          .then((res) => {})
          .catch((error) => writeLog(this.axios, { event: 'tracking storypv failed', value: this.id, log_type: 'error' }))
      },
      updateStoryPageView() {
        this.axios
          .post(`/api/story_tracks/${this.id}/page_views`)
          .then((res) => {})
          .catch((error) => writeLog(this.axios, { event: 'tracking storypv failed', value: this.id, log_type: 'error' }))
      },
      async trackingTouchStory() {
        if(this.trackingTouch >= 10) return
        this.trackingTouch = this.trackingTouch + 1
        await AsyncStorage.setItem(`@TrackStoryTouch:${this.id}`, JSON.stringify(this.trackingTouch))
        if(this.trackingTouch == 10) {
          this.axios
            .put(`/api/story_tracks/${this.id}/update_times_click`)
            .then((res) => {})
            .catch((error) => writeLog(this.axios, { event: 'tracking storypv failed', value: this.id, log_type: 'error' }))
        }
      },
      handleBackButtonClick() {
        if(!!this.getStoryImage){
          this.setStoryImage('')
          return true
        }
        return this.navigation.goBack()
      },
      handleContentSize(w, h){
      },

      loadAnimated(){
        if(!this.nextPageFlag)
          return this.currentPadding + this.marignLastChild

        let height = new Animated.Value(0)
        height.addListener(({value}) => {
          if(value >= this.currentPadding + this.marignLastChild)
            this.nextPageFlag = false
        })

        Animated.timing(height, {
              toValue: this.currentPadding + this.marignLastChild,
              duration: 500
            }).start(() => {

            })
        return height
      },

      handleItemQLayoutChange(event) {
        if(event.nativeEvent.layout.height >= this.currentPadding + this.marignLastChild){
            this.canTab = true
        }else{
            this.canTab = true
        }
      },

      renderItemQ() {
        if(this.showStamp) {
          this.marignLastChild = 0
        }
        return (
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={() => this.handleAutoLoad()}
            onPress={() => this.enableLoadMore()}>
            <Animated.View style={{ height: this.loadAnimated() }} onLayout={(event) => this.handleItemQLayoutChange(event)  } >
            </Animated.View>
          </TouchableOpacity>
        );
      },


      settingContent(page, content, paragraph, isNextPage){
        let contentStore = {}

        // handle page
        this.handleNextPage(page, isNextPage)
        contentStore.box = this.handleBox(page)

        // handle content
        if (content.character)
          contentStore.character = content.character
        if (content.boxcolor)
          contentStore.boxcolor = content.boxcolor
        if (content.textColor)
          contentStore.textColor = content.textColor

        contentStore.imagebackground = page.image
        if(content.nextChapter)
          contentStore.nextChapter = content.nextChapter
        contentStore.paragraph = paragraph.replace(/(<br>|<\/br>)/g, "<br> </br>")

        return contentStore
      },

      async processData(){
        for(let i = 0; i < this.story.pages.length; i++){
          for(let c = 0; c < this.story.pages[i].content.length; c++){
            for(let p = 0; p < this.story.pages[i].content[c].paragraph.length; p++){
              let isNextPage = c == 0 && p == 0

              result = this.settingContent(this.story.pages[i], this.story.pages[i].content[c], this.story.pages[i].content[c].paragraph[p], isNextPage)

              // Check next page
              if(isNextPage) {
                this.prepareDataFlatlist.push({ body: result, next_page: true })
              }else {
                this.prepareDataFlatlist.push({ body: result, next_page: false })
              }
            } // for 3
          } // for 2
        } // for 1

        if(this.doubleMessage){
          let dataFlatlist = []
          let flag = false
          for(let i = 0; i < this.prepareDataFlatlist.length; i++){
            let row = this.prepareDataFlatlist[i]
            if(row.body.box){
              let last = dataFlatlist[dataFlatlist.length - 1]
              if(flag && !row.next_page && row.body.character == last.body.character && !row.body.paragraph.includes('<img') && !last.body.paragraph.includes('<img')) {
                last.body.paragraph = last.body.paragraph + "<p>&nbsp;</p>" + row.body.paragraph
                last.groupIndex.push(i)
                flag = false
              } else {
                row.groupIndex = [i]
                dataFlatlist.push(row)
                flag = true
              }
            }else {
              dataFlatlist.push(row)
            }

            // RESET this.currentIndex without double message
            if(i == this.currentIndex) {
              this.currentIndex =  dataFlatlist.length - 1
            }
          }

          this.prepareDataFlatlist = dataFlatlist
        }
      },

      onUserScroll() {
        // stop autoLoading
        this.isScroll = false
        this.stopLoading = true
        if (this.checkActionLoading(this.pauseLoading)) {
          this.stopAutoLoad()
        }
      },
      handleViewableItemsChanged(info) {
        if (info.viewableItems.length > 0) {
          let image = info.viewableItems[info.viewableItems.length - 1]
          // if(info.viewableItems.length > 1)
          //   image = info.viewableItems[info.viewableItems.length - 2]

          if(this.imageUrl != image['item']['imagebackground'] && !this.nextPageFlag)
            this.imageUrl = image['item']['imagebackground']
          // let temp = this.pages.length - ( this.prepareDataFlatlist.length - 4 )
          // if(temp > 0)
          //   if(parseInt(info.viewableItems[0]['index']) < temp)
          //     this.imageUrl = this.prepareDataFlatlist[this.prepareDataFlatlist.length - 4]['body']['imagebackground']
        }
      },
      goToNextChapter() {
        const next = this.nextChapterData
        if(next.type == 'book') {
          this.navigation.navigate('BookDetail', {id: next.id})
        } else {
          this.navigation.navigate('Story', { story: next, book: this.book })
        }
      },

      findNextItem() {
        if(this.currentIndex < this.prepareDataFlatlist.length)
          this.testNextItem = this.prepareDataFlatlist[this.currentIndex]
      },

      pushToFlatlist(){
        if(this.testNextItem && !this.nextPageFlag){
          this.pages.unshift(this.testNextItem.body)
          if(this.pages.length > 1){

            if(this.testNextItem.next_page){

              if(!this.testNextItem.body.nextChapter){
                if(!this.firstLoad)
                  this.nextPageFlag = true
                this.currentPadding = this.heightList - this.marignLastChild
              }
            }

            if(this.currentPadding > 0)
              this.currentPadding = this.currentPadding - this.nextItemHeight

            if(this.currentPadding <= 0)
              this.currentPadding = 0

            if(this.firstLoad) {
              this.currentPadding = 0
            }
          }
        }

        this.currentIndex++
      },

      async loadMore() {
        // Save history on tap
        // Data structure: {position: currentIndex}

        if (this.stopLoading) {
          clearInterval(this.enableAutoLoad)
          this.stopLoading = false
          this.loading = false
          let arrayButton = this.arrayButtonLoading
          if (arrayButton.includes(this.pauseLoading)) {
            arrayButton.splice(arrayButton.indexOf(this.pauseLoading),1)
            arrayButton.push(this.playLoading)
          }
        }
        // Load story first time. Try to remember reading history
        // case: story row deleted and not found index stored
        // using condition: this.nextItem < this.story.pages.length
        if(this.firstLoad){
          await this.loadDataFromReadingHistory()
          this.currentPadding = 0

          // First load with double message
          if(this.doubleMessage && this.testNextItem.body.box){
            this.savePositionReading({position: this.testNextItem.groupIndex[this.testNextItem.groupIndex.length - 1]})
          }

          this.firstLoad = false
        }else{
          // Tracking Touch story to 10
           this.trackingTouchStory()
          // Load story from second time with tap on screen
          if(this.currentIndex < this.prepareDataFlatlist.length){
            await this.pushToFlatlist()

            this.findNextItem()

            let currIndex = this.doubleMessage && this.testNextItem.body.box ? this.testNextItem.groupIndex[this.testNextItem.groupIndex.length - 1] : this.currentIndex

            this.savePositionReading({position: currIndex})
          }else{
            clearInterval(this.enableAutoLoad)
            this.loading = false
            // this.showTouchable = await false
            this.arrayButtonLoading = []
            if(this.touchableActive){              
              this.touchableActive = false;
              setTimeout(() => {
              // Update next read story
              if (this.getNextChapter.type == 'story') {
                this.updateNextReadStory({ id: this.getNextChapter['id'], title: this.getNextChapter['title'] })
              }              
              this.goToEndStoryScreen()
            }, 100);
            }
            
          }
        }

      },

      handleNextPage(contentPages, isNextChapter) {
        if (isNextChapter) {
          this.checkImagePages = contentPages
        }
      },
      handleBox(contentPages) {
        return this.isContentBox = (contentPages.style == 'box') ? true : false
      },
      handleImageBackground(){
        if (this.imageUrl) {
          let path_file = `books/${this.book.id}/stories/${this.id}${this.imageUrl}`
          return {uri: `${FileSystem.documentDirectory}${path_file}`}
        }
      },
      handleAutoLoad() {
        let self = this
        if (self.loading)
          return true

        self.loading = true
        removeElementFromArray(this.arrayButtonLoading, this.playLoading)
        self.arrayButtonLoading.push(self.pauseLoading)
        self.enableAutoLoad = setInterval(function() {
          if (self.nextItem != self.story.pages.length) {
            self.loadMore()
          }
        }, 2000)
      },
      async displaySticker(uri) {
        this.currentSticker = uri
        // post stamp to server if success then show stamp
        this.pages.unshift({
          'character': null,
          'box': false,
          'stamp': true,
          'nextChapter': true,
          'paragraph': null,
          'uri': uri
        })
        this.showStamp = false
        await new Promise(r => setTimeout(r, 1000))

        setTimeout( () => this.showStamp09(), this.resetTimeout())


        if (this.getNextChapter.type == 'book') {
          this.showComment = true
        }
        // Save sticker to locastore
        LocalStoryData.saveDataLocal(`@ReadingHistory:${this.book.id}_${this.id}`, {sticker: uri})
      },
      async displayComment(content) {
        this.pages.unshift({
          'character': 'readerUser',
          'paragraph': content
        })
        this.showComment = false
        // // Save sticker to locastore
        LocalStoryData.saveDataLocal(`@ReadingHistory:${this.book.id}_${this.id}`, {comment: content})
        await new Promise(r => setTimeout(r, 1000))
        setTimeout( () => this.showStamp09(), this.resetTimeout())
        await new Promise(r => setTimeout(r, 2000))
        setTimeout( () => this.showReply(), this.resetTimeout())
      },
      displayNextChapter() {
        // const chapter = this.nextChapter(this.id)
        const chapter = this.getNextChapter
        const src = (chapter.type == 'book') ? chapter.image_url.url : chapter.cover.url
        setTimeout( () => {
          this.pages.push({
            "box": false,
            "character": null,
            "nextChapter": this.getNextChapter,
            "uri": src,
            'paragraph': chapter.title,
            'navigation': this.navigation,
            'book': this.book
          })
        }
        , 1000)
      },
      stopAutoLoad() {
        this.stopLoading = true
        removeElementFromArray(this.arrayButtonLoading, this.playLoading)
        if (this.stopLoading == true && this.showTouchable) {
          this.loadMore()
        }
      },

      enableLoadMore() {
        if(!this.canTab){
          return
        }

        this.canTab = false
        if(this.nextPageFlag){
          return
        }

        if(this.showGuide)
          this.disableShowGuide(false)
        this.stopLoading = true
        removeElementFromArray(this.arrayButtonLoading, this.playLoading)
        if(!this.showTouchable) { return }
        this.loadMore()
        // 35: height of header + statusbar
        screen = Dimensions.get('window').height - (this.heightTouch + 35)
        if(this.nextItemHeight > screen) {
          offset = this.nextItemHeight - screen
          this.$refs.scrollView.scrollToOffset({animated: false, offset: offset })
          return
        }

        if(this.currentIndex < this.prepareDataFlatlist.length) {
          this.$refs.scrollView.scrollToIndex({ animated: true, index: 0 })
        }
      },

      statusLoading() {
        if (this.arrayButtonLoading.includes(this.playLoading)) {
          this.handleAutoLoad()
        }
        else {
          this.stopLoading = true
          this.loadMore()
        }
      },
      setHeightList(event) {
        this.heightList = event.nativeEvent.layout.height
      },
      handleLayoutChange1(event){
        this.nextItemHeight = event.nativeEvent.layout.height
      },

      handleLayoutChange(event, index) {
        if (index == 0) {
          if(this.pages.length == 1) {

            newAddItemHeight = event.nativeEvent.layout.height

            this.nextHeight = this.heightList -  newAddItemHeight - this.marignLastChild
          }
        }
      },
      checkActionLoading(action) {
        return this.arrayButtonLoading.includes(action)
      },

      heightTouchEvent(event) {
        if (event.nativeEvent.layout.height > 0) {
          this.heightTouch = event.nativeEvent.layout.height
          this.marignLastChild = this.heightTouch
        }
      },

      async loadDataFromReadingHistory(){
        if(this.currentIndex > this.prepareDataFlatlist.length) {
          this.currentIndex = this.prepareDataFlatlist.length
        }

        lastIndex = this.currentIndex
        this.currentIndex = 0

        await this.findNextItem()


        while(this.currentIndex < lastIndex ){
          this.pushToFlatlist()
          this.findNextItem()
        }

         if(this.pages.length == 0) {
            await this.pushToFlatlist()
            this.findNextItem()
         }

        // Feedback was moved to new screen
        // if(this.currentIndex >= this.prepareDataFlatlist.length) {
        //    this.showTouchable = false
        //    this.showFeedBack()
        // }
      },

      // Data structure: {position: this.currentIndex}
      async savePositionReading(position){
        try{
          await AsyncStorage.mergeItem(`@ReadingHistory:${this.book.id}_${this.id}`, JSON.stringify(position))
        } catch(error){
          writeLog(this.axios, { event: 'savePositionReading', value: error, log_type: 'error' })
        }
      },

       // Data structure: {position: this.currentIndex}
      async fetchPositionReading(){
        try{
          value = await AsyncStorage.getItem(`@ReadingHistory:${this.book.id}_${this.id}`)

          if (value !== null && JSON.parse(value)) {
            this.showGuide = false
            value = JSON.parse(value)['position']

            if(typeof value == 'number')
              return this.currentIndex = value

            return this.currentIndex = 0
          } else {
            // Show Guideline
            this.showGuide = true
          }

        } catch(error){
          await AsyncStorage.setItem(`@ReadingHistory:${this.book.id}_${this.id}`, JSON.stringify({}))
          writeLog(this.axios, { event: 'fetchPositionReading', value: error, log_type: 'error' })
        }
      },

      async showReply() {
        // const character = this.getFirstCharacterName() ? this.getFirstCharacterName() : Object.keys(this.infoCharacter)[1]
        reply = this.getReply ? this.getReply : 'コメントありがとう！'
        this.pages.unshift({
          "character": '08',
          'paragraph': reply, // DO NOT remove array
        })
        await new Promise(r => setTimeout(r, 1000))
        setTimeout( () => this.showStamp11(), this.resetTimeout())
      },

      showStamp09() {
        this.pages.unshift({
          'character': null,
          'box': false,
          'stamp': true,
          'auto_stamp': true,
          'paragraph': [],
          'nextChapter': true,
          'uri': AutoSticker['stamp_9']['static']
        })
      },

      showStamp11() {
        this.pages.unshift({
          'character': null,
          'box': false,
          'stamp': true,
          'auto_stamp': true,
          'paragraph': [],
          'nextChapter': true,
          'uri': AutoSticker['stamp_11']['static']
        })
      },

      async expendCommentToPage(){
        if(this.currentComment) {
          this.pages.unshift({
            'character': 'readerUser',
            'paragraph': this.currentComment
          })

          await this.showStamp09()
          this.showReply()
        }
      },

      async expendStickerToPage(){

        if(this.currentSticker) {
          this.testNextItem =  {
            body: {
              'character': null,
              'box': false,
              'stamp': true,
              'nextChapter': true,
              'paragraph': null,
              'uri': this.currentSticker,
            }
          }
        }

        await this.pushToFlatlist()
        this.showStamp09()
      },

      showFeedBack(){
        // this.$refs.scrollView.scrollToEnd({ animated: true })
        setTimeout( () => {
          if (this.getNextChapter.type != 'book'){
            if(this.currentSticker != null){
              this.showStamp = false
              this.expendStickerToPage()
            } else {
              this.marignLastChild = 0
              this.currentPadding = 0
              this.showStamp = true
            }
          }

          // show comment
          setTimeout( () => {
            if(this.currentComment){
              this.showComment = false
              this.expendCommentToPage()
            }else{
              if (this.getNextChapter.type == 'book' && !this.showStamp) {
                this.showComment = true
              }
            }
          }, 500)
          this.feedBackDisplay = true
        }, 500)

      },
      getFirstCharacterName() {
        let resWithOutAvatar = ''
        let resWithAvatar = ''
        Object.keys(this.infoCharacter).forEach(name => {
          if(this.infoCharacter[name]['position'] === 'left' && name != 'readerUser') {
            if(this.infoCharacter[name]['avatar']) {
              resWithAvatar = name
            } else {
              resWithOutAvatar = name
            }
          }
        })
        return resWithAvatar ? resWithAvatar : resWithOutAvatar
      },

      pushBotCharacter() {
        this.infoCharacter['07'] = {
          avatar: require('../../../assets/auto-stamp/07.png'),
          name: "07",
          namecolor: "#FFC1C1",
          localImage: true
        }

        this.infoCharacter['08'] = {
          avatar: require('../../../assets/auto-stamp/08.png'),
          name: "08",
          namecolor: "#FFC1C1",
          localImage: true
        }
      },

      pushChapterToEndJson() {
        this.pushBotCharacter()

        const chapter = this.nextChapterData
        let paragraph2 = null

        chapterData = {
          chapter: chapter,
          book: this.book,
          navigation: this.navigation,
          id: this.id
        }
        // message welcome
        welcome_message = []

        if (chapter.type !== 'book') {
          // End of chapter
          welcome_message.push({
            "character": '08',
            'paragraph': ['次の話はこちら↓↓↓'],
          })

          paragraph2 = ['スタンプを押して作者を応援してね！']

        } else {
          // End of story
          welcome_message.push({
            "character": '07',
            'paragraph': ['最後まで読んでくれてありがとう♪ よかったら下の入力欄から作者への応援コメントを送ってね！'],
          })

           welcome_message.push({
            "character": '08',
            'paragraph': ['次はこの作品がオススメ！'],
          })
        }

        this.story.pages.push({
          content: welcome_message
        })

        chapter_content = [
          {
            "character": '08',
            'paragraph': ['aa'], // DO NOT remove array
            "nextChapter": chapterData,
          },
        ]

        if(paragraph2)
          chapter_content.push({
            "character": '07',
            'paragraph': paragraph2,
          })

        this.story.pages.push({
          content: chapter_content
        })
      }
    }
  };
</script>
<style>
.box-tab-content{
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>

