const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
    Product.find()
        .select('_id name price productImage')
        .exec()
        .then(docs => {
            const newDocs = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
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
            res.status(500).json({
                error: err
            });
        });
};

exports.products_create_product =  (req, res, next) => {
 
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save().then(result => {
        res.status(201).json({
            message: 'Created product sucessfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                    url: fullUrl + result._id
                }
            }
        });

    }).catch(err => {
        res.status(500).json({
            error: err
        });

    });
};

exports.products_get_product = (req, res, next) => {
    const allProductsUrl = req.protocol + '://' + req.get('host') + '/products' + '/';
    const id = req.params.productId;
    Product.findById(id)
        .select('_id name price productImage')
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
            res.status(500).json({
                error: err
            });
        });
};

// this method should make sure the product exists before updating
exports.products_update_product =(req, res, next) => {
    const id = req.params.productId;
    const getProductURL = req.protocol + '://' + req.get('host') + '/products' + '/' + id;

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id   }, { $set: updateOps })
        .exec()
        .then(result => {
            if( result.n === 0) {
                return res.status(404).json({
                    message: 'No valid entry found for given id, no update performed'
                });
            } 
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: getProductURL
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.products_delete_product = (req, res, next) => {
    let id = req.params.productId;
    const getProductURL = req.protocol + '://' + req.get('host') + '/products/';
    let imagePath = null;
    Product.findById(id)
        .select('productImage')
        .exec()
        .then(doc => {
            if (doc) {
                imagePath = doc.productImage;
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

    Product.deleteOne({
        _id: req.params.productId
    })
        .exec()
        .then(result => {
            deleteImageFile(imagePath);
            res.status(200).json({
                message: 'Product deleted, to create again',
                request: {
                    type: 'POST',
                    url: getProductURL,
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

function deleteImageFile(inFilePath) {
    const fs = require('fs');
    const util = require('util');

    const unlinkSync = util.promisify(fs.unlinkSync);

    unlinkSync(inFilePath)
        .then(() => console.log('file created successfully with promisify!'))
        .catch(error => console.log(error, 'ERROR, could not delete file pointed to by db,  could already be deleted', inFilePath));
}
