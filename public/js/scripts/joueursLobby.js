/**
 * @file public/js/scripts/joueursLobby.js
 * @author Hugo CIRETTE & Nathan EPRON
 */

// Permet d'utiliser socket.io
const socket = io();

// Connexion au serveur
socket.on('connect', () => {
  const codePin = document.location.href.split('/')[3];

  socket.emit('recuperer_id');

  socket.on('recuperer_id', (id) => {
    sessionStorage.setItem('socketId', id);
    socket.emit('bonne_page', id);

    socket.on('bonne_page', (paramPage, paramNumQuestion) => {
      if (paramNumQuestion !== null) {
        if (document.location.href.split('/')[4] !== paramNumQuestion) {
          document.location.href = `/${codePin}/${paramPage}/${paramNumQuestion}`;
        } else {
          // Change de page
          socket.on('changer_page', (kick, codePin, joueurPseudo) => {
            // Si l'admin kick le joueur
            if (kick === true) {
              if (joueurPseudo === sessionStorage.nomJoueur) {
                document.location.href = `/${codePin}/pseudo`;
              }

              // Si l'admin clique sur le bouton 'Démmarer'
            } else {
              if (codePin === document.location.href.split('/')[3]) {
                document.location.href = `/${codePin}/question/1`;
              }
            }
          });
        }
      }
    });
  });
});