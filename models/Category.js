/**
 * Created by tim on 17-8-1.
 */

var mongoose = require('mongoose');

//一个表结构
var categorySchema = require('../schemas/categories.js');

//一个模型类(构造函数)
//可通过此构造函数创建对象，从而对表进行操作
module.exports = mongoose.model('Category',categorySchema);
