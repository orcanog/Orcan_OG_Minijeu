import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import {
  mdiEmailOutline,
  mdiEyeOff,
  mdiEye,
  mdiLockOutline,
  mdiChevronRight,
  mdiAccountOutline,
  mdiClose
} from '@mdi/js'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      emailOutline: mdiEmailOutline,
      eyeOff: mdiEyeOff,
      eye: mdiEye,
      lockOutline: mdiLockOutline,
      chevronRight: mdiChevronRight,
      accountOutline: mdiAccountOutline,
      close: mdiClose
    },
    sets: {
      mdi
    }
  }
})

// Firebase

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBZfnOMyIedU8EEMcomNwTPg55bozhVIW4',

  authDomain: 'minijeu-9d795.firebaseapp.com',

  projectId: 'minijeu-9d795',

  storageBucket: 'minijeu-9d795.appspot.com',

  messagingSenderId: '563416550352',

  appId: '1:563416550352:web:b06555b7d47447226a07d5'
}

// Initialiser le projet

const firebase = initializeApp(firebaseConfig)

const db = getFirestore(firebase)

export { db }

const app = createApp(App)

app.use(vuetify)

app.mount('#app')
