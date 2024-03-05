/**
 * @file public/js/joueurs/ResponsiveButtonJeu.js
 * @author Nathan EPRON
 */

const buttons = document.querySelectorAll('.red-button, .yellow-button, .green-button, .orange-button');

function resizeButtons() {
  let bodyButtonHeight = document.querySelector('.Body-Button').offsetHeight;

  buttons.forEach(function (button) {
    // Si la largeur de la fenêtre est inférieure à 700px, on soustrait 38 plutôt que 44
    // Si la largeur de la fenêtre est inférieure à 400px, on soustrait 36 plutôt que 40
    const factor = window.innerHeight < 400 ? 30 : window.innerHeight < 500 ? 33 : window.innerHeight < 580 ? 35 : window.innerHeight < 670 ? 37 : window.innerHeight < 720 ? 39 : 44;
    button.style.height = (bodyButtonHeight / 1.9) - factor + 'px';
  });
}

resizeButtons();

window.addEventListener('resize', function () {
  resizeButtons();
});