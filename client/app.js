//game variables to keep track of
const sentences = []; //final array of words to type against
let textfile, numWords;
let sentenceNumber = 0;
let characterCount = 0;
let wordCount = 0
let letterNumber = 0;
let mistakeCount = 0;
let accuracy = 0.00;
let wordsPerMinute = 0;
let formattedDate = '';
let timeSelected = ""
let minutes = 0;
let seconds = 0;
let interval = 0;
let timeCheck = null;
let active = false;
let playing = false;
let wpmInterval = 0;
let accuracyString = "";
let targetLetter = '';
let complete = false;
let difficulty = $('.difficulty:checked').val(); //grabs the difficulty level
let sentenceCount = $("#numSentences option:selected").text(); 
let letterInput = $("#lettersInput").val();
let timeInput = 30;
let secondsElapsed = 0;

//TO DO: use these stats for reporting ie. data visualization chart upon game ending etc
const correctLetters = {}
const errorLetters = {};
const wpmOverTime = new Map();

//jQUERY cache for commonly used DOM manipulations
const $characterHighlight = $('#characterHighlight');
const $feedback = $('#feedback');
const $wordCount = $('#wordCount');
const $characters = $('#characters');
const $accuracy = $('#accuracy');
const $targetLetter = $('#targetLetter');
const $mistakes = $('#mistakes');
const $wpm = $('#wpm');

$('#keyboard-upper-container').hide(); //Uppercase keyboard is hidden by default
$('#characterHighlight').hide(); //Hide character highlight until game starts
$('#statsContainer').hide();


