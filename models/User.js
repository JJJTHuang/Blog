/**
 * Created by tim on 17-7-28.
 */

var mongoose = require('mongoose');

//一个表结构
var userSchema = require('../schemas/users.js');

//一个模型类(构造函数)
//可通过此构造函数创建对象，从而对表进行操作
module.exports = mongoose.model('User',userSchema);