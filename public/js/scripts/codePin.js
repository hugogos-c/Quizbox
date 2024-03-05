/**
 * @file public/js/scripts/codePin.js
 * @author Hugo CIRETTE & Nathan EPRON
 */

// Permet d'utiliser socket.io
const socket = io();

// Connexion au serveur
socket.on('connect', () => {
  // Récupère l'élément qui contient l'id 'se_connecter' (l'id peut être changé) puis écoute l'évènement 'click'
  document.querySelector('#submit-btn').addEventListener('click', (e) => {
    // Empêche l'envoi du formulaire
    e.preventDefault();

    // Récupère le code PIN
    const codePin = document.querySelector('#pin-input').value;

    // Envoie une requête au serveur pour dire qu'on veut se connecter au questionnaire
    socket.emit('se_connecter_questionnaire', codePin);
  });

  // Si un questionnaire ne contient pas de code PIN, on fait apparaître le message d'erreur
  socket.on('se_connecter_questionnaire_erreur', () => {
    message.style.display = "flex";
    setTimeout(() => {
      message.style.display = "none";
      input.value = "";
    }, 2000);
  });

  // Si un questionnaire contient un code PIN
  socket.on('se_connecter_questionnaire', (codePin) => {

    //  On change de page pour pouvoir rentrer son pseudo
    document.location.href = `/${codePin}/pseudo`;
  });
});