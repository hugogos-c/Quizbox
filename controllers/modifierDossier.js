/**
 * @file controller/modifierDossier.js
 * @author Hugo CIRETTE
 */

const { Dossiers } = require('../databaseConnection');

module.exports = async (id, nom) => {
  // Met à jour un dossier via son id dans la table Dossiers
  Dossiers.update({
    dossiers_nom: nom
  }, {
    where: {
      dossiers_id: id
    }
  });
};