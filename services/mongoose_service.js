/**
 * Created by nick on 2017/8/7.
 */
const uri = 'mongodb://localhost:27017/one_punch';
const mongoose = require('mongoose');

// 替换mongoose中的promise / bluebird
mongoose.Promise = global.Promise;
mongoose.connect(uri, {useMongoClient: true})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log('mongo connection created');
});
