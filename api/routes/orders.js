const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

// the url is /orders already since it is in orders.js file
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    
    res.status(201).json({
        message: 'Order was created',
        oder: order
    });
});

router.get('/:orderId', (req, res, next) => {
    // const id = req.params.productId;
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
     res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });

});

// Rich added this
module.exports = router;