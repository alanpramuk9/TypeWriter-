let express = require('express');
const cors = require('cors');
// const wordsRouter = require('./words');
const scoresRouter = require('./scores');

let router = express.Router();

// router.use('/words', wordsRouter);
router.use('/scores', scoresRouter);

module.exports = router;
