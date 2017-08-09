var express = require('express');
var router = express.Router();
const User = require('../models/mongo/users')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

// 注册，大小写是否敏感看系统，node对大小写敏感
router.post('/signUp', (req, res, next) => {
    const user = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
    }

});

router.post('/login', function (req, res, next) {
});

module.exports = router;
