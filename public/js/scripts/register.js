/**
 * @file public/js/scripts/register.js
 * @author Hugo CIRETTE & Nathan EPRON
 */

// Permet d'utiliser socket.io
const socket = io();

// Connexion au serveur
socket.on('connect', () => {
  // Séléctionne l'élément qui contient l'id 'se_connecter' (l'id peut être changé) puis écoute l'évènement 'click'
  document.querySelector('#submit-btn').addEventListener('click', (e) => {

    // Empêche l'envoi du formulaire (s'il y en a un)
    e.preventDefault();

    // Récupère le code PIN dans l'url et le pseudo du joueur
    const codePin = document.location.href.split('/')[3];
    const joueur = document.querySelector('#Nom-input').value;

    // Stocke le pseudo du joueur dans une session
    const nomInput = document.getElementById("Nom-input");
    const nomJoueur = nomInput.value;
    sessionStorage.setItem("nomJoueur", nomJoueur);

    // Envoie une requête au serveur pour dire qu'on veut associer un joueur à un certain questionnaire qui contient le code PIN codePin
    socket.emit('ajouter_joueur_lobby', codePin, joueur);

    // Si le code PIN n'est associé à aucun questionnaire, on met un message d'erreur
    socket.on('ajouter_joueur_lobby_erreur', () => {
      // Remplacer ce console.log() par une apparition d'un message d'erreur par exemple
      console.log('Ce lobby n\'existe pas');
    });

    document.location.href = '/' + codePin + '/lobby';
  });
});