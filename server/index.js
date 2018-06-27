//import 'babel-polyfill';
// import { join } from 'path';
// import express from 'express';
// import morgan from 'morgan';
// import routes from './routes';
// import stateRouting from './middleware/routing.mw';
const path = require('path');
const express = require('express');
//const morgan = require('morgan');
const routes = require('./routes');
const stateRouting = require('./middleware/routing.mw');
const bodyParser = require('body-parser');
const cors=require('cors');

let app = express();
const CLIENT_PATH = path.join(__dirname, '../client');



app.use(cors());
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(CLIENT_PATH));


app.use('/api', routes);

app.use(stateRouting);

// let port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });
// listening application on port 8000  
var server = app.listen(5500, function(){  
    console.log('Server Listening on port ' + server.address().port);  
}); 
