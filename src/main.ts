import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.less'

import Vue3Marquee from 'vue3-marquee'
import { router } from './router'

createApp(App).use(router).use(Vue3Marquee).mount('#app')
