import tags from '../../seeds/story'

// initial state
const state = {
  all: [
    {"id": 1, "order": 5, "title": "iPad 4 Mini"},
    {"id": 2, "order": 7, "title": "H&M T-Shirt White"},
    {"id": 3, "order": 2, "title": "Charli XCX - Sucker CD"}
  ],
  storyImage: ''
}

// getters
const getters = {
  storyImage: state => {
    return state.storyImage
  }
}

// actions
const actions = {
  getAllStories ({ commit }) {
    tags.getTags(stories => {
      const storiesSorted = stories.sort(function(before, after) { 
        return after.book_count - before.book_count || before.id - after.id
      });
      commit('setStories', storiesSorted)
    })
  }
}

// mutations
const mutations = {
  setStories (state, stories) {
    state.all = stories
  },
  setStoryImage (state, url) {
    state.storyImage = url
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
