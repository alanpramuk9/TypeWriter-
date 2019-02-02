'use strict'

//game variables to keep track of
let difficulty = $('.difficulty:checked').val(); //grabs the difficulty level
let sentenceCount = $(".sentenceInput option:selected").text(); 
let sentences = []; //stores the final array of words to type against
let textfile, numWords;
let sentenceNumber = 0;
let characterCount = 0;
let wordCount = 0
let letterNumber = 0;
let mistakeCount = 0;
let wordsPerMinute = 0;
let accuracy = 0.00;
let formattedDate = '';
let minutes = 0;
let seconds = 0;
let interval = 0;
let playing = false;

$('#keyboard-upper-container').hide(); //Uppercase keyboard is hidden by default
$('#characterHighlight').hide(); //Hide character highlight until game starts

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

$(document).ready(function(){
//upon pressing the enter key select the correct txt file and assign # words per sentence
$(document).keyup(function (e) {
    if (e.which == 13) {
        difficulty = $('.difficulty:checked').val();
        sentenceCount = $(".sentenceInput option:selected").text(); 
        $('#characterHighlight').show(); //highlight target letter

        //retrieve the correct text file to parse based on difficulty selection.
        if (difficulty === "Hard") {
            textfile = "words/Hardwords.txt"
            numWords = 6;
        } else if (difficulty === "Easy") {
            textfile = "words/Easywords.txt"
            numWords = 12;
        } else if (difficulty === "Medium") {
            textfile = "words/Mediumwords.txt"
            numWords = 9;
        }

        //asynchronous request to retrieve text file containing dataset of words using promises
        fetch(textfile)
            .then(response => response.text())
            .then(text => {
                let textArray = text.split(" "); //splits .txt file of words by space into an indexed array

                //determines how many words to add to senteces array
                for (let j = 0; j < sentenceCount; j++) {
                    let sentenceBuidler = [];
                    for (let index = 0; index < numWords; index++) {
                        let randWord = textArray[Math.floor(Math.random() * textArray.length)];
                        randWord.toString();
                        sentenceBuidler.push(randWord);
                    }
                    let tempSentence = sentenceBuidler.join(" "); //join the previous words into a sentence by space
                    //add this completed sentence to the parsed and final sentence variable
                    sentences.push(tempSentence);
                }
                


                $("#timer").html(minutes + 'm ' + seconds + 's');
                $('#sentence').append(`<div >${sentences[sentenceNumber]}</div>`);
                
                /**************************************************************************
                  This is the main event function. Once a key is pressed, the time begins
                **************************************************************************/
                $(document).keypress(function (e) {
                    if (playing === false) {
                        playing = true;
                        timerBegin(playing);
                    }

                    // Hightlights the key you press on keyboard 
                    $(`#${e.which}`).addClass('highlights')
                    $(document).keyup(function (e) {
                        $('.highlights').removeClass('highlights')
                    })

                    // Logic behind correct and incorrect keystrokes
                    // If correct keystroke, the yellow block highlightes the next letter, the letter displayed in #targetLetter div goes to the next one in line, and a green check mark is displayed
                    if (e.which === sentences[sentenceNumber].charCodeAt(letterNumber)) {
                        $('#characterHighlight').css('left', '+=13.7px');
                        $('#feedback').html('<span class="glyphicon glyphicon-ok"></span>');
                        $('#characterHighlight').removeClass('red-block');
                        letterNumber++;
                        characterCount++;
                        //if spacebar is pressed, increment word count. Decrement character count
                        if (e.which == 32) {
                            wordCount++;
                            characterCount--;
                            $('#wordCount').html(wordCount);
                        }
                        //calculate accuracy % and format it to percentage, then append it
                        $('#characters').html(characterCount);
                        calculateAccuracy();
                        $('#accuracy').html(accuracy);
                        $('#targetLetter').text(String.fromCharCode(sentences[sentenceNumber].charCodeAt(letterNumber))); 
                    }
                    // if it's the wrong key, a X mark is shown, and a mistake is saved in mistakeCount
                    else {
                        $('#characterHighlight').addClass('red-block'); //highlight turns red
                        mistakeCount++;
                        $('#mistakes').html(mistakeCount);
                        $('#feedback').html('<span class="glyphicon glyphicon-remove"></span>');
                        calculateAccuracy();
                        $('#accuracy').html(accuracy);
                    }
        
                    //if on last letter of last sentence then end the game and calc WPM
                    if (letterNumber === sentences[sentenceNumber].length && sentenceNumber === sentenceCount -1) {
                        $('#characterHighlight').hide(); //Hide character highlight until game starts
                        // playing = false;
                        function timerStop() {
                            clearInterval(interval);
                        }
                        //Calculate the Words per minute- formula is every 5 characters = 1 word
                        calculateWPM();
                        $('#wpmScoreModal').append(`${wordsPerMinute}`);
                        $('#wpm').html(wordsPerMinute).addClass('wpmHighlight');
                        timerStop();
                        $('#mistakes').addClass('bolder');
                        $('.submitBtn').removeClass('btn-sm').addClass('btn-lg')
                        $('#feedback').html('<span class="glyphicon glyphicon-off finishedLogo"></span>');

                    }
                    // Set up the next line of text to appear, and get the yellow highlighted area to follow
                    else if (letterNumber === sentences[sentenceNumber].length) {
                        sentenceNumber++;
                        letterNumber = 0;
                        $('#feedback').empty();
                        $('#sentence').append(`<div>${sentences[sentenceNumber]}</div>`);
                        $('#characterHighlight').css({
                            'left': '14px',
                            'top': '+=30px'
                        })
                    }
                });

                //reloads page if play again button is clicked
                $("#reset").click(function () {
                    location.reload();
                });
                //this is the timer function that will start then the first character of the first sentence is pressed 
                //complements to Jiovani Rosario for simple timing function
                function timerBegin() {
                    function timer() {
                        if (playing) {
                            if (seconds === 59) {
                                if (minutes < 59) {
                                    minutes = minutes + 1;
                                    seconds = 0;
                                }
                            } else {
                                seconds++;
                            }
                        }
                        // Output the result in an element with id="demo"
                        $("#timer").html(minutes + "m " + seconds + "s ");
                    }
                    //set interval to one second
                    interval = setInterval(timer, 1000);
                }

                //Submits data to database
                //remember to change url to localhost:8080 if in development environment
                $('#submitIt').on("click", function () {
                    let name = document.getElementById('name').value;
                    wpm = wordsPerMinute;
                    //data sent to database
                    let data = {
                        name: name,
                        wpm: wpm
                    }
                    //if wpm is greater than 0, then submit the score
                    if (wpm > 0) {
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
                            $('.modal-header').after(content).css({
                                'background-color': '#d4edda',
                                'color': 'white',
                                'text-align': 'center'
                            })
                            console.log(result);
                        }).fail((err) => {
                            console.log(err);
                        });
                    //alert the user to complete typing game before submission
                    } else {
                        let content = "<div style='text-align:center; margin:10px 0px 0px 0px; color: #BA0C2F'>You must complete a game first!</div>"
                        $('.modal-header').after(content).css({
                            'background-color': '#d9534f',
                            'color': 'white',
                            'text-align': 'center'
                        })
                    }
                })

            }).catch(function (error) {
                console.log(error);
            });

    }
})

