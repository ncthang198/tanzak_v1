<template>
  <view :style="{marginTop: 5, backgroundColor: '#fff'}">
    <view :style="{ borderBottomWidth: 1, borderBottomColor: '#e1e1e1', borderTopColor: '#e1e1e1'}" >
      <nb-text :style="{fontWeight: 'bold', paddingVertical: 10, paddingLeft: 15}">
        全{{ book.total_stories }}話
      </nb-text>
    </view>
    <view v-for="(section, index) in getSectionWithStory()">
      <view v-if="section.name != null">
        <nb-text :style="styleSection">
          {{ section.name }}
        </nb-text>
      </view>
      <view v-for="(story, index) in section.stories" >
        <story-item
          :isRead="readStoriesData.indexOf(story.id) > -1"
          :style="index == 0 ? { borderTopWidth: 1, borderTopColor: '#ccc'} : ''"
          :navigation="navigation"
          :imageUrl="book.image_url.url"
          :book="book"
          :goToStory="goToStory"
          v-if="readStoriesData"
          :story="story"
          :isUserPremium="isUserPremium" />
      </view>
    </view>
  </view>
</template>

<script>
import StoryItem from "./story-item.vue"

export default {
  props: ['readStoriesList', 'goToStory', 'stories', 'navigation', 'sections', 'book', 'isUserPremium'],
  components: {
    StoryItem
  },
  data() {
    return {
      styleSection: {
        fontSize: 17,
        paddingVertical: 5,
        paddingBottom: 2.5,
        backgroundColor: '#DDDDDD',
        paddingLeft: 15,
        fontWeight: 'bold',
      },
      readStoriesData: null,
      readStoriesDataLoaded: false
    }
  },
  methods: {
    getSectionWithStory() {
      let _sections = this.sections
      let sectionData = []
      if(_sections.length == 0) {
        sectionData.push(
          {
            'stories': this.stories
          }
        )
      } else {
        _sections.forEach((item, key) => {
          let section = {}
          let stories = []
          section['name'] = item.title
          this.stories.forEach((story, key) => {
            if (story.section_id == item.before){
              stories.push(story)
            }
          })
          section['stories'] = stories
          sectionData.push(section)
        })
      }
      return sectionData
    }
  },
  watch: {
    readStoriesList(newVal, oldVal) {
      if(!this.readStoriesDataLoaded) {
        this.readStoriesData = newVal
        this.readStoriesDataLoaded = true
      }
    }
  },
  mounted() {
    this.readStoriesData = this.readStoriesList
  },
}
</script>

