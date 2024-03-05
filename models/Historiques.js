/**
 * @file models/Historiques.js
 * @author Hugo CIRETTE
 */

// Import de 'Sequelize'
const Sequelize = require('sequelize');

// Export du modèle
module.exports = (sequelize) => {
  return sequelize.define('Historiques', {
    historiques_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    historiques_numQuestion: Sequelize.INTEGER,
    historiques_propositionChoisi: Sequelize.INTEGER,
    historiques_pseudoJoueur: Sequelize.TEXT,
    historiques_scoreJoueurQuestion: Sequelize.INTEGER,
    historiques_codePin: Sequelize.INTEGER,
    historiques_id_fk_questionnaires: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Questionnaires',
        key: 'questionnaires_id'
      }
    }
  });
};