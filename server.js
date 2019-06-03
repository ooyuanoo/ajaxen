/**
 * Created by yuanqiujuan on 2017/7/18.
 */
'use strict';
var url = require('url');
var path = require('path');
var express = require('express');
var proxy = require('http-proxy-middleware');
var http = require('http');
var compression = require('compression');
var app = express();
var port = 9001;

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.render(500, err.stack);
});

//读取静态资源
console.log(path.resolve(__dirname, "./"));
app.use(compression());
app.use('static', express.static(path.resolve(__dirname, "./") + '/static'));
app.use(express.static(path.resolve(__dirname, "./")));

app.use('/rexxar', proxy({
    target: "https://m.douban.com",
    changeOrigin: true
}));

//监听端口
app.listen(port, '0.0.0.0', function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==>Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
    }
});
