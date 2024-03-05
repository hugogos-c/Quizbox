/**
 * @file public/js/scripts/modifier_infos.js
 * @author Hugo CIRETTE & Nathan EPRON
 */

// Permet d'utiliser socket.io
const socket = io();

// Connexion au serveur
socket.on('connect', () => {
  const idAdmin = document.location.href.split('/')[4];

  // Si l'admin n'est pas connecté, redirige vers la page de connexion
  if (!sessionStorage.getItem('nomAdmin')) {
    document.location.href = '/connexion';
  }

  document.querySelector('#modifier').addEventListener('click', () => {
    document.location.href = `/admin/${idAdmin}/modifier`;
  });

  document.querySelector('#deconnexion').addEventListener('click', () => {
    sessionStorage.removeItem('nomAdmin');
    document.location.href = '/connexion';
  });

  // Transforme les textes en inputs
  const modifierInfos = () => {
    document.querySelector('#modifier_infos').querySelector('.modifier').addEventListener('click', () => {
      const emailDiv = document.querySelector('#email');
      const nomDiv = document.querySelector('#nom');

      const emailChamps = emailDiv.innerHTML.split(':');
      const nomChamps = nomDiv.innerHTML.split(':');

      emailDiv.innerHTML = `<input type="text" id="modifier${emailChamps[0].trim()}" placeholder="${emailChamps[0].trim()}" value="${emailChamps[1].trim()}">`;
      nomDiv.innerHTML = `<input type="text" id="modifier${nomChamps[0].trim()}" placeholder="${nomChamps[0].trim()}" value="${nomChamps[1].trim()}">`;

      document.querySelector('#modifier_infos').innerHTML = `<button class="enregistrer">Enregistrer les informations</button>`;

      document.querySelector('#modifier_infos').querySelector('.enregistrer').addEventListener('click', () => {
        const emailDiv = document.querySelector('#modifierEmail');
        const nomDiv = document.querySelector('#modifierNom');

        socket.emit('modifier_compte', sessionStorage.getItem('nomAdmin'), emailDiv.value, nomDiv.value);
      });
    });

    socket.on('modifier_compte', (data) => {
      // Convertit les données JSON en objet JavaScript
      const admin = JSON.parse(data);

      sessionStorage.setItem('nomAdmin', admin.admins_nom);

      const emailDiv = document.querySelector('#email');
      const nomDiv = document.querySelector('#nom');

      emailDiv.innerHTML = `Email : ${admin.admins_email}`;
      nomDiv.innerHTML = `Nom : ${admin.admins_nom}`;

      document.querySelector('#modifier_infos').innerHTML = `<button class="modifier">Modifier les informations</button>`;

      modifierInfos();
    });
  };

  modifierInfos();

  const modifierMdp = () => {
    document.querySelector('#modifier_mdp').querySelector('.modifier').addEventListener('click', () => {
      document.querySelector('#modifier_mdp_champs').innerHTML = `
      <input type="text" id="ancienMdp" placeholder="Ancien mot de passe">
      <br>
      <input type="text" id="nouveauMdp" placeholder="Nouveau mot de passe">
      <br>
      <input type="text" id="confirmerMdp" placeholder="Confirmer mot de passe">
      `;

      document.querySelector('#modifier_mdp').innerHTML = `<button class="enregistrer">Enregistrer mot de passe</button>`;

      document.querySelector('#modifier_mdp').querySelector('.enregistrer').addEventListener('click', () => {
        socket.emit('recuperer_mdp_admin', idAdmin);
      });

      socket.on('recuperer_mdp_admin', (mdp) => {
        const ancienMdp = document.querySelector('#ancienMdp');
        const nouveauMdp = document.querySelector('#nouveauMdp');
        const confirmerMdp = document.querySelector('#confirmerMdp');

        if (ancienMdp.value === mdp) {
          if (nouveauMdp.value === confirmerMdp.value) {
            socket.emit('modifier_mdp', sessionStorage.getItem('nomAdmin'), nouveauMdp.value);
          } else {
            alert('Les mots de passe ne sont pas identiques');
          }
        } else {
          alert(`L'ancien mot de passe est incorrecte`);
        }
      });
    });

    socket.on('modifier_mdp', () => {
      document.querySelector('#modifier_mdp').innerHTML = `<button class="modifier">Modifier mot de passe</button>`;

      document.querySelector('#modifier_mdp_champs').innerHTML = '';

      modifierMdp();
    });
  };

  modifierMdp();

  document.querySelector('#Supprimer-compte').addEventListener('click', () => {
    const confirmationDialogue = document.querySelector('#confirmation-dialogue');
    confirmationDialogue.style.display = 'block';

    const okBouton = confirmationDialogue.querySelector('.confirmation-dialogue-ok');
    const annulerBouton = confirmationDialogue.querySelector('.confirmation-dialogue-annuler');

    okBouton.addEventListener('click', () => {
      socket.emit('supprimer_compte', idAdmin);
      document.location.href = '/connexion';
    });

    annulerBouton.addEventListener('click', () => {
      confirmationDialogue.style.display = 'none';
    });
  });
});