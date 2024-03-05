/**
 * @file controller/recupererDossiersId.js
 * @author Hugo CIRETTE
 */

const { Dossiers } = require('../databaseConnection');

module.exports = async (idDossier) => {
  const dossier = await Dossiers.findAll({
    attributes: ['dossiers_id'],
    where: {
      dossiers_id: idDossier
    }
  });

  if (dossier[0] !== undefined) {
    return true;
  }

  return false;
};