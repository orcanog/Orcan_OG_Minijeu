<template>
  <div class="mt-12 d-flex flex-column align-center ga-16 pb-7">
    <div class="d-flex flex-column align-center ga-4 px-5 py-2 couleur">
      <h2>Présentation</h2>
      <p>
        Bienvenue dans le mini-jeu Pokémon Flip ! <br />
        Prépare-toi à relever un défi passionnant où la stratégie et la réflexion sont les clés de
        la victoire. <br />
        Dans ce jeu inspiré de l'univers de Pokémon, tu te retrouveras face à une grille de cartes.
        <br />
        Chacune cachant soit un salamèche, un reptincel, un dracaufeu ou soit un redoutable Voltorb
        ! <br />
        Ton objectif ? Retourner les bonnes cartes pour accumuler un maximum de points tout en
        évitant les Voltorb, qui mettront fin à ta partie si tu en retournes un ! <br />
        Prêt à relever le défi ? Alors lance-toi et montre tes talents de stratège dans le mini-jeu
        Voltorb Flip !
      </p>
    </div>
    <div class="d-flex flex-column align-center px-5 py-2 ga-4 couleur">
      <h2>Comment jouer ?</h2>
      <ul>
        <li>Retourne les cartes en cliquant dessus pour révéler leur contenu.</li>
        <li>Les chiffres indiquent le nombre de points présents dans la rangée ou la colonne.</li>
        <li>Attention aux Voltorbs ! Si tu en retournes un, tu perdras la partie.</li>
        <li>Utilise ta logique pour déduire l'emplacement des points et éviter les Voltorbs.</li>
        <li>
          Marque autant de points que possible pour grimper dans le classement et devenir le maître
          du Pokémon Flip !
        </li>
      </ul>
    </div>
    <div class="d-flex flex-column align-center px-5 py-2 ga-4 couleur">
      <h2>Comment fonctionne le système de points ?</h2>
      <ul>
        <li>
          <img
            src="/src/assets/charmander.png"
            alt="Salamèche"
            style="width: 30px; height: 30px"
          />
          vaut 1 point.
        </li>
        <li>
          <img
            src="/src/assets/charmeleon.png"
            alt="Reptincel"
            style="width: 30px; height: 30px"
          />
          vaut 2 points.
        </li>
        <li>
          <img
            src="/src/assets/charizard.png"
            alt="Dracaufeu"
            style="width: 30px; height: 30px"
          />
          vaut 3 points.
        </li>
        <li>
          <img src="/src/assets/voltorb.png" alt="Voltorb" style="width: 30px; height: 30px" /> te
          fait perdre la partie.
        </li>
        <li>
          La notation de points se base premièrement sur une addition puis sur de la multiplication.
        </li>
      </ul>
    </div>
  </div>
</template>

<script></script>

<style scoped>
.couleur {
  background-color: #bc8c859d;
  border: 4px solid white;
  border-radius: 10px;
}

h2 {
  border-bottom: 3px solid black;
}
</style>
