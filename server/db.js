let mysql = require('mysql');
let connection = mysql.createConnection(
    {
        host: '127.0.0.1',
        database: 'leaderboard',
        user: 'root',
        password: 'sesame'
    }
);



//get all the scores 
let getScores = () => {
    console.log('about to make promise with database');
    //connection.connect();
    return new Promise((resolve, reject) => {
        connection.query(`select * from leaderboard`, (err, results, fields) => {
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
let getChirps = () => {
    //connection.connect();
    return new Promise((resolve, reject) => {
        connection.query(`select * from chirps`, (err, results, fields) => {
            if (err) {
                //connection.end();
                console.log('Cannot get chirps');
                console.log(err);
                reject(err);
            };
            let result = results.map((item) => {
                return({
                    text: item.text,
                    id: item.id
                })
            });
            resolve(result);
            //connection.end();
        });
    });
};

let getChirp = (id) => {
    //connection.connect();
    return new Promise((resolve, reject) => {
        connection.query(`select * from chirps where id = ${id}`, (err, results, fields) => {
            if (err) {
                //connection.end();
                console.log(err);
                console.log('Cannot get individual chirp');
                reject(err);
            };
            resolve(results);
        });
    })
};
//DELETE FROM mentions WHERE chirpid = ${id}; DELETE FROM chirps WHERE id = ${id}
//DELETE FROM mentions, chirps  WHERE mentions.chirpid = ${id} and chirps.chirpid= ${id}  
let deleteChirp = (id) => {
    //connection.connect();
    return new Promise((resolve,reject) => {
        connection.query(`DELETE FROM chirps WHERE id = ${id}`, (err, results, fields) => {
            if (err) {
                //connection.end();
                console.log('Cannot get delete individual chirp');
                console.log(err);
                reject(err);
            };
            resolve(results);
            //console.log("Number of records deleted: " + results.affectedRows);
            //console.log(results);
            //connection.end();
        });
    })
};
//deleteChirp(5);
let updateChirp = (id,text) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE chirps SET text = "${text}" WHERE id = ${id}`, (err, results, fields) => {
        if (err) {
            //connection.end();
            console.log('Cannot get update individual chirp');
            console.log(err);
            reject(err);
        }
        console.log('updated successfully');
        resolve(results);
        //console.log(results);
        //connection.end();
        })
    })
};

let createChirp = (text, userid) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO chirps (userid, text, location) VALUES (${userid}, "${text}", "Nashville")`, (err, results, fields) => {
            if (err) {
                //connection.end();
                console.log('Cannot get create individual chirp');
                console.log(err);
                reject(err);
            };
            getTheMentions(text, userid)
            resolve(results);
            //console.log(results);
            //connection.end();
        })
    })
};
//`INSERT INTO mentions (userid, chirpid) VALUES(${userid}, ${chirpid})`
let createMention = (userid, chirpid) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO mentions (userid, chirpid) VALUES(${userid}, ${chirpid})`, (err, results, fields) => {
            if (err) {
                //connection.end();
                console.log('Cannot get create individual mention');
                console.log(err);
                reject(err);
            };
            console.log('successfully doing promise');
            resolve(results);
            
        })
    })
}

let getMentions = (userid) => {
    //connection.connect();
    return new Promise((resolve, reject) => {
        connection.query(`call spUserMentions(${userid})`, (err, results, fields) => {
            if (err) {
                //connection.end();
                console.log(err);
                console.log('Cannot get individual chirp mentions');
                reject(err);
            };
            resolve(results);
        })
    })  
}


let getTheMentions = (text, userid) => {
    return new Promise((resolve, reject) => {
      connection.query(`select * from chirps where userid = ${userid} and text='${text}'`, (err, results, field) => {
        if (err) {
          reject(err);
          //connection.end();
          
        } else {
          console.log('results[0].text = ', results[0].text);
          let array = results[0].text.split(" ");
            console.log(' str = '+ array);
            let index;
            for (let i = 0; i < array.length; i++) {
                let delimeter = array[i].includes('@');    
                if (delimeter === true) {
                index = i;
                };
            };
            console.log(index);
          let chirpid = results[0].id;
          console.log(' chirpid = '+ chirpid);
            
          let userHandle = array[index].slice(1);
          
          console.log('userHandle = ', userHandle)
            updateMentions(userHandle, chirpid)
          
  
          resolve('success');
        };
      });
    });
  };

//   let updateMentions = (userHandle, chirpid) => {
//     return new Promise((resolve, reject) => {
//       connection.query(`SELECT * FROM users WHERE name = '${userHandle}'`, (err, results, field) => {
//         if (err) {
//             console.log('error occurred');
//           reject(err);
          
//         createMention(results[0].id, chirpid)
    
//         resolve('success');
//       });
//     });
//   };
 



module.exports = {
    GetChirps: getChirps,
    GetChirp: getChirp,
    DeleteChirp: deleteChirp,
    UpdateChirp: updateChirp,
    CreateChirp: createChirp,
    CreateMention: createMention,
    GetMentions: getMentions,

    GetScores: getScores,
    CreateScore: createScore,
    GetScore: getScore
}
//createChirp('sadf');

//
// connection.query('SELECT * FROM Users', (err,results,fields) => {
//     if(err) {
//         connection.end();
//         return console.log(err);
//     }
//     // results.forEach(item => {
//     //     console.log(item.name);
//     // });

//     //console.log(results[0])
//     console.log(results);
//     connection.end();
// })

//get chirps
// let readChirps = () => {
//     connection.query(`SELECT * FROM Chirps`, (err, results, fields) => {
//         if (err) {
//             connection.end();
//             console.log(err);
//             reject(err);
//         };
// }
// });

// let getChirps = () => {
//     return new Promise((resolve, reject) => {
//         connection.query(`Select * from Chirps`, (err, results, fields) => {
//             if (err) {
//                 connection.end();
//                 console.log(err);
//                 reject(err);
//             };

//             let result = results[0];
//             result = result.map((item, index) => {
//                 return {
//                     id: item.id,
//                     text: item.text
//                 };
//             });
//             resolve(result);
//         });
//     });
// };


        





 //console.log(results);
        // let result = results[0];
        // result = result.map((item, index) => {
        //     return {
        //         id: item.id,
        //         text: item.text
        //     };
        // });



// //get chirps
// let getChirp = (chirpid) => {
//     connection.query(`CALL readChirp(${chirpid}) `, (err, results, fields) => {
//         if (err) {
//             connection.end();
//             return console.log(err);
//         }
//         console.log(results);
//     });
// }   
// getChirp(2);







// let courseid = 1;
// connection.query(`CALL spCourseStudents(${courseid})`, function(err,results,fields) => {
//     if(err) {
//         connection.end();
//         return console.log(err);
//     }
//     results[0].forEach(item => {
//         console.log(item.name);
//     });
    
//     console.log(results[0])
// })