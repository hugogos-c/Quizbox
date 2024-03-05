/**
 * @file controller/recupererClassement.js
 * @author Hugo CIRETTE
 */

const { Questionnaires, Joueurs } = require('../databaseConnection');

module.exports = async (codePin) => {
  // Récupère les données des joueurs dans la table Joueurs
  const classement = await Joueurs.findAll({
    attributes: ['joueurs_id', 'joueurs_pseudo', 'joueurs_score', 'joueurs_id_fk_questionnaires'],

    // Récupère les données par ordre décroissant des scores
    order: [
      ['joueurs_score', 'DESC']
    ],

    // Jointure de la table Joueurs et de la table Questionnaires
    include: {
      model: Questionnaires,
      attributes: ['questionnaires_id', 'questionnaires_codePin'],
      where: {
        questionnaires_codePin: codePin
      }
    }
  });

  // Convertit la donnée en JSON
  return JSON.parse(JSON.stringify(classement));
}