//generate random sentence.
/*
    TO DO: merge this with existing main script 
*/
'use strict'

let generatedSentence = '';
let sentenceCount = 4;
numWords = 15;
let sentences = [];
let input = 'adzr'; 
input.trim().split('');
console.log(input[0]);

for (let j = 0; j < sentenceCount; j++) { //determines how many sentences to add 
    let sentenceBuidler = [];
    for (let index = 0; index < numWords; index++) { //determines how many words to add per index
        let wordSize = getRandomWordSize();
        let word = '';
        for(let char = 0; char < wordSize; char++) {
            let randLetter = input[Math.floor(Math.random() * input.length)]; //select random word from dataset
            word += randLetter
        }
        sentenceBuidler.push(word);
    }

    let tempSentence = sentenceBuidler.join(" "); //join the previous words into a sentence by space
    sentences.push(tempSentence); //add this completed sentence to the parsed and final sentence variable
}

function getRandomWordSize(min = 2, max = 5) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }
