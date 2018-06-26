const express = require('express');
//const chirpsStore = require('../chirpstore');
const database = require('../db');
let router = express.Router();

//retrive chirp
router.get('/:id?', (req, res) => {
    let id = req.params.id
    if(id) {
        database.GetChirp(id)
        .then((result) => {
            //console.log(result);
            res.send(result);
        }).catch((err) => {
            console.log(err);
        })    
    }else {  
        database.GetChirps()    
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            console.log(err);
        })    
    }
});

//save chirp
router.post('/', (req,res) => {
    // console.log('creating a chirp');
    // console.log('Testing! req.body=' + req.body);
    // console.log('Testing! req.body.text=' + req.body.text);
    database.CreateChirp(req.body.text, 1)
    .then((results) => {
        res.send(results);
    }).catch((err) => {
        console.log(err);
    }) 
    
});

//delete chirps
router.delete('/:id', (req, res) => {
    console.log('deleting someting');
    let id = req.params.id
    database.DeleteChirp(id)
    .then((result) => {
        res.send(result);
        //res.sendStatus(200);
    }).catch((err) => {
        console.log(err);
    })
})  

//update chirps
//outer.put('/:id/edit', (req, res) => {
router.put('/:id', (req, res) => {
    console.log('updating some stuff');
    console.log(req.body.text);
    let id = req.params.id;
    let chirp = req.body.text;
    database.UpdateChirp(id, chirp)
    .then((results) => {
        res.send(results)
    }).catch((err) => {
        console.log(err);
    })
    
})


module.exports = router;




// //retrive chirp
// router.get('/:id?', (req, res) => {
//     let id = req.params.id
//     if(id) {
//         res.json(chirpsStore.GetChirp(id));
//     } else {    
//         res.send(chirpsStore.GetChirps());
//     }
// });

// //save chirp
// router.post('/', (req,res) => {
//     console.log(req.body);
//     chirpsStore.CreateChirp(req.body);
//     res.sendStatus(200);
// });

// router.delete('/:id?', (req, res) => {
//     //delete resource
//     let id = req.params.id
//     chirpsStore.DeleteChirp(id);
//     res.sendStatus(200);
// })  

// router.put('/:id', (req, res) => {
//     console.log('updating some stuff');
//     console.log(req.body);
//     let id = req.params.id;
//     let chirp = req.body;
//     chirpsStore.UpdateChirp(id, chirp);
//     res.send('success').status(200);
// })





