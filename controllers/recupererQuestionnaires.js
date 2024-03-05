/**
 * @file controller/recupererQuestionnaire.js
 * @author Hugo CIRETTE
 */

const { Questionnaires } = require('../databaseConnection');

module.exports = async () => {
  // Récupère les données de tous les questionnaires dans la table Questionnaires
  const questionnaires = await Questionnaires.findAll({
    attributes: ['questionnaires_id', 'questionnaires_titre', 'questionnaires_image', 'createdAt']
  });

  // Initialisation de la donnée
  const data = [];

  // Ajout des champs dans la donnée
  questionnaires.forEach(questionnaire => {
    // Formate la date pour la renvoyer sous forme de string
    const date = questionnaire.createdAt;
    const jour = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const mois = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    const annee = date.getFullYear();
    const dateDeCreation = `${jour}/${mois}/${annee}`;

    data.push({
      questionnaires_id: questionnaire.questionnaires_id,
      questionnaires_titre: questionnaire.questionnaires_titre,
      questionnaires_image: questionnaire.questionnaires_image,
      createdAt: dateDeCreation
    });
  });

  return JSON.stringify(data);
};