/**
 * @file controller/recupererQuestionnairesDossier.js
 * @author Hugo CIRETTE
 */

const { Admins, Questionnaires } = require('../databaseConnection');

module.exports = async (nomAdmin, id) => {
  // Récupère l'admin via son nom
  const admins = await Admins.findAll({
    attributes: ['admins_id', 'admins_nom'],
    where: {
      admins_nom: nomAdmin
    }
  });

  // Récupère l'id de l'admin
  const idAdmin = admins[0].admins_id;

  // Récupère les questionnaires dans la table Questionnaires
  const questionnaires = await Questionnaires.findAll({
    attributes: ['questionnaires_id', 'questionnaires_titre', 'questionnaires_image', 'questionnaires_id_fk_dossiers', 'createdAt'],
    where: {
      questionnaires_id_fk_admins: idAdmin,
      questionnaires_id_fk_dossiers: id
    }
  });

  const questionnairesJSON = [];

  questionnaires.forEach(questionnaire => {
    // Formate la date pour la renvoyer sous forme de string
    const date = questionnaire.createdAt;
    const jour = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const mois = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    const annee = date.getFullYear();
    const dateDeCreation = `${jour}/${mois}/${annee}`;

    questionnairesJSON.push({
      questionnaires_id: questionnaire.questionnaires_id,
      questionnaires_titre: questionnaire.questionnaires_titre,
      questionnaires_image: questionnaire.questionnaires_image,
      questionnaires_id_fk_dossiers: questionnaire.questionnaires_id_fk_dossiers,
      createdAt: dateDeCreation
    });
  });

  // Convertit les données en objet JavaScript
  return JSON.stringify(questionnairesJSON);
};