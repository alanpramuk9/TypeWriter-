//Uppercase keyboard is hidden by default
$('#keyboard-upper-container').hide();
$('#characterHighlight').hide();

let difficulty = "Medium"; //default value otherwise check for selected input
difficulty = $('.difficulty:checked').val();
var tempArray = [];
var textfile;

function sentenceChange() {
    return sentenceCount = $(".sentenceInput option:selected" ).text();
}

//upon pressing the enter key
$(document).keyup(function(e) {
    if (e.which == 13) {
        difficulty = $('.difficulty:checked').val();
        $('#characterHighlight').show();
        //retrieve the correct text file to parse based on difficulty selection
        if (difficulty === "Hard") {
            textfile = "words/longwords.txt" 
        } else if (difficulty === "Easy") {
            textfile = "words/shortwords.txt"
        } else if (difficulty === "Medium") {
            textfile = "words/mediumwords.txt"
        }

//asynchronous request to retrieve text file using promises
fetch(textfile)
  .then(response => response.text())
  .then(text => {
    var sentenceCount = $(".sentenceInput option:selected" ).text();
    var sentences = [];
    let numWords;
    //least words per sentence for 'easy' and most for 'hard' 
    if (difficulty == "Easy") {
        numWords = 12;
    } else if (difficulty == "Medium") {
        numWords = 9;
    }else if (difficulty == "Hard") {
        numWords = 6;
    }

    //splits .txt file of words by space into an indexed array
    let textArray = text.split(" ");

    //determines how many words to add to tempArray
    for(let j = 0; j < sentenceCount; j++) {
      for(let index=0; index < numWords; index++ ){
        var randWord2 = (textArray[Math.floor(Math.random() * textArray.length)] );
        randWord2.toString();
        var randWord = `${randWord2}`;
        tempArray.push(randWord);
       }
    }
    // an ineffecient way of slicing up the tempArray to a 2d array determined by number of sentences and number of words
    if (sentenceCount == 2) {
        let d = tempArray.slice(0,numWords);
        let dd = d.join(" ");
        sentences.push(dd);
        let f = tempArray.slice(numWords,numWords*2);
        let ff = f.join(" ");
        sentences.push(ff);
    }else if (sentenceCount == 4){
        let d = tempArray.slice(0,numWords);
        let dd = d.join(" ");
        sentences.push(dd);
        let f = tempArray.slice(numWords,numWords*2);
        let ff = f.join(" ");
        sentences.push(ff);
        let r = tempArray.slice(numWords*2,numWords*3);
        let rr = r.join(" ");
        sentences.push(rr);
        let t = tempArray.slice(numWords*3,numWords*4);
        let tt = t.join(" ");
        sentences.push(tt);
        console.log(sentences);
    }else if (sentenceCount == 6){
        let d = tempArray.slice(0,numWords);
        let dd = d.join(" ");
        sentences.push(dd);
        let f = tempArray.slice(numWords,numWords*2);
        let ff = f.join(" ");
        sentences.push(ff);
        let r = tempArray.slice(numWords*2,numWords*3);
        let rr = r.join(" ");
        sentences.push(rr);
        let t = tempArray.slice(numWords*3,numWords*4);
        let tt = t.join(" ");
        sentences.push(tt);
        let y = tempArray.slice(numWords*4,numWords*5);
        let yy = y.join(" ");
        sentences.push(yy);
        let z = tempArray.slice(numWords*5,numWords*6);
        let zz = z.join(" ");
        sentences.push(zz);
    }

    //game variables to keep track of
    let firstSentence = sentences[0];
    let sentenceNumber = 0;
    let characterCount = 0;
    let wordCount = 0
    let letterNumber = 0;
    let mistakeCount = 0;
    let wordsPerMinute = 0;
    let accuracy = 0.00;
    let complete = false;
    let formattedDate = '';
    let minutes = 0;
    let seconds = 0;
    let interval = 0;
    let playing = false;

    
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

// Hightlights the key you press (create a CSS class in styles.css for 'highlights')
$(document).keypress(function (e) {
    $(`#${e.which}`).addClass('highlights')
    $(document).keyup(function (e) {
        $('.highlights').removeClass('highlights')
    })
});

$("#timer").html(minutes + 'm ' + seconds + 's');
$('#sentence').append(`<div >${sentences[sentenceNumber]}</div>`);
    // // Shows the letter you need to type in the div with the #targetLetter id.
    // $('#targetLetter').append(String.fromCharCode(sentences[sentenceNumber].charCodeAt(letterNumber)));

/**************************************************************************
  This is the main event function. Once a key is pressed, the time begins
**************************************************************************/
$(document).keypress(function (e) {
    if (playing === false) {
        playing = true;
        timerBegin(playing);
    }

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
        accuracy = (1 - (mistakeCount / (mistakeCount + characterCount))) * 100;
        //console.log('accuracy' + accuracy)
        let roundedAccuracy = accuracy.toFixed(1);
        if (roundedAccuracy == Infinity || roundedAccuracy == 0) {
            roundedAccuracy = 100;
        }
        $('#accuracy').html(roundedAccuracy);
        $('#targetLetter').text(String.fromCharCode(sentences[sentenceNumber].charCodeAt(letterNumber)));
    } 
    // if it's the wrong key, a X mark is shown, and a mistake is saved in mistakeCount
    else {
        $('#characterHighlight').addClass('red-block');
        mistakeCount++;
        $('#mistakes').html(mistakeCount);
        $('#feedback').html('<span class="glyphicon glyphicon-remove"></span>');
        accuracy = (1 - (mistakeCount / (mistakeCount + characterCount))) * 100;
        let roundedAccuracy = accuracy.toFixed(1);
        if (roundedAccuracy == Infinity || roundedAccuracy == 0) {
            roundedAccuracy = 100;
        }
        $('#accuracy').html(roundedAccuracy);
    }
    // Set up the next line of text to appear, and get the yellow highlighted area to follow
    if (letterNumber == sentences[sentenceNumber].length) {
        sentenceNumber++;
        letterNumber = 0;
        $('#feedback').empty();
        $('#sentence').append(`<div>${sentences[sentenceNumber]}</div>`);
        $('#characterHighlight').css({
            'left': '14px',
            'top': '+=30px'
        })
    }
    //logic for when there are no more sentences to display and game ends
    if (sentenceNumber == sentences.length) {
        complete = true;
        function timerStop() {
            clearInterval(interval);
        }
        //Calculate the Words per minute- one formula is every 5 characters = 1 word
        let numerator= characterCount/5;
        if (minutes < 0){
            let nominalizedSeconds = seconds/60;
            wordsPerMinute= Math.round(numerator/ nominalizedSeconds);
        } else {
            let totalSeconds = (minutes * 60) + seconds;
            let nominalizedMinutes = totalSeconds/60;
            wordsPerMinute= Math.round(numerator/ nominalizedMinutes);
        }

        //appends the words per minute calculation. stops timer
        $('#wpmScoreModal').append(`${wordsPerMinute}`);
        $('#wpm').html(wordsPerMinute).addClass('wpmHighlight');
        timerStop();
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
$('#submitIt').on("click", function() {
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
            //add confirmation text that submission was sent
            }).done((result) => {
                let content = "<div style='text-align:center; margin:10px 0px 0px 0px; color: #d4edda'>Your submission was sent!</div>"
                $('.modal-header').after(content).css({'background-color': '#d4edda', 'color': 'white', 'text-align':'center'})
                console.log(result);
            }).fail((err) => {
                console.log(err);
            });
        //alert the user to complete typing game before submission
        }else {
            let content = "<div style='text-align:center; margin:10px 0px 0px 0px; color: #BA0C2F'>You must complete a game first!</div>"
            $('.modal-header').after(content).css({'background-color': '#d9534f', 'color': 'white', 'text-align':'center'})
        }
})

  }).catch(function(error) {
    console.log(error);
  });

}
})

//gets all the scores from the database and appends them to leaderboard id
// fetch('http://localhost:5500/api/scores')
// let port = process.env.PORT || 3306;
fetch(`https://just-my-type-game.herokuapp.com/api/scores`)
  .then(function(response) {
        return response.json();
  }).then(function(myJson) {
    let formattedDate; 
    for (let i =1; i < myJson.length; i++){
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
        `
        )
    }
  });

//game not yet formatted for smaller devices
//alert warning user if screen width less than 1000px
function checkWidth() {
    var windowSize = $(window).width();
    if (windowSize < 1000) {
      alert("Please use full screen or zoom out to play the game! Game only works on screens wider the 950 pixels. Please zoom out if needed. Updates coming!");
    }
  }
  // Execute on load
  checkWidth();

  
