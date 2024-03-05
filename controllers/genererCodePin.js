/**
 * @file controller/genererCodePin.js
 * @author Hugo CIRETTE
 */

const { Questionnaires } = require('../databaseConnection');

module.exports = async (idQuestionnaire) => {
  // Génère un code PIN
  var codePin = '';
  for (let i = 0; i < 6; i++) {
    codePin += Math.floor((Math.random() * 9) + 1).toString();
  }

  // Met à jour la base de données pour faire correspondre le code PIN à un questionnaire
  await Questionnaires.update({
    questionnaires_codePin: codePin
  }, {
    where: {
      questionnaires_id: idQuestionnaire
    }
  });

  return codePin;
}