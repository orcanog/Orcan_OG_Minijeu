<template>
  <v-app>
    <!-- Menu -->
    <v-toolbar class="flex-grow-0" dark color="green-darken-2">
      <v-toolbar-title>Pokémon Flip</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="$accountOutline"> </v-btn>
        </template>

        <!-- Liste des éléménts du bouton user -->
        <v-list>
          <v-list-item v-if="!isLoggedIn" @click.stop="overlayLogin = !overlayLogin">
            <v-list-item-title>Connexion</v-list-item-title>
            <v-overlay v-model="overlayLogin" class="align-center justify-center">
              <v-card class="pa-12 pb-8" width="448" rounded="lg">
                <v-btn
                  @click="overlayLogin = false"
                  icon="$close"
                  variant="text"
                  class="mt-n8 ml-n8"
                  style="z-index: 1; color: gray"
                ></v-btn>
                <div class="text-subtitle-1 text-medium-emphasis">Adresse mail :</div>

                <v-text-field
                  v-model="email"
                  :rules="[
                    () =>
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                      'L\'adresse e-mail n\'est pas valide'
                  ]"
                  hide-details
                  density="compact"
                  placeholder="Email"
                  prepend-inner-icon="$emailOutline"
                  variant="outlined"
                ></v-text-field>

                <div
                  class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
                >
                  Mot de passe :
                </div>

                <v-text-field
                  v-model="password"
                  :rules="isPasswordValid"
                  :append-inner-icon="visible ? '$eyeOff' : '$eye'"
                  :type="visible ? 'text' : 'password'"
                  density="compact"
                  placeholder="Mot de passe"
                  prepend-inner-icon="$lockOutline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>

                <v-card-text class="text-center text-red">
                  <p>{{ errMsg }}</p>
                </v-card-text>

                <v-btn
                  :disabled="!emailValid || !passwordValid"
                  class="mb-8"
                  color="blue"
                  size="large"
                  variant="tonal"
                  block
                  @click="login"
                >
                  Se connecter
                </v-btn>

                <v-card-text
                  class="text-center text-blue cursor-pointer"
                  @click="(overlayRegister = true), (overlayLogin = false), (visible = false)"
                >
                  Pas de compte ? <v-icon icon="$chevronRight"></v-icon>
                </v-card-text>
              </v-card>
            </v-overlay>
          </v-list-item>
          <v-list-item v-if="!isLoggedIn" @click.stop="overlayRegister = !overlayRegister">
            <v-list-item-title>S'enregistrer</v-list-item-title>
            <v-overlay v-model="overlayRegister" class="align-center justify-center">
              <v-card class="pa-12 pb-8" width="448" rounded="lg">
                <v-btn
                  @click="overlayRegister = false"
                  class="mt-n8 ml-n8"
                  icon="$close"
                  variant="text"
                  style="z-index: 1; color: gray"
                ></v-btn>
                <div class="text-subtitle-1 text-medium-emphasis">Nom d'utilisateur :</div>
                <v-text-field
                  v-model="username"
                  density="compact"
                  placeholder="Pseudo"
                  hide-details
                  prepend-inner-icon="$accountOutline"
                  variant="outlined"
                ></v-text-field>

                <div class="text-subtitle-1 text-medium-emphasis">Adresse mail :</div>
                <v-text-field
                  v-model="email"
                  :rules="[() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)]"
                  hide-details
                  density="compact"
                  placeholder="Email"
                  prepend-inner-icon="$emailOutline"
                  variant="outlined"
                ></v-text-field>

                <div
                  class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
                >
                  Mot de passe :
                </div>

                <v-text-field
                  v-model="password"
                  :rules="isPasswordValid"
                  :append-inner-icon="visible ? '$eyeOff' : '$eye'"
                  :type="visible ? 'text' : 'password'"
                  density="compact"
                  placeholder="Mot de passe"
                  prepend-inner-icon="$lockOutline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>

                <v-card-text class="text-center text-red">
                  <p>{{ errMsg }}</p>
                </v-card-text>

                <v-btn
                  :disabled="!username || !emailValid || !passwordValid"
                  class="mb-8"
                  color="blue"
                  size="large"
                  variant="tonal"
                  block
                  @click="register"
                >
                  S'enregistrer
                </v-btn>

                <v-card-text
                  class="text-center text-blue cursor-pointer"
                  @click="(overlayRegister = false), (overlayLogin = true), (visible = false)"
                >
                  Déjà un compte ? <v-icon icon="$chevronRight"></v-icon>
                </v-card-text>
              </v-card>
            </v-overlay>
          </v-list-item>
          <v-list-item v-if="isLoggedIn" @click.stop="handleSignOut">
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <!-- Contenu de la page -->
    <div class="d-flex flex-column align-center ga-16 background">
      <Game></Game>
      <Home></Home>
    </div>
  </v-app>
</template>

<script setup>
// Importation des composants nécessaires pour le script
import { onMounted, ref, computed } from 'vue'
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { db } from './main'
import { doc, setDoc } from 'firebase/firestore'
import Game from './views/Game.vue'
import Home from './views/Home.vue'

// Déclaration des variables globales
const username = ref('')
const email = ref('')
const password = ref('')
const errMsg = ref('')
const isLoggedIn = ref(false)
let auth

// Fonction appelée lors de l'initialisation de la page
onMounted(() => {
  auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})

// Fonction appelée lors de la déconnexion
const handleSignOut = () => {
  signOut(auth).then(() => {
    isLoggedIn.value = false
  })
}

// Fonction pour vérifier la validé d'un email
const emailValid = computed(() => {
  return email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
})

// Fonction pour vérifier la robustesse d'un mot de passe
const passwordValid = computed(() => {
  return password.value.match(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  )
})

// Fonction servant de règle pour l'input du mot de passe
const isPasswordValid = computed(() => {
  return [
    (value) => !!value || 'Le mot de passe est requis',
    (value) =>
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) ||
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
  ]
})

// Fonction pour la connexion en utilisant les méthodes d'authentification de Firebase
const login = () => {
  const auth = getAuth()
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log('Connexion avec succès !')
    })
    .catch((error) => {
      console.error('Erreur lors de la connexion : ', error.code)
      switch (error.code) {
        case 'auth/invalid-credential':
          errMsg.value = 'Les informations de connexion sont incorrectes.'
          break
        default:
          errMsg.value = 'Une erreur est survenue. Veuillez réessayer.'
          break
      }
    })
}

// Fonction pour l'inscription en utilisant les méthodes d'authentification de Firebase
const register = () => {
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      // Inscription de l'utilisateur dans la collection Firestore
      setDoc(doc(db, 'users', data.user.uid), {
        username: username.value,
        score: 0
      })
    })
    .then(() => {
      console.log('Création terminée avec succès !')
    })
    .catch((error) => {
      console.error('Erreur lors de la création du compte : ', error)
    })
}
</script>

<script>
export default {
  name: 'App',
  data() {
    return {
      sidebar: false,
      overlayLogin: false,
      overlayRegister: false,
      visible: false
    }
  }
}
</script>

<style scoped>
.background {
  padding-top: 7rem;
  padding-bottom: 7rem;
  background-color: #309f6a;
}
</style>
