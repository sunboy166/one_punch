const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./users');


mongoose.Promise = global.Promise;

const ReplySchema = new Schema({
    creator: Schema.Types.ObjectId,
    content: String,
    createTime: {type: String, required: true},
    author: {type: String},
    viewTimes: {type: Number},
    likes: {type: Number}
});

// 如果要指定Topic中的creator是User（某个Model）怎么指定？
// 目前使用creator的id做的
const TopicSchema = new Schema({
    creator: {type: String, required: true},
    title: {type: String, required: [true, "a topic must contain a title"]},
    content: String,
    createDate: {type: String},
    viewTimes: {type: Number},
    author: {type: String},
    replyList: [ReplySchema],
    replyNums: {type: Number}
});
// validator的用法？
// , validate: {
// validator: function (v) {
//     return v.length > 5
// },
// message: "a topic's content must be longer than 5 characters"
// }


const TopicModel = mongoose.model('topic', TopicSchema);

// 创建一个topic
// 错误码的问题
async function createANewTopic(params) {
    let user = await User.getUserById(params.creator);
    const topic = new TopicModel({
        creator: params.creator,
        title: params.title,
        content: params.content,
        createDate: new Date().toLocaleString(),
        viewTimes: 0,
        author: user.name,
        replyNums: 0
    });
    return await topic.save()
        .catch(e => {
            throw Error(`error creating topic ${ JSON.stringify(params) }`)
        });
}

// 获取所有topic
async function getTopics(params = {page: 0, pageSize: 10}) {
    let flow = TopicModel.find({});
    flow.skip(params.page * params.pageSize);
    flow.limit(params.pageSize);
    return await flow
        .catch(e => {
            throw new Error('error getting topics from db');
        });
}

// 按id查找topic
async function getTopicById(topicId) {
    return await TopicModel.findOneAndUpdate(
        {_id: topicId},
        {$inc: {viewTimes: 1}},
        {new: true}
    ).catch(e => {
        throw new Error(`error getting user by id:${topicId}`);
    })
}

// 按id更新topic
async function updateTopicById(topicId, update) {
    // new是true代表返回更新后的条目
    return await TopicModel.findOneAndUpdate({_id: topicId}, update, {new: true})
        .catch(e => {
            throw new Error(`error updating topic by id: ${topicId}`);
        });

}

// 回复帖子
async function replyATopic(params) {
    let user = await User.getUserById(params.creator);
    return await TopicModel.findOneAndUpdate(
        {_id: params.topicId},
        {
            $push: {
                replyList: {
                    creator: params.creator,
                    content: params.content,
                    createTime: new Date().toLocaleString(),
                    author: user.name,
                    viewTimes: 0,
                    likes: 0
                }
            },
            $inc: {
                replyNums: 1
            }
        },
        {new: true}
    ).catch(e => {
        console.log(e);
        throw new Error(`error replying topic ${JSON.stringify(params)}`);
    });
}

// 增加帖子的赞数，这个地方应该根据是否已经点过赞来设置。
// 未完成，怎么能够把找到的那条帖子设置上赞数？？？？
async function changeReplyLikes(params) {
    // let num = params.liked === 'liked' ? 1 : -1;
    // console.log(num);
    // let topic = await TopicModel.findOne(
    //     {replyList: {$elemMatch:{_id:params.replyId}}},
    // ).catch(e => {
    //     console.log(e);
    //     throw new Error(`error adding likes reply ${JSON.stringify(params)}`);
    // })
    // topic.replyList.find
}

module.exports = {
    model: TopicModel,
    createANewTopic,
    getTopics,
    getTopicById,
    updateTopicById,
    replyATopic,
    changeReplyLikes
}