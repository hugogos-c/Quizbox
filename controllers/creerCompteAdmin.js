/**
 * @file controller/creerCompteAdmin.js
 * @author Hugo CIRETTE
 */

const { Admins } = require('../databaseConnection');

module.exports = async (emailAdmin, nomAdmin, mdpAdmin) => {
  // Créé un admin
  await Admins.create({
    admins_email: emailAdmin,
    admins_nom: nomAdmin,
    admins_mdp: mdpAdmin
  });
};