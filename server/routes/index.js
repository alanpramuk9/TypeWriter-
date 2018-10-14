let express = require('express');
const cors = require('cors');
const scoresRouter = require('./scores');

let router = express.Router();

router.use('/scores', scoresRouter);

module.exports = router;
