# Events

> Documentation de l'utilisation des différents events qui interrogent l'API pour récupérer des données de la base de données avec des exemples d'utilisation
---

## Initialiser les scripts events
```js
// Permet d'utiliser socket.io
const socket = io();

// Connexion au serveur
socket.on('connect');

window.onload = () => {
  // todo: mettre les codes events ici
  // todo: cela va permettre d'exécuter le code UNIQUEMENT si tous les éléments de la page sont chargés
};
```

> À mettre dans toutes les pages contenant des events socket.io
```html
<!-- Permet d'utiliser socket.io -->
<script src="/socket.io/socket.io.js"></script>
<!-- todo: remplacer 'fichier.js' par le fichier qui correspond -->
<!-- todo: les scripts permettant la communication entre les interfaces et le serveur seront dans le dossier /js/scripts -->
<script src="/js/scripts/fichier.js"></script>
```

## Créer un questionnaire (côté creer_questionnaire)
```js
// Selectionne l'élément dont l'id est 'creer_qustionnaire' (l'id peut être changé) puis écoute l'évènement 'click'
document.querySelector('#creer_qustionnaire').addEventListener('click', (e) => {
  
  // Empêche l'envoi du formulaire (s'il y en a un)
  e.preventDefault();

  // Récupère les données du questionnaire
  const questionnaire_titre = document.querySelector('#questionnaire_titre').value;
  const questionnaire_description = document.querySelector('#questionnaire_description').value;
  const questionnaire_image = document.querySelector('#questionnaire_image').value;
  const questionnaire_section = document.querySelector('#questionnaire_section').value;
  const questionnaire_question_1_texte = document.querySelector('#questionnaire_question_1_texte').value;
  const questionnaire_question_1_image = document.querySelector('#questionnaire_question_1_image').value;
  const questionnaire_question_1_proposition_1_texte = document.querySelector('#questionnaire_question_1_proposition_1_texte').value;
  const questionnaire_question_1_proposition_2_texte = document.querySelector('#questionnaire_question_1_proposition_2_texte').value;
  const questionnaire_question_1_proposition_3_texte = document.querySelector('#questionnaire_question_1_proposition_3_texte').value;
  const questionnaire_question_1_proposition_4_texte = document.querySelector('#questionnaire_question_1_proposition_4_texte').value;
  const questionnaire_question_1_proposition_1_radio = document.querySelector('#questionnaire_question_1_proposition_1_radio').checked;
  const questionnaire_question_1_proposition_2_radio = document.querySelector('#questionnaire_question_1_proposition_2_radio').checked;
  const questionnaire_question_1_proposition_3_radio = document.querySelector('#questionnaire_question_1_proposition_3_radio').checked;
  const questionnaire_question_1_proposition_4_radio = document.querySelector('#questionnaire_question_1_proposition_4_radio').checked;

  // Initialisation de la donnée avec les données du questionnaire
  var data = {
    titre: questionnaire_titre,
    description: questionnaire_description,
    image: questionnaire_image,
    section: questionnaire_section,
    nbQuestions: 3,
    question: []
  };

  // Ajoute des cases au tableau pour ajouter les questions et les propositions
  data.question.push({
    texte : questionnaire_question_1_texte,
    image : questionnaire_question_1_image,
    1: {
      texte: questionnaire_question_1_proposition_1_texte,
      correcte: questionnaire_question_1_proposition_1_radio
    },
    2: {
      texte: questionnaire_question_1_proposition_2_texte,
      correcte: questionnaire_question_1_proposition_2_radio
    },
    3: {
      texte: questionnaire_question_1_proposition_3_texte,
      correcte: questionnaire_question_1_proposition_3_radio
    },
    4: {
      texte: questionnaire_question_1_proposition_4_texte,
      correcte: questionnaire_question_1_proposition_4_radio
    }
  });

  // Envoie une requête au serveur la donnée
  socket.emit('creer_questionnaire', data);

  // Change de page au bout de 100 ms
  setTimeout(() => {
    document.location.href = '/accueil';
  }, 100);
});
```

## Paramétrer le code PIN (côté admins)
```js
// Selectionne l'élément dont l'id est 'codePin' (l'id peut être changé) puis écoute l'évènement 'click'
document.querySelector('#codePin').addEventListener('click', (e) => {

  // Empêche l'envoi du formulaire (s'il y en a un)
  e.preventDefault();

  // Récupère le code PIN et l'id du questionnaire
  const code_pin = document.querySelector('#code_pin').value;
  const idQuestionnaire = document.location.href.split('/')[3];

  // Envoie une requête au serveur pour paramétrer le code PIN avec l'id du questionnaire
  socket.emit('parametrer_code_pin_admin', idQuestionnaire, code_pin);
});
```

