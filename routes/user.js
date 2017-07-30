const express = require('express');
const router = express.Router();
// service是多种服务联合时用到
const User = require('../models/in_memo/users');

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
    .post((req, res) => {
        (async () => {

            let user = await User.createANewUser({
                name: req.body.name,
                age: req.body.age
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
    .patch((req, res, next) => {
        (async () => {
            let user = await User.updateUserById(Number(req.params.id), {
                name: req.body.name,
                age: req.body.age
            });
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
