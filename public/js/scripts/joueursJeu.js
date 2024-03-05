/**
 * @file public/js/scripts/joueursJeu.js
 * @author Hugo CIRETTE & Nathan EPRON
 */

// Permet d'utiliser socket.io
const socket = io();

const url = document.location.href.split('/');
const codePin = url[3];
const page = url[4];
var numQuestion = url[5];

// Connexion au serveur
socket.on('connect', () => {
  socket.emit('recuperer_id');
  socket.on('recuperer_id', (id) => {
    sessionStorage.setItem('socketId', id);
    socket.emit('bonne_page', id);
  });

  // Récupération du pseudo du joueur, du code PIN et du numéro de la question
  const pseudoJoueur = document.querySelector('#PseudoJoueur').innerHTML;

  socket.on('bonne_page', (paramPage, paramNumQuestion) => {
    console.log(paramPage);
    if (paramNumQuestion !== null) {
      if (paramPage !== 'classement' && (page !== paramPage || numQuestion !== paramNumQuestion)) {
        if (paramNumQuestion === 'lobby') {
          document.location.href = `/${codePin}/${paramNumQuestion}`;
        } else {
          document.location.href = `/${codePin}/${paramPage}/${paramNumQuestion}`;
        }
      } else {
        // Gère les changements de page
        socket.on('changer_page', (etat, codePin, numQuestion) => {
          if (codePin === document.location.href.split('/')[3]) {
            switch (etat) {
              case 'question':
                document.location.href = `/${codePin}/propositions/${numQuestion}`;
                break;

              case 'propositions':
                document.location.href = `/${codePin}/resultats/${numQuestion}`;
                break;

              case 'reponses':
                document.location.href = `/${codePin}/question/${parseInt(numQuestion) + 1}`;
                break;

              case 'fin':
                document.location.href = `/${codePin}/lobby`;
                break;

              default:
                break;
            }
          }
        });

        socket.emit('recuperer_score_joueur', pseudoJoueur);

        socket.on('recuperer_score_joueur', (score) => {
          document.querySelector('.text-Score-Block').innerHTML = score;
        });

        socket.emit('recuperer_nombre_questions', codePin);

        socket.on('recuperer_nombre_questions', (nbQuestions) => {
          document.querySelector('#nbQuestions').innerHTML = nbQuestions;
        });

        // Récupération des boutons
        const redButton = document.querySelector('.red-button');
        const blueButton = document.querySelector('.blue-button');
        const greenButton = document.querySelector('.green-button');
        const orangeButton = document.querySelector('.orange-button');
        if (document.querySelector('.Body-Button')) {
          // Par défaut reponse est paramétré à -1 (permet d'avoir une valeur si on ne répond pas)
          sessionStorage.setItem('reponse', -1);
          sessionStorage.setItem('score', 0);
        }

        // Si on clique sur le bouton rouge
        if (redButton) {
          redButton.addEventListener('click', () => {
            localStorage.setItem('nb_joueurs_repondus', parseInt(localStorage.getItem('nb_joueurs_repondus')) + 1);
            const numProposition = 1;
            socket.emit('envoyer_reponse', numProposition);
            socket.emit('recuperer_temps_restant', sessionStorage.getItem('socketId'));

            socket.on('recuperer_temps_restant', (tempsRestant) => {
              socket.emit('verifier_propositions', codePin, numQuestion, numProposition, tempsRestant, pseudoJoueur);
            });
          });
        }

        // Si on clique sur le bouton jaune
        if (blueButton) {
          blueButton.addEventListener('click', () => {
            localStorage.setItem('nb_joueurs_repondus', parseInt(localStorage.getItem('nb_joueurs_repondus')) + 1);
            const numProposition = 2;
            socket.emit('envoyer_reponse', numProposition);
            socket.emit('recuperer_temps_restant', sessionStorage.getItem('socketId'));

            socket.on('recuperer_temps_restant', (tempsRestant) => {
              socket.emit('verifier_propositions', codePin, numQuestion, numProposition, tempsRestant, pseudoJoueur);
            });
          });
        }

        // Si on clique sur le bouton vert
        if (greenButton) {
          greenButton.addEventListener('click', () => {
            localStorage.setItem('nb_joueurs_repondus', parseInt(localStorage.getItem('nb_joueurs_repondus')) + 1);
            const numProposition = 3;
            socket.emit('envoyer_reponse', numProposition);
            socket.emit('recuperer_temps_restant', sessionStorage.getItem('socketId'));

            socket.on('recuperer_temps_restant', (tempsRestant) => {
              socket.emit('verifier_propositions', codePin, numQuestion, numProposition, tempsRestant, pseudoJoueur);
            });
          });
        }

        // Si on clique sur le bouton orange
        if (orangeButton) {
          orangeButton.addEventListener('click', () => {
            localStorage.setItem('nb_joueurs_repondus', parseInt(localStorage.getItem('nb_joueurs_repondus')) + 1);
            const numProposition = 4;
            socket.emit('envoyer_reponse', numProposition);
            socket.emit('recuperer_temps_restant', sessionStorage.getItem('socketId'));

            socket.on('recuperer_temps_restant', (tempsRestant) => {
              socket.emit('verifier_propositions', codePin, numQuestion, numProposition, tempsRestant, pseudoJoueur);
            });
          });
        }

        // Vérifie la proposition entrée par le joueur
        socket.on('verifier_propositions', (correcte, score) => {
          if (correcte === true) {
            sessionStorage.setItem('reponse', 1);
          } else {
            sessionStorage.setItem('reponse', 0);
          }

          // Stocke le score pour l'affichage
          sessionStorage.setItem('score', score);

          if (document.querySelector('.Body-Button')) {
            // Fais disparaître les boutons au clique pour ne pas changer de réponse
            document.querySelector('.Body-Button').remove();
          }
        });

        if (document.querySelector('.Body-Rep-Resultat')) {
          // Si c'est une bonne réponse
          if (sessionStorage.getItem('reponse') == 1) {
            document.querySelector('.img-Vrai').setAttribute('src', '/images/joueurs/Vrai.png');
            document.querySelector('.txt-Vrai').innerHTML = `Bonne réponse ! continue comme ça !<br><br><div id="score">+ ${sessionStorage.getItem('score')}</div>`;

            // Si c'est une mauvaise réponse
          } else if (sessionStorage.getItem('reponse') == 0) {
            document.querySelector('.img-Faux').setAttribute('src', '/images/joueurs/Faux.png');
            document.querySelector('.txt-Faux').innerHTML = 'Mauvaise réponse ! Tu feras mieux la prochaine fois !<br><br><div id="score">+ 0</div>';

            // Si le joueur n'a pas répondu
          } else {
            document.querySelector('.img-NoRep').setAttribute('src', '/images/joueurs/pasdereponse.png');
            document.querySelector('.txt-NoRep').innerHTML = 'Tu n\'as pas eu le temps de répondre... répond plus vite la prochaine fois !<br><br><div id="score">+ 0</div>';

            // Remplis quand même l'historique si le joueur ne répond pas
            socket.emit('remplir_historique', codePin, numQuestion, -1, pseudoJoueur, 0);
          }
        }
      }
    }
  });
});