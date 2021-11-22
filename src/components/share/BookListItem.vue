<template>
  <view v-if="data.books && data.books.length > 0" :style=" !isRelatedSection ? { marginBottom: 15} : {marginBottom: 10}">
    <view :style="{marginTop: 8}">
      <view :style="{backgroundColor: '#19448e', width: 2, height: titleHeight, position: 'absolute', left: 15, top: titlePadding}"></view>
      <text :style="titleStyle">{{ getSectionTitle() }}</text>
    </view>
    <view :style="{paddingLeft: 15, paddingTop: 10, paddingBottom: 10, backgroundColor: '#fff'}">
      <flat-list
        :data="flatlistData"
        :horizontal=true
        :showsHorizontalScrollIndicator=false
        :keyExtractor="(item, index) => item.book.id.toString()"
      >
         <view render-prop-fn="renderItem">
          <book-item
            :isSmall="isSmall"
            :navigation="navigation"
            :height="height"
            :width="width"
            :size="data.size"
            :item="args.item"
            :isHistory="isHistory"
            :showBookInfo="showBookInfo"
            :backBehavior="backBehavior"
            :subscriptions="subscriptions"
            :isPremium="isPremium"
          />
        </view>
      </flat-list>
    </view>
  </view>
</template>

<script>
import BookItem from './BookItem.vue'
import { Platform } from 'react-native'

const lineHeight = 32
const titleHeight = (Platform.OS === 'ios') ? 16 : 14
const titlePadding = (lineHeight - titleHeight) / 2

export default {
  components: {BookItem},
  mounted() {
    // NOTE: Please place this component inside (scroll-view component/scrollable) view or flatlist will be not rendered
    // ex: <scroll-view> <book-list-item />  </scroll-view>
    this.flatlistData = this.data.books
  },
  data() {
    return {
      isSmall: this.data.size == 'small',
      height: (this.data.size == 'small') ? '162' : '244',
      width: (this.data.size == 'small') ? '111' : '162',
      titlePadding,
      flatlistData: null,
      titleHeight,
      titleStyle: {
        fontSize: titleHeight,
        fontWeight: 'bold',
        paddingLeft: 20,
        lineHeight: lineHeight,
        height: lineHeight
      }
    }
  },
  watch: {
    data(newData, oldData) {
      this.flatlistData = newData.books
    }
  },
  props: {
    data: Object,
    styleData: Object,
    navigation: Object,
    isRelatedSection: Boolean,
    isHistory: {
      type: Boolean,
      default: false
    },
    sectionTitle: String,
    showBookInfo: {
      type: Boolean,
      default: true
    },
    backBehavior: String,
    subscriptions: Array, 
    isPremium: Boolean
  },

  methods: {
    getSectionTitle() {
      if(this.sectionTitle) { return this.sectionTitle }
      return this.isRelatedSection ? '関連作品' : this.data.name
    },
  }
};

</script>

<style>
</style>
