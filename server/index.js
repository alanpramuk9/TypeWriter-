const path = require('path');
const express = require('express');
const routes = require('./routes');
const stateRouting = require('./middleware/routing.mw');
const bodyParser = require('body-parser');
const cors= require('cors');

let app = express();
const CLIENT_PATH = path.join(__dirname, '../client');

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(CLIENT_PATH));

app.use('/api', routes);
app.use(stateRouting);

let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
