/**
 * Created by tim on 17-8-1.
 */
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

    // 分类
    //本质上是一个关联字段(与其他表有关联，所以类型要用引用)
    category: {
        type: mongoose.Schema.Types.ObjectId,//数据库中的ObejectId类型
        ref: 'Category'//（引用），另外一张表的模型
    },
    // 标题
    title: String,
    // 用户
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // 时间
    addTime: {
        type: Date,
        default: new Date()
    },
    // 浏览量
    views: {
        type: Number,
        default: 0
    },
    // 简介
    description: {
        type: String,
        default: ''
    },
    // 内容
    content: {
        type: String,
        default: ''
    },
    // 评论
    comments: {
        type: Array,
        default: []
    }
});
