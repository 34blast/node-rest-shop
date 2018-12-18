// app is for handling the routes of our server
// Express, morgan, body-parser, mongoose and multer are all installed via NPM and required
// for this test project

const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// Mongo Atlas on Google Cloud
/*
const dbURL = 'mongodb://34blast:' +
    process.env.MONGO_ATLAS_PW + '@' +
    'cluster0-shard-00-00-ghnqk.gcp.mongodb.net:27017,' +
    'cluster0-shard-00-01-ghnqk.gcp.mongodb.net:27017,' +
    'cluster0-shard-00-02-ghnqk.gcp.mongodb.net:27017' +
    '/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

// Mongo Atlas on AWS Cloud
const dbURL = 'mongodb://34blast:' +
    process.env.MONGO_ATLAS_PW + '@' +
    'cluster1-shard-00-00-jjq0t.mongodb.net:27017,' +
    'cluster1-shard-00-01-jjq0t.mongodb.net:27017,' +
    'cluster1-shard-00-02-jjq0t.mongodb.net:27017' +
    '/test?ssl=true&replicaSet=cluster1-shard-0&authSource=admin';
 */
// Mongo db on local host
const dbURL = 'mongodb://localhost:27017/test';

mongoose.set('useCreateIndex', true);
mongoose.connect(dbURL, {
    useNewUrlParser: true
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
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
app.use('/user', userRoutes);

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