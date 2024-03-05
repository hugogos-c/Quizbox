/**
 * @file models/Questionnaires.js
 * @author Hugo CIRETTE
 */

// Import de 'Sequelize'
const Sequelize = require('sequelize');

// Export du modèle
module.exports = (sequelize) => {
  return sequelize.define('Questionnaires', {
    questionnaires_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionnaires_titre: Sequelize.TEXT,
    questionnaires_description: Sequelize.TEXT,
    questionnaires_image: Sequelize.INTEGER,
    questionnaires_codePin: Sequelize.INTEGER,
    questionnaires_id_fk_admins: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Admins',
        key: 'admins_id'
      }
    },
    questionnaires_id_fk_dossiers: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Dossiers',
        key: 'dossiers_id'
      }
    }
  });
};