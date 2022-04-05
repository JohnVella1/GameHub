// Ce fichier ne contient QUE les routes
const express = require('express');
const router = express.Router();

// On importe la liste des jeux
const gamesJson = require('../games.json');

// Cette route affiche la page d'accueil
// elle répond avec le contenu de la vue index.ejs
router.get('/', (request, response) => {
    response.render('index');
});

router.get('/game/:nomDuJeu', (request, response, next) => {

    // récupérer le nom du jeu demandé
    let gameUrl = request.params.nomDuJeu;

    // rechercher dans la liste des jeux un qui correspond à celui demandé
    const gameFound = gamesJson.find((elementDuTableau) => {
        if (elementDuTableau.name === gameUrl) {
            return true;
        }
        else {
            return false;
        }

        // Alternative raccourcie
        // return elementDuTableau.name === gameUrl;
    });

    // Si un jeu a été trouvé, gameFound contient UN élément
    // du tableau gamesJson.
    // sinon la variable contiendra la valeur undefined


    // Si nom du jeu est dans la liste des jeux
    if (gameFound !== undefined) {

        let attentionAjouteLaCSSDiceRoller;
        if (gameFound.name === 'diceRoller') {
            // Si on affcihe le jeu diceRoller
            // On initilise la variable à true
            attentionAjouteLaCSSDiceRoller = true;
        }
        else {
            // sinon, à false
            attentionAjouteLaCSSDiceRoller = false;
        }

        // on affiche la vue correspondante
        response.render(gameFound.name, {
            // On transmet à la vue la variable qui permet
            // de savoir si il faut ajouter CSS diceRoller.css
            attentionAjouteLaCSSDiceRoller: attentionAjouteLaCSSDiceRoller
        });
    }
    // Sinon
    else {
        // on affiche le contenu de la vue 404.ejs
        // response.render('404');
        // Si on ne trouve pas le jeu, on appelle le middleware suivant
        next();
    }

});


// rajouter une route /search qui affiche un formulaire de recherche

// Créer une nouvelle route /search
router.get('/search', (request, response) => {
    response.render('search');
});

// On créé une route pour afficher les résultats
router.get('/search/results', (request, response) => {
    // console.log(request.query.recherche);
    const jeuRecherche = request.query.recherche;
    console.log(jeuRecherche);
    // Rechercher dans la liste des jeux le jeu
    // qui correspond à la recherche.
    const gameFound = gamesJson.find((element) => {
        if (jeuRecherche === element.title) {
            return true;
        }
        else {
            return false;
        }
    });

    // On envoie à la vue les infos du jeu trouvé
    response.render('searchResults', {
        gameFound: gameFound
    });
    // response.send(`Tu cherches donc les jeux qui se nomme : ${jeuRecherche}`);
});

router.get('/login', (request, response) => {
    response.render('login');
});

// Je créé une route qui va être activée pour les requêtes de type
// POST sur l'adresse /login/results
router.post('/login/results',  (request, response) => {
    console.log(request.body);
    const login = request.body.login;
    const password = request.body.password;
    response.send(`Coucou tu es ${login}, ton mot de passe est ${password}`);
});

// Créer une vue search.ejs

// dans cette vue, créer un formualaire avec
// - un input
// - un bouton "Rechercher"

// Bonus, récupérer les infos du formulaire :)

// router.get('/game/fourchette', (request, response) => {
//     response.render('fourchette', {
//         gamesJson: gamesJson
//     });
// });

// router.get('/game/diceRoller', (request, response) => {
//     response.render('diceRoller', {
//         attentionAjouteLaCSSDiceRoller: true,
//         gamesJson: gamesJson
//     });
// });

// J'exporte mon router (qui est une liste de route)
module.exports = router;
