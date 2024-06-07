<template>
  <v-app class="background">
    <Navbar></Navbar>
    <Game class="game"></Game>
    <Explain></Explain>
  </v-app>
</template>

<script setup>
import Navbar from '../components/NavbarComponent.vue'
import Game from '../components/GameComponent.vue'
import Explain from '../components/ExplainComponent.vue'
</script>

<style scoped>
.background {
  background-color: #309f6a;
}
.game {
  margin-top: 8em;
  margin-bottom: 10em;
}
</style>
