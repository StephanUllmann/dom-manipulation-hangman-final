const words = [
  'DOM',
  'React',
  'VanillaJS',
  'garbage collector',
  'NoSQL',
  'Toro',
  'Thirunavukkarasu',
  'ephemeral',
  'jazz',
  'event loop',
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
