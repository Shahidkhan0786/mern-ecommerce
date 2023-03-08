const express= require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
var cors = require('cors')
const mongoose = require('mongoose')
const userroute = require('./routes/user');
const productroute = require('./routes/product');
const orderroute = require('./routes/order');
const categoryroute = require('./routes/category');

const morgan = require('morgan');
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp/'
}));

app.set('view engine', 'ejs');

app.use('/api/v1/users' ,userroute)
app.use('/api/v1/category' ,categoryroute)
app.use('/api/v1/products', productroute)
app.use('/api/v1/order', orderroute)
module.exports = app;
