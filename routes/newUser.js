const express = require('express');
const router = express.Router();
const {LoginGet, Signup, Register, Login, Current} = require('../controllers/newUserController');
const validateToken = require('../middlewares/validatorMiddleware');

router.route('/signup').get(Signup);

router.route('/signup').post(Register);

router.route('/login').get(LoginGet);

router.route('/login').post(Login);

router.get('/current', validateToken, Current);

module.exports = router;