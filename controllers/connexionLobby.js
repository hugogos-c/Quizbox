/**
 * @file controller/connexionLobby.js
 * @author Hugo CIRETTE
 */

const { Questionnaires } = require('../databaseConnection');

module.exports = async (socket, code_pin) => {
  // Cherche dans la base de données si un questionnaire correspond au code PIN entré par le joueur 
  const questionnaires = await Questionnaires.findAll({
    attributes: ['questionnaires_codePin'],
    where: {
      questionnaires_codePin: code_pin
    }
  });

  // Récupère le code PIN
  const codePin = questionnaires[0].questionnaires_codePin;

  // Rejoint le lobby jeu_codePin
  const lobby = `jeu_${codePin}`;
  socket.join(lobby);
  console.log(`Un joueur s'est connecté sur le lobby '${lobby}'`);
  return codePin;
}