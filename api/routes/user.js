const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

// the url is /orders already since it is in orders.js file
router.get('/', UserController.user_get_all_users);


router.post('/signup', UserController.user_signup_user);

router.post('/login', UserController.user_login_user);

router.delete('/:userId', UserController.user_delete_user); 

module.exports = router;