<template>
  <!-- <scroll-view :style="{ flex: 1 }"
  :on-scroll="({nativeEvent}) => storyTracks(nativeEvent)"
  > -->
    <flat-list
      :data="images"
      :render-item="(item) => renderList(item)"      
      :showsVerticalScrollIndicator="false"
      :onEndReached="
        () => {
          loadMorePage();
        }
      "      
      :scrollEventThrottle="200"
      :on-end-reached-threshold="2"
      :ListFooterComponent="() => endStoryComponet()"
    />
  <!-- </scroll-view> -->
</template>
<script>
import React, { useRef } from "react";
import EndStory from "./end-story.vue";
import FullWidthImage from "react-native-fullwidth-image";
import { FlatList, Text, Image, ActivityIndicator, View } from "react-native";
import { mapGetters } from "vuex";
export default {
  props: [
    "relatedBooks",
    "propsCheck",
    "navigation",
    "getNextChapter",
    "book",
    "currentStory",
    "reloadStory",
  ],
  components: { FlatList, Text, Image, ActivityIndicator },
  data() {
    return {
      images: [],
      isLoading: true,
      index: 20,
      isDone: false,
      // flatlistRef: useRef(),
      scroll: React.createRef(),
      rendedItemIndex: 0,
      checkReaded: false,
    };
  },
  created() {    
    this.images = this.getImagesWebtoon.slice(0, 20);    
  },
  computed: {
    ...mapGetters({
      getImagesWebtoon: "downloadStory/getImagesWebtoon",
    }),
  },
  methods: {
    renderList: function (item) {            
      this.rendedItemIndex = item.index;
      return (
        <FullWidthImage
          style={{ width: "100%", marginTop:-1 }}
          source={{
            uri: item.item.url,
          }}
        />
      );
    },
    loadMorePage: function () {
      if (this.images.length >= this.getImagesWebtoon.length) {
        this.isDone = true;
      }
      // console.log(this.images.length)
      if (this.images.length >= (this.getImagesWebtoon.length/2)) {                
        this.storyTracks(); //if read 20 page track readed story. 
      }
      this.isLoading=true;      
      if (this.isLoading && !this.isDone) {
        setTimeout(() => {          
          let dataMore = this.getImagesWebtoon.slice(
            this.index,
            this.index + 20
          );
          this.index += 20;          
          this.images = this.images.concat(dataMore);
          this.isLoading = false;
        }, 200);
      }
    },    
    storyTracks: function(){      
      if (!this.checkReaded){        
           this.axios
          .put(`/api/story_tracks/${this.currentStory.id}/update_times_click`)
          .then((res) => {})
          .catch((error) => writeLog(this.axios, { event: 'tracking storypv failed', value: this.id, log_type: 'error' }))
          
          //change value checkReaded , only counted once 
          this.checkReaded= true;
      }
    },
    
    endStoryComponet: function () {
      if (this.images.length > (this.getImagesWebtoon.length/2)) {
        return (          
            <EndStory
              // reloadStory: () => this.reloadStory(),
              story={this.currentStory}
              book={this.book}
              getNextChapter={this.getNextChapter}
              relatedBooks={this.relatedBooks}
              navigation={this.navigation}
            />          
        );
      } else{
          return (<View style={{height:200, marginTop:50}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View> )
      }
       
    },
  },
};
</script>
<style>
.text-container: {
  flex: 1;
  margin-bottom: 30;
}
</style>
