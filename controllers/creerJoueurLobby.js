/**
 * @file controller/creerJoueurLobby.js
 * @author Hugo CIRETTE
 */

const { Questionnaires, Joueurs } = require('../databaseConnection');

module.exports = async (codePin, joueur) => {
  // Cherche l'id du questionnaire grâce au code PIN dans la table Questionnaires
  const questionnaire = await Questionnaires.findAll({
    attributes: ['questionnaires_id', 'questionnaires_codePin'],
    where: {
      questionnaires_codePin: codePin
    }
  });

  // Sauvegarde l'id du questionnaire
  const idQuestionnaireJSON = questionnaire[0].questionnaires_id;

  // Créé un joueur dans la table Joueurs
  await Joueurs.create({
    joueurs_pseudo: joueur,
    joueurs_score: 0,
    joueurs_id_fk_questionnaires: idQuestionnaireJSON
  });
};