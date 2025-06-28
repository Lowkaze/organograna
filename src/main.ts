import '@/assets/main.scss'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { initializeApp } from 'firebase/app'

import App from './App.vue'
import router from './router'

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDRZQ7YT9_T8UKZnHVJPoj4r0HPkVtW3IM',
  authDomain: 'organograna-1682e.firebaseapp.com',
  projectId: 'organograna-1682e',
  storageBucket: 'organograna-1682e.firebasestorage.app',
  messagingSenderId: '754973469602',
  appId: '1:754973469602:web:cac79ba2e9ca0cd90ee0fb',
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.provide('firebaseApp', firebaseApp)

app.mount('#app')
