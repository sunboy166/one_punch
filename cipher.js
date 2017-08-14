/**
 * Created by nick on 2017/7/30.
 * 定义加密所需的组件
 */
const PASSWORD_SALT = 'salt for one punch, which is salty'; // salt参数
const JWT_SECRET = 'you can never image such a long secret for a json web token'; // JWT的secret

module.exports = {
    PASSWORD_SALT,
    JWT_SECRET
};
