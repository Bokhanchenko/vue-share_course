import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'

import AddPost from './components/posts/AddPost'
import Posts from './components/posts/Posts'
import Post from './components/posts/Post'

import Profile from './components/auth/Profile'
import Signin from './components/auth/Signin'
import Signup from './components/auth/Signup'

import authGuard from './authGuard'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/posts',
      name: 'posts',
      component: Posts
    },
    {
      path: '/posts/:postId',
      name: 'post',
      component: Post,
      props: true,
    },
    {
      path: '/post/add',
      name: 'addPost',
      component: AddPost,
      beforeEnter: authGuard,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: authGuard,
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    { path: '*', redirect: '/'}
  ]
})
