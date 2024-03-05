/**
 * @file models/Dossiers.js
 * @author Hugo CIRETTE
 */

// Import de 'Sequelize'
const Sequelize = require('sequelize');

// Export du modèle
module.exports = (sequelize) => {
  return sequelize.define('Dossiers', {
    dossiers_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dossiers_nom: Sequelize.TEXT,
    dossiers_id_fk_admins: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Admins',
        key: 'admins_id'
      }
    }
  });
};