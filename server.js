/**
 * @file server.js
 * @author Hugo CIRETTE
 */

// Chargements des modules et des fichiers
const express = require('express'); // Chargement de 'express'
const app = express(); // Initialisation d'express
const path = require('path'); // Chargement de 'path'
const http = require('http').createServer(app); // Création du serveur HTTP
const io = require('socket.io')(http); // Chargement de 'socket.io'
const router = require('./router'); // Chargement du fichier 'router.js' qui contient les routes
require('./databaseConnection');

// Constantes
const host = 'localhost';
const port = process.env.PORT || 3000;

// Autorisation d'accès au dossier 'public'
app.use(express.static(path.join('public')));

// Paramétrage des vues en EJS
app.set('views', './views');
app.set('view engine', 'ejs');

// Écoute les connexions des joueurs
io.on('connection', async (socket) => {
  // // Écoute les connexions
  // console.log(`${socket.id} s'est connecté`);

  // // Écoute les déconnexions
  // socket.on('disconnect', () => {
  //   console.log(`${socket.id} s'est déconnecté`);
  // });

  // Parametre le code PIN via l'id d'un questionnaire
  socket.on('parametrer_code_pin', async (idQuestionnaire) => {
    try {
      // Importe et utilise le controller pour paramétrer un code PIN
      const codePin = await require('./controllers/genererCodePin.js')(idQuestionnaire);

      // Renvoie les données
      socket.emit('parametrer_code_pin', codePin);
      console.log(`Code PIN '${codePin}' généré et paramétré avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // À la connexion des joueurs, rejoint le lobby `jeu_${code_pin}`
  socket.on('se_connecter_questionnaire', async (code_pin) => {
    try {
      // Importe et utilise le controller pour se connecter à un lobby
      const codePin = await require('./controllers/connexionLobby.js')(socket, code_pin);

      // Envoie les joueurs qui sont dans le lobby jeu_codePin à la page codePin
      socket.emit('se_connecter_questionnaire', codePin);
      console.log(`Connexion au questionnaire '${codePin}' avec succès`);
    } catch (err) {
      // Si le code PIN n'es associé à aucun questionnaires dans la base de données
      // Envoie un message 'Aucun questionnaire trouvé' au joueur
      socket.emit('se_connecter_questionnaire_erreur');
      console.error('Erreur : ', err);
    }
  });

  // Event pour récupérer un admin
  socket.on('recuperer_admin', async (nomAdmin) => {
    try {
      // Importe et utilise le controller pour recupérer l'admin
      const admin = await require('./controllers/recupererAdmin')(nomAdmin);

      // Renvoie les données au format JSON
      socket.emit('recuperer_admin', admin);
      console.log(`Admin ${nomAdmin} récupéré avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour récupérer le mot de passe d'un admin
  socket.on('recuperer_mdp_admin', async (idAdmin) => {
    try {
      // Importe et utilise le controller pour récupérer le mot de passe d'un admin
      const mdp = await require('./controllers/recupererMdpAdmin')(idAdmin);

      // Renvoie les données au format JSON
      socket.emit('recuperer_mdp_admin', mdp);
      console.log(`Mot de passe de l'admin ${idAdmin} récupéré avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour changer le mot de passe de l'admin
  socket.on('modifier_mdp', async (nomAdmin, nouveauMdp) => {
    try {
      // Importe et utilise le controller pour modifier le mot de passe de l'admin
      await require('./controllers/modifierMdp')(nomAdmin, nouveauMdp);

      // Renvoie les données
      socket.emit('modifier_mdp');
      console.log(`Mot de passe de l'admin '${nomAdmin}' modifié avec succès`);
    } catch (err) {
      console.error('Erreur ', err);
    }
  });

  // Event pour créer un compte admin
  socket.on('creer_compte', async (emailAdmin, nomAdmin, mdpAdmin) => {
    try {
      // Importe et utilise le controller pour créer un compte admin
      await require('./controllers/creerCompteAdmin')(emailAdmin, nomAdmin, mdpAdmin);

      // Renvoie les données
      socket.emit('creer_compte', nomAdmin);
      console.log(`Admin '${nomAdmin}' créé avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour modifier un compte admin
  socket.on('modifier_compte', async (ancienNomAdmin, emailAdmin, nomAdmin) => {
    try {
      // Importe et utilise le controller pour modifier un compte admin
      const admin = await require('./controllers/modifierCompteAdmin')(ancienNomAdmin, emailAdmin, nomAdmin);

      // Renvoie les données
      socket.emit('modifier_compte', admin);
      console.log(`Admin '${ancienNomAdmin}' modifié avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour supprimer un compte admin
  socket.on('supprimer_compte', async (idAdmin) => {
    try {
      // Importe et utilise le controller pour supprimer un compte admin
      await require('./controllers/supprimerCompteAdmin')(idAdmin);

      // Renvoie les données
      // socket.emit('supprimer_compte');
      console.log(`Admin '${idAdmin}' supprimé avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour se connecter avec un compte admin
  socket.on('se_connecter_admin', async (nom, mdp) => {
    try {
      // Importe et utilise le controller pour se connecter à un compte admin
      const connexion = await require('./controllers/seConnecterAdmin')(nom, mdp);

      // Renvoie les données
      socket.emit('se_connecter_admin', connexion, nom);
    } catch (err) {
      console.error('Erreur : ' + err);
    }
  });

  // Event pour récupérer un questionnaire via son id
  socket.on('recuperer_questionnaire', async (where, id) => {
    try {
      // Importe et utilise le controller pour récupérer un questionnaire
      const questionnaire = await require('./controllers/recupererQuestionnaire')(where, id);

      // Renvoie les données au format JSON
      socket.emit('recuperer_questionnaire', questionnaire);
      console.log(`Questionnaire '${id}' récupéré avec succès`);
    } catch (err) {
      console.error('Erreur : ' + err);
    }
  });

  //* Event pour créer un questionnaire
  // Event qui enregistre dans la base de données un questionnaire et ses questions et ses propositions
  socket.on('creer_questionnaire', async (questionnaire) => {
    try {
      // Importe et utilise le controller pour créer un questionnaire
      const idQuestionnaire = await require('./controllers/creerQuestionnaire')(questionnaire);

      // Renvoie les données
      socket.emit('questionnaire', idQuestionnaire);
      console.log('Questionnaire créé avec succès');
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour modifier un questionnaire déjà existant
  socket.on('modifier_questionnaire', async (questionnaire, id) => {
    try {
      // Importe et utilise le controller pour modifier un questionnaire via son id
      const idQuestionnaire = await require('./controllers/modifierQuestionnaire')(questionnaire, id);

      // Renvoie les données
      socket.emit('questionnaire', idQuestionnaire);
      console.log(`Questionnaire '${id}' modifié avec succès`);
    } catch (err) {
      console.error('Erreur : ' + err);
    }
  });

  // Event pour supprimer un questionnaire
  socket.on('supprimer_questionnaire', async (id) => {
    try {
      // Importe et utilise le controller pour supprimer un questionnaire via son id
      await require('./controllers/supprimerQuestionnaire')(id);

      // Renvoie les données
      socket.emit('supprimer_questionnaire');
      console.log(`Questionnaire '${id}' supprimé avec succès`);
    } catch (err) {
      console.error('Erreur : ' + err);
    }
  });

  // Event pour récupérer les dossier des questionnaires
  socket.on('recuperer_dossiers', async (nomAdmin) => {
    try {
      // Importe et utilise le controller pour recuperer la liste des dossiers
      const listeDossiersJSON = await require('./controllers/recupererDossiers')(nomAdmin);

      // Renvoie les données au format JSON
      socket.emit('recuperer_dossiers', listeDossiersJSON);
      console.log('Dossiers récupéré avec succès');
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour récupérer un dossier via son id
  socket.on('recuperer_dossier', async (idDossier) => {
    try {
      const dossier = await require('./controllers/recupererDossier')(idDossier);

      // Renvoie les données au format JSON
      socket.emit('recuperer_dossier', dossier);
      console.log(`Dossier '${idDossier}' récupéré avec succès`);
    } catch (err) {
      console.error('Erreur : ' + err);
    }
  });

  // Event pour créer un dossier
  socket.on('creer_dossier', async (nomAdmin, nomDossier) => {
    try {
      await require('./controllers/creerDossier')(nomAdmin, nomDossier);

      // Renvoie les données
      socket.emit('creer_dossier');
      console.log(`Dossier '${nomDossier}' créé avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour modifier un dossier
  socket.on('modifier_dossier', async (id, nom) => {
    try {
      // Importe et utilise le controller pour modifier un dossier
      await require('./controllers/modifierDossier')(id, nom);

      // Renvoie les données
      socket.emit('modifier_dossier');
      console.log(`Dossier '${id}' modifié avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour supprimer un dossier
  socket.on('supprimer_dossier', async (id) => {
    try {
      // Importe et utilise le controller pour supprimer un dossier
      await require('./controllers/supprimerDossier')(id);

      // Renvoie les données
      socket.emit('supprimer_dossier');
      console.log(`Dossier '${id}' supprimé avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  //* Events pour le jeu côté admins
  // Event pour faire rejoindre l'admin dans la room 'admin'
  socket.on('admin', () => {
    socket.join('admin');
  });

  // Event pour récupérer les questionnaires d'un dossier
  socket.on('recuperer_questionnaires_dossier', async (nomAdmin, id) => {
    try {
      // Importe et utilise le controller pour recuperer les questionnaires d'un dossier
      const questionnaires = await require('./controllers/recupererQuestionnairesDossier')(nomAdmin, id);

      // Renvoie les données au format objet JavaScript
      socket.emit('recuperer_questionnaires_dossier', questionnaires);
      console.log(`Questionnaires du dossier ${id} récupéré avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  socket.on('recuperer_questionnaires', async () => {
    try {
      // Importe et utilise le controller pour récupérer tous les questionnaires
      const questionnaires = await require('./controllers/recupererQuestionnaires')();

      // Renvoie les données au format JSON
      socket.emit('recuperer_questionnaires', questionnaires);
      console.log('Questionnaires récupérés avec succès');
    } catch (err) {
      console.error('Erreur : ' + err);
    }
  });

  // Event pour récupérer les joueurs présents dans le lobby côté admin
  socket.on('recuperer_joueurs_lobby', async (codePin) => {
    try {
      // Importe et utilise le controller pour recupérer les joueurs d'un lobby
      const joueurs = await require('./controllers/recupererJoueursLobby')(codePin);

      // Renvoie les données au format JSON
      socket.emit('recuperer_joueurs_lobby', joueurs);
      console.log('Joueurs récupéré pour le lobby avec succès');
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour récupérer le classement
  socket.on('recuperer_classement', async (codePin) => {
    try {
      // Importe et utilise le controller pour récupérer le classement
      const classement = await require('./controllers/recupererClassement')(codePin);

      // Renvoie les données au format JSON
      socket.emit('recuperer_classement', classement);
      console.log('Classement récupéré avec succès');
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  socket.on('supprimer_joueur_lobby', async (joueurPseudo) => {
    try {
      // Importe et utilise le controller pour supprimer un joueur d'un lobby
      await require('./controllers/supprimerJoueurLobby')(joueurPseudo);

      console.log(`Joueur '${joueurPseudo}' supprimé avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  //* Events pour le jeu côté joueurs
  // Event pour récupérer l'id du socket du joueur
  socket.on('recuperer_id', () => {
    socket.emit('recuperer_id', socket.id);
  });

  // Event pour ajouter un joueur qui se connecte au lobby à la base de données
  socket.on('ajouter_joueur_lobby', async (codePin, joueur) => {
    try {
      // Importe et utilise le controller pour ajouter un joueur à un lobby
      await require('./controllers/creerJoueurLobby')(codePin, joueur);

      // Importe et utilise le controller pour recupérer les joueurs d'un lobby
      const joueurs = await require('./controllers/recupererJoueursLobby')(codePin);

      // Renvoie les données au format JSON
      io.to('admin').emit('recuperer_joueurs_lobby', joueurs);

      console.log('Joueur créé avec succès');
    } catch (err) {
      socket.emit('ajouter_joueur_lobby_erreur');
      console.error('Erreur : ', err);
    }
  });

  // Event pour récupérer le nombre de questions d'un questionnaire
  socket.on('recuperer_nombre_questions', async (codePin) => {
    try {
      // Importe et utilise le controller pour recuperer le nombre de questions
      const nbQuestions = await require('./controllers/recupererNbQuestions')(codePin);

      // Renvoie les données
      socket.emit('recuperer_nombre_questions', nbQuestions);
      console.log('Nombres de questions récupéré avec succès');
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour récupérer le chrono de la question
  socket.on('recuperer_temps', async (codePin, numQuestion) => {
    try {
      // Importe et utilise le controller pour recupérer le chrono d'une question
      const tempsTotal = await require('./controllers/recupererChrono')(codePin, numQuestion);

      socket.emit('recuperer_temps', tempsTotal);
      console.log(`Chrono de la question '${numQuestion}' du questionnaire '${codePin}' récupéré avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Events pour récupérer le temps restant de la question
  socket.on('recuperer_temps_restant', async (id) => {
    io.to('admin').emit('recuperer_temps_restant_admin', id);
  });

  socket.on('recuperer_temps_restant_admin', async (tempsRestant = undefined, id) => {
    io.to(id).emit('recuperer_temps_restant', tempsRestant);
  });

  // Event pour vérifier les propositions entrées par les joueurs
  socket.on('verifier_propositions', async (codePin, numQuestion, propositionChoisi, tempsRestant, pseudoJoueur) => {
    try {
      // Importe et utilise le controller pour verifier les propositions choisis par les joueurs
      const score = await require('./controllers/verifierPropositions')(codePin, numQuestion, propositionChoisi, tempsRestant);
      const createdHistorique = await require('./controllers/remplirHistorique')(codePin, numQuestion, propositionChoisi, pseudoJoueur, score);

      if (createdHistorique) {
        await require('./controllers/incrementerScore')(pseudoJoueur, score);
      }

      var correcte = false;

      if (score >= 300) {
        correcte = true;
      }

      // Renvoie les données
      socket.emit('verifier_propositions', correcte, score);
      console.log('Propositions vérifiés avec succès');
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour remplir l'historique de la partie en cours
  socket.on('remplir_historique', async (codePin, numQuestion, propositionChoisi, pseudoJoueur, score) => {
    try {
      // Importe et utilise le controller pour remplir l'historique du questionnaire
      await require('./controllers/remplirHistorique')(codePin, numQuestion, propositionChoisi, pseudoJoueur, score);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour récupérer le score d'un joueur via son pseudo
  socket.on('recuperer_score_joueur', async (pseudoJoueur) => {
    try {
      // Importe et utilise le controller pour recupérer le score d'un joueur
      const scoreJoueur = await require('./controllers/recupererScoreJoueur')(pseudoJoueur);

      // Renvoie les données
      socket.emit('recuperer_score_joueur', scoreJoueur);
      console.log(`Score de '${pseudoJoueur}' récupéré avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  socket.on('maj_historique', async (codePin) => {
    try {
      // Importe et utilise le controller pour mettre à jour la version de l'historique
      await require('./controllers/majHistorique')(codePin);

      // Renvoie les données
      socket.emit('maj_historique');
      console.log(`Historique du questionnaire ${codePin} mis à jour avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour exporter les resultats
  socket.on('exporter_resultats', async (codePin) => {
    try {
      // Importe et utilise le controller pour exporter les résultats dans différents formats
      const resultatCSV = await require('./controllers/exporterResultats')(codePin);

      // Renvoie les données
      socket.emit('exporter_resultats', resultatCSV);
      console.log(`Le questionnaire '${codePin}' à été exporté avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  // Event pour récupérer l'historique
  socket.on('recuperer_historique', async (idQuestionnaire) => {
    try {
      // Importe et utilise le controller pour recuperer l'historique
      const historiques = await require('./controllers/recupererHistorique')(idQuestionnaire);

      // Renvoie les données au format JSON
      socket.emit('recuperer_historique', historiques);
      console.log(`L'historique du questionnaire '${idQuestionnaire}' à été exporté avec succès`);
    } catch (err) {
      console.error('Erreur : ', err);
    }
  });

  //* Event pour verifier si on est sur la bonne page
  socket.on('bonne_page', (socketId) => {
    io.to('admin').emit('bonne_page_admin', socketId);
  });

  socket.on('bonne_page_admin', (socketId, page, numQuestion) => {
    console.log(socketId);
    io.to(socketId).emit('bonne_page', page, numQuestion);
  });

  //* Event pour faire changer de page l'admin et les joueurs
  socket.on('changer_page', async (param1 = undefined, param2 = undefined, param3 = undefined) => {
    io.emit('changer_page', param1, param2, param3);
  });

  //* Event pour envoyer les réponses sur lesquelles les joueurs on cliqués pour les statistiques
  socket.on('envoyer_reponse', async (numReponse) => {
    io.emit('envoyer_reponse', numReponse);
  });
});

// Permet d'utiliser les routes
app.use(router);

console.log('Initialization...');
setTimeout(() => {
  require('./controllers/initialization')();

  //* Lance le serveur
  http.listen({
    host: host,
    port: port
  }, () => {
    console.log(`Server running at http://${host}:${port}/`);
  }).on('error', (err) => {
    // Gère les erreurs lors du lancemant du serveur
    switch (err.code) {
      case 'EADDRINUSE':
        console.error(`A server is already running on http://${host}:${port}/`);
        break;

      case 'EADDRNOTAVAIL':
        console.error(`The address ${host} is not available`);
        break;

      default:
        console.error('Error starting the server : ', err);
        break;
    }
  });
}, 1000);