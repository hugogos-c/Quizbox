/**
 * @file controller/recupererChrono.js
 * @author Hugo CIRETTE
 */

const { Questionnaires, Questions } = require('../databaseConnection');

module.exports = async (codePin, numQuestion) => {
  // Récupère l'id d'un questionnaire via son code PIN dans la table Questionnaires
  const questionnaire = await Questionnaires.findAll({
    attributes: ['questionnaires_id'],
    where: {
      questionnaires_codePin: codePin
    }
  });

  // Sauvegarde l'id du questionnaire
  const idQuestionnaire = questionnaire[0].questionnaires_id;

  // Récupère le chrono de la question via l'id du questionnaire dans la table Questions
  const questions = await Questions.findAll({
    attributes: ['questions_id', 'questions_chrono', 'questions_id_fk_questionnaires'],
    where: {
      questions_id_fk_questionnaires: idQuestionnaire
    }
  });

  // Sauvegarde le chrono
  return questions[numQuestion - 1].questions_chrono;
};