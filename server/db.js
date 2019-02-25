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
    return new Promise((resolve, reject) => {
        connection.query(`select * from leaderboard order by wpm desc`, (err, results, fields) => {
            if (err) {
                reject(err);
            };
            resolve(results);
            connection.end();
        });
    });
};

//get specific score based on id
let getScore= (id) => {
    return new Promise((resolve, reject) => {
        connection.query(`select * from leaderboard where id = ${id}`, (err, results, fields) => {
            if (err) {
                reject(err);
            };
            resolve(results);
            connection.end();
        });
    })
};

//inserts a score into db
let createScore = (name, wpm) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO leaderboard (name, wpm) VALUES ("${name}", ${wpm})`, (err, results, fields) => {
            if (err) {
                reject(err);
            };
            resolve(results);
            connection.end();
        })
    })
};

module.exports = {
    GetScores: getScores,
    CreateScore: createScore,
    GetScore: getScore
}