$(document).ready(function(){
checkWidth();

//upon pressing the enter key select the correct txt file and assign # words per sentence
$(document).keyup(function (e) {
    letterInput = $("#lettersInput").val();
    difficulty = $('.difficulty:checked').val();
    sentenceCount = $("#numSentences option:selected").text();
    if (e.which == 13 && active == false && letterInput =="") { 
        //Longer words require less words to fit to screen width
        if (difficulty === "Easy") {
            textfile = "words/Easywords.txt"
            numWords = 12;
        } else if (difficulty === "Medium") {
            textfile = "words/Mediumwords.txt"
            numWords = 9;
        }else {
            textfile = "words/Hardwords.txt"
            numWords = 6;
        }
        //asynchronous request to retrieve text file containing dataset of words
        fetch(textfile)
            .then(response => response.text())
            .then(text => {
                startAnimations();
                sentenceCreator(text); //creates the sentences 
                senenteceAppender(sentences, sentenceCount); //append sentences to DOM
                mainEvent();
                
            })
    }
    else if (e.which == 13 && active == false && !letterInput == "") {
        letterInput.trim().split('');
        for (let j = 0; j < sentenceCount; j++) { //determines how many sentences to add 
            let sentenceBuidler = [];
            for (let index = 0; index < 15; index++) { //determines how many words to add per index
                let wordSize = getRandomWordSize();
                let word = '';
                for(let char = 0; char < wordSize; char++) {
                    let randLetter = letterInput[Math.floor(Math.random() * letterInput.length)]; //select random word from dataset
                    word += randLetter
                }
                sentenceBuidler.push(word);
            }
        
            let tempSentence = sentenceBuidler.join(" "); //join the previous words into a sentence by space
            sentences.push(tempSentence); //add this completed sentence to the parsed and final sentence variable
        }
        
        startAnimations();
        senenteceAppender(sentences, sentenceCount); //append sentences to DOM
        mainEvent();
    }
})

//game event loop and logic 
function mainEvent() {
    $('#characterHighlight').show(); //highlight target letter
    //Once a key is pressed, the time begins
    $(document).keypress(function (e) {
        if (active === false) {
            active = true;
            if(timeSelected != "") {
                timelimitDelimter(timeSelected)
                countDown(active); 
                timerCheck = setInterval(checkStatus, 50);
            }
            else {timerBegin(active)}
            playing = true;
            calculateWPM(playing);
            $('#reset').attr("style", "visibility: visible");
        }
       
        // If correct keystroke, the yellow block highlightes the next letter, the letter displayed in #targetLetter 
        // div goes to the next one in line, and a green check mark is displayed
        if (e.which === sentences[sentenceNumber].charCodeAt(letterNumber) && playing === true) {
            $characterHighlight.css('left', '+=13.7px');
            $feedback.html('<span class="glyphicon glyphicon-ok"></span>');
            $characterHighlight.removeClass('red-block');
            letterNumber++;
            characterCount++;
            if (e.which == 32) { //if spacebar is pressed, increment word count. Decrement character count
                wordCount++;
                characterCount--;
                $wordCount.html(wordCount);
            }
            targetLetter = sentences[sentenceNumber].charAt(letterNumber);
            correctObject(targetLetter, correctLetters)
            $characters.html(characterCount);
            calculateAccuracy(characterCount, mistakeCount);
            $accuracy.html(accuracyString);
            $targetLetter.text(String.fromCharCode(sentences[sentenceNumber].charCodeAt(letterNumber))); //change target letter for highlight
        }
        // if it's the wrong key, a X mark is shown, and a mistake is saved in mistakeCount
        else if (e.which !== sentences[sentenceNumber].charCodeAt(letterNumber) && playing === true) {
            $characterHighlight.addClass('red-block'); //highlight turns red
            mistakeCount++;
            targetLetter = sentences[sentenceNumber].charAt(letterNumber);
            mistakeObject(targetLetter, errorLetters) //add the missed letter to keep track of errors
            $mistakes.html(mistakeCount);
            $feedback.html('<span class="glyphicon glyphicon-remove"></span>');
            calculateAccuracy(characterCount, mistakeCount);
            $accuracy.html(accuracyString);
        }

        //if on last letter of last sentence then end the game
        if (letterNumber === sentences[sentenceNumber].length && sentenceNumber === sentenceCount -1) {
            complete = true;
            $characterHighlight.hide(); //Hide character highlight until game starts  
            $wpm.html(wordsPerMinute).addClass('wpmHighlight');
            timerStop();
            stopWpmInterval();
            playing = false;
            $mistakes.addClass('bolder');
            $('#submit').removeClass('btn-sm').addClass('btn-lg').attr("style", "visibility: visible"); 
            $feedback.html('<span class="glyphicon glyphicon-off finishedLogo"></span>');
            // $('#timer-beep' ).play()
        }
        // Set up the next line of text to appear, and get the yellow highlighted area to follow
        else if (letterNumber === sentences[sentenceNumber].length) {
            sentenceNumber++;
            letterNumber = 0;
            $feedback.empty();
            $characterHighlight.css({'left': '14px', 'top': '+=30px' })
        }

    });
}

//generates the sentences to be outputed 
function sentenceCreator(text) {
    let textArray = text.split(" "); //split file by space into array
    let textArrayLength = textArray.length
    for (let j = 0; j < sentenceCount; j++) { //determines how many sentences to add 
        let sentenceBuidler = [];
        for (let index = 0; index < numWords; index++) { //determines how many words to add per index
            let randWord = textArray[Math.floor(Math.random() * textArrayLength)]; //select random word from dataset
            randWord.toString();
            sentenceBuidler.push(randWord);
        }
        let tempSentence = sentenceBuidler.join(" "); 
        sentences.push(tempSentence); //add this completed sentence to the parsed and final sentence variable
    }
}

//appends sentences to DOM 
function senenteceAppender(sentences, sentenceCount = 2) {
    for(let i =0; i < sentenceCount; i++) {
        $('#sentence').append(`<div id=${i} class='sentenceContainer'>${sentences[i]}</div>`);
    }
}

function getRandomWordSize(min = 2, max = 5) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }

//Submits data to database (change url to localhost:8080 if in development environment)
$('#submitIt').on("click", function () {
    let name = $('#name').val(); //document.getElementById('name').value;
    let data = {
        name: name,
        wpm: wordsPerMinute
    }
    //if wpm is greater than 0, then submit the score
    if (complete) {
        $.ajax({
            type: "POST",
            url: 'https://just-my-type-game.herokuapp.com/api/scores',
            data: JSON.stringify({
                data
            }),
            contentType: "application/json"
        //add confirmation text that submission was sent in modal popup
        }).done((result) => {
            let content = "<div style='text-align:center; margin:10px 0px 0px 0px; color: #d4edda'>Your submission was sent!</div>"
            $('.modal-header').after(content).css({'background-color': '#d4edda', 'color': 'white', 'text-align': 'center' })
            console.log(result);
        }).fail((err) => {console.log(err); });
        //alert the user to complete typing game before submission
        } else {
            let content = "<div style='text-align:center; margin:10px 0px 0px 0px; color: #BA0C2F'>You must complete a game first!</div>"
            $('.modal-header').after(content).css({'background-color': '#d9534f', 'color': 'white','text-align': 'center'})
        }
    
})

// gets all the scores from the database and appends them to leaderboard id                                                                                                //in dev env: fetch('http://localhost:5500/api/scores') port = process.env.PORT || 5500;
fetch(`https://just-my-type-game.herokuapp.com/api/scores`) //fetch(`http://localhost:8080/api/scores`) during development
    .then(function (response) {
        return response.json();
    }).then(function (myJson) {
        let formattedDate;
        for (let i = 1; i < myJson.length; i++) { 
            formattedDate = moment(`${myJson[i].created_at}`).utc().format('YYYY-MM-DD'); //formats the mysql timestamp with moment library
            //appends data to leaderbaord
            $('#leaderboard').append(`
                <div id="leaderboardContainer" style="display: flex; justify-content: space-between; margin: 8px 3%;">
                    <div id="rank"> <span> ${i}.</span></div>
                    <p class="rankInfo">${myJson[i].name}</p>
                    <p class="rankInfo">${myJson[i].wpm}</p>
                    <p class="rankInfo">${formattedDate}</p>
                </div> `
            )
        }
    });


//calculate accuracy % and format it to percentage
function calculateAccuracy(characterCount, mistakeCount) {
    let roundedAccuracy = (1 - (mistakeCount / (mistakeCount + characterCount))) * 100;
    accuracy = roundedAccuracy.toFixed(1); //round to 1 decimal place
    if (accuracy == Infinity || accuracy == 0) { accuracy = 100; }
    accuracyString = `${accuracy}%`
    return accuracyString;
}

//this is the timer function that will start then the first character of the first sentence is pressed 
function timerBegin() {
    function timer() {
        if (active) {
            if (seconds === 59) {
                if (minutes < 59) {
                    minutes = minutes + 1;
                    seconds = 0;
                }
                secondsElapsed++;
            }else {
                seconds++;
                secondsElapsed++;
            }
        }
        $("#timer").html(minutes + "m " + seconds + "s ");
    }
    
    interval = setInterval(timer, 1000); //set interval to one second
}

function startAnimations() {
    $('#statsContainer').show();
}
function countDown() {
    function timer() {
        if (active) {
            if (seconds === 0 && minutes >= 1) {
                minutes = minutes - 1;
                seconds = 59;
                secondsElapsed++;
            }else {
                seconds--;
                secondsElapsed++;
            }
        }
        $("#timer").html(minutes + "m " + seconds + "s ");
    }
    
    interval = setInterval(timer, 1000); //set interval to one second
}

function checkStatus() {
    if(minutes ==0 && seconds == 0) {
        stopCheckingStatus();
        stopWpmInterval();
        playing = false;
        timerStop();
        complete = true; 
        $characterHighlight.hide(); //Hide character highlight until game starts  
        $wpm.html(wordsPerMinute).addClass('wpmHighlight');
        $mistakes.addClass('bolder');
        $('#submit').removeClass('btn-sm').addClass('btn-lg').attr("style", "visibility: visible"); 
        $feedback.html('<span class="glyphicon glyphicon-off finishedLogo"></span>');
        // $('#timer-beep' ).play();
    
    }
}
function stopCheckingStatus() {
    clearInterval(timerCheck);
}
function timerStop() {
    clearInterval(interval);
}

function timelimitDelimter(timeSelected) {
    if(timeSelected === '30 sec') {  minutes =0; seconds = 30;}
    else if(timeSelected === '1 min') { minutes =1; seconds = 0;}
    else if(timeSelected === '2 min') {  minutes =2; seconds = 0;}
    else if(timeSelected === '3 min') { minutes =3; seconds = 0;}
}


//Calculate the Words per minute. Formula is every 5 characters = 1 word then divide by time
function calculateWPM() {
    function calculate() {
        if (playing) {
            let numerator = characterCount / 5;
            if (minutes <= 0) {
                let nominalizedSeconds = secondsElapsed / 60;
                wordsPerMinute = Math.round(numerator / nominalizedSeconds);
                wpmOverTime.set(secondsElapsed, wordsPerMinute);
            } else {
                let totalSeconds = (minutes * 60) + seconds;
                let nominalizedMinutes = totalSeconds / 60;
                wordsPerMinute = Math.round(numerator / nominalizedMinutes);
                wpmOverTime.set(totalSeconds, wordsPerMinute);
            }
        }
        $('#wpm').html(wordsPerMinute);
    }
    wpmInterval = setInterval(calculate, 3000);
}

function stopWpmInterval() {
    clearInterval(wpmInterval);
}

//if error is not in errors object then add it, else increment it
function mistakeObject(targetLetter, errorLetters) {
   typeof errorLetters[targetLetter] === 'undefined' ? errorLetters[targetLetter] = 1 : errorLetters[targetLetter]++;
}

//if error is not in errors object then add it, else increment it
function correctObject(targetLetter, correctLetters) {
    typeof correctLetters[targetLetter] === 'undefined' ? correctLetters[targetLetter] = 1 : correctLetters[targetLetter]++;
 }

// Holding 'shift' key down displays uppercase keyboard, otherwise lowercase keyboard is shown
$(document).keydown(function (e) {
    if (e.which == 16) {
        $('#keyboard-upper-container').show();
        $('#keyboard-lower-container').hide();
    }
    $(document).keyup(function (e) {
        if (e.which == 16) {
            $('#keyboard-upper-container').hide();
            $('#keyboard-lower-container').show();
        }
    });
});

//reloads page if play again button is clicked
$("#reset").click(function () {
    location.reload();
});

//game is only formatted for laptops. Alert warning if screen width less than 1000px
function checkWidth() {
    const windowSize = $(window).width();
    if (windowSize < 1000) 
        alert("Please use full screen or zoom out to play the game! Game only works on screens wider the 950 pixels.");
}

//allow only one selection of difficulty and ability to uncheck it
$("input:checkbox").on('click', function() {
    let $box = $(this);
    if ($box.is(":checked")) {
      let group = "input:checkbox[name='" + $box.attr("name") + "']";
      $(group).prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
  });

  // Hightlights the key you press on the keyboard
$(document).keypress(function (e) {
    $(`#${e.which}`).addClass('highlights')
    $(document).keyup(function (e) {
        $('.highlights').removeClass('highlights')
    })
});

//grabbing selected value from html datalist for time limit selected & ensure its valid value
$("input[name='timeLimit']").on('input', function(e){
    var $input = $(this);
        timeSelected = $input.val();
        list = $input.attr('list')
        // match = $('#'+list + ' option').filter(function() {
        //     return ($(this).val() === val);
        // });
 
    //  if(match.length <= 0) {
    //     alert('Please select an option from the timer list')
    //  }
 });

 $(function() {
    if($('one').prop('checked') || $('two').prop('checked' || $('three').prop('checked'))) {
      $("#lettersInput").prop('disabled', true);
    }
    // else if(!$("input:checkbox").val())
    //   $("#lettersInput").prop('disabled', false);
    
    else if ($("#lettersInput").val() !== '') {
        $("input:checkbox").prop('disabled', true);
    }
    // else if (!$("#lettersInput").val())
    //     $("input:checkbox").prop('disabled', true);
 });
  
});//end of document.ready
