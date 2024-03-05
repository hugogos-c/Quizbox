/**
 * @file public/js/admins/oeil.js
 * @author Nathan HAUDEBAULT
 */

document.querySelector('.show-password').addEventListener('click', () => {
  var password = document.querySelector('input[name="password"]');

  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
});