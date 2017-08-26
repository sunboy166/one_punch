const JWT = require('jsonwebtoken');
const JWT_SECRET = require('../cipher').JWT_SECRET;

//因为auth返回一个函数，所以写法上写auth()
module.exports = function (options) {
    return function (req, res, next) {
        try {
            const auth = req.get('Authorization');
            if (!auth) throw new Error('No auth!');
            let authList = auth.split(' ');
            if (!auth || authList.length < 2) {
                next(new Error('No auth!'));
                return;
            }
            // console.log(authList);
            const token = authList[1];

            const obj = JWT.verify(token, JWT_SECRET);
            // 检验格式
            if (!obj || !obj._id || !obj.expire) {
                throw new Error('No auth!');
            }
            // console.log(Date.now() - obj.expire);
            // 检验是否过期
            if (Date.now() - obj.expire < 0) {
                throw new Error('Token expired');
            }
            next();
        } catch (e) {
            res.status(401);
            next(e);
        }


    }
};