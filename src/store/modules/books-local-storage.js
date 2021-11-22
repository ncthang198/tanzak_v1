import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios';
import Constant from '../../common/Constant.js';
import { writeLog } from '../../../src/common/helper.js';

// initial state
const state = {
  books: null,
  currentBook: null,
  isLoading: true,
  currentBookId: null,
  isRefresh: false,
  favoriteBooksSection: {
    books: [],
    name: 'お気に入り',
    size: 'small'
  }
}

// getters
const getters = {
  getBooksLocal: state => state.books,
  getStatus: state => {
    return state.isLoading
  },
  needToRefresh: state => {
    return state.isRefresh
  },
  findStories: ({books, currentBookId}) => (storyId, bookId=null) => {
    book_id = bookId ? bookId : currentBookId
    if(books[book_id] && books[book_id].readStories)
      return books[book_id].readStories.indexOf(storyId)
    return -1
  },
  getStories: ({books}) => {
    return bookId => {
      if(books[bookId])
        return books[bookId].readStories
      else
        return []
    }
  },
  lastReadStory: ({books}) => {    
    return bookId => {
      if(books[bookId])
        return books[bookId].lastReadStory
      else
        return {
          'id': null,
          'title': null
        }
    }
  },
  nextReadStory: ({ books}) =>  {
    return bookId => {
      if(books[bookId]) {
        return books[bookId].nextReadStory
      }
      else
        return {
          'id': null,
          'title': null
        }
    }
  },
  currentReadingSection: ({books}) => {
    try {
      let section = {}
      section['books'] = []
      section['name'] = '続きを読む'
      section['size'] = 'small'            
      if(books) {
        Object.keys(books).forEach(function(key) {
          if(!books[key].isDone) {
            let timeNow = new Date().getTime()
            let timecreatedAt = new Date(books[key].createdAt).getTime()
            let timeCount = timeNow - timecreatedAt
            if (timeCount <= Constant.timeSevenDay) {
              section['books'].push({
                'book': {
                  id: key,
                  title: books[key].title,
                  image_url: books[key].image_url,
                  image_dimensions: books[key].image_dimensions,
                  catch_copy: books[key].catch_copy,
                  createdAt: books[key].createdAt
                }
              })
            }
          }
        });
      }
      sortByCreatedAt = section['books'].slice(0)
      sortByCreatedAt.sort(function(a,b) {
        timeA = (new Date(a.book.createdAt)).getTime()
        timeB = (new Date(b.book.createdAt)).getTime()
        return timeB - timeA;
      });
      section['books'] = sortByCreatedAt.slice(0, 30) // limited 30 books
      return section
    } catch(error) {
      writeLog(axios, { event: 'checkTimeLeft', value: error, log_type: 'error' })
      AsyncStorage.removeItem('readBooks')
    }
  },

  favoriteBooksSection: state => state.favoriteBooksSection
}

// actions
const actions = {
  async initBooks({commit}) {
    let allBooks = await AsyncStorage.getItem('readBooks')
    if(allBooks) {
      allBooks = JSON.parse(allBooks)
      commit('initBooks', allBooks)
      commit('loadingDone')
    } else {
      try {
        await AsyncStorage.setItem('readBooks', JSON.stringify({}));
        commit('initBooks', {})
        commit('loadingDone')
      } catch(error) {
          console.log(error)
      }
    }
  },
  async loadBook ({commit, state}, book_id) {
    commit('setCurrentBookId', book_id)
  },
  async addStory ({commit, state, dispatch}, {id, title, bookInfo}) {
    let books = state.books
    commit('setCurrentBookId', bookInfo.id)
    let currentBook = books[bookInfo.id]
    if (!currentBook) {
      currentBook = {}
      currentBook['readStories'] = []

      // Save book for reading section - top page
      currentBook['title'] = bookInfo.title
      currentBook['catch_copy'] = bookInfo.catch_copy
      currentBook['image_url'] = bookInfo.image_url
      currentBook['image_dimensions'] = bookInfo.image_dimensions
      currentBook['isDone'] = false
      commit('refresh', true)
    }
    currentBook['createdAt'] = new Date()

    // Save Story
    if(currentBook['readStories'].indexOf(id) == -1)
      currentBook['readStories'].push(id)
    currentBook['lastReadStory'] = {}
    currentBook['lastReadStory']['id'] = id
    currentBook['lastReadStory']['title'] = title

    let itemStore = {}
    itemStore[state.currentBookId] = currentBook
    dispatch('updateBookLocal', itemStore)
  },
  setCurrentBookId ({commit, state}, book_id) {
    commit('setCurrentBookId', book_id)
  },

  // Update book as done reading when user read final chapter
  updateDoneBook({dispatch, commit}, id) {
    let books = state.books
    let currentBook = books[state.currentBookId]

    currentBook['isDone'] = true
    let itemStore = {}
    itemStore[state.currentBookId] = currentBook
    dispatch('updateBookLocal', itemStore)
    commit('refresh', true)
  },
  updateBookLocal ({commit, state}, book) {
    AsyncStorage.mergeItem('readBooks', JSON.stringify(book), () => {
      commit('initBooks', book)
      commit('updateLastReadStory', book[state.currentBookId]['lastReadStory'])
    })
  },

  updateLastReadStory({commit, state}, data) {
    commit('updateLastReadStoryV2', data)
  },

  updateNextReadStory({commit, state}, data) {
    commit('updateNextReadStory', data)
  },

  removeNextReadStory({commit, state}, book_id) {
    commit('removeNextReadStory', book_id)
  },

  saveFavoriteBooksFromServer({commit, state}, data){
    commit('resetFavoriteBooksSection')
    commit('setFavoriteBooksSection', data)
  },

  updateFavoriteBooksSection({commit, state}, data){
    commit('updateFavoriteBooksSection', data)
  },
  clearCacheBook({commit, state}){
    commit('clearCache')
  },
}

// mutations
const mutations = {
  loadingDone (state) {
    state.isLoading = false
  },
  refresh (state, bool) {
    state.isRefresh = bool
  },
  initBooks (state, books) {
    state.books = {...books, ...state.books }
  },
  setCurrentBookId (state, book_id) {
    state.currentBookId = book_id
  },
  updateLastReadStory (state, title) {
    state.lastReadStory = title
  },
  updateLastReadStoryV2(state, data) {
    state.books[state.currentBookId]['lastReadStory'] = data
  },
  updateNextReadStory(state, data) {
    state.books[state.currentBookId]['nextReadStory'] = data
  },
  removeNextReadStory(state, book_id) {
    state.books[book_id]['nextReadStory'] = null
  },
  setFavoriteBooksSection(state, data) {
    state.favoriteBooksSection = data
  },
  resetFavoriteBooksSection(state, data) {
    state.favoriteBooksSection = null
  },
  updateFavoriteBooksSection(state, data) {
    // TODO: only need image / id / title / sumary, remove some unused field
    if(data.state == 'add'){
      state.favoriteBooksSection.books.unshift({ book: data.book })
    }else{
      state.favoriteBooksSection.books.splice(
        state.favoriteBooksSection.books.findIndex(item => item.book.id === data.book.id), 1)
    }
  },
  clearCache(state){
    state.books={}    
    state.currentBook= {}
    state.currentBookId= {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
