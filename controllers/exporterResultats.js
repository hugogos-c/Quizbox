/**
 * @file controller/exporterResultats.js
 * @author Hugo CIRETTE
 */

const fs = require('fs'); // Chargement de 'fs'
const { Parser } = require('json2csv'); // Chargement de 'json2csv'
const { Historiques } = require('../databaseConnection');

module.exports = async (codePin) => {
  // Récupère les données de l'historique du questionnaire via son code PIN dans la table Questionnaires
  const historique = await Historiques.findAll({
    attributes: ['historiques_id', 'historiques_numQuestion', 'historiques_propositionChoisi', 'historiques_pseudoJoueur', 'historiques_scoreJoueurQuestion', 'historiques_codePin', 'historiques_id_fk_questionnaires'],
    where: {
      historiques_codePin: codePin
    }
  });

  // Convertit la donnée en JSON
  const resultats = JSON.parse(JSON.stringify(historique));

  // Retire la première case du tableau
  resultats.shift();

  // Initialisation de la donnée
  var data = [];

  // Nombre de questions
  const nbQuestions = resultats[resultats.length - 1].historiques_numQuestion;

  // Nombre de joueurs
  const nbJoueurs = resultats.length / nbQuestions;

  // Ajoute les joueurs dans la donnée
  for (let i = 0; i < nbJoueurs; i++) {
    data.push({
      Joueurs: resultats[i].historiques_pseudoJoueur
    });
  }

  // Ajoute les questions dans la donnée
  data.forEach(d => {
    // Initialisation des variables
    var total = 0;
    var bonneRep = 0;
    var mauvaiseRep = 0;
    var nonRep = 0;
    var reponse = '';

    // Attribut le score de chaque joueurs pour chaque questions
    resultats.forEach(resultat => {
      if (resultat.historiques_pseudoJoueur === d.Joueurs) {
        // Compte le % de bonnes réponses, de mauvaises réponses et de non répondus
        if (resultat.historiques_scoreJoueurQuestion === 0) {
          if (resultat.historiques_propositionChoisi === -1) {
            nonRep++;
            reponse = '⌛';
          } else {
            mauvaiseRep++;
            reponse = '❌';
          }
        } else {
          bonneRep++;
          reponse = '✔️';
        }

        // Attribut le score de chaque joueurs pour chaque questions
        d[`Question ${resultat.historiques_numQuestion}`] = reponse;

        // Compte le total
        total += resultat.historiques_scoreJoueurQuestion;
      }
    });

    // Attribut les % de bonnes réponses, la moyenne et la note de chaques joueurs dans la donnée
    d['Correctes (%)'] = `${Math.round((bonneRep * 100) / nbQuestions)}%`;
    d['Incorrectes (%)'] = `${Math.round((mauvaiseRep * 100) / nbQuestions)}%`;
    d['Pas répondus (%)'] = `${Math.round((nonRep * 100) / nbQuestions)}%`;
    d['Moyenne (pts)'] = Math.round(total / nbQuestions);
    d['Total (pts)'] = total;
    d['Note (/20)'] = Math.round(((total * 20) / (nbQuestions * 1000)) * 100) / 100;
  });

  // Convertit la donnée en JSON
  const resultatsJSON = JSON.stringify(data);

  // Génère le fichier JSON
  fs.writeFile(`public/downloads/${codePin}.json`, resultatsJSON, (err) => {
    if (err) {
      console.error('Erreur : ' + err);
    } else {
      console.log(`Fichier '${codePin}.json' généré avec succès`);
    }
  });

  // Initialisation de json2csv
  const json2csv = new Parser();

  // Convertit la donnée en CSV
  const resultatsCSV = json2csv.parse(data);

  // Génère le fichier CSV
  fs.writeFile(`public/downloads/${codePin}.csv`, resultatsCSV, (err) => {
    if (err) {
      console.error('Erreur : ' + err);
    } else {
      console.log(`Fichier '${codePin}.csv' généré avec succès`);
    }
  });

  return `${codePin}.csv`;
};