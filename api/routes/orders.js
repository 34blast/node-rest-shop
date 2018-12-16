const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

// the url is /orders already since it is in orders.js file
router.get('/', (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
    Order.find().select('_id quantity product')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        quantity: doc.quantity,
                        product: doc.product,
                        request: {
                            type: 'GET',
                            url: fullUrl + doc._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found,  can not store object without valid product id'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Order stored',
                        createdOrder: {
                            _id: result._id,
                            quantity: result.quantity,
                            product: result.product
                        },
                        request: {
                            type: 'GET',
                            url: fullUrl + result._id
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:orderId', (req, res, next) => {
    const allOrdersUrl = req.protocol + '://' + req.get('host') + '/orders' + '/';
    const id = req.params.orderId;
    Order.findById(id)
        .select('_id quantity product')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    _id: doc._id,
                    quantity: doc.quantity,
                    product: doc.product,
                    request: {
                        type: 'GET',
                        descriptions: 'Get all orders',
                        url: allOrdersUrl
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for given id'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    console.log('Order id to delete' + id);
    const getOrderURL = req.protocol + '://' + req.get('host') + '/orders/';
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted, to create again',
                request: {
                    type: 'POST',
                    url: getOrderURL,
                    body: { product: 'String_product_id', Quantity: 'Number'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;