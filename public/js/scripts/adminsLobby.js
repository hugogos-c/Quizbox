/**
 * @file public/js/scripts/adminsLobby.js
 * @author Hugo CIRETTE & Nathan EPRON & Nathan HAUDEBAULT
 */

// Permet d'utiliser socket.io
const socket = io();

// Connexion au serveur
socket.on('connect', () => {
  // Si l'admin n'est pas connecté, redirige vers la page de connexion
  if (!sessionStorage.getItem('nomAdmin')) {
    document.location.href = '/connexion';
  }

  socket.emit('admin');

  socket.on('bonne_page_admin', (socketId) => {
    socket.emit('bonne_page_admin', socketId, document.location.href.split('/')[4], document.location.href.split('/')[5]);
  });

  // Récupère le code PIN
  const codePin = document.location.href.split('/')[4];

  socket.emit('recuperer_joueurs_lobby', codePin);

  // Récéptionne la liste des joueurs
  socket.on('recuperer_joueurs_lobby', (data) => {
    // Convertit la donnée en objet JavaScript
    const joueurs = JSON.parse(data);

    // Récupère la liste des joueurs
    var listeJoueurs = document.querySelector('#liste_joueurs');
    listeJoueurs.innerHTML = '';

    // Affichage des joueurs dans le lobby
    if (joueurs.length > 0) {
      document.querySelector('#attente-joueurs').style.display = 'none';
      joueurs.forEach(joueur => {
        listeJoueurs.innerHTML += `
        <p id="joueur_${joueur.joueurs_id}" class="joueur-lobby">${joueur.joueurs_pseudo}&nbsp;<a id="suppr_joueur_${joueur.joueurs_id}" class="Suppr-Lobby">❌</a></p>
        `;
      })
    }

    // Permet de kick les joueurs
    joueurs.forEach(joueur => {
      document.querySelector(`#suppr_joueur_${joueur.joueurs_id}`).addEventListener('click', () => {
        socket.emit('supprimer_joueur_lobby', joueur.joueurs_pseudo);
        socket.emit('changer_page', true, codePin, joueur.joueurs_pseudo);
        socket.emit('recuperer_joueurs_lobby', codePin);
      });
    });
  });

  // Démarre le questionnaire
  document.querySelector('#bouton-demarrer').addEventListener('click', () => {
    socket.emit('maj_historique', codePin);

    socket.on('maj_historique', () => {
      socket.emit('changer_page', false, codePin);
      document.location.href = `/admin/${codePin}/question/1`;
    });
  });
});