
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.ajouterPanier').forEach(function(button) {
        button.addEventListener('click', function() {
            const nom = this.getAttribute('data-nom');
            const prix = this.getAttribute('data-prix');

            const listePanier = document.getElementById('articlesPanier');
            const articleListe = document.createElement('li');
            articleListe.textContent = nom + ' - ' + prix + '€';
            articleListe.setAttribute('data-nom', nom);
            articleListe.setAttribute('data-prix', prix);

            const supprimerBtn = document.createElement('button');
            supprimerBtn.textContent = 'Supprimer';
            supprimerBtn.classList.add('supprimerDuPanier');
            articleListe.appendChild(supprimerBtn);

            listePanier.appendChild(articleListe);

            // Ajouter un écouteur d'événement pour le bouton Supprimer
            supprimerBtn.addEventListener('click', function() {
                listePanier.removeChild(articleListe);
                // Envoie une requête pour mettre à jour le panier sur le serveur
            });
        });
    });

    document.getElementById('validerPanier').addEventListener('click', function() {
        const articles = [];
        document.querySelectorAll('#articlesPanier li').forEach(function(item) {
            articles.push({
                nom: item.getAttribute('data-nom'),
                prix: item.getAttribute('data-prix')
            });
        });

        fetch('/validerPanier', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ articles }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Panier enregistré:', data);
        });
    });
});
