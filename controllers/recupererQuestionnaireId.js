/**
 * @file controller/recupererQuestionnaireId.js
 * @author Hugo CIRETTE
 */

const { Questionnaires } = require('../databaseConnection');

module.exports = async (idQuestionnaire) => {
  const questionnaire = await Questionnaires.findAll({
    attributes: ['questionnaires_id'],
    where: {
      questionnaires_id: idQuestionnaire
    }
  });

  if (questionnaire[0] !== undefined) {
    return true
  }
  
  return false;
};