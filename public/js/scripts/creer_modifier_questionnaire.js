/**
 * @file public/js/scripts/creer_modifier_questionnaire.js
 * @author Hugo CIRETTE & Maël HOCHEDEZ
 */

// Permet d'utiliser socket.io
const socket = io();

// Connexion au serveur
socket.on('connect', () => {
  // Si l'admin n'est pas connecté, redirige vers la page de connexion
  if (!sessionStorage.getItem('nomAdmin')) {
    document.location.href = '/connexion';
  }

  document.querySelector('#modifier').addEventListener('click', () => {
    socket.emit('recuperer_admin', sessionStorage.getItem('nomAdmin'));
  });

  socket.on('recuperer_admin', (admin) => {
    document.location.href = `/admin/${admin.id}/modifier`;
  });

  document.querySelector('#deconnexion').addEventListener('click', () => {
    sessionStorage.removeItem('nomAdmin');
    document.location.href = '/connexion';
  });

  const url = document.location.href.split('/');

  socket.emit('recuperer_dossiers', sessionStorage.getItem('nomAdmin'));

  socket.on('recuperer_dossiers', (data) => {
    // Convertit la donnée en objet JavaScript
    const dossiers = JSON.parse(data);

    dossiers.dossiersAdmin.forEach(dossier => {
      document.querySelector('#questionnaire_dossier').innerHTML += `
      <option>${dossier.dossiers_nom}</option>
      `;
    });

    dossiers.dossiersCompte.forEach(dossier => {
      document.querySelector('#questionnaire_dossier').innerHTML += `
      <option>${dossier.dossiers_nom}</option>
      `;
    });
  });

  // Page de création de questionnaire
  if (url[4] === 'creer') {
    const questions = document.querySelector('#questions');

    const questionsDiv = document.querySelectorAll('.questions');

    const question = document.createElement('div');
    question.setAttribute('class', 'questions');

    const h4 = document.createElement('h4');
    h4.innerHTML = `Question ${questionsDiv.length + 1}`;

    const question_input = document.createElement('div');

    const question_label = document.createElement('label');
    question_label.innerHTML = 'Titre :&nbsp;';

    const supprimer_question_choix = document.createElement('input');
    supprimer_question_choix.setAttribute('type', 'button');
    supprimer_question_choix.setAttribute('class', 'supprimer');
    supprimer_question_choix.setAttribute('value', 'Supprimer');

    const question_titre = document.createElement('input');
    question_titre.setAttribute('type', 'text');
    question_titre.setAttribute('class', 'question_texte');

    const question_image = document.createElement('input');
    question_image.setAttribute('type', 'file');
    question_image.setAttribute('class', 'question_image');

    const propositions = document.createElement('div');

    var proposition = [];
    for (let i = 1; i < 5; i++) {
      const proposition_div = document.createElement('div');

      const proposition_label = document.createElement('label');
      proposition_label.innerHTML = `Proposition ${i} :&nbsp;`;

      const proposition_titre = document.createElement('input');
      proposition_titre.setAttribute('type', 'text');
      proposition_titre.setAttribute('class', 'proposition_texte');

      const proposition_checkbox = document.createElement('input');
      proposition_checkbox.setAttribute('type', 'checkbox');
      proposition_checkbox.setAttribute('name', `question_${questionsDiv.length + 1}_proposition_correcte`);
      proposition_checkbox.setAttribute('class', 'proposition_correcte');

      proposition_div.append(proposition_label);
      proposition_div.append(proposition_titre);
      proposition_div.innerHTML += '&nbsp;';
      proposition_div.append(proposition_checkbox);
      proposition.push(proposition_div);
    }

    const chronometre_input = document.createElement('div');

    const chronometre_label = document.createElement('label');
    chronometre_label.innerHTML = `Chronomètre (en seconde) :&nbsp;`;

    const chronometre_titre = document.createElement('input');
    chronometre_titre.setAttribute('type', 'number');
    chronometre_titre.setAttribute('class', 'chronometre');
    chronometre_titre.setAttribute('value', '60');

    // Ajout des élément créés précédemment à la page HTML
    question.append(h4);
    question_input.append(question_label);
    question_input.append(question_titre);
    question_input.append(supprimer_question_choix);
    question_input.append(question_image);
    question.append(question_input);
    question.append(propositions);
    chronometre_input.append(chronometre_label);
    chronometre_input.append(chronometre_titre);
    question.append(chronometre_input);

    for (let i = 0; i < proposition.length; i++) {
      propositions.append(proposition[i]);
    }

    const br = document.createElement('br');
    questions.append(br);
    questions.append(question);

    const brDiv = document.querySelector('#questions').querySelectorAll('br');
    question.querySelector('.supprimer').addEventListener('click', () => {
      brDiv[brDiv.length - 1].remove();
      question.remove();

      var i = 0;
      document.querySelectorAll('.questions').forEach(q => {
        i++;
        q.querySelector('h4').innerHTML = `Question ${i}`;
      });
    });
  }

  // Page de modification de questionnaire
  if (url[5] === 'modifier') {
    const idQuestionnaire = url[4];
    socket.emit('recuperer_questionnaire', 'id', idQuestionnaire);

    socket.on('recuperer_questionnaire', (data) => {
      const questionnaire = JSON.parse(data);

      // Remplis les données du questionnaire
      document.querySelector('#questionnaire_titre').value = questionnaire.questionnaires_titre;
      document.querySelector('#questionnaire_description').value = questionnaire.questionnaires_description;
      document.querySelector('#questionnaire_dossier').value = questionnaire.questionnaires_dossier;

      var v = document.querySelector('#questions').querySelectorAll('.questions').length;
      const img = document.createElement('img');
      img.setAttribute('src', questionnaire.questionnaires_image);
      img.setAttribute('alt', questionnaire.questionnaires_titre);
      img.setAttribute('class', 'img_titre');
      const div = document.createElement('div');
      div.innerHTML = 'Image actuel : ';
      document.querySelector('#questionnaire_image').style.display = 'block';
      document.querySelector('#questionnaire_image').after(document.createElement('br'));
      document.querySelector('#questionnaire_image').after(img);
      document.querySelector('#questionnaire_image').after(div);

      // Ajoute et remplis les données des questions
      questionnaire.Questions.forEach(question => {
        if (v !== 0) {
          document.querySelector('#questions').innerHTML += `<br>`;
        }
        v++;
        var correcte = [];
        for (let i = 0; i < 4; i++) {
          if (question.Propositions[i].propositions_correcte == 1) {
            correcte.push('checked');
          } else {
            correcte.push('');
          }
        }
        document.querySelector('#questions').innerHTML += `
        <div class="questions">
          <h4>Question ${v}</h4>
          <div>
            <label>Titre :</label>
            <input type="text" class="question_texte" value="${question.questions_texte}" required>
            <input type="button" class="supprimer" value="Supprimer">
            <input type="file" class="question_image">
            <div>Image actuel :</div>
            <img src="${question.questions_image}", alt="${question.questions_image}" class="img_question" style="display:block;">
          </div>
          <br>
          <div>
            <div>
              <label>Proposition 1 : </label>
              <input type="text" value="${question.Propositions[0].propositions_texte}" class="proposition_texte">
              <input type="checkbox" name="question_${v}_proposition_correcte" class="proposition_correcte" value="a" ${correcte[0]}>
            </div>
            <div>
              <label>Proposition 2 : </label>
              <input type="text" value="${question.Propositions[1].propositions_texte}" class="proposition_texte">
              <input type="checkbox" name="question_${v}_proposition_correcte" class="proposition_correcte" value="b" ${correcte[1]}>
            </div>
            <div>
              <label>Proposition 3 : </label>
              <input type="text" value="${question.Propositions[2].propositions_texte}" class="proposition_texte">
              <input type="checkbox" name="question_${v}_proposition_correcte" class="proposition_correcte" value="c" ${correcte[2]}>
            </div>
            <div>
              <label>Proposition 4 : </label>
              <input type="text" value="${question.Propositions[3].propositions_texte}" class="proposition_texte">
              <input type="checkbox" name="question_${v}_proposition_correcte" class="proposition_correcte" value="d" ${correcte[3]}>
            </div>
          </div>
          <div>
            <label>Chronomètre (en seconde) :</label>
            <input type="number" class="chronometre" value="${parseInt(question.questions_chrono)}" required>
          </div>
        </div>
        `;
      });

      const questions = document.querySelectorAll('.questions');
      const br = document.querySelector('#questions').querySelectorAll('br');

      for (let i = 0; i < questions.length; i++) {
        questions[i].querySelector('.supprimer').addEventListener('click', () => {
          if (br[i] !== undefined) {
            br[i].remove();
          }
          questions[i].remove();

          var j = 0;
          document.querySelectorAll('.questions').forEach(q => {
            j++;
            q.querySelector('h4').innerHTML = `Question ${j}`;
          });
        });
      }
    });
  }

  document.querySelector('#enregistrer').addEventListener('click', async (e) => {
    // Empêche l'envoi du formulaire (s'il y en a un)
    e.preventDefault();

    // Récupère les données du questionnaire
    const questionnaire_titre = document.querySelector('#questionnaire_titre').value;
    const questionnaire_description = document.querySelector('#questionnaire_description').value;
    const questionnaire_dossier = document.querySelector('#questionnaire_dossier').value;

    // Image
    const questionnaire_image = document.querySelector('#questionnaire_image').files[0];
    var imageOld;
    var questionnaire_imageOld;
    if (url[5] === 'modifier') {
      imageOld = document.querySelector('#quiz-form').querySelectorAll('img')[0].src;
      questionnaire_imageOld = imageOld.split('/')[imageOld.split('/').length - 1];
    }
    var questionnaire_imageName;
    if (questionnaire_image) {
      questionnaire_imageName = questionnaire_image.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '_').replaceAll('\'', '_').toLowerCase();
    }

    // Initialisation de la donnée avec les données du questionnaire
    var data = {
      nomAdmin: sessionStorage.getItem('nomAdmin'),
      titre: questionnaire_titre,
      description: questionnaire_description,
      imageChange: false,
      imageOld: questionnaire_imageOld,
      imageName: questionnaire_imageName,
      image: questionnaire_image,
      dossier: questionnaire_dossier,
      Questions: []
    };

    if (questionnaire_image) {
      data.imageChange = true;
    }

    for (let i = 0; i < document.querySelectorAll('.questions').length; i++) {
      // Récupère les données du questionnaire
      const question_titre = document.querySelectorAll(`.question_texte`)[i].value;
      const question_chrono = document.querySelectorAll('.chronometre')[i].value;
      const question_proposition_1_texte = document.querySelectorAll(`.proposition_texte`)[(i * 4) + 0].value;
      const question_proposition_2_texte = document.querySelectorAll(`.proposition_texte`)[(i * 4) + 1].value;
      const question_proposition_3_texte = document.querySelectorAll(`.proposition_texte`)[(i * 4) + 2].value;
      const question_proposition_4_texte = document.querySelectorAll(`.proposition_texte`)[(i * 4) + 3].value;
      const question_proposition_1_checkbox = document.querySelectorAll(`.proposition_correcte`)[(i * 4) + 0].checked;
      const question_proposition_2_checkbox = document.querySelectorAll(`.proposition_correcte`)[(i * 4) + 1].checked;
      const question_proposition_3_checkbox = document.querySelectorAll(`.proposition_correcte`)[(i * 4) + 2].checked;
      const question_proposition_4_checkbox = document.querySelectorAll(`.proposition_correcte`)[(i * 4) + 3].checked;

      // Image
      const question_image = document.querySelectorAll(`.question_image`)[i].files[0];
      var imageOld;
      var question_imageOld;
      if (url[5] === 'modifier') {
        if (document.querySelector('#quiz-form').querySelectorAll('img')[i + 1]) {
          imageOld = document.querySelector('#quiz-form').querySelectorAll('img')[i + 1].src;
          question_imageOld = imageOld.split('/')[imageOld.split('/').length - 1];
        }
      }
      var question_imageName;
      if (question_image) {
        question_imageName = question_image.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '_').replaceAll('\'', '_').toLowerCase();
      }

      // Ajoute des cases au tableau pour ajouter les questions et les propositions
      data.Questions.push({
        texte: question_titre,
        chrono: question_chrono,
        imageChange: false,
        imageOld: question_imageOld,
        imageName: question_imageName,
        image: question_image,
        Propositions: [
          {
            texte: question_proposition_1_texte,
            correcte: question_proposition_1_checkbox
          },
          {
            texte: question_proposition_2_texte,
            correcte: question_proposition_2_checkbox
          },
          {
            texte: question_proposition_3_texte,
            correcte: question_proposition_3_checkbox
          },
          {
            texte: question_proposition_4_texte,
            correcte: question_proposition_4_checkbox
          }
        ]
      });

      if (question_image) {
        data.Questions[data.Questions.length - 1].imageChange = true;
      }
    }

    if (url[4] === 'creer') {
      // Envoie une requête au serveur pour créer un questionnaire
      socket.emit('creer_questionnaire', data);
    } else {
      // Envoie une requête au serveur pour modifier un questionnaire
      const idQuestionnaire = document.location.href.split('/')[4];
      socket.emit('modifier_questionnaire', data, idQuestionnaire);
    }

    socket.on('questionnaire', (idQuestionnaire) => {
      document.location.href = `/questionnaire/${idQuestionnaire}`;
    });
  });
});