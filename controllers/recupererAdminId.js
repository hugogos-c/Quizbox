/**
 * @file controller/recupererAdminId.js
 * @author Hugo CIRETTE
 */

const { Admins } = require('../databaseConnection');

module.exports = async (idAdmin) => {
  // Récupère l'admin via son id dans la table Admins
  const admin = await Admins.findAll({
    attributes: ['admins_id', 'admins_nom', 'admins_email', 'admins_mdp', 'createdAt'],
    where: {
      admins_id: idAdmin
    }
  });

  // Formate la date pour la renvoyer sous forme de string
  const date = admin[0].createdAt;
  const jour = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const mois = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
  const annee = date.getFullYear();
  const dateDeCreation = `${jour}/${mois}/${annee}`;

  // Renvoie les données au format JSON
  return {
    id: admin[0].admins_id,
    email: admin[0].admins_email,
    nom: admin[0].admins_nom,
    prenom: admin[0].admins_prenom,
    date: dateDeCreation
  };
}