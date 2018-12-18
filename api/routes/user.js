const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// bcrypt is used to hash the password and encrypt it by salting it
// npm install bcrypt.js
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

// the url is /orders already since it is in orders.js file
router.get('/', (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
    User.find()
        .select('_id email password')
        .exec()
        .then(docs => {
            const newDocs = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        password: doc.password
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

router.post('/signup', (req, res, next) => {
    console.log('passed in email = ', req.body.email);
    // check if email is already used
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                console.log('user = ', user);
                return res.status(409).json({
                    message: 'Can not create user, ERROR, Email already in use'
                });
            } else {
                // 10 is the salting
                bcryptjs.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.
                        save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    eror: err
                                });
                            });
                    }

                });
            }
        });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('_id, email, password')
        .exec()
        .then(doc => {
            if (doc) {
                console.log('Found id');
                User.deleteOne({
                    _id: id
                })
                    .exec()
                    .then(result => {
                        console.log('result = ', result);
                        res.status(200).json({
                            message: 'User deleted',
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            } else {
                res.status(404).json({
                    message: 'Id not found,  could not delete'
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

module.exports = router;