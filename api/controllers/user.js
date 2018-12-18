const mongoose = require('mongoose');

// bcrypt is used to hash the password and encrypt it by salting it
// npm install bcrypt.js
const bcryptjs = require('bcryptjs');

// use jsonwebtoken for JWT exchanges, security
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// the url is /orders already since it is in orders.js file
exports.user_get_all_users = (req, res, next) => {
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
            res.status(500).json({
                error: err
            });
        });
};

exports.user_signup_user = (req, res, next) => {
    // check if email is already used
    User.find({
        email: req.body.email
    })
        .exec()
        .then(user => {
            if (user.length >= 1) {
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
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    eror: err
                                });
                            });
                    }

                });
            }
        });
};

exports.user_login_user =  (req, res, next) => {
 
    User.find({
        email: req.body.email
    })
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcryptjs.compare(req.body.password, user[0].password, (err, result) => {
                if( err ) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if( result) {
                    // use const to run synchronously 
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: '4h'
                    });
                    return res.status(200).json({
                        message: 'Authorization sucessful',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });

            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json( {
                error: err
            });
        });
     
};

exports.user_delete_user =  (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('_id, email, password')
        .exec()
        .then(doc => {
            if (doc) {
                User.deleteOne({
                    _id: id
                })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: 'User deleted',
                        });
                    })
                    .catch(err => {
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
            res.status(500).json({
                error: err
            });
        });



};
