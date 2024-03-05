/**
 * @file controller/recupererDossiers.js
 * @author Hugo CIRETTE
 */

const { Admins, Dossiers } = require('../databaseConnection');

module.exports = async (nomAdmin) => {
  // Cherche l'admin via son nom dans la table Admins
  const admins = await Admins.findAll({
    attributes: ['admins_id', 'admins_nom'],
    where: {
      admins_nom: nomAdmin
    }
  });

  // Récupère l'id de l'admin
  const idAdmin = admins[0].admins_id;

  // Cherche la liste des dossiers d'un compte dans la table Dossiers
  const compte = await Dossiers.findAll({
    attributes: ['dossiers_id', 'dossiers_nom', 'dossiers_id_fk_admins', 'createdAt'],
    where: {
      dossiers_id_fk_admins: idAdmin
    }
  });

  const dossiersCompte = [];

  compte.forEach(element => {
    // Formate la date pour la renvoyer sous forme de string
    const date = element.createdAt;
    const jour = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const mois = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    const annee = date.getFullYear();
    const dateDeCreation = `${jour}/${mois}/${annee}`;

    dossiersCompte.push({
      dossiers_id: element.dossiers_id,
      dossiers_nom: element.dossiers_nom,
      dossiers_id_fk_admins: element.dossiers_id_fk_admins,
      createdAt: dateDeCreation
    });
  });

  // Cherche la liste des dossiers de l'admin dans la table Dossiers
  const admin = await Dossiers.findAll({
    attributes: ['dossiers_id', 'dossiers_nom', 'dossiers_id_fk_admins', 'createdAt'],
    where: {
      dossiers_id_fk_admins: 1
    }
  });

  const dossiersAdmin = [];

  admin.forEach(dossier => {
    // Formate la date pour la renvoyer sous forme de string
    const date = dossier.createdAt;
    const jour = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const mois = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    const annee = date.getFullYear();
    const dateDeCreation = `${jour}/${mois}/${annee}`;

    dossiersAdmin.push({
      dossiers_id: dossier.dossiers_id,
      dossiers_nom: dossier.dossiers_nom,
      dossiers_id_fk_admins: dossier.dossiers_id_fk_admins,
      createdAt: dateDeCreation
    });
  });

  const dossiers = {
    dossiersAdmin,
    dossiersCompte
  };

  // Convertit la donnée en JSON
  return JSON.stringify(dossiers);
};