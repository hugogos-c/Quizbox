/**
 * @file router.js
 * @author Hugo CIRETTE
 */

const express = require('express');
const router = express.Router();

//* Routes
router.get('/', async (req, res, next) => {
  // Route '/'
  res.status(200).render('joueurs/Accueil');
});

router.get('/connexion', async (req, res, next) => {
  // Route '/connexion'
  res.status(200).render('admins/Jeu');
});

router.get('/creer_compte', async (req, res, next) => {
  // Route '/creer_compte'
  res.status(200).render('admins/register-prof');
});

router.get('/admin/:idAdmin/modifier', async (req, res, next) => {
  // Route '/admin/:idAdmin/modifier'
  const idAdmin = req.params.idAdmin;
  const admin = await require('./controllers/recupererAdminId')(idAdmin);

  if (admin) {
    res.status(200).render('admins/modifier-compte-prof', {
      admin
    });
  } else {
    next();
  }
});

router.get('/accueil', async (req, res, next) => {
  // Route '/accueil'
  res.status(200).render('admins/accueil');
});

router.get('/mes_quiz', (req, res, next) => {
  // Route '/mes_quiz'
  res.status(200).render('admins/questionnaires');
});

router.get('/bibliotheque', (req, res, next) => {
  // Route '/bibliotheque'
  res.status(200).render('admins/questionnaires');
});

router.get('/dossier/:idDossier', async (req, res, next) => {
  // Route '/dossier/:idDossier'
  const idDossier = req.params.idDossier;
  const dossier = await require('./controllers/recupererDossiersId')(idDossier);

  if (dossier === true) {
    res.status(200).render('admins/questionnaires', {
      idDossier
    });
  } else {
    next();
  }
});

router.get('/questionnaire/creer', async (req, res, next) => {
  // Route '/questionnaire/creer'
  res.status(200).render('creer_questionnaire/questionnaire');
});

router.get('/questionnaire/:idQuestionnaire', async (req, res, next) => {
  // Route '/questionnaires/:idQuestionnaire'
  const idQuestionnaire = req.params.idQuestionnaire;
  const questionnaire = await require('./controllers/recupererQuestionnaireId')(idQuestionnaire);

  if (questionnaire === true) {
    res.status(200).render('admins/Apercu-Questionnaire', {
      idQuestionnaire
    });
  } else {
    next();
  }
});

router.get('/questionnaire/:idQuestionnaire/modifier', async (req, res, next) => {
  // Route '/questionnaires/:idQuestionnaire/modifier'
  const idQuestionnaire = req.params.idQuestionnaire;
  const questionnaire = await require('./controllers/recupererQuestionnaireId')(idQuestionnaire);

  if (questionnaire === true) {
    res.status(200).render('creer_questionnaire/questionnaire', {
      idQuestionnaire
    });
  } else {
    next();
  }
});

router.get('/admin/:codePin/lobby', async (req, res, next) => {
  // Route '/admin/:codePin/lobby'
  const codePin = req.params.codePin;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('admins/lobby', {
      codePin
    });
  } else {
    next();
  }
});

router.get('/admin/:codePin/question/:numQuestion', async (req, res, next) => {
  // Route '/admin/:codePin/question/:numQuestion'
  const codePin = req.params.codePin;
  const numQuestion = req.params.numQuestion;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('admins/Question', {
      codePin,
      numQuestion
    });
  } else {
    next();
  }
});

router.get('/admin/:codePin/propositions/:numQuestion', async (req, res, next) => {
  // Route '/admin/:codePin/propositions/:numQuestion'
  const codePin = req.params.codePin;
  const numQuestion = req.params.numQuestion;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('admins/Propositions', {
      codePin,
      numQuestion
    });
  } else {
    next();
  }
});

router.get('/admin/:codePin/resultats/:numQuestion', async (req, res, next) => {
  // Route '/admin/:codePin/resultats/:numQuestion'
  const codePin = req.params.codePin;
  const numQuestion = req.params.numQuestion;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('admins/Reponses', {
      codePin,
      numQuestion
    });
  } else {
    next();
  }
});

router.get('/admin/:codePin/classement/:numQuestion', async (req, res, next) => {
  // Route '/admin/:codePin/classement/:numQuestion'
  const codePin = req.params.codePin;
  const numQuestion = req.params.numQuestion;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('admins/Classement-Joueur', {
      codePin,
      numQuestion
    });
  } else {
    next();
  }
});

router.get('/admin/:codePin/classement', async (req, res, next) => {
  // Route '/admin/:codePin/classement'
  const codePin = req.params.codePin;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('admins/Classement-Final', {
      codePin
    });
  } else {
    next();
  }
});

router.get('/:codePin/pseudo', async (req, res, next) => {
  // Route '/:codePin/pseudo'
  const codePin = req.params.codePin;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('joueurs/Register', {
      codePin
    });
  } else {
    next();
  }
});

router.get('/:codePin/lobby', async (req, res, next) => {
  // Route '/:codePin/lobby'
  const codePin = req.params.codePin;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('joueurs/Loading-Room', {
      codePin
    });
  } else {
    next();
  }
});

router.get('/:codePin/question/:numQuestion', async (req, res, next) => {
  // Route '/:codePin/question/:numQuestion'
  const codePin = req.params.codePin;
  const numQuestion = req.params.numQuestion;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('joueurs/Loading-game', {
      codePin,
      numQuestion
    });
  } else {
    next();
  }
});

router.get('/:codePin/propositions/:numQuestion', async (req, res, next) => {
  // Route '/:codePin/propositions/:numQuestion'
  const codePin = req.params.codePin;
  const numQuestion = req.params.numQuestion;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('joueurs/Jeu-utilisateur', {
      codePin,
      numQuestion
    });
  } else {
    next();
  }
});

router.get('/:codePin/resultats/:numQuestion', async (req, res, next) => {
  // Route '/:codePin/resultats/:numQuestion'
  const codePin = req.params.codePin;
  const numQuestion = req.params.numQuestion;
  const questionnaire = await require('./controllers/recupererQuestionnaireCodePin')(codePin);

  if (questionnaire === true) {
    res.status(200).render('joueurs/Attente-Resultat', {
      codePin,
      numQuestion,
    });
  } else {
    next();
  }
});

router.get('*', async (req, res, next) => {
  // Autres routes
  res.status(404).render('admins/error404');
});

module.exports = router;