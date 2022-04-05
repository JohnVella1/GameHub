const express = require('express');

// J'importe ma liste de routes
const router = require('./modules/router')

const gamesJson = require('./games.json');

const app = express();
const port = 3000;

// Je stocke la liste des jeux dans la variable locals de Express
// Le fait de faire ça fait que je pourrais, dans mes vues,
// utiliser `locals.games` pour récupérer la liste des jeux.
app.locals.games = gamesJson;

// On rajoute un middleware pour demande à express d'extraire le contenu
// des requetes de type POST et de le stocker dans la propriété body de l'objet
// request passé à toutes les routes.
app.use(express.urlencoded({ extended: true }));

app.use((request, response, next) => {
    const date = new Date().toISOString();
    const ip = request.ip;
    const url = request.path;

    console.log(`[${date} ${ip}] ${url}`);
    next();
});

// Cette fonction est un middleware.
// C'est à dire une fonction qui s'insère dans 
// une chaine de plusieurs fonction exécutées
// les unes après les autres
app.use((request, response, next) => {
    // console.log('Toto');
    // console.log(request.ip);

    // Si l'adresse ip a l'origine de la requete
    // correspond à celle que l'on veut ejecter
    if (request.ip === 'adressipduhacker') {
        // On repond à la requete avec l'objet response (send)
        response.send('Tu sors de là vilain hacker');
    }
    // Sinon
    else {
        // on passe la main au middleware suivant
        // on appelle la fonction next()
        next();
    }

    // Un middleware, pour ne pas casser la chaine
    // doit appeler le middleware suivant.
    // next();
});

const middleware = (request, response, next) => {
    // console.log("Encore un test de middleware");
    next();
};

app.use(middleware);

// On indique à express où sont rangées les ressources statiques
app.use(express.static('public'));


// Je demande à Express d'utiliser ma liste de routes.
app.use(router);

// Je rajoute un possibilité pour répondre à une requete HTTP
// C'est un middleware, ajouté en fin de chaine, qui va renvoyer une erreur 404
// Si ce middleware est atteint, c'est qu'aucune route n'a pu répondre à la requete 
// Attention de bien le mettre en dernier !
app.use((request, response) => {
    response.status(404).render("404");
});


// On indique à express où sont rangées les vues
app.set('views', './views');
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`GameHub listening at http://localhost:${port}`);
})