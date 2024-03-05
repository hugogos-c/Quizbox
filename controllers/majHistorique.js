/**
 * @file controller/majHistorique.js
 * @author Hugo CIRETTE
 */

const { Questionnaires, Historiques } = require('../databaseConnection');

module.exports = async (codePin) => {
  const questionnaires = await Questionnaires.findAll({
    attributes: ['questionnaires_id', 'questionnaires_codePin'],
    where: {
      questionnaires_codePin: codePin
    }
  });

  const idQuestionnaire = questionnaires[0].questionnaires_id;

  // Créé la première entrée pour le code PIN de l'historique du questionnaire
  await Historiques.create({
    historiques_codePin: codePin,
    historiques_id_fk_questionnaires: idQuestionnaire
  });
}