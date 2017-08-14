const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const User = require('../models/mongo/users');
const JWT_SECRET = require('../cipher').JWT_SECRET;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

// 注册和登录放在这里，使用全局的中间件来做鉴权的事情
// 注册，大小写是否敏感看系统，node对大小写敏感

router.post('/signUp', (req, res, next) => {


});

// 登录的流程
router.post('/login', (req, res, next) => {
    (async () => {
        const user = await User.login(req.body.phoneNumber, req.body.password);

        // 保证JWT对象没有被篡改过，签名保证内容不被篡改
        // 此处过期时间60s
        const token = JWT.sign({_id: user._id, iat: Date.now(), expire: Date.now() + 60000}, JWT_SECRET);

        return {
            code: 0,
            data: {
                user: user,
                token: token
            }
        };
    })()
        .then(r => {
            res.json(r);
        })
        .catch(e => {
            next(e);
        })
});



module.exports = router;
