let express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const wordsRouter = require('./words');
const scoresRouter = require('./scores');

let router = express.Router();

router.use('/words', wordsRouter);
=======
const scoresRouter = require('./scores');

let router = express.Router();
>>>>>>> 0cb4026d4afd35b927e5b9b6345dd1b10cbb10d5
router.use('/scores', scoresRouter);

module.exports = router;