## Récupérer les questionnaires pour l'accueil (côté admins)
```js
// Envoie une requête au serveur pour dire que l'on veut récupérer le questionnaire pour l'accueil
socket.emit('recuperer_questionnaire_accueil');

// Récéptionne le questionnaire pour l'afficher dans l'accueil
socket.on('recuperer_questionnaire_accueil', (questionnaires) => {
  //todo:
  console.log(questionnaires);
});
```

## Récupérer un questionnaire et ses questions pour l'aperçu (coté admins)
```js
// Récupère l'id du questionnaire
const idQuestionnaire = document.querySelector('#idQuestionnaire').value;

// Envoie une requête au serveur pour dire que l'on veut récupérer le questionnaire pour l'aperçu
socket.emit('recuperer_questionnaire_apercu', idQuestionnaire);

// Récéptionne le questionnaire au format JSON pour l'afficher dans l'accueil
socket.on('recuperer_questionnaire_apercu', (data) => {
  // todo:
  console.log(data);
});
```

## Récupérer le questionnaire et ses questions et ses propositions pour le jeu (coté admins)
```js
// Récupère l'id du questionnaire
const idQuestionnaire = document.querySelector('#idQuestionnaire').value;

// Envoie une requête au serveur pour dire qu'on veut récupérer le questionnaire via l'id du questionnaire
socket.emit('recuperer_questionnaire_jeu_admin', idQuestionnaire);

// Récéptionne le questionnaire au format JSON pour le jeu côté admin
socket.on('recuperer_questionnaire_jeu_admin', (data) => {
  // todo:
  console.log(data);
});
```

## Récupérer les joueurs du lobby (coté admins)
```js
// Récupère la liste des joueurs toute les secondes
setInterval(() => {

  // Récupère le code PIN
  const codePin = document.location.href.split('/')[4];

  // Envoie une requête au serveur pour dire qu'on veut récupérer les joueurs présents dans le lobby
  socket.emit('recuperer_joueurs_lobby', codePin);
}, 1000);

// Récéptionne la liste des joueurs
socket.on('recuperer_joueurs_lobby', (joueurs) => {
  console.log(joueurs);
});
```

## Récupérer le classement (côté admins)
```js
// Envoie une requête au serveur pour dire qu'on veut récupérer le classement
socket.emit('recuperer_classement');

// Récéptionne le classement
socket.on('recuperer_classement', (classement) => {
  console.log(classement);
});
```

## Se connecter à un questionnaire (côté joueurs)
```js
// Récupère l'élément qui contient l'id 'se_connecter' (l'id peut être changé) puis écoute l'évènement 'click'
document.querySelector('#se_connecter').addEventListener('click', (e) => {

  // Empêche l'envoi du formulaire
  e.preventDefault();

  // Récupère le code PIN
  const code_pin = document.querySelector('#code_pin').value;

  // Envoie une requête au serveur pour dire qu'on veut se connecter au questionnaire
  socket.emit('se_connecter_questionnaire', code_pin);
});

// Si un questionnaire ne contient pas de code PIN, on fait apparaître le message d'erreur
socket.on('se_connecter_questionnaire_erreur', () => {
  message.style.display = "flex";
  setTimeout(() => {
    message.style.display = "none";
    input.value = "";
  }, 2000);
});

// Si un questionnaire contient un code PIN
socket.on('se_connecter_questionnaire', (codePin) => {

  //  On change de page pour pouvoir rentrer son pseudo
  document.location.href = `/${codePin}/pseudo`;
});
```

## Ajouter un joueur qui se connecte au lobby à la base de données (côté joueurs)
```js
// Séléctionne l'élément qui contient l'id 'se_connecter' (l'id peut être changé) puis écoute l'évènement 'click'
document.querySelector('#se_connecter').addEventListener('click', (e) => {

  // Empêche l'envoi du formulaire (s'il y en a un)
  e.preventDefault();

  // Récupère le code PIN dans l'url et le pseudo du joueur
  const codePin = document.location.href.split('/')[4];
  const joueur = document.querySelector('#pseudo').value;

  // Envoie une requête au serveur pour dire qu'on veut associer un joueur à un certain questionnaire qui contient le code PIN codePin
  socket.emit('ajouter_joueur_lobby', codePin, joueur);
});

// Si le code PIN n'est associé à aucun questionnaire, on met un message d'erreur
socket.on('ajouter_joueur_lobby_erreur', () => {
  // Remplacer ce console.log() par une apparition d'un message d'erreur par exemple
  console.log('Ce lobby n\'existe pas');
});
```

