/**
 * @file public/js/scripts/adminsJeu.js
 * @author Hugo CIRETTE & Nathan EPRON & Nathan HAUDEBAULT
 */

// Permet d'utiliser socket.io
const socket = io();

const url = document.location.href.split('/');
const codePin = url[4];
const page = url[5];
var numQuestion = url[6];

// Connexion au serveur
socket.on('connect', () => {
  // Si l'admin n'est pas connecté, redirige vers la page de connexion
  if (!sessionStorage.getItem('nomAdmin')) {
    document.location.href = '/connexion';
  }

  socket.emit('admin');

  socket.on('bonne_page_admin', (socketId) => {
    socket.emit('bonne_page_admin', socketId, page, numQuestion);
  });

  // Constantes
  const Question = document.querySelector('.Question-P');
  const Propositions = document.querySelector('.container-Propositions');
  const Reponses = document.querySelector('.container-Res');
  const Classement = document.querySelector('.leaderboard');
  const Fin = document.querySelector('.ladder-nav--results');

  // Récupère le questionnaire pour le jeu côté admin
  socket.emit('recuperer_questionnaire', 'codePin', codePin);

  socket.on('recuperer_questionnaire', (data) => {
    // Convertit la donnée en objet JavaScript
    const questionnaire = JSON.parse(data);

    // Si on est dans l'interface 'Question'
    if (Question) {
      // Changement de page
      setTimeout(() => {
        socket.emit('changer_page', 'question', codePin, numQuestion);
        document.location.href = `/admin/${codePin}/propositions/${numQuestion}`;
      }, 7000);

      // Initalise ou réinitialise le nombre de réponses sur lesquelles les joueurs a cliqué
      for (let i = 0; i < 4; i++) {
        localStorage.setItem('nb_joueurs_repondus', 0);
        localStorage.setItem(`reponses_${i + 1}`, 0);
      }

      // Affichage des données
      document.querySelector('#numQuestion').innerHTML += `Question ${numQuestion} sur ${questionnaire.Questions.length}`;
      document.querySelector('#question').innerHTML += questionnaire.Questions[numQuestion - 1].questions_texte;
    }

    // Si on est dans l'interface 'Propositions'
    if (Propositions) {
      socket.on('recuperer_temps_restant_admin', (id) => {
        const tempsRestant = document.querySelector('#timer').innerHTML;
        socket.emit('recuperer_temps_restant_admin', tempsRestant, id);
      });

      // Récuperation de l'image
      const image = document.querySelector('#image');
      image.alt = questionnaire.Questions[numQuestion - 1].questions_texte;
      image.src = questionnaire.Questions[numQuestion - 1].questions_image;

      // Timer pour les propositions
      var count = questionnaire.Questions[numQuestion - 1].questions_chrono;
      document.querySelector('#timer').innerHTML = count;

      // Change de page au bout de n secondes
      setInterval(() => {
        count--;
        document.querySelector('#timer').innerHTML = count;
        if (count == 0) {
          socket.emit('changer_page', 'propositions', codePin, numQuestion);
          document.location.href = `/admin/${codePin}/resultats/${numQuestion}`;
        }
      }, 1000);

      // Ou au clique de l'admin
      document.querySelector('#bouton-suivant').addEventListener('click', () => {
        socket.emit('changer_page', 'propositions', codePin, numQuestion);
        document.location.href = `/admin/${codePin}/resultats/${numQuestion}`;
      });

      // Affichage des données
      document.querySelector('#numQuestion').innerHTML = `Question ${numQuestion} sur ${questionnaire.Questions.length}`;
      document.querySelector('#question').innerHTML = questionnaire.Questions[numQuestion - 1].questions_texte;

      const propositions = document.querySelector('#propositions').querySelectorAll('span');

      for (let i = 0; i < propositions.length; i++) {
        propositions[i].innerHTML = questionnaire.Questions[numQuestion - 1].Propositions[i].propositions_texte;
      }
    }

    // Si on est dans l'interface 'Reponses'
    if (Reponses) {
      // Permet d'afficher le statut des réponses (correctes ou incorrectes)
      var correctes = [];
      questionnaire.Questions[numQuestion - 1].Propositions.forEach(proposition => {
        if (proposition.propositions_correcte === 1) {
          correctes.push('✔️');
        } else {
          correctes.push('❌');
        }
      });

      // Affiche un graphique en fonction des réponses sur lesquelles les joueurs ont cliqués
      const reponses = document.querySelector('.container-Res').querySelectorAll('p');
      reponses[0].innerHTML = `${localStorage.getItem(`reponses_${1}`)} ${correctes[0]}`;
      reponses[1].innerHTML = `${localStorage.getItem(`reponses_${3}`)} ${correctes[2]}`;
      reponses[2].innerHTML = `${localStorage.getItem(`reponses_${4}`)} ${correctes[3]}`;
      reponses[3].innerHTML = `${localStorage.getItem(`reponses_${2}`)} ${correctes[1]}`;

      document.querySelector('.red-Resultat-block').style.height = parseInt(document.querySelector('.red-zone-graph').textContent) * 20 + 'px';
      document.querySelector('.blue-Resultat-block').style.height = parseInt(document.querySelector('.blue-zone-graph').textContent) * 20 + 'px';
      document.querySelector('.green-Resultat-block').style.height = parseInt(document.querySelector('.green-zone-graph').textContent) * 20 + 'px';
      document.querySelector('.orange-Resultat-block').style.height = parseInt(document.querySelector('.orange-zone-graph').textContent) * 20 + 'px';

      // Affichage des données
      document.querySelector('#numQuestion').innerHTML = `Question ${numQuestion} sur ${questionnaire.Questions.length}`;
      document.querySelector('#question').innerHTML = questionnaire.Questions[numQuestion - 1].questions_texte;
      const propositions = document.querySelector('#propositions').querySelectorAll('span');

      for (let i = 0; i < propositions.length; i++) {
        propositions[i].innerHTML = `${questionnaire.Questions[numQuestion - 1].Propositions[i].propositions_texte} ${correctes[i]}`;
      }

      // Si on est à la dernère question
      if (numQuestion == questionnaire.Questions.length) {
        document.querySelector('#bouton-suivant').addEventListener('click', () => {
          socket.emit('changer_page', 'fin', codePin);
          document.location.href = `/admin/${codePin}/classement`;
        });

        // Si on n'est pas à la dernère question
      } else {
        document.querySelector('#bouton-suivant').addEventListener('click', () => {
          document.location.href = `/admin/${codePin}/classement/${numQuestion}`;
        });
      }
    }

    // Si on est dans l'interface 'Classement'
    if (Classement) {
      socket.emit('recuperer_classement', codePin);

      socket.on('recuperer_classement', (classement) => {
        // Affiche les 5 premiers joueurs
        var limit = 5;
        if (limit > classement.length) {
          limit = classement.length;
        }
        for (let i = 0; i < limit; i++) {
          document.querySelector('ol').innerHTML += `
          <li>
            <mark>${classement[i].joueurs_pseudo}</mark>
            <small>${classement[i].joueurs_score}</small>
          </li>
          `;
        }
      });

      // Passe à la question suivante
      document.querySelector('#bouton-suivant').addEventListener('click', () => {
        socket.emit('changer_page', 'reponses', codePin, numQuestion);
        document.location.href = `/admin/${codePin}/question/${parseInt(numQuestion) + 1}`;
      });

      // Affichage des données
      document.querySelector('#numQuestion').innerHTML += `Question ${numQuestion} sur ${questionnaire.Questions.length}`;
    }
  });

  socket.on('envoyer_reponse', (numReponse) => {
    const nbReponses = parseInt(localStorage.getItem(`reponses_${numReponse}`));
    localStorage.setItem(`reponses_${numReponse}`, nbReponses + 1);
  });

  // Si on est dans l'interface 'Classement final'
  if (Fin) {
    socket.emit('recuperer_classement', codePin);

    socket.on('recuperer_classement', (classement) => {
      document.querySelector('#scrims-ladder--results').innerHTML = '';
      for (let i = 0; i < classement.length; i++) {
        document.querySelector('#scrims-ladder--results').innerHTML += `
        <div class="ladder-nav--results-players">
          <div class="results-col">
            <span class="results-rank"><span class="positions">${i + 1}</span></span>
          </div>
          <div class="results-col">
            <span class="results-team">${classement[i].joueurs_pseudo}</span>
          </div>
          <div class="results-col">
            <span class="results-pts">${classement[i].joueurs_score}</span>
          </div>
        </div>
        `;
      }

      document.querySelector('.ladder-search').addEventListener('keyup', (e) => {
        // Permet de rechercher les données d'un joueur via son rang, son pseudo ou son score
        document.querySelectorAll('.ladder-nav--results-players').forEach(div => {
          const filtre = e.target.value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
          const rang = div.querySelector('.results-rank').querySelector('.positions').innerHTML;
          const pseudo = div.querySelector('.results-team').innerHTML;
          const score = div.querySelector('.results-pts').innerHTML;
          if (rang.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(filtre) == -1 &&
            pseudo.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(filtre) == -1 &&
            score.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(filtre) == -1) {
            div.style.display = 'none';
          } else {
            div.style.display = '';
          }
        });
      });
    });

    document.querySelector('#exporter_resultats').addEventListener('click', () => {
      socket.emit('exporter_resultats', codePin);
    });

    socket.on('exporter_resultats', (resultatCSV) => {
      const download = document.createElement('a');
      download.setAttribute('href', `/downloads/${resultatCSV}`);
      download.setAttribute('download', resultatCSV);
      download.click();
    });

    // Retourne au lobby
    document.querySelector('#bouton-suivant').addEventListener('click', () => {
      document.location.href = `/admin/${codePin}/lobby`;
    });
  }
});