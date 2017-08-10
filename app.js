/**
 * Created by tim on 17-7-27.
 */

/**
 *应用程序的入口
 **/

//加载一个express模块
let express = require('express');

//加载模板处理引擎
let swig = require('swig');

//加载数据库模块
let mongooes = require('mongoose');

//加载body-parser(处理post过来的数据)
let bodyparser = require('body-parser');

//加载cookies模块保存用户登录状态信息
let cookies = require('cookies');

//加载markdown语法模块
let markdown = require('markdown');

//通过该模块创建一个应用
//创建app === Node.js中的http.createServer();
let app = express();


var User = require('./models/User.js');

//设置静态文件托管
//当用户访问的url以 '/public' 开始，就返回(__dirname + '/public')的文件
app.use('/public',express.static(__dirname + '/public'));

/*
*1.配置应用模板
* 定义当前应用所使用的模板引擎
*第一个参数:模板引擎的名称,(后缀.html的一个外部文件)
* 第二个参数:用于解析模板内容的方法(swig对象调用renderFile方法对传送过来的.html文件进行解析)
 */
app.engine('html',swig.renderFile);
//2.设置模板文件存放目录（第一个参数必填views,第二个参数则是文件路径）
app.set('views','./views');
//3.注册所使用的模板引擎（第一个参数必须是view engine，第二个参数是模板引擎(类型必须和配置的模板一致)
// (即与app.engine（‘’，‘’）的第一个参数一致)）
app.set('view engine','html');


//开发过程中，需要设置(取消)模板缓存的线程(**因为模板引擎为了优化性能，当应用读取模板文件后，就直接将模板数据放在内存中，
// 当再次读取同一个模板文件，就会直接在缓存里读取数据，而不是到模板文件中读取)
swig.setDefaults({cache:false});

//调用bodyparser.urlencoded()会在api的post的req对象中增加一个属性(body（body中保存的就是post过来的数据）)
app.use(bodyparser.urlencoded());

//设置cookie,加载中间件为request对象的属性
app.use( (req,res,next)=>{

   req.cookies = new cookies(req,res);

    //解析用户的cookie
    req.userInfo = {};

    if(req.cookies.get('userInfo')){
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //从数据库中获取当前用户是否为管理员
            User.findById(req.userInfo._id).then( (userInfo)=>{
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
            });
            next();
        }
        catch(e){next();}
    }
    else{
        next();
    }
});


/*
 *根据不同的功能划分模块
 */
app.use('/admin',require('./router/admin'))
app.use('/api',require('./router/api'))
app.use('/',require('./router/main'))

/*
 *分配路由
 *首页
 *参数next是下一个要执行的函数
//  */
// app.get('/', function (req, res,next) {
//     //响应返回
//     //res.send('GET request to homepage');
//
//     /*
//      *读取views目录下的指定文件，解析并返回给客户端
//      * 第一个参数:表示模板文件,相对于views目录 (这里就是views/index.html)
//      * 第二个参数：传输给模板使用的数据
//      */
//     res.render('index')
// });


//连接数据库
mongooes.connect('mongodb://localhost:27018/blog',(err)=>{
    if(err){
        console.log('数据库连接失败。');
    }else{
        console.log('数据库连接成功。');
        //监听http请求
        app.listen(3000);
    }
});




/**
 * 总结：
 *用户发送http请求(url) -> 后端接收请求并解析(解析路由(url)) -> 找到匹配规则 -> 执行绑定的函数，返回对应的内容至客户端
 *
 *静态文件的处理(app.use())
 * /public表示静态文件 -> 直接读取指定目录的文件并返回给用户
 *动态文件的处理(app.get())
 *else动态文件 -> 通过路由的方式处理，处理业务逻辑，加载模板，解析模板 并 返回给用户
 **/
