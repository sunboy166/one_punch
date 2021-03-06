const express = require('express');
const router = express.Router();
// service是多种服务联合时用到
const User = require('../models/mongo/users');
const Topic = require('../models/mongo/topic');
const auth = require('../middlewares/auth_user');


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
    .post(auth(), (req, res, next) => {
        (async () => {
            // 获取creator
            const user = await User.getUserById(req.body.userId);
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
            let topic = await Topic.getTopicById(req.params.id)
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
    .patch(auth(), (req, res, next) => {
        (async () => {
            let topic = await Topic.updateTopicById(req.params.id, {
                content: req.body.content
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
    .post(auth(), (req, res, next) => {
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

router.route('/reply/:replyId')
    .post(auth(), (req, res, next) => {
        (async ()=> {
            let reply = await Topic.changeReplyLikes({
                replyId: req.params.replyId,
                liked:req.body.liked
            });
            return {
                code:0,
                reply:reply
            }
        })()
        .then(r => {
            res.json(r)
        })
        .catch(e => {
            next(e);
        })
    });

module.exports = router;
