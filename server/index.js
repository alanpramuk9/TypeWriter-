const path = require('path');
const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors= require('cors');

let app = express();
const CLIENT_PATH = path.join(__dirname, '../client'); //join client code 
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

let port = process.env.PORT || 8706;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


// for non production release to allow for cors requests 
app.all('/*', function (req, res, next) {
    req.header("Access-Control-Allow-Origin", "http://localhost:8706");
    req.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    req.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});