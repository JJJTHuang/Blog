# Blog
<h3>个人博客项目</h3>(Node.js(服务端)+Mongodb(数据库)+Express+Mongoose+bodyparse+markdown(框架|库))<br><br>
本项目学习自<a href="http://study.163.com/course/courseMain.htm?courseId=1003675016">妙味课堂</a><br>
<p>后经个人功能需求做了一些修改:<em>(此处留空博客地址，等申请了稳定的服务器后再摆上来)</em></p>

<h3>项目部署的过程(你也可参照<a href="https://segmentfault.com/a/1190000004051670#articleHeader4">我参照的</a>)</h3>
<strong>下面是个人首次安装过程与遇到的一些问题的简单总结</strong>
<ol>
<li>
	<h4>购买一个服务器（我这里选择的是linux centOS 7.3）</h4>
</li>
	<li><h4>连接服务器</h4>
	第一次登录需要输入用户名与密码，后面可通过命令
	<p>ssh 用户名@IP地址 </p>	进行连接
	<p>（通过ssh连接你必须先下载你所创建的密匙，并放入.ssh文件夹）</p>
	<p>遇到的问题:一开始本想在本机(本机也是linux)连接，但是一直不成功,通过密匙连接，(连接的过程一直报public key denid)</p>
	<p>遇到这个问题百度了很久，说法不一，个人还是办法解决，最后求助于师兄，发现是密匙的权限过高，降低密匙权限(通过chmod “密匙名” 权限等级 ）后才成功连接,（自己最后还是下载了fileZila..）。</p>
</li>
	<li><h4>搭建项目运行环境</h4>
	<p>安装Mongodb遇到的问题:不知道为什么几次安装mongodb后，都没有mongod文件</p>
	<p>最后只好通过fileZila,直接上传本地的mongodb才把问题解决了</p>
</li>
<li><h4>启动数据库</h4>
	<p>找到你mongod文件所在的文件夹，进入到此文件夹并通过命令</p>
	<p>/usr/local/mongodb/bin/mongod --dbpath=/var/mongodb/data --logpath /var/mongodb/logs/log.log --fork</p>
	<p>//注释:(/usr/local/mongodb/bin是我mongod所在的文件夹)</p>
	<p>成功启动可看到</p>
	<p>forked process: 18394(这里的数字是你的进程)</p>
	<p>all output going to: /var/mongodb/logs/log.log</p>
</li>
	<li><h4>上传代码，启动项目</h4>
	<p>上传代码可通过fileZila，或者把你的项目放到github通过git clone(可自行百度)</p>
	<p>通过命令sudo forever start app.js 启动</p>
	<p>命令sudo forever list 查看正在运行的程序</p>
	<p>命令sudo forever stop 0 可终止当前程序</p>
	<p>所有东西都弄好了，最后还是打不开网页？</p>
	<p>问了师兄，原来服务器默认端口80,把程序入口文件app.js中的监听端口3000改成80后终于大工告成！</p>
</li>
</ol>
