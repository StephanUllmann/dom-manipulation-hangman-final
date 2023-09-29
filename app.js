// Imports and global variables - leave them as they are
import { words, getLetterIndexes, getRandomWord } from './utils/utils.js';
let currentWord = getRandomWord();
let hangmanPart, points, lettersToGo, playing;

// ? last bit
const decrementPointsGlobal = new Event('decrementpoints');

/**
 * ! START HERE
 * * Selecting elements from the DOM
 * TODO | Select the form to get a new typed in word
 * TODO | form class="new-word__form"
 */
const header = document.querySelector('header');
const newWordForm = header.querySelector('form');

/**
 * TODO | Select this button to randomly select a new word
 * TODO | button id="random-word-btn"
 */
const randomWordBtn = document.getElementById('random-word-btn');

/**
 * TODO | Select this input to get the player's name
 * TODO | input name="player-name"
 */
const playerNameEl = Array.from(document.getElementsByName('player-name'))[0];

/**
 * TODO | Select this span to control the points
 * TODO | <span class="points__num">26</span>
 */
const pointsEl = header.querySelector('div>span.points__num');

/**
 * TODO | Select this container to insert the hangman parts later on
 * TODO | <section class="hangman__container">
 */
const hangmanContainer = document.querySelector('section.hangman__container');

/**
 * TODO | This container to insert the missing and found letters later on
 * TODO | <section class="word__container">
 */
const wordContainer = document.querySelector('.word__container');

/**
 * TODO | Somehow something from these to get the letter
 * TODO | <section class="keyboard__container">
 * TODO | <button class="btn--letter"><span>q</span></button>
 * TODO | <button class="btn--letter strikeout"><span>e</span></button>
 */
const letterBtns = document.getElementsByClassName('btn--letter');
// ! OR
const keyboardEL = document.querySelector('.keyboard__container');

/**
 * * Doing something with the elements
 *
 * * Display "spaces" for the currentWord inside the wordContainer
 * TODO | Create and show <div class="word__letter--container"><span class="word__letter"></span></div>
 * TODO | per letter in currentWord
 */

function renderCurrentWord() {
  // loop over currentWord
  for (let i = 0; i < currentWord.length; i++) {
    // create the div and add the css classes
    // "word__letter--container" on every,
    // "word__letter--space" only on whitespaces
    const div = document.createElement('div');
    div.classList.add('word__letter--container');
    if (currentWord[i] === ' ') {
      div.classList.add('word__letter--space');
    }
    // create span, add css and insert into div
    const span = document.createElement('span');
    div.appendChild(span);
    // insert the div into wordContainer
    wordContainer.appendChild(div);
  }
}
/**
 * TODO | actually call the function 😊
 */
renderCurrentWord();

/**
 * * Making the UI interactive
 *
 * TODO | add event listener(s) to get a letter on click
 */
keyboardEL.addEventListener('click', handleKeyboardClick);
// ! OR
// [...letterBtns].forEach((btn) =>
//   btn.addEventListener('click', handleLetterClick)
// );
/**
 * TODO | write the event handler function for the letter click (as ES5 function expressions)
 * TODO | get letter indexes on keyboard click
 */

function handleKeyboardClick(e) {
  if (!playing) return;
  // get the button from the event (e)
  const btn = e.target.closest('button');
  // return early if invalid
  if (!btn) return;
  // get the letter from the button
  const letter = btn.children[0].textContent;
  const indexes = getLetterIndexes(letter, currentWord);
  // add css class "strikeout" to the button
  btn.classList.add('strikeout');
  // disable the button
  btn.disabled = true;
  if (indexes.length === 0) insertHangman();
  else insertLetter(indexes);
}
// ! OR
function handleLetterClick(e) {
  if (!playing) return;
  // get the button from the event (e)
  const btn = e.target.closest('button');
  // get the letter from the button
  const letter = btn.children[0].textContent;
  const indexes = getLetterIndexes(letter, currentWord);
  // add css class "strikeout" to the button
  btn.classList.add('strikeout');
  // disable the button
  btn.disabled = true;
  if (indexes.length === 0) insertHangman();
  else insertLetter(indexes);
}

