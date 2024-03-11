<template>
  <div>
    <table>
      <tbody>
        <tr v-for="(row, rowIndex) in grid" :key="rowIndex">
          <td
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            :class="{ 'zero-cell': colIndex === 5 || rowIndex === 5 }"
            @click="handleCellClick(rowIndex, colIndex)"
          >
            <!-- Utilisation d'une balise img pour l'image du Voltorb -->
            <img
              v-if="cell.flipped && cell.value === 0"
              src="/voltorb.png"
              alt="Image de Voltorb"
              style="width: 20px; height: 20px"
            />
            <!-- Affichage de la valeur lorsque la cellule est retournée -->
            <span v-else-if="cell.flipped && colIndex !== 5 && rowIndex !== 5">{{
              cell.value
            }}</span>
            <!-- Affichage du total de la colonne ou de la ligne pour les cases avec la classe ".zero-cell" -->
            <span v-else>
              <!-- Affichage du total des points et du nombre de zéros dans les cellules ".zero-cell" -->
              {{ cell.total }}
              <br />
              {{ cell.zeros }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Affichage du compteur de points -->
    <div>Score: {{ score }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      grid: [],
      score: 0
    }
  },
  mounted() {
    this.preloadImages() // Appel de la méthode de préchargement des images
    this.generateGrid()
  },
  methods: {
    preloadImages() {
      // Liste des chemins d'accès des images à précharger
      const images = ['/voltorb.png'] // Ajoutez d'autres chemins d'accès si nécessaire
      images.forEach((src) => {
        const img = new Image()
        img.src = src
      })
    },
    generateGrid() {
      for (let i = 0; i < 5; i++) {
        let row = []
        let zerosCount = 0 // Compteur pour le nombre de zéros dans la ligne
        let rowTotal = 0 // Total des points dans la ligne
        for (let j = 0; j < 5; j++) {
          let num = Math.floor(Math.random() * 4)
          row.push({ value: num, flipped: false }) // Ajouter le nombre à la ligne et initialiser flipped à false
          if (num === 0) zerosCount++ // Incrémenter le compteur de zéros
          rowTotal += num // Ajouter le nombre au total des points
        }
        // Ajouter le nombre de zéros et le total des points à la fin de la ligne
        row.push({ total: rowTotal, zeros: zerosCount })
        this.grid.push(row)
      }
      // Ajouter la dernière ligne contenant le nombre de zéros dans chaque colonne
      let lastRow = []
      for (let j = 0; j < 5; j++) {
        let colZeros = this.grid.reduce((acc, row) => acc + (row[j].value === 0 ? 1 : 0), 0) // Compter les zéros dans la colonne
        let colTotal = this.grid.reduce((acc, row) => acc + row[j].value, 0) // Calculer le total des points dans la colonne
        lastRow.push({ total: colTotal, zeros: colZeros })
      }
      lastRow.push('') // La dernière cellule de la dernière ligne est vide
      this.grid.push(lastRow)

      // Afficher la grille dans la console
      console.log('Grille générée :', this.grid)
    },

    checkLevelCompletion() {
      // Parcourir la grille pour vérifier si toutes les cartes de valeur 2 et 3 ont été retournées
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

      this.generateGrid()
      // Si toutes les cartes de valeur 2 et 3 ont été retournées, le niveau est terminé
      return true
    },

    resetGame() {
      // Réinitialiser la grille en générant une nouvelle grille aléatoire
      this.grid = []
      this.generateGrid()

      // Réinitialiser le score à zéro
      this.score = 0

      // Autres actions de réinitialisation, si nécessaire
    },

    handleCellClick(rowIndex, colIndex) {
      // Vérifier si la cellule est déjà retournée
      if (this.grid[rowIndex][colIndex].flipped) {
        // Si la cellule est déjà retournée, ne rien faire
        return
      }

      // Vérifier si la cellule contient un Voltorb
      if (this.grid[rowIndex][colIndex].value === 0) {
        // Si la cellule contient un Voltorb, déclencher le game over
        alert('Game Over ! Vous avez retourné un Voltorb.')
        // Ajoutez ici d'autres actions à effectuer en cas de game over, comme réinitialiser le jeu ou afficher un écran de fin de partie.
        this.resetGame()
        return
      }

      // Basculer la valeur flipped
      this.grid[rowIndex][colIndex].flipped = true

      // Ajouter les points au score uniquement si la cellule n'était pas déjà retournée
      this.score += this.grid[rowIndex][colIndex].value

      // Vérifier si le niveau est terminé
      if (this.checkLevelCompletion()) {
        // Si le niveau est terminé, générer une nouvelle grille tout en conservant le score
        const currentScore = this.score
        this.resetGame()
        this.score = currentScore
      }
    }
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}

td {
  border: 1px solid black;
  width: 50px;
  height: 50px;
  text-align: center;
  background-color: rgb(26, 39, 0);
}

.zero-cell {
  background-color: rgb(26, 39, 0);
}
</style>
