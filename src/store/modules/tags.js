import tags from '../../seeds/story'

// initial state
const state = {
  all: null
}

// getters
const getters = {}

// actions
const actions = {
  getAllTags ({ commit }) {
    tags.getTags(stories => {
      const storiesSorted = stories.sort(function(before, after) { 
        return after.book_count - before.book_count || before.id - after.id
      });
      commit('setStories', storiesSorted)
    })
  },
}

// mutations
const mutations = {
  setStories (state, stories) {
    state.all = stories
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
