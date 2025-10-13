import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import 'ant-design-vue/dist/reset.css'

import Vue3Marquee from 'vue3-marquee'
import { router } from './router'

createApp(App).use(router).use(Vue3Marquee).mount('#app')
