/**
 * @file public/js/scripts/connexion.js
 * @author Hugo CIRETTE & Nathan EPRON & Nathan HAUDEBAULT
 */

// Permet d'utiliser socket.io
const socket = io();

// Connexion au serveur
socket.on('connect', () => {
  document.querySelector('#connect-button').addEventListener('click', (e) => {
    // Empêche l'envoi du formulaire
    e.preventDefault();

    // Récupération du nom et du mot de passe
    const nom = document.querySelector('.ut').value;
    const mdp = document.querySelector('.mdp').value;

    // Envoie une requête au serveur pour dire qu'on se connecte à un compte admin
    socket.emit('se_connecter_admin', nom, mdp);
  });

  socket.on('se_connecter_admin', (connexion, nomAdmin) => {
    if (connexion === true) {
      sessionStorage.setItem('nomAdmin', nomAdmin);
      document.location.href = '/accueil';
    } else {
      var popup = document.getElementById("error-popup");
      popup.classList.add("show");
      setTimeout(function () {
        popup.classList.remove("show");
      }, 1500);
    }
  });
});