/**
 * @file models/Questions.js
 * @author Hugo CIRETTE
 */

// Import de 'Sequelize'
const Sequelize = require('sequelize');

// Export du modèle
module.exports = (sequelize) => {
  return sequelize.define('Questions', {
    questions_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questions_texte: Sequelize.TEXT,
    questions_chrono: Sequelize.INTEGER,
    questions_image: Sequelize.TEXT,
    questions_id_fk_questionnaires: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Questionnaires',
        key: 'questionnaires_id'
      }
    }
  });
};