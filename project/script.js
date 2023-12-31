function verifierEtatConnexion() {
    fetch('/etatConnexion')
        .then(response => response.json())
        .then(data => {
            const message = document.getElementById('messageConnexion');
            const boutonDeconnexion = document.getElementById('boutonDeconnexion');
            if (data.username && data.username !== 0) {
                message.textContent = 'Bonjour ' + data.username;
                boutonDeconnexion.style.display = 'block'; // Afficher le bouton de déconnexion
            } else {
                message.textContent = 'Vous n\'êtes pas connecté';
                boutonDeconnexion.style.display = 'block'; // Masquer le bouton de déconnexion
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    let menuButton = document.getElementById('menuButton');
    let dropdownMenu = document.getElementById('dropdownMenu');
    let loginLink = document.getElementById('loginLink');
    let loginForm = document.getElementById('loginForm');

    menuButton.onclick = function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    };

    loginLink.onclick = function() {
        loginForm.style.display = loginForm.style.display === 'block' ? 'none' : 'block';
    };

    window.onclick = function(event) {
        if (!event.target.matches('#menuButton') && !event.target.matches('#loginLink')) {
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            }
            if (loginForm.style.display === 'block') {
                loginForm.style.display = 'none';
            }
        }
    };

    // Ajouter la fonctionnalité pour le bouton de connexion si nécessaire
    // document.getElementById('loginButton').onclick = function() {
    //    // Votre code pour la connexion
    // };
});

document.addEventListener('DOMContentLoaded', function() {
    let menuButton = document.getElementById('menuButton');
    let dropdownMenu = document.getElementById('dropdownMenu');

    // Affiche ou masque la liste déroulante
    menuButton.onclick = function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    };

    // Masque la liste déroulante si l'utilisateur clique en dehors de celle-ci
    window.onclick = function(event) {
        if (!event.target.matches('#menuButton')) {
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            }
        }
    };
});


document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();

    var username = document.getElementById('login_username').value;
    var password = document.getElementById('login_password').value;

    fetch('/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        verifierEtatConnexion();
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Utilisateur incorrect');
        }
    })
    .catch((error) => {
        console.error('Erreur:', error);
        document.getElementById('welcomeMessage').innerText = error.message;
    });
};

document.getElementById('boutonDeconnexion').addEventListener('click', function() {
    fetch('/deconnexion', {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            verifierEtatConnexion(); // Vérifier à nouveau l'état de connexion après la déconnexion
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
});