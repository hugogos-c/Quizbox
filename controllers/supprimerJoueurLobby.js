/**
 * @file controller/supprimerJoueurLobby.js
 * @author Hugo CIRETTE
 */

const { Joueurs } = require('../databaseConnection');

module.exports = async (joueurPseudo) => {
  // Supprime un joueur via son pseudo
  await Joueurs.destroy({
    where: {
      joueurs_pseudo: joueurPseudo
    }
  });
};