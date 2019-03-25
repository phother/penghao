/**
 * Created by caoRN on 2016/11/9.
 * 创建一个nodejs的server
 */
var PORT = 4006;//创建服务端口
/*引用的模块*/
var http = require('http');
var url = require('url');
var fs = require('fs');
var mine = require('./mine').types;//自定义的文件后缀列表
var path = require('path');

var server = http.createServer(function (request, response) {
    var host = request.headers.host;
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join(".", pathname);
    //console.log(realPath);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    if (realPath == "./" || realPath == ".\\") {
        var locationUrl = "http://" + host + "/index.html";
        response.writeHead(302, {
            'Location': locationUrl
        });
        response.end();
        return;
    }
    //获取文件地址，查找文件，如果没有该文件返回404，如果有则readfile
    fs.exists(realPath, function (exists) {
        if (!exists) {
            fs.readFile(path.join(__dirname, 'data/' + realPath + '.json'), {encoding: 'utf-8'}, function (err, bytesRead) {
                if (!err) {
                    var data = JSON.parse(bytesRead);
                    response.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    response.write(JSON.stringify(data));
                    response.end();
                } else {
                    response.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });
                    response.write(err.toString());
                    response.end();
                }

            });
        } else {
            //读取文件。如果读取出错则返回500，读取成功返回200
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
}).listen(PORT);
console.log("服务已创建，访问端口号:" + PORT);

