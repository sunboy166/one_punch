/**
 * Created by nick on 2017/7/30.
 */

let USER_ID_INIT = 10000;
users = [];

class User {
    constructor(params) {
        if (!params.name || !params.age) {
            throw new Error('age and name required when creating a user');
        }
        this.name = params.name;
        this.age = params.age;
        this._id = USER_ID_INIT++;
    }

    //getter setter函数

}

// 创建一个user
async function createANewUser(params) {
    const user = new User(params);
    users.push(user);
    return user;
}

// 获取所有user
async function getUsers(params){
    return users;
}

// 按id查找user
async function getUserById(userId){
    return users.find(u=>u._id === Number(userId));
}

// 按id更新user
async function updateUserById(userId,update) {
    const user = users.find(u => u._id === Number(userId));
    if(update.name){
        user.name = update.name;
    }
    if(update.age) {
        user.age = update.age;
    }
    return user;
}

module.exports = {
    model:User,
    createANewUser,
    getUsers,
    getUserById,
    updateUserById
}