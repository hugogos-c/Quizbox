/**
 * @file controller/incrementerScore.js
 * @author Hugo CIRETTE
 */

const { Joueurs } = require('../databaseConnection');

module.exports = async (joueurPseudo, score) => {
  // Récupère le score précédent
  const scoreBase = await Joueurs.findAll({
    attributes: ['joueurs_id', 'joueurs_pseudo', 'joueurs_score'],
    where: {
      joueurs_pseudo: joueurPseudo
    }
  });

  // Récupère le score de base avant incrémentation
  const scoreBaseJSON = scoreBase[0].joueurs_score;

  // Met à jour le score
  await Joueurs.update({
    joueurs_score: scoreBaseJSON + parseInt(score)
  }, {
    where: {
      joueurs_pseudo: joueurPseudo
    }
  });
};