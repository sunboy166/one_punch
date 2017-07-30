/**
 * Created by nick on 2017/7/30.
 */
/**
 * Created by nick on 2017/7/30.
 */

let TOPIC_ID_INIT = 10000;
topics = [];

class Topic {
    constructor(params) {
        if (!params.creator) {
            throw {code: -1, msg: "a topic must be sent by a creator"};
        }
        if (!params.title) {
            throw {code: -1, msg: "a topic must contain a title"};
        }
        if (params.content.length < 5) {
            throw {code: -1, msg: "a topic's content must be longer than 5 characters"};
        }
        this._id = TOPIC_ID_INIT++;
        this.creator = params.creator;
        this.title = params.title;
        this.content = params.content;
        this.replyList = [];
    }

    //getter setter函数

}

// 创建一个topic
async function createANewTopic(params) {
    const topic = new Topic(params);
    topics.push(topic);
    return topic;
}

// 获取所有topic
async function getTopics(params) {
    return topics;
}

// 按id查找topic
async function getTopicById(topicId) {
    return topics.find(u => u._id === topicId);
}

// 按id更新topic
async function updateTopicById(topicId, update) {
    const topic = topics.find(u => u._id === topicId);
    // if (update.name) {
    //     topic.name = update.name;
    // }
    // if (update.age) {
    //     topic.age = update.age;
    // }
    return topic;
}

async function replyATopic(params) {
    const topic = topics.find(t => Number(params.topicId) === t._id)
    topic.replyList.push({
        creator:params.creator,
        content:params.content
    })
    return topic;
}

module.exports = {
    model: Topic,
    createANewTopic,
    getTopics,
    getTopicById,
    updateTopicById,
    replyATopic
}