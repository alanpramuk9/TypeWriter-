let mysql = require('mysql');
let connection = mysql.createConnection(
    {
        host: 'us-cdbr-iron-east-01.cleardb.net',
        database: 'heroku_24442f68f9ac8b0',
        user: 'bae1ffc289571e',
        password: 'e9e18526'
    }
);



//get all the scores 
let getScores = () => {
    console.log('GET: about to make promise wi  th database');
    //connection.connect();
    return new Promise((resolve, reject) => {
        connection.query(`select * from leaderboard order by wpm desc`, (err, results, fields) => {
            if (err) {
                //connection.end();
                console.log('Cannot get scores');
                console.log(err);
                reject(err);
            };
            // let result = results.map((item) => {
            //     return({
            //         person: item.person,
            //         wpm: item.wpm
            //     })
            // });
            console.log('about to actually make the result');
            console.log(results);
            resolve(results);
            //connection.end();
        });
    });
};

// //get all the words 
// let getWords = () => {
//     console.log('GET: about to make promise with database   ');
//     //connection.connect();
//     return new Promise((resolve, reject) => {
//         connection.query(`select * from words`, (err, results, fields) => {
//             if (err) {
//                 console.log('Cannot get words');
//                 console.log(err);
//                 reject(err);
//             };
//             console.log('about to actually make the result');
//             console.log(results);
//             resolve(results);
//             //connection.end();
//         });
//     });
// };

let getScore= (id) => {
    //connection.connect();
    return new Promise((resolve, reject) => {
        connection.query(`select * from leaderboard where id = ${id}`, (err, results, fields) => {
            if (err) {
                //connection.end();
                console.log(err);
                console.log('Cannot get individual score');
                reject(err);
            };
            console.log('successful promise almost')
            resolve(results);
        });
    })
};

let createScore = (name, wpm) => {
    console.log('about to create a score');
    console.log(name);
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO leaderboard (name, wpm) VALUES ("${name}", ${wpm})`, (err, results, fields) => {
            if (err) {
                //connection.end();
                console.log('Cannot create a score');
                console.log(err);
                reject(err);
            };
            //getTheMentions(text, userid)
            console.log('this is what got put in database');
            console.log(results);
            resolve(results);
            //console.log(results);
            //connection.end();
        })
    })
};

//connection.connect();
// GetWords: getWords,

module.exports = {
    GetScores: getScores,
    CreateScore: createScore,
    GetScore: getScore
}
