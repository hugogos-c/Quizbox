/**
 * @file public/js/scripts/creer_compte.js
 * @author Hugo CIRETTE & Nathan EPRON
 */

// Permet d'utiliser socket.io
const socket = io();

// Connexion au serveur
socket.on('connect', () => {
  // Si l'admin n'est pas connecté, redirige vers la page de connexion
  if (!sessionStorage.getItem('nomAdmin')) {
    document.location.href = '/connexion';
  }

  const usernameInput = document.querySelector('input[name="username"]');
  const mailInput = document.querySelector('input[name="mail"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const passwordConfInput = document.querySelector('input[name="password-conf"]');
  const submitButton = document.querySelector('a.bouton-creer');

  submitButton.addEventListener('click', function (event) {
    event.preventDefault(); // Empêcher le comportement par défaut du bouton

    let errorMessage = '';

    if (!usernameInput.value) {
      errorMessage += 'Le champ "Pseudo" est obligatoire. ';
    }

    if (!mailInput.value) {
      errorMessage += 'Le champ "Adresse mail" est obligatoire. ';
    }

    if (!passwordInput.value) {
      errorMessage += 'Le champ "Mot de passe" est obligatoire. ';
    }

    if (!passwordConfInput.value) {
      errorMessage += 'Le champ "Confirmer" est obligatoire. ';
    }

    if (passwordInput.value !== passwordConfInput.value) {
      errorMessage += 'Les deux mots de passe ne sont pas identiques. ';
    }

    if (errorMessage) {
      alert(errorMessage);
    } else {
      socket.emit('creer_compte', mailInput.value, usernameInput.value, passwordInput.value, passwordConfInput.value);

      socket.on('creer_compte', (nomAdmin) => {
        window.location.href = '/mes_quiz';
      })
    }
  });
});