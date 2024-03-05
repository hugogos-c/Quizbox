/**
 * @file controller/supprimerQuestionnaire.js
 * @author Hugo CIRETTE
 */

const { Questionnaires, Questions, Propositions } = require('../databaseConnection');

module.exports = async (id) => {
  await Questionnaires.destroy({
    where: {
      questionnaires_id: id
    },
    include: {
      model: Questions,
      include: {
        model: Propositions
      }
    }
  });
};