/**
 * @file public/js/scripts/questionnaires.js
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

  const nomAdmin = sessionStorage.getItem('nomAdmin');
  const url = document.location.href.split('/');
  const idDossier = url[4];

  if (url[3] === 'mes_quiz') {
    // Bouton créer un dossier
    const questionnairesDiv = document.querySelector('#questionnaires');
    const buttonCreerDossier = document.createElement('button');
    buttonCreerDossier.setAttribute('class', 'btn-cree-dossier');
    buttonCreerDossier.setAttribute('data-bs-toggle', 'modal');
    buttonCreerDossier.setAttribute('data-bs-target', '#exampleModal');
    buttonCreerDossier.innerHTML += 'Créer un Dossier';
    questionnairesDiv.after(buttonCreerDossier);

    document.querySelector('.section-bar').innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Créer un dossier</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label for="fileName" class="form-label">Nom du dossier :</label>
            <input type="text" class="form-control" id="fileName">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-annuler" data-bs-dismiss="modal">Annuler</button>
            <button type="button" id="creer_dossier" data-bs-dismiss="modal" class="btn-cree-dossier">Créer</button>
          </div>
        </div>
      </div>
    </div>
    `;

    document.querySelector('#creer_dossier').addEventListener('click', () => {
      const fileName = document.querySelector('#fileName').value.trim();
      if (fileName === '') {
        alert("Veuillez entrer un nom de dossier.");
      } else {
        socket.emit('creer_dossier', nomAdmin, fileName);
      }
    });

    socket.on('creer_dossier', () => {
      document.querySelector('#questionnaires').innerHTML = '';
      socket.emit('recuperer_dossiers', nomAdmin);
      socket.emit('recuperer_questionnaires_dossier', nomAdmin, 1);
    });

    // Envoie une requête au serveur pour dire que l'on veut récupérer les questionnaires qui n'ont pas de dossier
    socket.emit('recuperer_questionnaires_dossier', nomAdmin, 1);
  }

  if (url[3] === 'dossier') {
    socket.emit('recuperer_dossier', idDossier);

    socket.emit('recuperer_questionnaires_dossier', nomAdmin, idDossier);

    const questionnairesDiv = document.querySelector('#questionnaires');

    // Bouton modifier un dossier
    const buttonModifierDossier = document.createElement('button');
    buttonModifierDossier.setAttribute('class', 'btn-cree-dossier');
    buttonModifierDossier.setAttribute('data-bs-toggle', 'modal');
    buttonModifierDossier.setAttribute('data-bs-target', '#exampleModal');
    buttonModifierDossier.innerHTML = 'Modifier le dossier';
    questionnairesDiv.after(buttonModifierDossier);

    document.querySelector('.section-bar').innerHTML += `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modifier le dossier</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label for="fileName" class="form-label">Nom du dossier :</label>
            <input type="text" class="form-control" id="fileName">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-annuler" data-bs-dismiss="modal">Annuler</button>
            <button type="button" id="modifier_dossier" data-bs-dismiss="modal" class="btn-cree-dossier">Modifier</button>
          </div>
        </div>
      </div>
    </div>
    `;

    // Bouton supprimer un dossier
    document.querySelector('.section-bar').innerHTML += `
    <button id="Supprimer-dossier" class="bouton-Supprimer-Dossier">Supprimer le dossier</button>
    <div id="confirmation-dialogue" class="confirmation-dialogue">
      <h2 class="confirmation-dialogue-titre">Confirmation</h2>
      <p class="confirmation-dialogue-message">Êtes-vous sûr de vouloir supprimer ce dossier ?</p>
      <div class="bouton-dialogue">
        <button class="confirmation-dialogue-annuler">Annuler</button>
        <button class="confirmation-dialogue-ok">Confirmer</button>
      </div>
    </div>
    `;

    document.querySelector('#modifier_dossier').addEventListener('click', () => {
      const fileName = document.querySelector('#fileName').value.trim();
      if (fileName === '') {
        alert("Veuillez entrer un nom de dossier.");
      } else {
        socket.emit('modifier_dossier', idDossier, fileName);
      }
    });

    document.querySelector('#Supprimer-dossier').addEventListener('click', () => {
      const confirmationDialogue = document.querySelector('#confirmation-dialogue');
      confirmationDialogue.style.display = 'block';

      const okBouton = confirmationDialogue.querySelector('.confirmation-dialogue-ok');
      const annulerBouton = confirmationDialogue.querySelector('.confirmation-dialogue-annuler');

      okBouton.addEventListener('click', () => {
        socket.emit('supprimer_dossier', idDossier);
        confirmationDialogue.style.display = 'none';
      });

      annulerBouton.addEventListener('click', () => {
        confirmationDialogue.style.display = 'none';
      });
    });
  }

  socket.on('modifier_dossier', () => {
    socket.emit('recuperer_dossier', idDossier);
  });

  socket.on('supprimer_dossier', () => {
    document.location.href = '/mes_quiz';
  });

  if (url[3] === 'bibliotheque') {
    document.querySelector('#nomDossier').innerHTML += 'Bibliothèque';
    document.querySelector('#nomDossier').style.display = '';
    socket.emit('recuperer_questionnaires');
  }

  socket.on('recuperer_dossier', (data) => {
    // Convertit la donnée JSON en objet JavaScript
    const dossier = JSON.parse(data);

    document.querySelector('#nomDossier').style.display = '';
    document.querySelector('#nomDossier').innerHTML = dossier.dossiers_nom;
  });

  if (url[3] !== 'accueil') {
    socket.emit('recuperer_dossiers', nomAdmin);
  }

  socket.on('recuperer_dossiers', (data) => {
    // Convertit la donnée en objet JavaScript
    const dossiers = JSON.parse(data);

    const dropdownMenu = document.querySelector('#dossiers-dropdown');

    dropdownMenu.innerHTML = '';
    dossiers.dossiersAdmin.forEach(dossier => {
      if (dossier.dossiers_nom !== 'Aucun') {
        dropdownMenu.innerHTML += `
        <li>
          <a class="dropdown-item" href="/dossier/${dossier.dossiers_id}">${dossier.dossiers_nom}</a>
        </li>
        `;
      }
    });

    if (url[3] === 'mes_quiz') {
      dossiers.dossiersCompte.forEach(dossier => {
        document.querySelector('#questionnaires').innerHTML += `
        <div id="dossiers_${dossier.dossiers_id}">
          <a href="/dossier/${dossier.dossiers_id}" class="balise-a">
            <img src="/images/admins/dossier.png" alt="QuizBox Logo" style="width: 150px;">
            <span class="titre card-title" style="color: white;">${dossier.dossiers_nom}</span>
          </a>
        </div>
        `;
      });
    }
  });

  // Récéptionne le questionnaire pour l'afficher dans l'accueil
  socket.on('recuperer_questionnaires_dossier', (data) => {
    // Convertit la donnée en objet JavaScript
    const questionnaires = JSON.parse(data);

    questionnaires.forEach(questionnaire => {
      document.querySelector('#questionnaires').innerHTML += `
      <div id="questionnaire_${questionnaire.questionnaires_id}" class="card">
        <a href="/questionnaire/${questionnaire.questionnaires_id}" class="balise-a">
          <div class="card-img">
            <img class="img-affichage-bliblio" src="${questionnaire.questionnaires_image}" alt="${questionnaire.questionnaires_titre}">
          </div>
          <div class="card-title">
            <span class="titre card-title">${questionnaire.questionnaires_titre}</span>
          </div>
        </a>
      </div>
      `;
    });
  });

  socket.on('recuperer_questionnaires', (data) => {
    // Convertit la donnée JSON en objet JavaScript
    const questionnaires = JSON.parse(data);

    questionnaires.forEach(questionnaire => {
      document.querySelector('#questionnaires').innerHTML += `
      <div id="questionnaire_${questionnaire.questionnaires_id}" class="card">
        <a href="/questionnaire/${questionnaire.questionnaires_id}" class="balise-a">
          <div class="card-img">
            <img class="img-affichage-bliblio" src="${questionnaire.questionnaires_image}" alt="${questionnaire.questionnaires_titre}">
          </div>
          <div class="card-title">
            <span class="titre card-title">${questionnaire.questionnaires_titre}</span>
          </div>
        </a>
      </div>
      `;
    });
  });
});