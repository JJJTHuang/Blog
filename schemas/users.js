/**
 * Created by tim on 17-7-28.
 */

//加载mongoose模块，通过mongooes操作数据库
var mongooes = require('mongoose');

//用户的表结构
//通过全局对象module.exports 挂载到全局(让整个应用都可以访问)
module.exports = new mongooes.Schema({

    //用户名
    username: String,
    //密码
    password: String,
    //是否是管理员
    isAdmin:{
        type:Boolean,
        default:false
    }

});

