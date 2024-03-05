/**
 * @file public/js/admins/Mdp.js
 * @author Nathan EPRON
 */

const checkbox = document.getElementById("weekday-1");
const passwordInputs = document.querySelectorAll('input[type="password"]');

checkbox.addEventListener("change", function () {
  if (this.checked) {
    passwordInputs.forEach(function (input) {
      input.type = "text";
    });
  } else {
    passwordInputs.forEach(function (input) {
      input.type = "password";
    });
  }
});