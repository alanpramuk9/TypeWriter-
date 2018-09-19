

//Uppercase keyboard is hidden by default
$('#keyboard-upper-container').hide();
$('#characterHighlight').hide();
let numWords = 8;
//retrieve number of sentences from input box


// let difficulty = document.querySelector('input[name="difficulty"]:checked').value
let difficulty = "Medium";
difficulty = $('.difficulty:checked').val();


var str = "";
let sent = "";
var tempArray = [];
var tempSent = [];
let newNew = [];
let newSentence = [];
var sentences = [];
function sentenceChange() {
    return sentenceCount = $(".sentenceInput option:selected" ).text();
}
var textfile;

$(document).keyup(function(e) {
    if (e.which == 13) {
        difficulty = $('.difficulty:checked').val();
        $('#characterHighlight').show();
        
        if (difficulty === "Hard") {
            textfile = "words/longwords.txt" 
        } else if (difficulty === "Easy") {
            textfile = "words/shortwords.txt"
        } else if (difficulty === "Medium") {
            textfile = "words/mediumwords.txt"
        }

fetch(textfile)
  .then(response => response.text())
  .then(text => {
    var sentenceCount = $(".sentenceInput option:selected" ).text();
    console.log()
    var sentences = [];
    let numWords;
    if (difficulty == "Easy") {
        numWords = 12;
    } else if (difficulty == "Medium") {
        numWords = 9;
    }else if (difficulty == "Hard") {
        numWords = 6;
    }

    let textArray = text.split(" ");
    // let textArray2 = text.split("\n");
    
    //let textArray = textArray2.split(" ");
    for(let j = 0; j < sentenceCount; j++) {

      for(let index=0; index < numWords; index++ ){
        var randWord2 = (textArray[Math.floor(Math.random() * textArray.length)] );
        randWord2.toString();
        var randWord = `${randWord2}`;
        tempArray.push(randWord);
        //console.log(tempArray);
        
        //console.log(tempSent);
        //tempSent = tempSent.concat(randWord2);
        //newSentence[0].push(randWord);
    
            //newSentence.push(tempSent);
           // tempSent = tempArray.join(" ");
            //console.log(tempSent)
            //console.log(tempSent);
            // tempSent.toString();
            // console.log(tempSent);
             //return newNew.push(tempSent);
       }
    }
    
    if (sentenceCount == 2) {
        let d = tempArray.slice(0,numWords);
        let dd = d.join(" ");
        sentences.push(dd);
        let f = tempArray.slice(numWords,numWords*2);
        let ff = f.join(" ");
        sentences.push(ff);
        //console.log(sentences);
    }else if (sentenceCount == 4){
        console.log('asfasdfasdfasdf', sentenceCount)
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

    let firstSentence = sentences[0];
//let firstLetter = firstSentence[0];
let sentenceNumber = 0;
let characterCount = 0;
let wordCount = 0
let letterNumber = 0;
let mistakeCount = 0;
let wordsPerMinute = 0;
let accuracy = 0.00;

    // console.log(e.which);
// Holding  T displays uppercase keyboard, otherwise lowercase keyboard is shown
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

// Initial typing game variables that we will track
let complete = false;
let formattedDate = '';
let minutes = 0;
let seconds = 0;
let interval = 0;
let playing = false;

// let sentences = ['ten ate neite ate nee enet ite ate inet ent eate',
//  'Too ato too nOt enot one totA not anot tOO aNot',
//  'oat itain oat tain nate eate tea anne inant nean', 
//  'itant eate anot eat nato inate eat anot tain eat']
// 'nee ene ate ite tent tiet ent ine ene ete ene ate'];
//console.log(sentences);




$("#timer").html(minutes + 'm ' + seconds + 's');
$('#sentence').append(`<div >${sentences[sentenceNumber]}</div>`);

    // // Shows the letter you need to type in the div with the #targetLetter id.
    // $('#targetLetter').append(String.fromCharCode(sentences[sentenceNumber].charCodeAt(letterNumber)));

//This is the main event function. Once a key is pressed, the time begins
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
        // wordsPerMinute = Math.round(wordCount / ((seconds / 60) - 2 * mistakeCount));
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
        
        //this function will ask the user if they want to play again
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

// let port = process.env.PORT || 3306;
//gets all the scores from the database and appends them to leaderboard id
// fetch('http://localhost:5500/api/scores')
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

//   
function checkWidth() {
    var windowSize = $(window).width();

    if (windowSize < 1000) {
      alert("Please use full screen or zoom out to play the game! Game only works on screens wider the 950 pixels. Please zoom out if needed. Updates coming!");
    
    }
  }
  // Execute on load
  checkWidth();


  //gets all the words from the database and appends them to sentenceContainer id
// fetch('http://localhost:5500/api/words')
// .then(function(response) {
//       return response.json();
// }).then(function(myJson) { 
//   for (let i =1; i < myJson.length; i++){
//       //retrieves sentece id and appends data
      
//       $('#sentenceContainer').append(`
//       <div id="leaderboardContainer" style="display: flex; justify-content: space-around; margin: 10px 0px;">
//           <div> <span id="rank"> ${i}.</span></div>
//           <p class="rankInfo">${myJson[i].word}</p>
         
//       </div>
//       `
//       )
  