//gets all the scores from the database and appends them to leaderboard id
// fetch('http://localhost:5500/api/scores')
let port = process.env.PORT || 5500;
fetch(`https://just-my-type-game.herokuapp.com/api/scores`)
    .then(function (response) {
        return response.json();
    }).then(function (myJson) {
        let formattedDate;
        for (let i = 1; i < myJson.length; i++) {
            //formats the mysql timestamp with moment library 
            formattedDate = moment(`${myJson[i].created_at}`).utc().format('YYYY-MM-DD');
            //retrieves leaderboard id and appends data
            let leaderboard = document.getElementById('leaderboard');
            $('#leaderboard').append(`
        <div id="leaderboardContainer" style="display: flex; justify-content: space-around; margin: 10px 0px;">
            <div> <span id="rank"> ${i}.</span></div>
            <p class="rankInfo">${myJson[i].name}</p>
            <p class="rankInfo">${myJson[i].wpm}</p>
            <p class="rankInfo">${formattedDate}</p>
        </div>
        `)
        }
    });

//game not yet formatted for smaller devices
//alert warning user if screen width less than 1000px
function checkWidth() {
    var windowSize = $(window).width();
    if (windowSize < 1000) {
        alert("Please use full screen or zoom out to play the game! Game only works on screens wider the 950 pixels.");
    }
}

const calculateAccuracy = () => {
    let roundedAccuracy = (1 - (mistakeCount / (mistakeCount + characterCount))) * 100;
    accuracy = roundedAccuracy.toFixed(1); //round to 1 decimal place
    if (accuracy == Infinity || accuracy == 0) {
        accuracy = 100;
    }
    return accuracy;
}

//Calculate the Words per minute
//one formula is every 5 characters = 1 word then divide by time 
const calculateWPM = () => {
    let numerator = characterCount / 5;
    if (minutes < 0) {
        let nominalizedSeconds = seconds / 60;
        wordsPerMinute = Math.round(numerator / nominalizedSeconds);
    } else {
        let totalSeconds = (minutes * 60) + seconds;
        let nominalizedMinutes = totalSeconds / 60;
        wordsPerMinute = Math.round(numerator / nominalizedMinutes);
    }
}


// Execute on load
checkWidth();

});//end of document.ready
