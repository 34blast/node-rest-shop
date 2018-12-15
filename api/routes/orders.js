const express = require('express');
const router = express.Router();

// the url is /orders already since it is in orders.js file
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    
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