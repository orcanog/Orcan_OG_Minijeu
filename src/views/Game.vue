<template>
  <div class="container">
    <div></div>
    <div class="jeu">
      <!-- Grille de jeu -->
      <table>
        <tbody>
          <tr v-for="(row, rowIndex) in grid" :key="rowIndex">
            <td
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              :class="{
                'info-cell': colIndex === 5 || rowIndex === 5,
                'game-cell': colIndex >= 0 && colIndex <= 4 && rowIndex !== 5,
                unflipped: cell.flipped === false,
                flipped: cell.flipped,
                'cursor-pointer': colIndex >= 0 && colIndex <= 4 && rowIndex !== 5
              }"
              @click="cellIsGameCell(rowIndex, colIndex) && handleCellClick(rowIndex, colIndex)"
            >
              <!-- Utilisation d'une balise img pour l'image du Voltorb -->
              <img
                v-if="cell.flipped && cell.value === 0"
                src="/src/assets/voltorb.png"
                alt="Voltorb"
                style="width: 40px; height: 40px"
              />

              <!-- Utilisation d'une balise img pour l'image du Salamèche -->
              <img
                v-if="cell.flipped && cell.value === 1"
                src="/src/assets/charmanderTest2.png"
                alt="Salamèche"
                style="width: 40px; height: 40px"
              />

              <!-- Utilisation d'une balise img pour l'image du Reptincel -->
              <img
                v-if="cell.flipped && cell.value === 2"
                src="/src/assets/charmeleonTest.png"
                alt="Reptincel"
                style="width: 40px; height: 40px"
              />

              <!-- Utilisation d'une balise img pour l'image du Dracaufeu -->
              <img
                v-if="cell.flipped && cell.value === 3"
                src="/src/assets/charizardTest.png"
                alt="Dracaufeu"
                style="width: 40px; height: 40px"
              />
              <!-- Affichage des informations de la grille -->
              <div class="d-flex flex-column ga-1" v-if="cellIsInfoCell(rowIndex, colIndex)">

                <!-- Affichage du total des points de la ligne ou colonne correspondante -->
                <div class="d-flex justify-space-around align-center">
                  <img src="/src/assets/pokeball.png" alt="Pokeball" style="width: 30px; height: 30px">
                  <p class="text-white">{{ cell.total }}</p>
                </div>
                <hr style="height: 5px; width: 100%; color: white; background-color: white" />

                <!-- Affichage du nombre de Voltorbs dans la ligne ou colonne correspondante -->
                <div class="d-flex justify-space-around align-center">
                  <img
                    src="/src/assets/voltorb.png"
                    alt="Voltorb"
                    style="width: 30px; height: 30px"
                  />
                  <p class="text-white">{{ cell.zeros }}</p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Affichage du niveau en cours et des points du joueur -->
      <div class="informations">
        <div>
          <p>Niveau : {{ difficultyLevel }}</p>
        </div>
        <div>
          <p>Score : {{ score }}</p>
        </div>
        <div>
          <p>Total : {{ totalScore }}</p>
        </div>
      </div>
    </div>

    <!-- Affichage du classement top 10 -->
    <div class="classement">
      <h2>Classement Top 10</h2>
      <ul>
        <li v-for="user in usersList" :key="user.username">
          {{ user.username }} - {{ user.score }} points
        </li>
      </ul>
      <div>
        <p>Connecte toi pour apparaître dans le classement !</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Importation des fonctions Firebase nécessaires
import { db } from '../main'
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
</script>

