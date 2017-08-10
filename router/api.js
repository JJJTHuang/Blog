/**
 * Created by tim on 17-7-28.
 */

//加载express模块
let express = require('express');
//加载router模块(一个对象)
let router = express.Router();
//返回一个构造函数,该构造函数中有很多可以操作数据库的方法，通过该模块可以像操作对象一样去操作数据库而不用直接操作数据库
let User = require('../models/User.js');

let Content = require('../models/Content.js');

//设定统一返回格式
let responseData;

//初始化返回的数据
router.use((req, res, next) => {
    responseData = {
        code: 0,
        message: ''
    }
    next();
});

/*router.get('/user',(req,res,next)=>{
 res.send('apiUser');
 });*/

/*用户注册逻辑
 *1.用户名非空
 *2.密码非空
 *3.两次输入密码一致
 *
 * 数据库查询
 * 1.用户名是否已经存在
 */

router.post('/user/register', (req, res, next) => {

    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;

    //用户名非空
    if (username == '') {
        responseData.code = 1;
        responseData.message = '用户名为空';
        //将信息以json格式返回给前端
        res.json(responseData);
        return;
    }

    //密码非空
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码为空';
        res.json(responseData);
        return;
    }

    //两次输入的密码
    if (password != repassword) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不同';
        res.json(responseData);
        return;
    }


    //tips:mongoose中以#连接的方法是类方法(不需要new对象就可调用),以.连接的是对象方法(即需要new一个对象)
    //在数据库查询用户名是否已被注册
    User.findOne({
        username: username//查询条件
    }).then((userInfo) => { //Use.findOne()返回一个promise对象（返回查到的用户数据）
        //console.log(userInfo);
        if (userInfo) {
            //表示数据库中有记录
            responseData.code = 4;
            responseData.message = '用户名已被注册';
            res.json(responseData);
        } else {
            //若数据库中无数据，保存用户注册信息到数据库
            let user = new User({
                username: username,
                password: password
            });

            return user.save();

        }
    }).then((newUserInfo) => {
        //console.log(newUserInfo);
        responseData.message = '注册成功'
        res.json(responseData);
    });//此处返回一个promise对象都可以用then

});

router.post('/user/login', (req, res, next) => {

    let username = req.body.username;
    let password = req.body.password;


    //用户名和密码非空
    if (username == '' || password == '') {
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        //将信息以json格式返回给前端
        res.json(responseData);
        return;
    }


    //查询数据库中是否有记录
    User.findOne({
        username: username,
        password: password
    }).then((userInfo) => {

        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '该用户或密码错误';
            res.json(responseData);
            return;
        }

        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username,
        };

        //发送cookie给浏览器,浏览器得到该信息会保存起来，以后只要访问该站点，都会以头信息的方式返回给服务端，服务端得到cookie就可以验证用户的登录状态
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username,
        }));

        res.json(responseData);
        return;
    });
});

router.post('/admin/login', (req, res, next) => {

    let username = req.body.username;
    let password = req.body.password;

    console.log(username);

    //用户名和密码非空
    if (username == '' || password == '') {
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        //将信息以json格式返回给前端
        res.json(responseData);
        return;
    }


    //查询数据库中是否有记录
    User.findOne({
        username: username,
        password: password
    }).then((userInfo) => {

        if(userInfo) {

            console.log(userInfo);

            if (userInfo.isAdmin) {
                // userInfo.username === 'admin' && userInfo.password === 'admin'
                responseData.message = '登录成功';
                responseData.userInfo = {
                    _id: userInfo._id,
                    username: userInfo.username,
                };

                //发送cookie给浏览器,浏览器得到该信息会保存起来，以后只要访问该站点，都会以头信息的方式返回给服务端，服务端得到cookie就可以验证用户的登录状态
                req.cookies.set('userInfo', JSON.stringify({
                    _id: userInfo._id,
                    username: userInfo.username,
                }));

                res.json(responseData);
                return;
            }

            res.send('You are not admin');
            return;
        }else{
            responseData.code = 2;
            responseData.message = '用户名和密码错误    ';
            //将信息以json格式返回给前端
            res.json(responseData);
            return;
        }
    });
});

router.get('/user/logout', (req, res) => {
    //清除cookie
    req.cookies.set('userInfo', null);
    responseData.message = '退出';
    res.json(responseData);
});

router.get('/admin/logout', (req, res) => {
    //清除cookie
    req.cookies.set('userInfo', null);
    responseData.message = '退出';
    res.json(responseData);
});

/*
 获取指定文章所有的评论
 */
// router.get('/comment', (req, res, next) => {
//
//     let contentId = req.query.contentid || '';
//
//     Content.findOne({
//         _id: contentId
//     }).then((content) => {
//         responseData.data = content.comments;
//         res.json(responseData);
//     });
//
// });

/*
 评论提交
 */

// router.post('/comment/post', (req, res, next) => {
//     //当前文章的id
//     let contentId = req.body.contentid || '';
//     let postdata = {
//         username: req.userInfo.username,
//         postTime: new Date(),
//         content: req.body.content
//     };
//
//     //查询当前文章的信息
//     Content.findOne({
//         _id: contentId
//     }).then((content) => {
//         content.comments.push(postdata);
//         return content.save();
//     }).then((newContent) => {
//         responseData.message = '评论成功';
//         responseData.data = newContent;
//         res.json(responseData);
//     });
//
// });


module.exports = router;
