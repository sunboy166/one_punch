/**
 * Created by nick on 2017/7/30.
 * 持久化存储数据的方案
 */
const crypto = require('crypto');
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const SALT = require('../../cipher').PASSWORD_SALT;// 可以使用随机字符串，每个用户都不一样。此处使用相同的salt

const pbkdf2Async = bluebird.promisify(crypto.pbkdf2);

const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    name: {type: String, required: true},
    age: {type: Number, max: [90, 'Nobody over 90 could use postman']},
    phoneNumber: String, // 没有写成必须的，未来可能会支持三方登录
    password: String
});

// 索引的设置
UserSchema.index({name: 1}, {unique: true});

UserSchema.index({name: 1, age: 1});

// projection设置，相当于mysql中的select
const DEFAULT_PROJECTION = {password: 0, phoneNumber: 0, __v: 0};

const UserModel = mongoose.model('user', UserSchema);

// 创建一个user
async function createANewUser(params) {
    const user = new UserModel({name: params.name, age: params.age,phoneNumber:params.phoneNumber});

    user.password = await pbkdf2Async(params.password, SALT, 512, 128, 'sha512')
        .then(r => r.toString())
        .catch(e => {
            console.log(e);
            throw new Error('something goes wrong inside the server'); // 给用户看的错误，错误细节不应该暴露
        });

    // 此处可能校验，报错
    let created = await user.save()
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
    // 过滤password敏感信息
    return {
        _id: created._id,
        name: created.name,
        age: created.age
    }
}

// 获取所有user
// 这种写法是ES6新写法（设置默认值）（结构赋值、默认参数，有坑要填）
// 正则会造成服务器资源的大量消耗
async function getUsers(params = {page: 0, pageSize: 10}) {
    let flow = UserModel.find({});
    flow.select(DEFAULT_PROJECTION);
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
        .select(DEFAULT_PROJECTION)
        .catch(e => {
            console.log(e);
            throw new Error(`error getting user by id: ${userId}`);
        });
}

// 按id更新user
async function updateUserById(userId, update) {
    // findOneAndUpdate原子性操作？？,new:true是啥意思。。。
    // await后面是一个promise，await关键字会获取promise执行完的返回东西
    return await UserModel.findOneAndUpdate({_id: userId}, update, {new: true})
        .select(DEFAULT_PROJECTION)
        .catch(e => {
            console.log(e);
            throw new Error(`error updating user by id: ${userId}`);
        });
}

// 假设phoneNumber是登录的依据
async function login(phoneNumber, password) {
    // 加密获取密码，再到数据库中查找
    const pwd = await pbkdf2Async(password, SALT, 512, 128, 'sha512')
        .then(r => r.toString())
        .catch(e => {
            console.log(e);
            throw new Error('something goes wrong inside the server');
        });

    // 查找到的user，使用phoneNumber查询，要求它是唯一的，所以在创建的时候就要检验
    const user = await UserModel.findOne({phoneNumber: phoneNumber, password: pwd})
        .select(DEFAULT_PROJECTION)
        .catch(e => {
            console.log(`error logging in, phone ${phoneNumber}`, {err: e.stack || e});
            throw new Error('something wrong with the server');
        });

    if (!user) throw Error('No such user!');
    return user;
}

module.exports = {
    model: UserModel,
    createANewUser,
    getUsers,
    getUserById,
    updateUserById,
    login
};