<script>
export default {
  data() {
    return {
      grid: [],
      score: 0,
      totalScore: 0,
      totalScoreDb: 0,
      difficultyLevel: 1,
      usersList: []
    }
  },
  mounted() {
    this.fetchUsersForRanking()
    this.generateGrid(this.difficultyLevel)
  },

  methods: {
    // Fonction pour générer la grille de jeu
    generateGrid(difficultyLevel) {
      const numRows = 5
      const numCols = 5
      this.grid = []

      // Système de difficulté
      const maxVoltorb = Math.min(5 + difficultyLevel, 15) // Limite le nombre max de Voltorbs
      const multiplierChances = {
        1: 70 - difficultyLevel * 5,
        2: 20 + difficultyLevel * 2,
        3: 10 + difficultyLevel * 3
      } // Ajuste la probabilité des multiplicateurs

      for (let i = 0; i < numRows; i++) {
        let row = []
        for (let j = 0; j < numCols; j++) {
          row.push(this.createCell(multiplierChances))
        }
        this.grid.push(row)
      }

      // Ajoute des Voltorbs à la grille
      let voltorbsToAdd = Math.floor(
        Math.random() * (maxVoltorb - difficultyLevel) + difficultyLevel
      )
      while (voltorbsToAdd > 0) {
        let row = Math.floor(Math.random() * numRows)
        let col = Math.floor(Math.random() * numCols)
        if (this.grid[row][col].value !== 0) {
          this.grid[row][col] = { value: 0, flipped: false }
          voltorbsToAdd--
        }
      }

      // Calcule le total des points et le nombre de Voltorbs par ligne
      for (let row = 0; row < numRows; row++) {
        let rowTotal = 0
        let zerosCount = 0
        for (let col = 0; col < numCols; col++) {
          rowTotal += this.grid[row][col].value
          if (this.grid[row][col].value === 0) {
            zerosCount++
          }
        }
        // Ajouterle total des points et le nombre de Voltorbs à la fin de la ligne
        this.grid[row].push({ total: rowTotal, zeros: zerosCount })
      }

      // Ajoute la dernière ligne contenant le total des points et le nombre de Volcorbs par colonne
      let lastRow = []
      for (let col = 0; col < numCols; col++) {
        let colTotal = 0
        let colZeros = 0
        for (let row = 0; row < numRows; row++) {
          colTotal += this.grid[row][col].value
          if (this.grid[row][col].value === 0) {
            colZeros++
          }
        }
        lastRow.push({ total: colTotal, zeros: colZeros })
      }
      this.grid.push(lastRow)
    },

    // Fonction pour générer la valeur d'une case de la grille
    createCell(multiplierChances) {
      let rnd = Math.random() * 100
      let value = 1 // Par défaut, la cellule a une valeur de 1
      if (rnd < multiplierChances[3]) {
        value = 3
      } else if (rnd < multiplierChances[3] + multiplierChances[2]) {
        value = 2
      }
      return { value: value, flipped: false }
    },

    // Vérifie si la cellule est une cellule de jeu ('game-cell')
    cellIsGameCell(rowIndex, colIndex) {
      return rowIndex < 5 && colIndex < 5
    },

    // Vérifie si la cellule est une cellule d'information ('info-cell')
    cellIsInfoCell(rowIndex, colIndex) {
      return rowIndex === 5 || colIndex === 5
    },

    // Fonction pour gérer le clic sur une cellule de la grille
    handleCellClick(rowIndex, colIndex) {
      const cell = this.grid[rowIndex][colIndex]

      // Vérifie si la cellule est déjà retournée
      if (cell.flipped) return

      // Retourne la cellule
      cell.flipped = true

      // Ajoute les points au score
      if (this.score === 0) {
        // Si le score est égal à 0, on additionne simplement la valeur de la cellule
        this.score += cell.value
      } else {
        // Sinon, on multiplie
        this.score *= cell.value
      }

      // Vérifie si le niveau est terminé
      if (this.checkLevelCompletion()) {
        // Ajoute le score actuel au score total
        this.totalScore += this.score
        this.score = 0
      }

      // Vérifie si la cellule contient un Voltorb
      if (cell.value === 0) {
        // Déclenche le game over si la cellule contient un Voltorb
        alert('Game Over ! Vous avez retourné un Voltorb.')
        this.resetGame()
        return
      }
    },

    // Fonction pour vérifier si le niveau est terminé
    checkLevelCompletion() {
      // Parcours la grille pour vérifier si toutes les cartes de valeur 2 et 3 ont été retournées
      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
          if (this.grid[i][j].value === 2 || this.grid[i][j].value === 3) {
            if (!this.grid[i][j].flipped) {
              // S'il reste au moins une carte de valeur 2 ou 3 non retournée, le niveau n'est pas terminé
              return false
            }
          }
        }
      }

      // Si toutes les cartes de valeur 2 et 3 ont été retournées, le niveau est terminé donc on augmente la difficulté et on regénère une nouvelle grille
      this.difficultyLevel++
      this.generateGrid(this.difficultyLevel)
      return true
    },

    // Fonction pour réinitialiser le jeu
    resetGame() {
      if (this.difficultyLevel === 1) {
        // Le score total est égal au score actuel si game over au niveau 1
        this.totalScore = this.score
      }

      // Mettre à jour le score total dans la base de données si l'utilisateur est connecté
      if (getAuth().currentUser) {
        getDoc(doc(db, 'users', getAuth().currentUser.uid))
          .then((data) => {
            if (data.exists()) {
              const userData = data.data()
              this.totalScoreDb = userData.score

              if (this.totalScore > this.totalScoreDb) {
                console.log('update')
                updateDoc(doc(db, 'users', getAuth().currentUser.uid), {
                  score: this.totalScore
                })
              }

            } else {
              console.log('Aucun document trouvé pour cet utilisateur.')
            }
          })
          .then(() => {
            this.resetValues()
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération du document utilisateur:', error)
          })
      }

      // Réinitialiser la grille en générant une nouvelle grille aléatoire
      this.grid = []
      this.difficultyLevel = 1
      this.generateGrid(this.difficultyLevel)
    },

    // Fonction pour réinitialiser les valeurs du score
    resetValues() {
      this.score = 0
      this.totalScore = 0
    },

    // Fonction qui récupère les utilisateurs pour le classement
    fetchUsersForRanking() {
      const usersCollectionRef = collection(db, 'users')

      // Créez une requête pour récupérer les utilisateurs triés par score en ordre décroissant
      const q = query(usersCollectionRef, orderBy('score', 'desc'), limit(10))

      try {
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.usersList.push({ username: doc.data().username, score: doc.data().score })
          })
          console.log(this.usersList)
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des documents: ', error)
        return [] // Retourne une liste vide en cas d'erreur
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.jeu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.informations {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.informations > div {
  background-color: #bc8c859d;
  border: 2px solid whitesmoke;
  border-radius: 10px;
  width: 120px;
  text-align: center;
}

.classement {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin-left: 7rem;
  background-color: #bc8c859d;
  border: 4px solid whitesmoke;
  border-radius: 10px;
  width: 70%;
  height: 50%;
}

.classement > ul {
  list-style-type: none;
  overflow: scroll;
  cursor: ns-resize;
}

table {
  border-collapse: separate;
}

td {
  border: 4px solid whitesmoke;
  border-radius: 5px;
  width: 90px;
  height: 90px;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
}

.unflipped {
  box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 1) inset;
  background-image: url('/src/assets/blanktile.svg');
  background-size: cover;
}

.flipped {
  box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 1) inset;
  background-color: #bc8c85;
}

.info-cell {
  background-color: rgb(8, 90, 76);
}

.info-cell > span {
  cursor: default;
  color: white;
}
</style>
