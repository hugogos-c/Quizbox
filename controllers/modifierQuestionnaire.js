/**
 * @file controller/modifierQuestionnaire.js
 * @author Hugo CIRETTE
 */

const fs = require('fs');
const { Admins, Dossiers, Questionnaires, Questions, Propositions } = require('../databaseConnection');

module.exports = async (questionnaire, id) => {
  if (questionnaire.imageChange === true) {

    // Ajoute '/uploads/' dans le nom de l'image
    questionnaire.imageName = '/uploads/' + questionnaire.imageName;

    // Télécharge le fichier
    fs.writeFile(`public${questionnaire.imageName}`, questionnaire.image, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Fichier '${questionnaire.imageName}' téléchargé avec succès`);
      }
    });
  }

  // Télécharge les images des questions
  for (let i = 0; i < questionnaire.Questions.length; i++) {
    if (questionnaire.Questions[i].imageChange === true) {

      // Ajoute '/uploads/' dans le nom de l'image
      questionnaire.Questions[i].imageName = '/uploads/' + questionnaire.Questions[i].imageName;

      // Télécharge le fichier
      fs.writeFile(`public${questionnaire.Questions[i].imageName}`, questionnaire.Questions[i].image, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Fichier '${questionnaire.Questions[i].imageName}' téléchargé avec succès`);
        }
      });
    } else {
      questionnaire.Questions[i].imageName = '/uploads/' + questionnaire.Questions[i].imageOld;
    }
  }

  // Supprime les questions et les propositions
  await Questions.destroy({
    where: {
      questions_id_fk_questionnaires: id
    },

    // Jointure de la table Questions avec la table Propositions
    include: {
      model: Propositions,
    }
  });

  // Cherche les données de l'admin via son nom dans la table Admins
  const admin = await Admins.findAll({
    attributes: ['admins_id', 'admins_nom'],
    where: {
      admins_nom: questionnaire.nomAdmin
    }
  });

  // Sauvegarde l'id de l'admin
  const idAdmin = admin[0].admins_id;

  // Cherche les données du dossier via son nom dans la table Dossiers
  const dossier = await Dossiers.findAll({
    attributes: ['dossiers_id', 'dossiers_nom'],
    where: {
      dossiers_nom: questionnaire.dossier
    }
  });

  // Sauvegarde l'id du dossier
  const idDossier = dossier[0].dossiers_id;

  // Met à jour le questionnaire via son id
  await Questionnaires.update({
    questionnaires_titre: questionnaire.titre,
    questionnaires_description: questionnaire.description,
    questionnaires_image: questionnaire.imageName,
    questionnaires_id_fk_admins: idAdmin,
    questionnaires_id_fk_dossiers: idDossier
  }, {
    where: {
      questionnaires_id: id
    }
  });

  // Créé les questions
  questionnaire.Questions.forEach(async question => {
    const questions = await Questions.create({
      questions_texte: question.texte,
      questions_chrono: question.chrono,
      questions_image: question.imageName,
      questions_id_fk_questionnaires: id
    });

    // Sauvegarde l'id de la question
    const idQuestion = questions.questions_id;

    // Créé les propositions
    question.Propositions.forEach(async proposition => {
      await Propositions.create({
        propositions_texte: proposition.texte,
        propositions_correcte: proposition.correcte,
        propositions_id_fk_questions: idQuestion
      });
    });
  });

  return id;
}