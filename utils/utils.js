const words = [
  'garbage collector',
  'querySelector',
  'addEventListener',
  'insertAdjacentHTML',
  'HTMLCollection',
  'NodeList',
  'capture phase',
  'bubbling phase',
  'event loop',
  'DOM manipulation',
];

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function getLetterIndexes(letter, currentWord) {
  const out = [];
  letter = letter.toLowerCase();
  currentWord = currentWord.toLowerCase();
  for (let i = 0; i < currentWord.length; i++) {
    if (currentWord[i] === letter) out.push(i);
  }
  return out;
}

export { words, getLetterIndexes, getRandomWord };
