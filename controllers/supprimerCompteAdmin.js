/**
 * @file controller/supprimerCompteAdmin.js
 * @author Hugo CIRETTE
 */

const { Admins, Dossiers, Questionnaires } = require('../databaseConnection');

module.exports = async (idAdmin) => {
  // Supprime les dossiers qui sont associé à l'id de l'admin
  await Dossiers.destroy({
    where: {
      dossiers_id_fk_admins: idAdmin
    }
  });

  // Supprime les questionnaires qui sont associé à l'id de l'admin
  await Questionnaires.destroy({
    where: {
      questionnaires_id_fk_admins: idAdmin
    }
  });

  // Supprime l'admin via son id
  await Admins.destroy({
    where: {
      admins_id: idAdmin
    }
  });
};