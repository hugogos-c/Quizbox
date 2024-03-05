/**
 * @file public/js/scripts/apercu_questionnaire.js
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

  document.querySelector('#modifier').addEventListener('click', () => {
    socket.emit('recuperer_admin', sessionStorage.getItem('nomAdmin'));
  });

  socket.on('recuperer_admin', (admin) => {
    document.location.href = `/admin/${admin.id}/modifier`;
  });

  document.querySelector('#deconnexion').addEventListener('click', () => {
    sessionStorage.removeItem('nomAdmin');
    document.location.href = '/connexion';
  });

  // Récupère l'id du questionnaire
  const idQuestionnaire = document.location.href.split('/')[4];

  // Envoie une requête au serveur pour dire que l'on veut récupérer le questionnaire pour l'aperçu
  socket.emit('recuperer_questionnaire', 'id', idQuestionnaire);

  // Récéptionne le questionnaire au format JSON pour l'afficher dans l'accueil
  socket.on('recuperer_questionnaire', (data) => {
    // Convertit la donnée en objet JavaScript
    const questionnaire = JSON.parse(data);

    document.querySelector('#apercu').innerHTML += `
    <div class="Desc-Questionnaire">
      <div class="Desc-Pincipal-Questionnaire">
        <h1 class ="titre-questionnaire">${questionnaire.questionnaires_titre}</h1>
        <br>
        <p class ="description-questionnaire">${questionnaire.questionnaires_description}</p>
        <br>
        <img class="img-quest-size" src="${questionnaire.questionnaires_image}" alt="${questionnaire.questionnaires_titre}">
        <br>
        <p class="section-questionnaire">${questionnaire.questionnaires_dossier}</p>
        <div class="btn-Apercue-Quest">
          <button id="lancer-questionnaire" class="bouton-jouer">Jouer</button>
          <button id="Modifier-questionnaire" class="bouton-Modifier">Modifier</button>
        </div>
      </div>
      <div id="questions-desc"></div>
    </div>
    <button id="Supprimer-questionnaire" class="bouton-Supprimer">Supprimer</button>
    <div id="confirmation-dialogue" class="confirmation-dialogue">
      <h2 class="confirmation-dialogue-titre">Confirmation</h2>
      <p class="confirmation-dialogue-message">Êtes-vous sûr de vouloir supprimer ce questionnaire ?</p>
      <div class="bouton-dialogue">
        <button class="confirmation-dialogue-annuler">Annuler</button>
        <button class="confirmation-dialogue-ok">Confirmer</button>
      </div>
    </div>
    `;

    questionnaire.Questions.forEach((question, NumQuestions) => {
      document.querySelector('#questions-desc').innerHTML += `
      <div id="question_${question.questions_id}" class="Question-Desc-All">
        <div class="Question-desc-div">
          <p class="texte-questionnaire-titre">${NumQuestions + 1} - Quiz</p>
          <p class="texte-questionnaire">${question.questions_texte}</p>
        </div>
        <div class="Question-desc-img" id="QDI">
          <img src="${question.questions_image}" alt="${question.questions_texte}">
        </div>
      </div>
      `;
    });

    document.querySelector('#lancer-questionnaire').addEventListener('click', () => {
      socket.emit('parametrer_code_pin', idQuestionnaire);
    });

    document.querySelector('#Modifier-questionnaire').addEventListener('click', () => {
      document.location.href = `/questionnaire/${questionnaire.questionnaires_id}/modifier`;
    });

    document.querySelector('#Supprimer-questionnaire').addEventListener('click', () => {
      const confirmationDialogue = document.querySelector('#confirmation-dialogue');
      confirmationDialogue.style.display = 'block';

      const okBouton = confirmationDialogue.querySelector('.confirmation-dialogue-ok');
      const annulerBouton = confirmationDialogue.querySelector('.confirmation-dialogue-annuler');

      okBouton.addEventListener('click', () => {
        socket.emit('supprimer_questionnaire', idQuestionnaire);
        confirmationDialogue.style.display = 'none';
      });

      annulerBouton.addEventListener('click', () => {
        confirmationDialogue.style.display = 'none';
      });
    });
  });

  socket.on('parametrer_code_pin', (codePin) => {
    document.location.href = `/admin/${codePin}/lobby`;
  });

  socket.on('supprimer_questionnaire', () => {
    document.location.href = '/mes_quiz';
  });

  socket.emit('recuperer_historique', idQuestionnaire);

  socket.on('recuperer_historique', (data) => {
    if (data === '[]') {
      // Si le questionnaire n'a pas encore été joué
      document.querySelector('#historique').innerHTML = `Ce quiz n'a pas encore été joué`;
    } else {
      // Si le questionnaire à été joué
      const historiques = JSON.parse(data);

      historiques.forEach(historique => {
        if (historique.historiques_numQuestion === null) {
          document.querySelector('#historique').innerHTML += `
          <br>
          <button id="exporter_resultats_${historique.historiques_codePin}" class="exporter">Exporter ${historique.historiques_codePin}</button>
          `;
        }
      });

      historiques.forEach(historique => {
        if (historique.historiques_numQuestion === null) {
          document.querySelector(`#exporter_resultats_${historique.historiques_codePin}`).addEventListener('click', () => {
            socket.emit('exporter_resultats', historique.historiques_codePin);
          });
        }
      });
    }
  });

  socket.on('exporter_resultats', (resultatCSV) => {
    const download = document.createElement('a');
    download.setAttribute('href', `/downloads/${resultatCSV}`);
    download.setAttribute('download', resultatCSV);
    download.click();
  });
});