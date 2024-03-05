/**
 * @file public/js/joueurs/LoadingRoomTxtAnimation.js
 * @author Nathan EPRON
 */

const text = document.querySelector('#text');

const messages = ["A vos marques !", "Prêt ?!", "Quizez !"];

let index = 0;
let i = 0;

function typing() {
  let message = messages[index];
  text.textContent = "";
  i = 0;

  let interval = setInterval(() => {
    if (i < message.length) {
      text.textContent += message[i];
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        index++;
        if (index >= messages.length) {
          index = 0;
        }
        typing();
      }, 1000);
    }
  }, 100);
}

typing();