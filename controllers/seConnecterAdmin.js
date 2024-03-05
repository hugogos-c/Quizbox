/**
 * @file controller/seConnecterAdmin.js
 * @author Hugo CIRETTE
 */

const { Admins } = require('../databaseConnection');
module.exports = async (nom, mdp) => {
  const admins = await Admins.findAll({
    attributes: ['admins_id', 'admins_email', 'admins_nom', 'admins_mdp'],
    where: {
      admins_nom: nom,
      admins_mdp: mdp
    }
  });

  if (admins[0]) {
    return true;
  }

  return false;
};