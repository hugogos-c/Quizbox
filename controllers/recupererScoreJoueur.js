/**
 * @file controller/recupererScoreJoueur.js
 * @author Hugo CIRETTE
 */

const { Joueurs } = require('../databaseConnection');

module.exports = async (pseudoJoueur) => {
  // Récupère le pseudo et le score d'un joueur via son pseudo dans la table Joueurs
  const joueurs = await Joueurs.findAll({
    attributes: ['joueurs_id', 'joueurs_pseudo', 'joueurs_score'],
    where: {
      joueurs_pseudo: pseudoJoueur
    }
  });

  // Récupère le score
  return joueurs[0].joueurs_score;
};