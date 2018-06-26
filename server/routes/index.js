let express = require('express');
//import peopleRouter from './people';
const cors = require('cors');
const chirpsRouter = require('./chirps');
const scoresRouter = require('./scores');

let router = express.Router();

router.use('/chirps', chirpsRouter);
router.use('/scores', scoresRouter);
// export default router;
module.exports = router;