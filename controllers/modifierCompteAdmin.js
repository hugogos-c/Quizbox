/**
 * @file controller/modifierCompteAdmin.js
 * @author Hugo CIRETTE
 */

const { Admins } = require('../databaseConnection');

module.exports = async (ancienNomAdmin, emailAdmin, nomAdmin) => {
  // Modifie l'admin par les nouvelles données
  await Admins.update({
    admins_email: emailAdmin,
    admins_nom: nomAdmin
  }, {
    where: {
      admins_nom: ancienNomAdmin
    }
  });

  // Récupère les données dans la table Admins
  const admin = await Admins.findAll({
    attributes: ['admins_email', 'admins_nom'],
    where: {
      admins_nom: nomAdmin
    }
  });

  return JSON.stringify(admin[0]);
};