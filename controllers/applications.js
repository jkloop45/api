var util = require('../utils.js');
var models = require('../models');
var config = require('../configs');
var shells = require('../shell');
var parse = require('co-body');
var transliteration = require('transliteration');
var portManager = require('../port');
var common = require('./common');

var applications = {};
//数据渲染，todo:分页参数引入，异常信息引入
function render(data,all,cur,code,message) {

	return {
		code: code,
		message: message,
		all: all,
		cur: cur,
		fields: data
	}
}

applications.create = function*() {

  console.log("create");
  console.log(this);
  if ('POST' != this.method) this.throw(405, "method is not allowed");
    var application = yield parse(this, {
      limit: '1kb'
    });

    //应用中文转英文
    var domain  = application.name;
    var reg = /[\u4e00-\u9FA5]+/;
    var res = reg.test(domain);

    if(res){
      var tr = transliteration.transliterate
      domain = tr(domain).replace(new RegExp(" ",'gm'),"").toLocaleLowerCase();
    }

    var port = yield portManager.generatePort();
    console.log(port + domain);
    var inserted = yield  models.gospel_domains.create({
        domain: domain + "_" +application.creator,
        ip: '120.76.235.234',
        creator: application.creator
    });

    try{
        var data = yield shells.domain({
          user: application.creator,
          domain: domain  + "_" + application.creator,
          port: port,
        });
        console.log(data);
        if(data == 'success'){
          // var data = yield shells.nginx();
          // console.log(data);
          var inserted = yield models.gospel_applications.create(application);

          //创建并启动docker
          var sshPort = yield portManager.generatePort();
          var socketPort = yield portManager.generatePort();
          if(sshPort == socketPort){

            sshPort = yield portManager.generatePort();
            socketPort = yield portManager.generatePort();
          }
          var data = yield shells.docker({
            name: domain,
            sshPort: sshPort,
            socketPort: socketPort,
            password: application.password
          });
          console.log(data);
          if(data == 'success'){
            this.body = render(null,null,null,1,'创建应用成功');
          }else{
            this.body = render(null,null,null,-1,'创建应用失败');
          }

        }else{
          this.body = render(null,null,null,-1,'创建应用失败');
        }

    }catch(err){
        console.log(err);
        throw err;
    }
}

module.exports = applications;
