var util = require('../utils.js'),
	fs = require('fs'),
	path = require('path'),
	co = require('co'),
	parse = require('co-body'),
	url = require('url');

var send = require('koa-send');
var os = require('os');
var exec = require('child_process').exec;
var dir = require('node-dir');
var multer = require('koa-multer');
var path = require('path');
var shells = require('../shell/index');

var baseDir = '/var/www/storage/codes/'

var	writeFile = function(fileName, content) {
		return new Promise(function(resolve, reject) {
			fs.writeFile(fileName, content, function(error) {
				if (error) {
					reject(error);
				};
				resolve();
			});
		});
	},

	mkdir = function(fileName) {
		return new Promise(function(resolve, reject) {
			fs.mkdir(fileName, function(error, data) {
				if (error) {
					if (error.code == 'EEXIST') {
						resolve(data);
					}else {
						reject(error);
					}
				}
				resolve(data);
			});
		});
	},

	rmdir = function(dir) {
		return new Promise(function(resolve, reject) {
			exec('rm -rf ' + dir, function(error, data) {
				if (error) reject(error);
				resolve(data);
			});
		});
	},

	zip = function(dir) {
		return new Promise(function(resolve, reject) {
			dir = dir.split('/');
			var zipFolder = dir.pop();
			dir = dir.join('/');
			exec('cd ' + dir + ' && zip -r ' + zipFolder + '.zip ' + zipFolder, function(error, data) {
				console.log(error);
				console.log(data);
				if (error) reject(error);
				resolve(data);
			});
		});
	},

	cp = function(dest, origin) {
		return new Promise(function(resolve, reject) {
			exec('cp -fr '+ origin + ' ' + dest , function(error, data) {
				if (error) reject(error);
				resolve(data);
			});
		});
	},
	mv = function(origin, dest) {
		return new Promise(function(resolve, reject) {
			exec('mv  '+ origin + ' ' + dest , function(error, data) {
				if (error) reject(error);
				resolve(data);
			});
		});
	},
	readData = function (path){
	    return new Promise(function(resolve,reject){
	        fs.readFile(path,function(err,data){
	            if(err){
	                reject(err);//文件存在返回true
	            }else{
	                resolve(data);//文件不存在，这里会抛出异常
	            }
	        });
	    }).then(function(data){
	            console.log(data);
	            return data;
	        },function(err){
	            console.log(err);
	            return err;
	        });
	},

	beautifyJS = function(fileName, type) {
		return new Promise(function(resolve, reject) {
			exec('js-beautify --type ' + type +' ' + fileName + ' -r', function(error, data) {
				if (error) reject(error);
				resolve(data);
			});
		});
	}

var vdsite = {
	pack: function *() {

		var app = yield parse(this);

		if(typeof app == 'string') {
			app = JSON.parse(app);
		}
		//创建文件夹，随机字符串

		var randomDir = baseDir,
			stylesName = 'pages/css/styles.'+ util.randomString(8, 10) +'.css';
		delete app['folder'];
		// 递归生成项目文件
		var loopPack = function *(dir, app) {
			if(dir!=randomDir ) {
				var data = yield mkdir(dir);
			}
			for(var key in app) {
				var file = app[key],
				filePath = '';
				try {

					if(typeof file == 'string') {
						try {
							var type = '';

							if(key == 'css') {
								//删除css文件

								yield shells.rmFile({
									fileName: randomDir + 'pages/css/styles.*'
								});
								var Dir = dir + stylesName;
								yield writeFile(Dir, file);
								type ='css';
								yield beautifyJS(Dir, type);
							}else {
								filePath = dir + key;
								if(extension == 'html') {
									file = file.replace(/styles.\w{10}.css/, stylesName);
								}

								yield writeFile(filePath, file);

								var splitKey = key.split('.'),
									extension = splitKey.pop();


								yield beautifyJS(filePath, type);
							}
						}catch (err) {
							this.body = util.resp(500, '云打包失败', '创建文件：' + key + '失败: ' + err.toString());
						}
					}else {
						yield loopPack(dir + key + '/', file);
					}
				}catch (err) {
					this.body = util.resp(500, '云打包失败', '创建文件夹失败: ' + err.toString());
				}
			}
		}
		try{
			yield loopPack(randomDir,app);
			this.body = util.resp(200, '配置预览环境成功', '');
		} catch (err) {
			console.log(err.toString());
			this.body = util.resp(500, '云打包失败', '压缩文件包失败:' + err.toString());
		}
		//将pages里面的文件复制出来
		// try {
		// 	yield cp ( randomDir, randomDir + 'pages/*');
		// 	yield rmdir( randomDir + 'pages');
		// }catch (err) {
		// 	console.log( err.toString());
		// 	this.body = util.resp(500, '复制失败' + err.toString());
		// }
		// try {
		//
		// 	var dir = randomDir.split('/');
		// 	dir.pop();
		// 	dir = dir.join('/');
		// 	console.log(dir);
		// 	yield zip(dir);
		// 	yield rmdir(randomDir);
		// 	this.body = util.resp(200, '云打包成功', dir + '.zip');
		// }catch (err) {
		// 	yield rmdir(randomDir);
		// 	console.log(err.toString());
		// 	this.body = util.resp(500, '云打包失败', '压缩文件包失败:' + err.toString());
		// }
	},

	download: function *() {

		try {
			var folder = this.query.folder;
			var project = this.query.project
			var randomDir = baseDir + folder + 'pages';
			console.log(randomDir);
			yield cp(randomDir, baseDir + folder + 'images');
			yield zip(randomDir);
			yield mv(baseDir + folder + 'pages.zip', baseDir + folder + project + '.zip')
			this.set('Content-disposition','attachment;filename='+ project +'.zip');
			var info = yield readData(baseDir + folder + project +'.zip');
			console.log(info);
			this.body = info;
			yield shells.rmFile({
	 			fileName: baseDir + folder +  project + '.zip',
	 		});
		}catch (err) {
			console.log(err);
			this.body = util.resp(200, '云打包成功'+ err.toString());
		}
		// this.body = 'Try GET /' + this.params.id;
		// yield send(this, this.params.id, {
		// 	root: __dirname + '/../tmp/vdsite'
		// });
	}
}

module.exports = vdsite;