/**
 * TODO | display the correct letter in it's place
 */

function insertLetter(foundIndexes) {
  foundIndexes.forEach((foundIndex) => {
    // change the textContent of the "letter space" to the letter in our currentWord
    wordContainer.children[foundIndex].children[0].textContent =
      currentWord[foundIndex];
    lettersToGo -= 1;
  });
  if (lettersToGo === 0) endGame('won');
}

/**
 * TODO | display the next part of the hangman (consider the variable hangmanPart)
 */

function insertHangman() {
  // prepare the new DOM node as template literal and insert the current hangmanPart
  const html = `
  <div class="hangman__el hangman--${hangmanPart}"></div>
  `;

  // insert the prepared markup into the hangmanContainer
  hangmanContainer.insertAdjacentHTML('beforeend', html);

  points--;
  // (later) send Event
  document.dispatchEvent(decrementPointsGlobal);

  hangmanPart++;
  if (hangmanPart > 10) endGame('lost');
}

/**
 * TODO | Display Win / Loose Status
 */

function endGame(status) {
  playing = false;
  // get the right <template> from the document depending on the status param
  const template = document.getElementById(`game--${status}`);
  // clone the template
  const clone = template.content.cloneNode(true);
  // append the clone to the hangmanContainer
  hangmanContainer.append(clone);

  if (status === 'won') {
    hangmanContainer.querySelector('.points__num--won').textContent = points;
  }
}

/**
 * * Getting values from forms
 *  TODO | get new word from form
 */

newWordForm.addEventListener('submit', (e) => {
  // in (almost) every form...
  e.preventDefault();

  // get the value from the input element (traversing the tree, querying or accessing the form elements)
  // ? console.log(e.target.elements['new-word'].value);
  // ? console.log(e.target.children[0].children[0].value);
  // ? console.log(e.target.querySelector('input').value);
  const newWord = e.target.elements['new-word'].value;
  //
  words.push(newWord);
  currentWord = newWord;
  start();
});

/**
 * * Simple button handling
 * TODO | get random word from the words array
 */
randomWordBtn.addEventListener('click', () => {
  currentWord = getRandomWord();
  start();
});
/**
 * TODO | Add an event listener on the "light" button, to toggle
 * TODO | the .light css class on the body element
 */
document.getElementById('theme-toggle').addEventListener('click', (e) => {
  document.body.classList.toggle('light');
  e.target.textContent = e.target.textContent === 'Light' ? 'Dark' : 'Light';
});
/**
 * * re/starting the game
 */

function start() {
  // clear wordContainer
  wordContainer.innerHTML = '';
  // remove won/lost and hangmanParts
  hangmanContainer.innerHTML = '';

  // remove .strikeout css class and disabled property from every letter btn
  [...keyboardEL.children].forEach((btn) => {
    btn.classList.remove('strikeout');
    btn.disabled = false;
  });

  // render freshly
  renderCurrentWord();
  resetValues();
}

start();

/**
 * ? optional - declaring and listening for custom Events
 * ? TODO  | declare a new Event "decrementpoints" on top of this file
 * ? TODO | Listen for custom event and decrement points
 */
document.addEventListener('decrementpoints', () => {
  const newPoints = +pointsEl.textContent - 1;
  pointsEl.textContent = newPoints;
});
/**
 * ! THE END - Thank you for your attention
 * * go ahead, play with the code, refactor, restructure...
 *
 *
 * leave that here ⬇️
 */

function resetValues() {
  hangmanPart = 0;
  points = 11;
  lettersToGo = currentWord.replaceAll(' ', '').length;
  playing = true;
  pointsEl.textContent = points;
}
