/**
 * @file controller/recupererJoueursLobby.js
 * @author Hugo CIRETTE
 */

const { Questionnaires, Joueurs } = require('../databaseConnection');

module.exports = async (codePin) => {
  const questionnaire = await Questionnaires.findAll({
    // Récupère les données d'un questionnaire dans la table Questionnaires
    attributes: ['questionnaires_id', 'questionnaires_codePin'],
    where: {
      questionnaires_codePin: codePin
    }
  });

  // Sauvegarde l'id du questionnaire
  const idQuestionnaire = questionnaire[0].questionnaires_id;

  // Cherche les pseudos des joueurs via l'id du questionnaire
  const joueurs = await Joueurs.findAll({
    attributes: ['joueurs_id', 'joueurs_pseudo', 'joueurs_id_fk_questionnaires'],
    where: {
      joueurs_id_fk_questionnaires: idQuestionnaire
    }
  });

  // Convertit la donnée en JSON
  return JSON.stringify(joueurs);
};