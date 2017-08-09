/**
 * Created by nick on 2017/7/30.
 * 持久化存储数据的方案
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    name: {type: String, required: true},
    age: {type: Number, max: [90, 'Nobody over 90 could use postman']}
});

// 索引的设置
UserSchema.index({name: 1}, {unique: true});
// ensureIndex

const UserModel = mongoose.model('user', UserSchema);

// 创建一个user
async function createANewUser(params) {
    const user = new UserModel({name: params.name, age: params.age});
    // 此处可能校验，报错
    return await user.save()
        .catch(e => {
            // age的错误没有对应的错误码
            console.log(e);
            switch (e.code) {
                case 11000:
                    throw Error('Someone has picked that name,choose another one');
                    break;
                default:
                    throw Error(`error creating user ${JSON.stringify(params)}`);
                    break;
            }
        });
}

// 获取所有user
// 这种写法是ES6新写法（设置默认值）（结构赋值、默认参数，有坑要填）
// 正则会造成服务器资源的大量消耗
async function getUsers(params = {page: 0, pageSize: 10}) {
    let flow = UserModel.find({});
    flow.skip(params.page * params.pageSize);
    flow.limit(params.pageSize);
    return await flow
        .catch(e => {
            console.log(e);
            throw new Error('error getting users from db');
        });
}

// 按id查找user
async function getUserById(userId) {
    return await UserModel.findOne({_id: userId})
        .catch(e => {
            console.log(e)
            throw new Error(`error getting user by id: ${userId}`);
        })
}

// 按id更新user
async function updateUserById(userId, update) {
    // findOneAndUpdate原子性操作？？,new:true是啥意思。。。
    // await后面是一个promise，await关键字会获取promise执行完的返回东西
    return await UserModel.findOneAndUpdate({_id: userId}, update, {new: true})
        .catch(e => {
            console.log(e);
            throw new Error(`error updating user by id: ${userId}`);
        });
}

module.exports = {
    model: UserModel,
    createANewUser,
    getUsers,
    getUserById,
    updateUserById
};

