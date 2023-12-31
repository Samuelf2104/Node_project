document.addEventListener('DOMContentLoaded', function() {
    fetch('/getPanier')
        .then(response => response.json())
        .then(data => {
            const contenuPanier = document.getElementById('contenuPanier');
            data.articles.forEach(article => {
                const div = document.createElement('div');
                div.classList.add('articlePanier');
                div.innerHTML = `<h2>${article.nom}</h2><p>Prix: ${article.prix}€</p>`;

                const supprimerBtn = document.createElement('button');
                supprimerBtn.textContent = 'Supprimer';
                supprimerBtn.classList.add('supprimerDuPanier');
                div.appendChild(supprimerBtn);

                contenuPanier.appendChild(div);

                // Ajouter un écouteur d'événement pour le bouton Supprimer
                supprimerBtn.addEventListener('click', function() {
                    contenuPanier.removeChild(div);
                    // Envoie une requête pour mettre à jour le panier sur le serveur
                    fetch('/supprimerDuPanier', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ nom: article.nom, prix: article.prix }),
                    });
                });
            });
        })
        .catch(error => {
            console.error('Erreur:', error);
        });

    const boutonCommander = document.getElementById('boutonCommander');
    boutonCommander.addEventListener('click', function() {
        fetch('/getPanier')
            .then(response => response.json())
            .then(panierData => {
                fetch('/etatconnexion')
                    .then(response => response.json())
                    .then(userData => {
                        const commande = {
                            utilisateur: userData,
                            articles: panierData.articles
                        };

                        fetch('/ajouterCommande', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(commande),
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Commande enregistrée:', data);
                            // Vous pouvez ici gérer la suite, par exemple vider le panier ou afficher un message de succès
                        });
                    });
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
    });
});
