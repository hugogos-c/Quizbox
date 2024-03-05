/**
 * @file controller/modifierMdp.js
 * @author Hugo CIRETTE
 */

const { Admins } = require('../databaseConnection');

module.exports = async (nomAdmin, nouveauMdp) => {
  // Met à jour le mot de passe de l'admin via son nom
  Admins.update({
    admins_mdp: nouveauMdp
  }, {
    where: {
      admins_nom: nomAdmin
    }
  });
}