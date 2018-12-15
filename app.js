const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true
});
/*
mongoose.connect(
    'mongodb+srv://34blast:' + 
    process.env.MONGO_ATLAS_PW + 
    '@cluster0-jjq0t.mongodb.net/test?retryWrites=true',  {
        useMongoCLient: true
    });
*/

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// handle potential CORS errors, * is everyone,  but could list domains
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET', 'PUT', 'POST', 'PATCH', 'DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found, invalid URL used, only /orders and /products supported');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;