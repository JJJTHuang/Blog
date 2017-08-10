/**
 * Created by tim on 17-7-28.
 */

//加载express模块
let express = require('express');
//加载router模块(一个对象)
let router = express.Router();

let Category = require('../models/Category');

let Content = require('../models/Content');


var data;
// 处理通用数据
//前端页面顶部导航的信息每个页面都需要用到，所以在前端页面中作为通用信息
router.use(function(req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: [],
    };

    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});

//首页
router.get('/', function(req, res, next) {

    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 3;
    data.pages = 0;

    var where = {};
    if (data.category) {
        where.category = data.category;
    }

    Content.where(where).count().then(function(count) {
        data.count = count;
        // 计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        // 规定页数的最大与最小值
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime: -1});
    }).then(function(contents) {
        data.contents = contents;
         res.render('main/index', data);
    });
});


// 首页
router.get('/', function(req, res, next) {

    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 4;
    data.pages = 0;

    var where = {};
    if (data.category) {
        where.category = data.category;
    }

    Content.where(where).count().then(function(count) {
        data.count = count;
        // 计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        // 规定页数的最大与最小值
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime: -1});
    }).then(function(contents) {
        data.contents = contents;
        res.render('main/index', data);
    });

});

// 阅读原文
router.get('/view', function(req, res) {
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        data.content = content;
        content.views++;
        content.save();
        res.render('main/view', data);
    });
});

module.exports = router;
