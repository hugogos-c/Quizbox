/**
 * @file controller/recupererQuestionnaire.js
 * @author Hugo CIRETTE
 */

const { Dossiers, Questionnaires, Questions, Propositions } = require('../databaseConnection');

module.exports = async (where, param) => {
  // Récupère les données du questionnaire via son id dans la table Questionnaires
  var questionnaires;

  switch (where) {
    case 'id':
      questionnaires = await Questionnaires.findAll({
        attributes: ['questionnaires_id', 'questionnaires_titre', 'questionnaires_description', 'questionnaires_image', 'questionnaires_codePin', 'questionnaires_id_fk_admins', 'questionnaires_id_fk_dossiers'],
        where: {
          questionnaires_id: param
        },
        include: {
          model: Dossiers,
          attributes: ['dossiers_id', 'dossiers_nom']
        }
      });
      break;

    case 'codePin':
      questionnaires = await Questionnaires.findAll({
        attributes: ['questionnaires_id', 'questionnaires_titre', 'questionnaires_description', 'questionnaires_image', 'questionnaires_codePin', 'questionnaires_id_fk_admins', 'questionnaires_id_fk_dossiers'],
        where: {
          questionnaires_codePin: param
        },
        include: {
          model: Dossiers,
          attributes: ['dossiers_id', 'dossiers_nom']
        }
      });
    default:
      break;
  }

  // Sauvegarde l'id du questionnaire
  const idQuestionnaire = questionnaires[0].questionnaires_id;

  // Initialisation de la donnée et ajout des données du questionnaire dans la donnée
  var questionnaire = {
    questionnaires_id: questionnaires[0].questionnaires_id,
    questionnaires_titre: questionnaires[0].questionnaires_titre,
    questionnaires_description: questionnaires[0].questionnaires_description,
    questionnaires_image: questionnaires[0].questionnaires_image,
    questionnaires_dossier: questionnaires[0].Dossier.dossiers_nom,
    questionnaires_id_fk_admins: questionnaires[0].questionnaires_id_fk_admins,
    questionnaires_id_fk_dossiers: questionnaires[0].questionnaires_id_fk_dossiers,
    Questions: []
  };

  // Récupère les données des questions via l'id du questionnaire dans la table Questions
  const questions = await Questions.findAll({
    attributes: ['questions_id', 'questions_texte', 'questions_chrono', 'questions_image', 'questions_id_fk_questionnaires'],
    where: {
      questions_id_fk_questionnaires: idQuestionnaire
    }
  });

  for (let i = 0; i < questions.length; i++) {
    // Ajout des données des questions dans la donnée
    questionnaire.Questions.push({
      questions_id: questions[i].questions_id,
      questions_texte: questions[i].questions_texte,
      questions_chrono: questions[i].questions_chrono,
      questions_image: questions[i].questions_image,
      questions_id_fk_questionnaires: questions[i].questions_id_fk_questionnaires,
      Propositions: []
    });

    // Sauvegarde l'id de la questions
    const idQuestion = questions[i].questions_id;

    // Récupère les données des propositions via l'id des questions
    const propositions = await Propositions.findAll({
      attributes: ['propositions_id', 'propositions_texte', 'propositions_correcte', 'propositions_id_fk_questions'],
      where: {
        propositions_id_fk_questions: idQuestion
      }
    });

    for (let j = 0; j < propositions.length; j++) {
      // Ajout des propositions dans la donnée
      questionnaire.Questions[i].Propositions.push({
        propositions_id: propositions[j].propositions_id,
        propositions_texte: propositions[j].propositions_texte,
        propositions_correcte: propositions[j].propositions_correcte,
        propositions_id_fk_questions: propositions[j].propositions_id_fk_questions
      });
    }
  }

  return JSON.stringify(questionnaire);
};