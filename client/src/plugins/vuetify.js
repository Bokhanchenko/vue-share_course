import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#3f51b5',
    secondary: '#673ab7',
    accent: '#5b63b5',
    error: '#f44336',
    warning: '#ffeb3b',
    info: '#607d8b',
    success: '#2196f3'
  }
});
