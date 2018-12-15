const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    })
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Order was created'
    })
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    })
});

router.delete('/:orderId', (req, res, next) => {
    console.log('inside of delete')
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });

});

// Rich added this
module.exports = router;