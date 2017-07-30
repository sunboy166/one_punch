const express = require('express');
const router = express.Router();
// service是多种服务联合时用到
const User = require('../models/in_memo/users');
const Topic = require('../models/in_memo/topic');

/*实现基本的增改查功能*/
// localhost:3000/topic
router.route('/')
    .get((req, res, next) => {
        (async () => {
            let topics = await Topic.getTopics();
            return {
                code: 0,
                topics: topics
            }

        })().then(r => {
            res.json(r)
        }).catch(e => {
            // 处理错误
            next(e);
        });
        // res.send('trying to get topic list');
    })
    .post((req, res) => {
        (async () => {
            // 获取creator
            const user = await User.getUserById(req.body.userId);
            console.log(user);
            let topic = await Topic.createANewTopic({
                creator: user,
                title: req.body.title,
                content: req.body.content
            });
            return {
                code: 0,
                topic: topic
            }

        })().then(r => {
            res.json(r)
        }).catch(e => {
            // 处理错误
            next(e);
        })
        // res.send('trying to create a topic')
    });

// localhost:3000/topic/nick
router.route('/:id')
    .get((req, res, next) => {
        (async () => {
            let topic = await Topic.getTopicById(Number(req.params.id))
            return {
                code: 0,
                topics: topic,
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
            let topic = await Topic.updateTopicById(Number(req.params.id), {
                name: req.body.name,
                age: req.body.age
            });
            return {
                code: 0,
                topics: topic,
            }
        })()
            .then(r => {
                res.json(r);
            })
            .catch(e => {
                next(e);
            })
    });

router.route('/:id/reply')
    .post((req, res, next) => {
        (async () => {
            // 获取creator
            const user = await User.getUserById(req.body.userId);
            let topic = await Topic.replyATopic({
                topicId: req.params.id,
                creator: user,
                content: req.body.content
            });
            return {
                code: 0,
                topic: topic
            }

        })().then(r => {
            res.json(r)
        }).catch(e => {
            // 处理错误
            next(e);
        })
        // res.send('trying to create a topic')
    });

module.exports = router;
