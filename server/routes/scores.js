const express = require('express');
const database = require('../db');
let router = express.Router();

//post score
router.post('/', (req,res) => {
    console.log('*** Posting Score: req.body ***');
    console.log(req.body);
    console.log('*** request name: req.body.name ***');
    console.log(req.body.name);

    
    database.CreateScore(req.body.data.name, req.body.data.wpm)
    .then((results) => {
        console.log('result of creating a score:');
        console.log(results);
        res.send(results);
    }).catch((err) => {
        console.log(err);
    }) 
    
});

//retrieves id
router.get('/:id?', (req, res) => {
    let id = req.params.id
    if(id) {
        console.log('about to send stuff to database');
        //res.send(database.GetScore(id));
        database.GetScore(id)
        .then((result) => {
            console.log(result);
            res.send(result);
        }).catch((err) => {
            console.log(err);
        })    
    }else {  
        console.log('about to send stuff to database');
        database.GetScores()    
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            console.log(err);
        })    
    }  
    }
)
module.exports = router;