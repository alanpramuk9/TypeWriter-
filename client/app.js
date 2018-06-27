//Uppercase keyboard is hidden by default
$('#keyboard-upper-container').hide();

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
let sentences = ['ten ate neite ate nee enet ite ate inet ent eate', 
'Too ato too nOt enot one totA not anot tOO aNot'];
// 'oat itain oat tain nate eate tea anne inant nean', 
// 'itant eate anot eat nato inate eat anot tain eat', 
// 'nee ene ate ite tent tiet ent ine ene ete ene ate'];
let firstSentence = sentences[0];
let firstLetter = firstSentence[0];
let sentenceNumber = 0;
let characterCount = 0;
let wordCount = 0
let letterNumber = 0;
let mistakeCount = 0;
let wordsPerMinute = 0;
let accuracy = 0.00;

console.log('after' + characterCount)

$("#timer").html(minutes + 'm ' + seconds + 's');
$('#sentence').append(`<p >${sentences[sentenceNumber]}</p>`);

// Shows the letter you need to type in the div with the #targetLetter id.
$('#targetLetter').append(String.fromCharCode(sentences[sentenceNumber].charCodeAt(letterNumber)));

//This is the main event function. Once a key is pressed, the time begins
$(document).keypress(function (e) {
    if (playing === false) {
        playing = true;
        timerBegin(playing);
    }
    // Logic behind correct and incorrect keystrokes
    // If correct keystroke, the yellow block highlightes the next letter, the letter displayed in #targetLetter div goes to the next one in line, and a green check mark is displayed
    if (e.which == sentences[sentenceNumber].charCodeAt(letterNumber)) {
        $('#characterHighlight').css('left', '+=17.3px');
        $('#feedback').html('<span class="glyphicon glyphicon-ok"></span>');
        $('#characterHighlight').removeClass('red-block');
        letterNumber++;
        characterCount++;
        //console.log(characterCount);
        //if spacebar is pressed, increment word count. Decrement character count
        if (e.which == 32) {
            wordCount++;
            characterCount--;
            $('#wordCount').html(wordCount);
        }
        //calculate accuracy %
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
        // if it's the wrong key, a X mark is displayed to show an incorrect attempt, and a mistake is saved in mistakeCount
    else {
        $('#characterHighlight').addClass('red-block');
        mistakeCount++;
        console.log(mistakeCount)
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
            'top': '+=34px'
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
        $('#wpm').html(wordsPerMinute).addClass('wpmHighlight');
        timerStop();
        $("#feedback").html("Keep Practicing So You Can Top The Leaderboards!");
    }
    
});
$("#reset").click(function () {
    // characterCount = 0;
    // minutes, seconds, t, sentenceNumber, characterCount, wordCount, letterNumber, mistakeCount, wordsPerMinute, accuracy = 0;
    // $('#characters').val('characterCount')
    // playing= false;
    // console.log( characterCount)  
    location.reload();

});

//reset score
// let reset = document.getElementById('reset');
// reset.addEventListener('click', resetForm);
// function resetForm() {
//     location.reload();
// }


$('#wpmScoreModal').append(wordsPerMinute);
// submit your score
let form = document.getElementById('submit');
let name = 'alan';
let wpm = 0;
//form.addEventListener('click', submitForm);


    // function submitForm(e) {
        
    //     e.preventDefault();
        
    //     let name = document.getElementById('name').value;
    //     console.log(name);
    //     wpm = wordsPerMinute;
    //     console.log(wpm);

    //     let data = {
    //         name: "alanasdf",
    //         wpm: 100
    //     }
        
    //     //console.log('complete?' + complete);
    //     // if (complete) {
    //         $.ajax({
    //             type: "POST",
    //             url: '/api/scores/',
    //             data: JSON.stringify({
    //                 data
    //             }),
    //             contentType: "application/json"
    //         }).done((result) => {
    //             console.log(result);
    //         }).fail((err) => {
    //             console.log(err);
    //         });
    //     // }else {
    //     //     let content = "<div style='text-align:center; margin:10px 0px 0px 0px; color: #BA0C2F'>You must complete a game first!</div>"
    //     //     $('.modal-header').after(content).css({'background-color': '#d9534f', 'color': 'white', 'text-align':'center'})
            
    //     // }
    //     //asychronous request sent to the backend for processing and eventual saving in database
        
    // } 

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
// form.addEventListener( 'click', function() {
//     // e.preventDefault();
//     console.log('Listener Works')
//     // let wpm = document.getElementsByTagName('input')[0].value;
//     let name= 'Jose';
//     let wpm = 10 ;

//     let data = {
//         name: name,
//         wpm: wpm
//     }

//     console.log(data);

//     fetch('/api/scores', {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: new Headers({
//             'content-type': 'application/json'
//           })
//     }).then(res => {return res})
//     .catch(error => console.log(error));
// })


// get requests for leaderboard section
// $.ajax({
//     type: "GET",
//     url: '/api/scores',
//     headers: new Headers({
//         'content-type': 'application/json'
//     })
// }).done((result) => {
//     console.log('get request completed succesfully! ');
//     console.log(result);
// }).fail((err) => {
//     console.log(err);
// });


fetch('/api/scores')
  .then(function(response) {
      console.log('front-end request');
      console.log(response);
        return response.json();
  }).then(function(myJson) {
    //console.log(myJson[0].id);
    formattedDate; 
    console.log('myJson value')
    console.log(myJson);
    for (let i =1; i < myJson.length; i++){
        // formattedDate = moment($(time).utc().format("dddd, MMMM Do, h:mm A");
        //formattedDate = moment($(myJson[i].created_at).utc().format('YYYY-MM-DD'));
       
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