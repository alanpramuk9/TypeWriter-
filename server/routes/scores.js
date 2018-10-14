const express = require('express');
const database = require('../db');
let router = express.Router();

//post score
router.post('/', (req,res) => {
    database.CreateScore(req.body.data.name, req.body.data.wpm)
    .then((results) => {
        res.send(results);
    }).catch((err) => {
        console.log(err);
    }) 
});

//retrieves id
router.get('/:id?', (req, res) => {
    let id = req.params.id
    if (id) {
        database.GetScore(id)
            .then((result) => {
                res.send(result);
            }).catch((err) => {
                console.log(err);
            })
    } else {
        database.GetScores()
            .then((result) => {
                res.send(result);
            }).catch((err) => {
                console.log(err);
            })
    }
})
module.exports = router;