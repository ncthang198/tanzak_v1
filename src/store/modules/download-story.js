import axios from "axios";
import * as FileSystem from "expo-file-system";

// initial state
const state = {
  status: "waiting",
  errorMessage: "",
  lengthContent: null,
  result: null,
  router: null,
  infoCharacter: null,
  imagesWebtoon: null,
  nextChapter: null,
  json: {},
};

// getters
const getters = {
  getContentStoryJSON: (state) => state.result,
  getDimensions: (state) => (key) => state.json[key],
  getError: (state) => state.errorMessage,
  getInfoCharacter: (state) => state.infoCharacter,
  getStatus: (state) => state.status == "success",
  fileName: (state) => (url) => url.split("/").reverse()[0],
  getInfoFile: (state) => (path) => {
    return new Promise((resolve) => {
      resolve(
        FileSystem.getInfoAsync(`${FileSystem.documentDirectory}${path}`)
      );
    });
  },
  makeDirectory: (state) => (direct) => {
    return new Promise((resolve) => {
      let url = `${FileSystem.documentDirectory}${direct}`;
      FileSystem.makeDirectoryAsync(url, { intermediates: true });
      FileSystem.makeDirectoryAsync(url + "/characters/", {
        intermediates: true,
      });
      FileSystem.makeDirectoryAsync(url + "/cover/", { intermediates: true });
      FileSystem.makeDirectoryAsync(url + "/content/", { intermediates: true });
      resolve(true);
    });
  },
  getNextChapter: (state) => state.nextChapter,
  getImagesWebtoon: (state) => state.imagesWebtoon,
};

// actions
const actions = {
  async fetchStory({ commit, dispatch }, data) {    
    axios
      .get(`/api/stories/${data.id}`)
      .then(({ data: res }) => {      
        if (
          Object.entries(res.data).length === 0 &&
          res.data.constructor === Object
        ) {
          commit("setSuccess");
          if (res.results.message) {
            // Story unpublish
            commit("createError", res.results.message);
            return;
          }
          return commit(
            "createError",
            "Can not get download link for this story"
          );
        } else if (res.data.webtoonType==1) {              
          commit("setImagesWebtoon", res.data.imageWebtoon);
          commit("saveNextchapter", res.data.nextChapter);
          commit("setSuccess");
        } else {          
          commit("saveJsonType", res.data.story);
          commit("saveNextchapter", res.data.nextChapter);

          dispatch("downloadStory", res.data.story);
        }
      })
      .catch((error) => {
        console.log(error.data);
      });
  },
  async clearStory({ commit }, url) {
    commit("clearStory");
  },
  async downloadStory({ dispatch, commit, rootState, getters }, url) {
    let book = rootState.bookDetail.book;
    let story_id = rootState.bookDetail.currentStory.id;
    let file_json = getters.fileName(url.json);
    let path_json = "books/" + book.id + "/stories/" + story_id;
    let path_direct = "books/" + book.id + "/stories/" + story_id + "/images/";
    let result = await getters.getInfoFile(`${path_json}/${file_json}`);
    if (result.exists > 0) {
      return dispatch("makeReadJson", file_json);
    } else {
      if (await getters.makeDirectory(path_direct)) {
        Object.keys(url).forEach(function (object) {
          let length = object != "json" ? url[object].length : 1;
          commit("lengthContent", length);
        });
        Object.keys(url).forEach(function (object) {
          if (object == "json") {
            const path_file = url[object];
            dispatch("processDownload", {
              path_file: path_file,
              direct: path_json + "/" + getters.fileName(path_file),
              file_json: file_json,
            });
          } else {
            url[object].forEach(function (path_file) {
              dispatch("processDownload", {
                path_file: path_file.url,
                direct:
                  path_direct + object + "/" + getters.fileName(path_file.url),
                file_json: file_json,
              });
            });
          }
        });
      }
    }
  },
  async processDownload(
    { commit, state, dispatch },
    { path_file, direct, file_json }
  ) {
    path_file_non_space = path_file.replace(/ /g, "%20");
    await FileSystem.downloadAsync(
      path_file_non_space,
      FileSystem.documentDirectory + direct
    )
      .then(({ uri }) => {
        commit("decreaseLength");
        if (state.lengthContent == 0) dispatch("makeReadJson", file_json);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  async makeReadJson(
    { commit, getters, rootState, dispatch, state },
    file_json
  ) {
    let book = rootState.bookDetail.book;
    let story_id = rootState.bookDetail.currentStory.id;
    let story = rootState.bookDetail.currentStory;
    try {
      const file = `books/${book.id}/stories/${story_id}/${file_json}`;
      let result = await new Promise((resolve) => {
        let url = `${FileSystem.documentDirectory}${file}`;
        resolve(FileSystem.readAsStringAsync(url));                                         
      });
      if (result) {
        //state.router.navigate('Story', { story: story, book: book, content_story: result })
        commit("setSuccess");
        commit("setResult", JSON.parse(result));
      }
    } catch (error) {
      console.log(error);
    }
  },
};

// mutations
const mutations = {
  setSuccess(state) {
    state.status = "success";
  },
  saveJsonType(state, url) {
    Object.keys(url).forEach(function (object) {
      if (object !== "json") {
        url[object].forEach(function (path_file) {
          const arrUrl = path_file.url.split("/").reverse();
          const key = "/" + arrUrl[2] + "/" + arrUrl[1] + "/" + arrUrl[0];
          const obj = {};
          obj[key] = path_file.dimensions;
          state.json = { ...state.json, ...obj };
        });
      }
    });
  },
  clearStory(state) {
    state.status = "waiting";
    (state.errorMessage = ""),
      (state.lengthContent = null),
      (state.result = null),
      (state.router = null),
      (state.infoCharacter = null);
    // state.json = {}
  },
  createError(state, message) {
    state.errorMessage = message;
  },
  setResult(state, result) {
    state.result = result;
    
     let character = {
      readerUser: {
        namecolor: "#FFFFFF",
        position: "right",
      },
    };
    result.characters.forEach(function (object) {
      character[object["name"]] = object;
    });
    state.infoCharacter = Object(character);
  },
  setImagesWebtoon(state, result) {
    state.imagesWebtoon = result;
  },
  lengthContent(state, length) {
    state.lengthContent += length;
  },
  decreaseLength(state) {
    state.lengthContent--;
  },
  router(state, router) {
    state.router = router;
  },
  saveNextchapter(state, nextChapter) {
    state.nextChapter = nextChapter;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
