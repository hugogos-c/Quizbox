/**
 * @file controller/recupererQuestionnaireCodePin.js
 * @author Hugo CIRETTE
 */

const { Questionnaires } = require('../databaseConnection');

module.exports = async (codePin) => {
  const questionnaire = await Questionnaires.findAll({
    attributes: ['questionnaires_id', 'questionnaires_codePin'],
    where: {
      questionnaires_codePin: codePin
    }
  });

  if (questionnaire[0] !== undefined) {
    return true
  }
  
  return false;
};