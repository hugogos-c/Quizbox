/**
 * @file models/Propositions.js
 * @author Hugo CIRETTE
 */

// Import de 'Sequelize'
const Sequelize = require('sequelize');

// Export du modèle
module.exports = (sequelize) => {
  return sequelize.define('Propositions', {
    propositions_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    propositions_texte: Sequelize.TEXT,
    propositions_correcte: Sequelize.INTEGER,
    propositions_id_fk_questions: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Questions',
        key: 'questions_id'
      }
    }
  });
};