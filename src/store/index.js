/**
 * reference
 * https://github.com/weexteam/weex-hackernews/tree/master/src/store
 */

import Vue from "vue-native-core"
import Vuex from 'vuex'
import axios from "axios";
import VueAxios from "vue-axios";

import stories from './modules/stories'
import user from './modules/user'
import tags from './modules/tags'
import booksLocal from './modules/books-local-storage'
import bookDetail from './modules/book-detail'
import downloadStory from './modules/download-story'

Vue.use(VueAxios, axios)
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    stories,
    user,
    tags,
    booksLocal,
    bookDetail,
    downloadStory,
  }
})

export default store;
