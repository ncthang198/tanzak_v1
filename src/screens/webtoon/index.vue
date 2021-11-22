<template>
  <nb-container>
    <header-image-webtoon
      :navigation="navigation"
      :goBack="true"
      :overflow="true"
      iconBack="close"
      otherIcon="shareWhite"
      :storyDetail="book"
      :currentStory="currentStory"
      :fromWebtoon="true"
    />    
    <loading v-if="!isStoryLoaded" />
    <webtoon  
    v-if="isStoryLoaded"
    :relatedBooks="related_books"
    :navigation="navigation"    
    :getNextChapter="getNextChapter"
    :book="book"
    :currentStory="currentStory"
    />
  </nb-container>
</template>
<script>
import Story from "../../components/story";
import Webtoon from "../../components/webtoon";
import Loading from "../../components/share/LoadingScreen.vue";
import { mapGetters, mapActions } from "vuex";
import { Dimensions, Platform } from "react-native";
import btnClose from "../../../assets/images/close.png";
import btnUp from "../../../assets/images/up.png";
import backgroundHeader from "../../../assets/images/header.png";
import ShareApp from "../../components/share/ShareApp.vue";
import HeaderImageWebtoon from "../../components/share/HeaderImageWebtoon.vue";
import * as LocalStoryData from "../../localstore/story.js";

export default {
  props: ["navigation"],
  components: { ShareApp, Loading, HeaderImageWebtoon, Webtoon },
  data() {
    return {
      currentStory: null,
      book: null,
      stories: null,
      related_books: {},
      widthScreen: Dimensions.get("window").width,
      heightTop: Platform.OS === "android" ? 50 : 45,
      closeMargin: Platform.OS === "android" ? 0 : 2,
      headerMargin: Platform.OS === "android" ? -4 : -10,
      btnclose: btnClose,
      btnup: btnUp,
      header: backgroundHeader,
      parent_getStoryContentJSON: null,
      parent_getInfoCharacter: null,
      loadChild: false,
      previous_route: null,
      read: null,      
    };
  },

  created() {
    this.book = this.navigation.getParam("book");
    this.currentStory = this.navigation.getParam("story");    
    this.related_books = this.navigation.getParam("related_books_q");    

    this.clearStory();    
    this.fetchStory({ id: this.currentStory.id, navigation: this.navigation });
    this.previous_route = this.navigation.getParam("previous_route");
    this.read = this.navigation.getParam("read");
    this.id= this.currentStory.id;
    //alert(this.currentStory.id);
  },
  async mounted() {
    let num = await LocalStoryData.getDataFromLocal("@NumReading");
    if (num === null) {
      num = 1;
    } else {
      num = num + 1;
    }
    
    await LocalStoryData.saveDataSetting("@NumReading", num);
    this.update_page_views();
  },
  watch: {
    isStoryLoaded(newVal, oldVal) {
      if (newVal && !this.loadChild) {
        this.parent_getStoryContentJSON = this.getStoryContentJSON;
        this.parent_getInfoCharacter = this.getInfoCharacter;
        this.loadChild = true;
        let read_story = null;

        if (this.currentStory.type !== "free") {
          data = LocalStoryData.getDataFromLocal(
            `@ReadingHistory:${this.currentStory.book_id}_${this.currentStory.id}`
          );

          data.then(function (value) {
            read_story = value;
          });

          if (read_story == null && this.read == null) {
            this.buyStory(this.currentStory);
          }
        }
      }
    },
  },

  computed: {
    ...mapGetters({
      getStoryContentJSON: "downloadStory/getContentStoryJSON",
      isStoryLoaded: "downloadStory/getStatus",
      getInfoCharacter: "downloadStory/getInfoCharacter",
      getError: "downloadStory/getError",
      getNextChapter: "downloadStory/getNextChapter",
      findStories: "booksLocal/findStories",
    }),
    setHeightTop() {
      return Platform.OS === "android" ? null : { height: 100 };
    },
  },
  methods: {
    ...mapActions({
      fetchStory: "downloadStory/fetchStory",
      clearStory: "downloadStory/clearStory",
      buyStory: "bookDetail/buyStory",
    }),
   async update_page_views(){
  

      this.axios
          .put(`/api/story_tracks/${this.currentStory.id}/update_page_views`)
          .then((res) => {})
          .catch((error) => writeLog(this.axios, { event: 'tracking storypv failed', value: this.id, log_type: 'error' }))

      },
    clearStoryAndGoback() {
      this.navigation.goBack();
    },
  },
};
</script>

<style>
.text_header {
  color: #fff;
}
</style>
