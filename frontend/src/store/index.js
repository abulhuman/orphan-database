import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    snackbar: false,
    snackbarColor: "success",
    snackbarText: ""
  },
  getters: {
    getSnackbar: state => state.snackbar,
    getSnackbarColor: state => state.snackbarColor,
    getSnackbarText: state => state.snackbarText
  },
  mutations: {
    SET_SNACKBAR: (state, payload) => {
      state.snackbar = payload;
    },
    SET_SNACKBAR_COLOR: (state, payload) => {
      state.snackbarColor = payload;
    },
    SET_SNACKBAR_TEXT: (state, payload) => {
      state.snackbarText = payload;
    }
  },
  actions: {},
  modules: {}
});
