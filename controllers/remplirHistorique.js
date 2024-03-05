/**
 * @file controller/remplirHistorique.js
 * @author Hugo CIRETTE
 */

const { Questionnaires, Historiques } = require('../databaseConnection');

module.exports = async (codePin, numQuestion, propositionChoisi, pseudoJoueur, score) => {
  // Cherche un questionnaire via son code PIN dans la table Questionnaires
  const questionnaires = await Questionnaires.findAll({
    attributes: ['questionnaires_id', 'questionnaires_codePin'],
    where: {
      questionnaires_codePin: codePin
    }
  });

  // Sauvegarde l'id du questionnaire
  const idQuestionnaire = questionnaires[0].questionnaires_id;

  const historiques = await Historiques.findAll({
    attributes: ['historiques_id', 'historiques_codePin'],
    where: {
      historiques_id_fk_questionnaires: idQuestionnaire
    }
  });

  const codePinHistorique = historiques[historiques.length - 1].historiques_codePin;

  // Créé l'entrée de l'historique du questionnaire
  const [histo, created] = await Historiques.findOrCreate({
    where: {
      historiques_numQuestion: numQuestion,
      historiques_pseudoJoueur: pseudoJoueur,
      historiques_codePin: codePinHistorique,
      historiques_id_fk_questionnaires: idQuestionnaire
    },
    defaults: {
      historiques_numQuestion: numQuestion,
      historiques_propositionChoisi: propositionChoisi,
      historiques_pseudoJoueur: pseudoJoueur,
      historiques_scoreJoueurQuestion: score,
      historiques_codePin: codePinHistorique,
      historiques_id_fk_questionnaires: idQuestionnaire
    }
  });

  return created;
};