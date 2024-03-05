/**
 * @file controller/supprimerDossier.js
 * @author Hugo CIRETTE
 */

const { Dossiers } = require('../databaseConnection');

module.exports = async (id) => {
  // Supprime un dossier via son id dans la table Dossiers
  Dossiers.destroy({
    where: {
      dossiers_id: id
    }
  });
};