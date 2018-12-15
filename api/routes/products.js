const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
    Product.find()
        .select('_id name price')
        .exec()
        .then(docs => {
            const newDocs = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,

                        request: {
                            type: 'GET',
                            url: fullUrl + doc._id
                        }
                    };
                }),

            };
            res.status(200).json(newDocs);
        })
        .catch(err => {
            console.log(docs);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product sucessfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: fullUrl + result._id
                }
            }
        });

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });

    });
});

router.get('/:productId', (req, res, next) => {
    const allProductsUrl = req.protocol + '://' + req.get('host') + '/products' + '/';
    const id = req.params.productId;
    Product.findById(id)
        .select('_id name price')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        descriptions: 'Get all products',
                        url: allProductsUrl
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

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const getProductURL = req.protocol + '://' + req.get('host') + '/products' + '/' + id;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: getProductURL
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

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;