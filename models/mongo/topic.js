const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const ReplySchema = new Schema({
    creator: Schema.Types.ObjectId,
    content: String
});


// 如果要指定Topic中的creator是User（某个Model）怎么制定？
const TopicSchema = new Schema({
    creator: {type: String, required: true},
    title: {type: String, required: [true, "a topic must contain a title"]},
    content: {
        type: String, validate: {
            validator: function (v) {
                return v.length > 5
            },
            message: "a topic's content must be longer than 5 characters"
        }
    },
    replyList: [ReplySchema]
});

const TopicModel = mongoose.model('topic', TopicSchema);

// 创建一个topic
// 错误码的问题
async function createANewTopic(params) {
    const topic = new TopicModel({
        creator: params.creator,
        title: params.title,
        content: params.content,
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
    return await TopicModel.findOne({_id: topicId})
        .catch(e => {
            throw new Error(`error getting user by id:${topicId}`);
        })
}

// 按id更新topic
async function updateTopicById(topicId, update) {
    // new是true代表返回更新后的条目
    return await TopicModel.findOneAndUpdate({_id: topicId}, update, {new: true})
        .catch(e => {
            throw new Error(`error updating user by id: ${topicId}`);
        });

}

async function replyATopic(params) {
    return await TopicModel.findOneAndUpdate(
        {_id: params.topicId},
        {$push: {replyList: {creator: params.creator, content: params.content}}},
        {new: true}
    ).catch(e => {
        console.log(e);
        throw new Error(`error replying topic ${JSON.stringify(params)}`);
    });
}

module.exports = {
    model: TopicModel,
    createANewTopic,
    getTopics,
    getTopicById,
    updateTopicById,
    replyATopic
}