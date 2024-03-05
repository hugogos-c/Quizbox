/**
 * @file controller/recupererHistorique.js
 * @author Hugo CIRETTE
 */

const { Historiques } = require('../databaseConnection');

module.exports = async (idQuestionnaire) => {
  // Récupère l'historique d'un questionnaire via son id dans la table Historiques
  const historiques = await Historiques.findAll({
    attributes: ['historiques_id', 'historiques_numQuestion', 'historiques_propositionChoisi', 'historiques_pseudoJoueur', 'historiques_scoreJoueurQuestion', 'historiques_codePin', 'historiques_id_fk_questionnaires', 'createdAt'],
    where: {
      historiques_id_fk_questionnaires: idQuestionnaire
    }
  });

  // Retourne les données au format JSON
  return JSON.stringify(historiques);
};