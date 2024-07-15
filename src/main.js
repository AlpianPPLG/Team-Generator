import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUsers,
  faPlus,
  faTrashAlt,
  faRandom,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons'
import { faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons'

library.add(faGithub, faInstagram, faUsers, faPlus, faTrashAlt, faRandom, faMoon, faSun)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
