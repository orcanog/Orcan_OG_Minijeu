# Orcan_OG_Minijeu

## Commandes

### Build le projet

```sh
npm install
```

### Lancer le projet

```sh
npm run dev
```

## Concept du jeu

Pokémon Flip est un jeu de logique inspiré du classique jeu démineur. Le joueur est confronté à une grille contenant la lignée d'évolution de Salamèche, qui représente les chiffres, et doit éviter les Voltorbes, qui sont des bombes. En retournant les cartes, le joueur gagne des points équivalents au stade d'évolution (1 pour Salamèche, 2 pour Reptincel et 3 pour Dracaufeu) mais risque de rencontrer des Voltorbes qui mettent fin à la partie. Avec une stratégie réfléchie et une dose de chance, le joueur peut découvrir toutes les cartes sans rencontrer de Voltorbes pour gagner la partie. Un système de classement également est présent afin de permettre aux joueurs de se mesurer aux autres.

## Fonctionnement du jeu

### Système de jeu

Une grille est générée aléatoirement, contenant des Salamèches, Reptincels, Dracaufeus, représentant les chiffres 1, 2 et 3 et des Voltorbes. Les cases à la fin de la ligne ou de la colonne permettent aux joueurs d'avoir des informations concernant le nombre de points total de la ligne ou colonne (colonne si c'est la 6e ligne, ligne si c'est la 6e colonne) et le nombre de Voltorbes. Le joueur doit cliquer sur une case pour révéler son contenu. Lorsque le joueur retourne tous les Reptincels et Dracaufeus, le joueur passe au niveau suivant. La montée de niveau implique une grille générée avec plus de voltorbes.

### Système de score

Un double système de score est mit en place avec d'un côté le score obtenu sur la grille et le score total de la partie. Le score repose sur la multiplication de celui-ci avec les valeurs obtenues sauf un score égal un 0, où on additionnera la première valeur obtenue.
Le score total se compose d'une addition des scores de chaque grille terminée lors de la partie en cours. Ainsi si un joueur fait un score de 2750 au premier niveau et 3000 au deuxième, il aura un score total de 3000 + 2750 = 5750.
Lors d'un Game Over provoqué par la retournée d'une case avec un Voltorbe, le score total est également additionné avec le score puis toutes les statistiques sont remit à 0.

### Système de classement

Un système de classement a été mit en place pour instaurer une certaine ambiance de compétivité entre les joueurs athentifiés, ce qui nécéssite au préalable la création d'un compte.
La création d'un compte se fait à l'aide d'une adresse mail et d'un mot de passe respectant la règle suivante : au moins 1 majuscule, minuscule, caractère spécial, chiffre et 8 caractères minimum.
Il est également demandé un nom d'utilisateur.
En jouant connecté, lors d'un Game Over, le score total est sauvegardé en base de données, permettant donc l'affichage de chaque joueur possédant un compte avec son score total maximal.
Il est important de préciser que si le score total obtenu en jeu est plus petit que celui présent dans la base de données, il ne sera pas sauvegardé.

## Points de difficulté du code

L'utilisation de VueJS, du composant vue-router (qui a été retiré car non utilisé au final), du framework front-end Vuetify, du package Firebase de Google.
Il a fallu tout d'abord saisir le concept et l'utilisation de VueJS, qui est différent de ce qui a été vu en classe.
Saisir les concepts de "data", "mounted" et des options traditionnelle API et composition API de VueJS.
Comprendre comment se compose la structure du projet, que sont les fichiers ".vue", comment se passe l'importation des différents fichiers ".vue".
Apprendre et comprendre les nouvelles variables apporté par le framework front-end Vuetify et découvrir une nouvelle façon de faire du CSS : à travers les classes ou en donnant des propriétés aux éléments Vuetify.
L'utilisation de Firebase a été très compliquée au début, l'importer et utiliser la documentation pour les fonctions de création de comptes, connexion et intéractions avec la BDD Firestore (qui est du NoSQL donc une conception différente de MySQL)
La création du script du jeu s'est avérée être l'étape la plus compliquée ainsi que le système de difficulté (pour être honnête, merci tonton GPT).
Ne saisissant pas encore tous les concepts mathématiques poussés, il a été très difficile (et ça l'est toujours) de manipuler l'aléatoire.
La seule ouverture possible qui m'est venu à l'esprit durant le développement a été le nombre de Voltorbes généré.

## Explication de l'identité graphique

Des couleurs autour du vert et rouge ainsi qu'un motif sur les cases pour rappeler l'ambiance casino, mini-jeu et du hasard, elles proviennent également d'un jeu Pokémon.
Les chiffres 0, 1, 2 et 3 ont été remplacé par (dans l'ordre) des Voltorbes, Salamèches, Reptincels et Dracaufeus pour rappeler l'univers Pokémon.
Une page web simple et pas trop chargée pour garder l'ambiance d'un jeu de réflexion.

## Déroulement des étapes du développement

Il a tout d'abord fallu créer le projet et comprendre comment le framework VueJS fonctionnait.
Ensuite créer un début d'interface pour le jeu pour pouvoir se concentrer exclusivement sur le script.
Créer le script de génération de grille, avec des fonctions en cas de clique sur une case pour vérifier des conditions (est-ce que la case a déjà été retournée, est-ce une case du jeu ou une case contenant des informations, le joueur a t-il retourné un Voltorbe, le joueur a t-il fini le niveau).
Créer le système de points.
Implémenter le système de création de compte et de connexion à l'aide de Firebase sur d'autres pages web (qui ont été supprimées pour pouvoir tout faire sans changer de page web).
Implémenter le système de classement qui fonctionne avec des requêtes pour modifier les valeurs des documents de la collection users (Google Firebase étant une BDD orientée document, termes provenant de NoSQL).
S'occuper de l'aspect visuel de la page web.
Réaliser des tests pour vérifier si toutes les fonctionnalités fonctionnent correctement (notamment le système de classement qui a été difficile à faire fonctionner correctement dans tous les cas imaginés).
Bonus : déployer le site à l'aide de Vercel.

## Construction de la BDD

Aucune action est nécessaire, la BDD est sur Google Firebase.