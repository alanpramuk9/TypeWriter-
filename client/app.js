

//game variables to keep track of
let difficulty = $('.difficulty:checked').val(); //grabs the difficulty level
let sentenceCount = $(".sentenceInput option:selected").text(); 
let sentences = []; //final array of words to type against
let textfile, numWords;
let sentenceNumber = 0;
let characterCount = 0;
let wordCount = 0
let letterNumber = 0;
let mistakeCount = 0;
let accuracy = 0.00;
let wordsPerMinute = 0;
let formattedDate = '';
let minutes = 0;
let seconds = 0;
let interval = 0;
let active = false;
let playing = false;

$('#keyboard-upper-container').hide(); //Uppercase keyboard is hidden by default
$('#characterHighlight').hide(); //Hide character highlight until game starts

$(document).ready(function(){
checkWidth();
//upon pressing the enter key select the correct txt file and assign # words per sentence
$(document).keyup(function (e) {
    if (e.which == 13 && active == false) {
        difficulty = $('.difficulty:checked').val();
        sentenceCount = $(".sentenceInput option:selected").text(); 
        $('#characterHighlight').show(); //highlight target letter

        //Longer words require less words to fit to screen width
        if (difficulty === "Easy") {
            textfile = "words/Easywords.txt"
            numWords = 12;
        } else if (difficulty === "Medium") {
            textfile = "words/Mediumwords.txt"
            numWords = 9;
        }
        else {
            textfile = "words/Hardwords.txt"
            numWords = 6;
        }
        //asynchronous request to retrieve text file containing dataset of words
        fetch(textfile)
            .then(response => response.text())
            .then(text => {
                let textArray = text.split(" "); //splits .txt file of words by space into an indexed array
                for (let j = 0; j < sentenceCount; j++) { //determines how many words to add to senteces array
                    let sentenceBuidler = [];
                    for (let index = 0; index < numWords; index++) {
                        let randWord = textArray[Math.floor(Math.random() * textArray.length)]; //select random word from dataset
                        randWord.toString();
                        sentenceBuidler.push(randWord);
                    }
                    let tempSentence = sentenceBuidler.join(" "); //join the previous words into a sentence by space
                    sentences.push(tempSentence); //add this completed sentence to the parsed and final sentence variable
                }
                $("#timer").html(minutes + 'm ' + seconds + 's');
                $('#sentence').append(`<div >${sentences[sentenceNumber]}</div>`);
                
                //Once a key is pressed, the time begins
                $(document).keypress(function (e) {
                    if (playing === false) {
                        playing = true;
                        timerBegin(playing);
                    }
                    //$(`#${e.which}`).addClass('highlights'); // Hightlights the key you press on keyboard 
                   
                    // If correct keystroke, the yellow block highlightes the next letter, the letter displayed in #targetLetter 
                    // div goes to the next one in line, and a green check mark is displayed
                    if (e.which === sentences[sentenceNumber].charCodeAt(letterNumber)) {
                        $('#characterHighlight').css('left', '+=13.7px');
                        $('#feedback').html('<span class="glyphicon glyphicon-ok"></span>');
                        $('#characterHighlight').removeClass('red-block');
                        letterNumber++;
                        characterCount++;
                        if (e.which == 32) { //if spacebar is pressed, increment word count. Decrement character count
                            wordCount++;
                            characterCount--;
                            $('#wordCount').html(wordCount);
                        }
                        $('#characters').html(characterCount);
                        calculateAccuracy();
                        $('#accuracy').html(accuracy);
                        $('#targetLetter').text(String.fromCharCode(sentences[sentenceNumber].charCodeAt(letterNumber))); //change target letter for highlight
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
                        //Calculate the Words per minute. Formula is every 5 characters = 1 word then divide by time  
                        calculateWPM()
                        // $('#wpmScoreModal').html(`${wordsPerMinute}`);
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
                        $('#characterHighlight').css({'left': '14px', 'top': '+=30px' })
                    }
                });
        })
    }})

//reloads page if play again button is clicked
$("#reset").click(function () {
    location.reload();
});

//Submits data to database (change url to localhost:8080 if in development environment)
$('#submitIt').on("click", function () {
    let name = $('#name').val(); //document.getElementById('name').value;
    let data = {
        name: name,
        wpm: wordsPerMinute
    }
    //if wpm is greater than 0, then submit the score
    if (wordsPerMinute > 0) {
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
//gets all the scores from the database and appends them to leaderboard id                                                                                                //in dev env: fetch('http://localhost:5500/api/scores') port = process.env.PORT || 5500;
fetch(`https://just-my-type-game.herokuapp.com/api/scores`)
    .then(function (response) {
        return response.json();
    }).then(function (myJson) {
        let formattedDate;
        for (let i = 1; i < myJson.length; i++) { 
            formattedDate = moment(`${myJson[i].created_at}`).utc().format('YYYY-MM-DD'); //formats the mysql timestamp with moment library
            //appends data to leaderbaord
            $('#leaderboard').append(`
                <div id="leaderboardContainer" style="display: flex; justify-content: space-around; margin: 10px 0px;">
                    <div> <span id="rank"> ${i}.</span></div>
                    <p class="rankInfo">${myJson[i].name}</p>
                    <p class="rankInfo">${myJson[i].wpm}</p>
                    <p class="rankInfo">${formattedDate}</p>
                </div> `
            )
        }
    });

//game is only formatted for laptops. Alert warning if screen width less than 1000px
function checkWidth() {
    const windowSize = $(window).width();
    if (windowSize < 1000) 
        alert("Please use full screen or zoom out to play the game! Game only works on screens wider the 950 pixels.");
}

function calculateWPM() {
    const numerator = characterCount / 5;
    if (minutes < 0) {
        const nominalizedSeconds = seconds / 60;
        wordsPerMinute = Math.round(numerator / nominalizedSeconds);
    } else {
        const totalSeconds = (minutes * 60) + seconds;
        const nominalizedMinutes = totalSeconds / 60;
        wordsPerMinute = Math.round(numerator / nominalizedMinutes);
    }
}

//calculate accuracy % and format it to percentage
function calculateAccuracy() {
    let roundedAccuracy = (1 - (mistakeCount / (mistakeCount + characterCount))) * 100;
    accuracy = roundedAccuracy.toFixed(1); //round to 1 decimal place
    if (accuracy == Infinity || accuracy == 0) { accuracy = 100; }
    return accuracy;
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
            }else {
                seconds++;
            }
        }
        $("#timer").html(minutes + "m " + seconds + "s ");
    }
    interval = setInterval(timer, 1000); //set interval to one second
}

function timerStop() {
    clearInterval(interval);
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



});//end of document.ready
