import axios from 'axios';
import { ParseAuthorData, writeLog } from '../../../src/common/helper.js';

// initial state
const state = {
  books: {},
  book: null,
  authors: null,
  tags: null,
  stories: null,
  sections: null,
  book_images: null,
  currentStory: null,
  relatedBooks: {},
  storiesTime: {},
  storyHistories: {},
  reply: null,
  favorited: false
}

// getters
const getters = {
  getBook: state => state.book,
  checkTimeLeft: state => story => {
    try {
      if(state.storyHistories[story.book_id].length > 0) {
        return state.storyHistories[story.book_id].filter(item => {
          id = item.cover ? item.id : item.story_id
          return id == story.id
        })[0]
      }
    }catch(err){
      writeLog(axios, { event: 'checkTimeLeft', value: err, log_type: 'error' })
      return false
    }
  },
  getPathFile: state => {
    if(state.currentStory)
      return`books/${state.book.id}/stories/${state.currentStory.id}`
  },
  getRelatedBooks: state => {
    const books = []
    state.relatedBooks.forEach((book) => {
      books.push({'book': book})
    })
    return {'books': books, 'size': 'small'}
  },
  isHaveRelatedBooks: state => {
    return state.relatedBooks && state.relatedBooks.length > 0
  },
  getReply: state => state.reply,
  getBookImages: state => state.book_images,
  getBookImage: state => state.book.image_url.url,
  getTags: state => state.tags,
  getAuthors: state => state.authors,
  getStories: state => state.stories,
  getTotalStories: state => state.book.total_stories,
  getSections: state => state.sections,
  findStory: state => id => state.stories.filter(story => story.id === id)[0],
  nextChapter: state => {
    return id => {
      let nextChapter = null
      const index = state.stories.findIndex(story => story.id === id)
      if (state.stories[index + 1]) {
        nextChapter = {...state.stories[index + 1], type: 'story'}
      } else {
        nextChapter = {...state.relatedBooks[0], type: 'book'}
      }
      return nextChapter
    }
  },
  getFirstStory: state => state.stories[0],
  getAuthorsWrittersFormat: state => {
    return ParseAuthorData(state.authors)
  },
  getSectionWithStory: state => {
    let _sections = state.sections
    let sectionData = []
    if(_sections.length == 0) {
      sectionData.push(
        {
          'stories': state.stories
        }
      )
    } else {
      _sections.forEach((item, key) => {
        let section = {}
        let stories = []
        section['name'] = item.title
        state.stories.forEach((story, key) => {
          if (story.section_id == item.before){
            stories.push(story)
          }
        })
        section['stories'] = stories
        sectionData.push(section)
      })
    }
    return sectionData
  },
  bookFavorited :state => state.favorited
}

// actions
const actions = {
  async initBook({commit}, book_id) {
   return new Promise((resolve, reject) => {
    // axios.get(`/api/books/${506}`).then(({data: res}) => {
    axios.get(`/api/books/${book_id}`).then(({data: res}) => {
      // Check book unpublish
      if(Object.keys(res.data).length === 0 && res.data.constructor === Object) {
        resolve(res.results)
      } else {
        commit('initBook', res.data)
        commit('setReply', res.data.reply)
        resolve(res.data)
      }
    })
   })
  },
  closeOldScreen({commit}) {
    commit('loading')
  },
  buyStory({commit, dispatch}, story) {
    axios.post(`/api/stories/${story.id}/purchase`,{ paid_coin: story.coin }).then(({data: res}) => {
      writeLog(axios, { event: 'buyStory', value: story.id + '=====' + story.coin, log_type: 'info' })
      commit('setCountDownStory', res.data)
      dispatch('user/decrementCoin', story.coin, {root: true})
    }).catch(error => {
    })
  },
  watchVideos({commit}, story) {
    axios.post('/api/story_histories',{story_id: story.id, coin_from: 2, book_id: story.book_id})
      .then(({data: res}) => {
        commit('setCountDownStory', res.data)
      })
      .catch(error => {
        console.log('src/store/modules/book-detail.js watchVideos', error)
      })
  },
  updateFavorite({commit}, isFavorited){
    commit('updateFavorite', isFavorited)
  }
}

// mutations
const mutations = {
  initBook (state, {related_books, authors, book, book_images, sections, stories, tags, favorited}) {
    state.book = book
    state.authors = authors
    state.book_images = book_images
    state.sections = sections
    state.stories = stories
    state.tags = tags
    state.relatedBooks = related_books
    state.favorited = favorited
  },
  setReply (state, reply) {
    state.reply = reply
  },
  removeStoryHistory(state, story) {
    if(!story) return
    removeStory = state.storyHistories[story.book_id]
    idx = removeStory.findIndex(item => {
      id = null
      id = item.cover ? item.id : item.story_id
      return id === story.id
    })
    removeStory.splice(idx, 1);
    book = {}
    book[story.book_id] = removeStory
    state.storyHistories = {...state.storyHistories, ...book}
  },
  setStoryHistories(state, {bookId, storyHistories}) {
    state.storyHistories[bookId] = storyHistories
  },
  loading (state) {
    state.isLoading = true
  },
  setCurrentStory (state, story) {
    state.currentStory = story
  },
  setCountDownStory(state, story) {
    item = state.storyHistories[story.book_id]
    newItem = [...item]
    newItem.push(story)
    book = {}
    book[story.book_id] = newItem
    state.storyHistories = {...state.storyHistories, ...book}
  },
  updateFavorite(state, isFavorited) {
    state.favorited = isFavorited
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
