import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ace from 'ace-builds'
// Перед инициализацией редактора
ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict')

createApp(App).mount('#app')
