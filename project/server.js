const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

utilisateur_connecte = { username: 0, password: 0 };

app.use(bodyParser.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Route pour l'inscription
app.post('/inscription', (req, res) => {
    const { username, password } = req.body;

    // Lire le fichier JSON
    fs.readFile('utilisateurs.json', (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture du fichier');
            return;
        }

        const users = JSON.parse(data.toString());
        users.users.push({ username, password });

        // Écrire dans le fichier JSON
        fs.writeFile('utilisateurs.json', JSON.stringify(users), (err) => {
            if (err) {
                res.status(500).send('Erreur lors de l\'écriture dans le fichier');
                return;
            }

            res.send('Utilisateur enregistré avec succès');
        });
    });
});

// Route pour la connexion
app.post('/connexion', (req, res) => {
    const { username, password } = req.body;

    // Lire le fichier JSON
    fs.readFile('utilisateurs.json', (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors de la lecture du fichier');
            return;
        }

        const users = JSON.parse(data.toString());

        // Vérifier si l'utilisateur existe et si le mot de passe correspond
        const user = users.users.find(u => u.username === username && u.password === password);

        if (user) {
            res.send({ message: 'Connexion réussie', username: username });
            utilisateur_connecte = user;
            console.log("User :");
            console.log(utilisateur_connecte);

        }
        else {
            res.status(401).send('Échec de la connexion');
        }
    });
});

// Stockage en mémoire du panier
let panierEnMemoire = [];

app.post('/validerPanier', (req, res) => {
    const { articles } = req.body;
    
    // Concaténer les nouveaux articles aux articles existants
    panierEnMemoire = [...panierEnMemoire, ...articles];

    res.json({ message: 'Articles ajoutés au panier avec succès' });

    console.log("le panier :")
    console.log(panierEnMemoire)

});

app.get('/getPanier', (req, res) => {
    res.json({ articles: panierEnMemoire }); // Retourne le contenu du panier
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

app.post('/supprimerDuPanier', (req, res) => {
    const { nom, prix } = req.body;
    
    // Filtrer le panier pour supprimer l'article spécifié
    panierEnMemoire = panierEnMemoire.filter(article => !(article.nom === nom && article.prix === prix));

    res.json({ message: 'Article supprimé du panier' });
});

app.get('/etatConnexion', (req, res) => {
    res.json(utilisateur_connecte);
});

app.post('/deconnexion', (req, res) => {
    utilisateur_connecte = { username: 0, password: 0 };
    res.json({ message: 'Déconnexion réussie' });
});

app.post('/ajouterCommande', (req, res) => {
    const commande = req.body;

    fs.readFile('commandes.json', (err, data) => {
        if (err) throw err;
        let commandes = JSON.parse(data);
        commandes.push(commande);

        fs.writeFile('commandes.json', JSON.stringify(commandes), (err) => {
            if (err) throw err;
            res.json({ message: 'Commande ajoutée avec succès' });
        });
    });
});