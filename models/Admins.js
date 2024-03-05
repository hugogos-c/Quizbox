/**
 * @file models/Admins.js
 * @author Hugo CIRETTE
 */

// Import de 'Sequelize'
const Sequelize = require('sequelize');

// Export du modèle
module.exports = (sequelize) => {
  return sequelize.define('Admins', {
    admins_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    admins_email: Sequelize.TEXT,
    admins_nom: Sequelize.TEXT,
    admins_mdp: Sequelize.TEXT
  });
};