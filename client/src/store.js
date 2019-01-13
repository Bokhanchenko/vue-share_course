import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

import { defaultClient as apolloClient } from './main'

import {
  GET_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  ADD_POST,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST, DELETE_USER_POST, INFINITE_SCROLL_POSTS,
} from './queries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    user: null,
    loading: false,
    error: null,
    authError: null,
    searchResults: [],
  },

  mutations: {
    setUser: (state, payload) => (state.user = payload),
    setPosts: (state, payload) => (state.posts = payload),
    setUserPosts: (state, payload) => (state.userPosts = payload),
    setSearchResults: (state, payload) => { if (payload !== null) state.searchResults = payload },
    setLoading: (state, payload) => (state.loading = payload),
    setError: (state, payload) => (state.error = payload),
    setAuthError: (state, payload) => (state.authError = payload),
    clearUser: state => (state.user = null),
    clearSearchResults: state => state.searchResults.length = 0,
    clearError: state => (state.error = null),
  },

  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);

      apolloClient.query({
        query: GET_CURRENT_USER
      })
        .then(({ data }) => {
          commit('setLoading', false);
          commit('setUser', data.getCurrentUser);
        })
        .catch(err => {
          commit('setLoading', false);
          console.log(err)
        })
    },

    getPosts: ({ commit }) => {
      commit('setLoading', true);

      // use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS
        })
      .then(({ data }) => {
        // Get data from actions to state via mutation
        // commit passes data from actions along to  mutation functions
        commit('setPosts', data.getPosts);
        commit('setLoading', false);
      })
      .catch(err => {
        commit('setLoading', false);
        console.error(err)
      })
    },

    getUserPosts: ({ commit }, payload) => {
      apolloClient.query({
        query: GET_USER_POSTS,
        variables: payload
      })
        .then(({ data }) => {
          commit('setUserPosts', data.getUserPosts);
        })
        .catch(err => console.log('Error in getUserPosts', err))
    },

    searchPosts: ({ commit }, payload) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      })
        .then(({ data }) => {
          commit('setSearchResults', data.searchPosts)
        })
        .catch(err => console.error('Error in searchPosts', err))
    },

    addPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // First read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // Create update data
            data.getPosts.unshift(addPost);
            // Write updated data back to query
            cache.writeQuery({ query: GET_POSTS, data })
          },
          // optimistic response ensures data is added immediately as we specified for the update function
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload
            }
          },
          // Return specified queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: { pageNum: 1, pageSize: 2 }
            },
            {
              query: GET_USER_POSTS,
              variables: { userId: state.user._id }
            },
          ]
        })
        .catch(err => console.error(err))
    },

    updateUserPost: ({ state, commit }, payload) => {
      apolloClient.mutate({
        mutation: UPDATE_USER_POST,
        variables: payload
      })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(post => post._id === data.updateUserPost._id);

          if (index > -1) {
            const userPosts = [
              ...state.userPosts.slice(0, index),
              data.updateUserPost,
              ...state.userPosts.slice(index + 1)
            ];

            commit('setUserPosts', userPosts);
          }

        })
        .catch(err => console.log('Error in updateUserPost', err))
    },

    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient.mutate({
        mutation: DELETE_USER_POST,
        variables: payload
      })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(post => post._id === data.deleteUserPost._id);

          if (index > -1) {
            const userPosts = [
              ...state.userPosts.slice(0, index),
              ...state.userPosts.slice(index + 1)
            ];

            commit('setUserPosts', userPosts);
          }
        })
        .catch(err => console.log('Error in deleteUserPost', err))
    },

    signinUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload,
        })
        .then(({ data }) => {
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          // add user data to state
          commit('setLoading', false);
          localStorage.setItem('token', data.signinUser.token);

          router.go()
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.error('Error in signinUser', err)
        })
    },

    signupUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload,
        })
        .then(({ data }) => {
          commit('setLoading', false);
          localStorage.setItem('token', data.signupUser.token);

          router.go()
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.error('Error in signinUser', err)
        })
    },

    signoutUser: async ({ commit }) => {
      commit('setLoading', false);
      commit('clearUser');
      // remove token from localStorage
      localStorage.setItem('token', '');
      // and session
      await apolloClient.resetStore();
      // redirect home - kick users out of private pages (i.e. profile)
      router.push('/')
    }
  },

  getters: {
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError,
  }
})
