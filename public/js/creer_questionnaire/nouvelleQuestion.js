/**
 * @file public/js/creer_questionnaire/nouvelleQuestion.js
 * @author Hugo CIRETTE & Maël HOCHEDEZ
 */

document.querySelector('#ajouter_question').addEventListener('click', () => {
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

    document.querySelectorAll('.questions').forEach((q, i) => {
      q.querySelector('h4').innerHTML = `Question ${i + 1}`;
    });
  });
});