/**
 * @file models/Joueurs.js
 * @author Hugo CIRETTE
 */

// Import de 'Sequelize'
const Sequelize = require('sequelize');

// Export du modèle
module.exports = (sequelize) => {
  return sequelize.define('Joueurs', {
    joueurs_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    joueurs_pseudo: Sequelize.TEXT,
    joueurs_score: Sequelize.INTEGER,
    joueurs_id_fk_questionnaires: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Questionnaires',
        key: 'questionnaires_id'
      }
    }
  });
};