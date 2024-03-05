/**
 * @file controller/recupererNbQuestions.js
 * @author Hugo CIRETTE
 */

const { Questionnaires, Questions } = require('../databaseConnection');

module.exports = async (codePin) => {
  // Cherche dans la base de données les données d'un questionnaire
  const questionnaire = await Questionnaires.findAll({
    // Récupère les données d'un questionnaire dans la table Questionnaires
    attributes: ['questionnaires_id', 'questionnaires_titre', 'questionnaires_description', 'questionnaires_image', 'questionnaires_codePin'],
    where: {
      questionnaires_codePin: codePin
    },

    // Jointure de la table Questionnaires avec la table Questions
    include: {
      model: Questions,
      attributes: ['questions_id']
    }
  });

  // Récupère le nombre de questions du questionnaire
  return questionnaire[0].Questions.length;
};