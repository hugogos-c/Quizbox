/**
 * @file databaseConnection.js
 * @author Hugo CIRETTE
 */

const Sequelize = require('sequelize'); // Chargement de 'sequelize'

const db_name = __dirname + '/database/quizbox.db';

// Connexion à la base de données
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: db_name
});

// Chargement des modèles
const Admins = require('./models/Admins')(sequelize);
const Dossiers = require('./models/Dossiers')(sequelize);
const Questionnaires = require('./models/Questionnaires')(sequelize);
const Questions = require('./models/Questions')(sequelize);
const Propositions = require('./models/Propositions')(sequelize);
const Joueurs = require('./models/Joueurs')(sequelize);
const Historiques = require('./models/Historiques')(sequelize);

// Synchronisation des modèles
sequelize.sync();

// Définition des liens entres les tables
Admins.hasMany(Questionnaires, { foreignKey: 'questionnaires_id_fk_admins' });
Questionnaires.belongsTo(Admins, { foreignKey: 'questionnaires_id_fk_admins' });
Dossiers.hasMany(Questionnaires, { foreignKey: 'questionnaires_id_fk_dossiers' });
Questionnaires.belongsTo(Dossiers, { foreignKey: 'questionnaires_id_fk_dossiers' });
Questionnaires.hasMany(Questions, { foreignKey: 'questions_id_fk_questionnaires' });
Questions.belongsTo(Questionnaires, { foreignKey: 'questions_id_fk_questionnaires' });
Questions.hasMany(Propositions, { foreignKey: 'propositions_id_fk_questions' });
Propositions.belongsTo(Questions, { foreignKey: 'propositions_id_fk_questions' });
Questionnaires.hasMany(Joueurs, { foreignKey: 'joueurs_id_fk_questionnaires' });
Joueurs.belongsTo(Questionnaires, { foreignKey: 'joueurs_id_fk_questionnaires' });
Questionnaires.hasMany(Historiques, { foreignKey: 'historiques_id_fk_questionnaires' });
Historiques.belongsTo(Questionnaires, { foreignKey: 'historiques_id_fk_questionnaires' });

module.exports = { Admins, Dossiers, Questionnaires, Questions, Propositions, Joueurs, Historiques };