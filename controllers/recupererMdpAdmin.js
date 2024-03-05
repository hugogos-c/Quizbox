/**
 * @file controller/recupererMdpAdmin.js
 * @author Hugo CIRETTE
 */

const { Admins } = require('../databaseConnection');

module.exports = async (idAdmin) => {
  // Récupère l'admin via son nom dans la table Admins
  const admin = await Admins.findAll({
    attributes: ['admins_id', 'admins_mdp'],
    where: {
      admins_id: idAdmin
    }
  });

  // Renvoie le mot de passe
  return admin[0].admins_mdp;
}