## Récupérer la bonne réponse (côté joueurs)
```js
// Récupère le code PIN et l'id de la question via l'url
const url = document.location.href.split('/');
const codePin = url[4];
const idQuestion = url[6];

// Lors du click sur la première proposition
document.querySelector('#proposition_1').addEventListener('click', (e) => {
  // Empêche l'envoi du formulaire (s'il y en a un)
  e.preventDefault();

  // Envoie une requête pour dire qu'on veut vérifier si la proposition sur laquelle on a cliqué est bonne ou pas
  socket.emit('verifier_propositions', codePin, idQuestion, 1);
});

// Lors du click sur la deuxième proposition
document.querySelector('#proposition_2').addEventListener('click', (e) => {
  // Empêche l'envoi du formulaire (s'il y en a un)
  e.preventDefault();

  // Envoie une requête pour dire qu'on veut vérifier si la proposition sur laquelle on a cliqué est bonne ou pas
  socket.emit('verifier_propositions', codePin, idQuestion, 2);
});

// Lors du click sur la troisième proposition
document.querySelector('#proposition_3').addEventListener('click', (e) => {
  // Empêche l'envoi du formulaire (s'il y en a un)
  e.preventDefault();

  // Envoie une requête pour dire qu'on veut vérifier si la proposition sur laquelle on a cliqué est bonne ou pas
  socket.emit('verifier_propositions', codePin, idQuestion, 3);
});

// Lors du click sur la quatrième proposition
document.querySelector('#proposition_4').addEventListener('click', (e) => {
  // Empêche l'envoi du formulaire (s'il y en a un)
  e.preventDefault();

  // Envoie une requête pour dire qu'on veut vérifier si la proposition sur laquelle on a cliqué est bonne ou pas
  socket.emit('verifier_propositions', codePin, idQuestion, 4);
});

// Récéptionne l'état de la réponse choisi
socket.on('verifier_propositions', (correcte) => {
  // Si la réponse choisi est correcte
  if (correcte === true) {
    // todo: incémenter le score
    console.log('Bonne réponse');

  // Si la réponse choisi n'est pas correcte
  } else {
    // todo:
    console.log('Mauvaise réponse');
  }
});
```

## Incrémenter le score (côté joueurs)
```js
// Récupère l'id du joueur et son score à ajouter
const idJoueur = document.querySelector('#idJoueur').value;
const score = document.querySelector('#score').value;

// Envoie une requête au serveur pour dire qu'on veut incrémenter le score
socket.emit('incrementer_score', idJoueur, score);
```

## Faire changer de page les deux côté (côté admins)
```js
// todo: on peut par exemple remplacer 'document.querySelector('#demarrer')' par un 'setTimeout()'
document.querySelector('#demarrer').addEventListener('click', (e) => {
  e.preventDefault();

  // Envoie une requête au serveur pour dire qu'on veut changer de page en envoyant certains paramètres (les paramètres ne sont pas obligatoires)
  socket.emit('changer_page', param1, param2, param3);
});

// Récéptionne une requête du serveur avec les paramètres (les paramètres ne sont pas obligatoires)
socket.on('changer_page', (param1, param2, param3) => {
  // todo: changer l'url
  const codePin = document.location.href.split('/')[4];
  const idQuestion = 1;

  // Permet de changer de page
  document.location.href = '/admin/' + codePin + '/question/' + idQuestion;
});
```

## Faire changer de page les deux côté (côté joueurs)
```js
// Récéptionne une requête du serveur avec les paramètres (les paramètres ne sont pas obligatoires)
// param1, param2 et param3 sont des variables que l'on peut nommer autrement
// on peut transmettre n'importe quels variables entre pages
// comme le code PIN ou l'id de la question
socket.on('changer_page', (param1, param2, param3) => {
  // todo: changer l'url
  const codePin = document.location.href.split('/')[3];
  const idQuestion = 1;

  // Permet de changer de page
  document.location.href = '/' + codePin + '/question/' + idQuestion;
});
```





```js
attributes: ['propositions_id', 'propositions_correcte', 'propositions_id_fk_questions'],
```