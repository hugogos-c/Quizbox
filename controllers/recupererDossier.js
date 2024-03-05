/**
 * @file controller/recupererDossier.js
 * @author Hugo CIRETTE
 */

const { Dossiers } = require('../databaseConnection');

module.exports = async (idDossier) => {
  // Récupère un dossier via son id dans la table Dossiers
  const dossiers = await Dossiers.findAll({
    attributes: ['dossiers_id', 'dossiers_nom'],
    where: {
      dossiers_id: idDossier
    }
  });

  // Renvoie la donnée au format JSON
  return JSON.stringify(dossiers[0]);
};