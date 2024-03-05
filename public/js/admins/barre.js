/**
 * @file public/js/admins/barre.js
 * @author Nathan EPRON
 */

window.addEventListener("load", function() {
  var progressBar = document.querySelector(".progress-fill");
  var width = 0;
  var duration = 7000; // Durée du timer en millisecondes
  var interval = duration / 100; // Intervalle de mise à jour de la progress bar en millisecondes

  setInterval(function() {
    if (width >= 100) {
      clearInterval(interval);
    } else {
      width++;
      progressBar.style.width = width + "%";
    }
  }, interval);
});