/**
 * @file public/js/joueurs/RecupNomJoueur.js
 * @author Nathan EPRON
 */

const pseudoJoueur = document.getElementById("PseudoJoueur");

if (sessionStorage.getItem("nomJoueur")) {
  const nomJoueur = sessionStorage.getItem("nomJoueur");
  pseudoJoueur.textContent = nomJoueur;
}