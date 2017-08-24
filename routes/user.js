const express = require('express');
const router = express.Router();
// service是多种服务联合时用到
// 替换为mongo的user
const User = require('../models/mongo/users');
const auth = require('../middlewares/auth_user');

/*实现基本的增改查功能*/
// localhost:3000/user
router.route('/')
    .get((req, res, next) => {
        (async () => {

            let users = await User.getUsers();
            return {
                code: 0,
                users: users
            }

        })().then(r => {
            res.json(r)
        }).catch(e => {
            // 处理错误
            next(e);
        });
        // res.send('trying to get user list');
    })
    .post((req, res, next) => {
        (async () => {

            let user = await User.createANewUser({
                name: req.body.name,
                age: req.body.age,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber
            });
            return {
                code: 0,
                user: user
            }

        })().then(r => {
            res.json(r)
        }).catch(e => {
            // 处理错误
            next(e);
        })
        // res.send('trying to create a user')
    });

// localhost:3000/user/nick
router.route('/:id')
    .get((req, res, next) => {
        (async () => {
            // 参数的处理交给model做，这里不需要转成number
            let user = await User.getUserById(req.params.id)
            return {
                code: 0,
                user: user,
            }
        })()
            .then(r => {
                res.json(r);
            })
            .catch(e => {
                next(e);
            })
    })
    .patch(auth(), (req, res, next) => {
        (async () => {
            let update = {};
            if (req.body.name) update.name = req.body.name;
            if (req.body.age) update.age = req.body.age;
            let user = await User.updateUserById(req.params.id, update);
            return {
                code: 0,
                user: user,
            }
        })()
            .then(r => {
                res.json(r);
            })
            .catch(e => {
                next(e);
            })
    });

module.exports = router;
