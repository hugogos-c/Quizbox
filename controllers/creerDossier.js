/**
 * @file controller/creerDossier.js
 * @author Hugo CIRETTE
 */

const { Admins, Dossiers } = require('../databaseConnection');

module.exports = async (nomAdmin, nomDossier) => {
  const admins = await Admins.findAll({
    attributes: ['admins_id', 'admins_nom'],
    where: {
      admins_nom: nomAdmin
    }
  });

  // Sauvegarde l'id de l'admin
  const idAdmin = admins[0].admins_id;

  // Créé un dossier dans la table Dossiers
  await Dossiers.create({
    dossiers_nom: nomDossier,
    dossiers_id_fk_admins: idAdmin
  });
};