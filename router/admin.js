/**
 * Created by tim on 17-7-28.
 */

//加载express模块
let express = require('express');
//加载router模块(一个对象)
let router = express.Router();

let User = require('../models/User');

let Category = require('../models/Category');

let Content = require('../models/Content');


// router.use((req,res,next)=>{
//    if(!req.userInfo.isAdmin){
//        res.send('你不是管理员');
//        return;
//    }
//    next();
// });

router.get('/', (req, res, next) => {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

// router.use((req, res, next) => {
//     console.log(req.userInfo);
//     if (!req.userInfo.isAdmin) {
//         res.send('只有管理员才可以进入后台管理');
//         return;
//     }
// });

/*
 用户管理
 */
router.get('/user', (req, res, next) => {

    /*
     * 从数据库中读取所有用户的数据
     *
     * User.find().limit(2) 限制获取的数据条数
     *
     * ...skip():跳过数据的条数
     *
     *
     * 每页显示两条数据
     * 1:1-2  skip 0
     * 2:3-4  skip 1,2
     */

    //获取用户想看的第几页的数据，若用户无操作则默认第一页
    let page = Number(req.query.page || 1);
    let limit = 2;

    User.count().then((count) => {

            //计算总页数
            let pages = parseInt(count / limit);
            //取值不超过pages
            page = Math.min(page, pages);
            //取值不能小于1
            page = Math.max(page, 1);

            let skip = (page - 1) * limit;

            User.find().limit(limit).skip(skip).then((users) => {
                res.render('admin/user_index', {
                    userInfo: req.userInfo,
                    users: users,
                    page: page,
                    count: count,
                    pages: pages,
                    limit: limit
                })
            });
        }
    );
});

/*
 分类管理首页
 */
router.get('/category', (req, res, next) => {
    let page = Number(req.query.page || 1);
    let limit = 5;

    Category.count().then((count) => {
            //计算总页数
            let pages = Math.ceil(count / limit);
            //取值不超过pages
            page = Math.min(page, pages);
            //取值不能小于1
            page = Math.max(page, 1);

            let skip = (page - 1) * limit;

            /*
             1：代表升序
             -1：代表降序
             */
            Category.find().sort({_id: -1}).limit(limit).skip(skip).then((categories) => {
                res.render('admin/category_index', {
                    userInfo: req.userInfo,
                    categories: categories,
                    page: page,
                    count: count,
                    pages: pages,
                    limit: limit
                })
            });
        }
    );
})


router.get('/category/add', (req, res, next) => {

    res.render('admin/category_add', {
        userInfo: req.userInfo
    })
})

/*
 分类保存
 */
router.post('/category/add', (req, res) => {

    let name = req.body.name || '';

    if (name == "") {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '你太帅了。名称不能为空'

        });
        return;
    }

    Category.findOne({
        name: name
    }).then((rs) => {
        //查询数据库中是否有同名分类
        if (rs) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已有该分类'
            });
            //
            return Promise.reject();
        } else {
            return new Category({
                name: name
            }).save();
        }
    }).then((newCategory) => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '保存成功',
            url: '/admin/category'
        })
    });

});

/*
 分类编辑
 */
router.get('/category/edit', (req, res) => {
    //编辑分类信息之前要获取id,以表单的形式表现出来
    let id = req.query.id || '';

    Category.findOne({
        _id: id
    }).then((category) => {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        }
        else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })
});


/*
 分类的修改保存
 */
router.post('/category/edit', (req, res) => {
    let id = req.query.id || '';

    //获取post提交的数据
    let name = req.body.name || '';

    Category.findOne({
        _id: id
    }).then((category) => {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        }
        else {
            //当用户没有做任何修改
            if (name == category.name) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                //
                return Promise.reject();
            }//要修改的分类名称是否存在
            else {
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                }).then()
            }
        }
    }).then((samecategory) => {
        if (samecategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中存在同名分类'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id,

            }, {
                name: name
            });
        }
    }).then(() => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    });

});

/*
 分类删除
 */

router.get('/category/delete', (req, res) => {

    let id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(() => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    });

});

/*
 添加内容
 */
router.get('/content/add', (req, res, next) => {
    Category.find().sort({_id: -1}).then((categories) => {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        });
    });
});


/*
 内容保存（将post过来的信息保存的数据库中）
 */
router.post('/content/add', (req, res) => {


    if ((req.body.category) === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '分类不能为空'
        });
        return;
    }

    if (req.body.title === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        });
        return;
    }

    //保存数据
    new Content({
        category: req.body.category,
        user: req.userInfo._id,
        title: req.body.title,
        content: req.body.content,
        description: req.body.description
    }).save().then((rs) => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功'
        });
    });

});

/*
 内容首页
 */
router.get('/content', function (req, res) {
    var page = Number(req.query.page || 1)
    var limit = 5
    var pages = 0;  //总页数

    Content.count().then(function (count) {
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);    //取值不能超过总页数pages
        page = Math.max(page, 1);        //取值不能小于1
        var skip = (page - 1) * limit;

        //populate关联Content中的category属性(该属性的内容来自另外一个表)
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        }).then(function (contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                page: page,
                limit: limit,
                count: count,
                pages: pages,
                title: req.body.title
            })
        })
    })
});

/*
 修改内容
 */
router.get('/content/edit', (req, res, next) => {

    let id = req.query.id || '';

    let categories = [];

    //暂时得不到categories
    Category.find().sort({_id: -1}).then((rs) => {

        categories = rs;

        //找到该表中的相应的ID，读取内容
        return Content.findOne({
            _id: id
        }).populate('category').then((content) => {


            if (!content) {//如果内容不存在
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '指定内容不存在'
                });
            } else {//否则，就渲染页面
                res.render('admin/content_edit', {
                    userInfo: req.userInfo,
                    content: content,
                    categories: categories,
                    url: '/admin/content'
                });
            }
        });
    });


});


/*
 保存修改内容
 */

router.post('/content/edit', (req, res) => {
    let id = req.query.id || '';

    if ((req.body.category) === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '分类不能为空'
        });
        return;
    }

    if (req.body.title === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        });
        return;
    }

    //保存数据
    Content.update({
        _id: id,

    }, {
        category: req.body.category,
        title: req.body.title,
        content: req.body.content,
        description: req.body.description
    }).then(() => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功'
        })
    });
});

/*
 内容删除
 */

router.get('/content/delete', (req, res, next) => {

    let id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(() => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容删除成功',
            url: '/admin/content'
        });
    });
});

//返回值
module.exports = router;