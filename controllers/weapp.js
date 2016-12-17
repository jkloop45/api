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
			exec('mkdir ' + fileName, function(error, data) {
				if (error) reject(error);
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
			exec('zip -r ' + dir + '.zip ' + dir, function(error, data) {
				if (error) reject(error);
				resolve(data);
			});
		});
	};

var weapp = {
	pack: function*() {

		var app = yield parse(this);

		if(typeof app == 'string') {
			app = JSON.parse(app);
		}

		var randomDir = __dirname + '/../tmp/'+  util.randomString(8, 10) + '/';

		console.log(randomDir);

		var loopPack = function *(dir, app) {

			try {
				mkdir(dir);

				for(var key in app) {
					var file = app[key],
						filePath = '';

					try {

						if(typeof file == 'string') {

							try {
								filePath = dir + key;
								yield writeFile(filePath, file);
							}catch (err) {
								rmdir(dir);
								this.body = util.resp(500, '云打包失败', '创建文件: ' + key + '失败：' + err.toString());
							}
						}else {

							if(file.pages.length > 0) {
								for (var i = 0; i < val.length; i++) {
									var page = val[i];
									yield loopPack(dir, page);
								};
							}else {
								yield loopPack(dir, file.pages);
							}

						}

					} catch (err) {
						rmdir(dir);
						this.body = util.resp(500, '云打包失败', '创建文件夹失败：' + err.toString());
					}

				}

			}catch (err) {
				this.body = util.resp(500, '云打包失败', '创建项目主文件夹失败：' + err.toString());
			}

		}

		yield loopPack(randomDir, app);

		try {
			yield zip(randomDir);
			this.body = util.resp(500, '云打包成功', randomDir);
		} catch (err) {
			this.body = util.resp(500, '云打包失败', '压缩文件包失败：' + err.toString());
		}

	},

	download: function *() {

		var params = yield parse(this);

		if(typeof params == 'string') {
			params = JSON.parse(app);
		}

		var path = params.path;

	  	yield send(this, path);
	}
}

module.exports = weapp;
