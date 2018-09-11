const express = require('express');
const database = require('../db');
let router = express.Router();

//retrieves words
router.get('/', (req, res) => {
    //let id = req.params.id
        console.log('about to get words from database');
        database.GetWords()    
        .then((result) => {
            console.log('asdk');
            res.send(result);
        }).catch((err) => {
            console.log(err);
        })    
    }  
)


module.exports = router;