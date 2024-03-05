/**
 * @file controller/verifierPropositions.js
 * @author Hugo CIRETTE
 */

const { Questionnaires, Questions, Propositions } = require('../databaseConnection');

module.exports = async (codePin, numQuestion, propositionChoisi, tempsRestant) => {
  // Cherche l'id du questionnaire grâce au code PIN dans la table Questionnaires
  const questionnaire = await Questionnaires.findAll({
    attributes: ['questionnaires_id', 'questionnaires_codePin'],
    where: {
      questionnaires_codePin: codePin
    },
  });

  // Sauvegarde l'id du questionnaire
  const idQuestionnaire = questionnaire[0].questionnaires_id;

  // Cherche l'id des questions
  const questions = await Questions.findAll({
    attributes: ['questions_id', 'questions_chrono', 'questions_id_fk_questionnaires'],
    where: {
      questions_id_fk_questionnaires: idQuestionnaire
    }
  });

  // Sauvegarde l'id de la question et le chrono
  const idQuestion = questions[numQuestion-1].questions_id;
  const tempsTotal = questions[numQuestion-1].questions_chrono;

  // Cherche l'id et le statut correcte de la proposition dans la table Proposition
  const propositions = await Propositions.findAll({
    attributes: ['propositions_id', 'propositions_correcte', 'propositions_id_fk_questions'],
    where: {
      propositions_id_fk_questions: idQuestion
    }
  });

  // Récupère la propositions qui est correcte
  const propositionCorrecte = propositions[propositionChoisi-1].propositions_correcte;

  // Si la réponse du joueur est correcte, renvoie 'true' sinon 'false'
  if (propositionCorrecte === 1) {
    return Math.floor(((700 * parseInt(tempsRestant)) / tempsTotal) + 300);
  }

  return 0;
};