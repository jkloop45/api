var AlipayNotify = require('./alipay_notify.class').AlipayNotify;
var AlipaySubmit = require('./alipay_submit.class').AlipaySubmit;
var assert = require('assert');
var url = require('url');
var inherits = require('util').inherits,
  EventEmitter = require('events').EventEmitter;
var DOMParser = require('xmldom').DOMParser;
var https = require('https');
var xml2js = require('xml2js')
var _ = require('lodash');
var parse = require('co-body');
var order = require('../order');


var default_alipay_config = {
  partner: '2088421937560320' //合作身份者id，以2088开头的16位纯数字
    ,
  key: '5msupwk7dm3hmzgzbe2x89mz1kx17yb8' //安全检验码，以数字和字母组成的32位字符
    ,
  seller_id: '2088421937560320' //卖家支付宝用户号 必填，可能和合作身份者id相同
    ,
  host: "http://api.gospely.com" //域名
    ,
  cacert: 'cacert.pem' //ca证书路径地址，用于curl中ssl校验 请保证cacert.pem文件在当前文件夹目录中
    ,
  transport: 'http' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
    ,
  input_charset: 'utf-8' //字符编码格式 目前支持 gbk 或 utf-8
    ,
  sign_type: "MD5" //签名方式 不需修改
    ,
  create_direct_pay_by_user_return_url: '/alipay/create_direct_pay_by_user/return_url',
  create_direct_pay_by_user_notify_url: '/alipay/create_direct_pay_by_user/notify_url',
  refund_fastpay_by_platform_pwd_notify_url: '/alipay/refund_fastpay_by_platform_pwd/notify_url',
  create_partner_trade_by_buyer_notify_url: '/aplipay/create_partner_trade_by_buyer/notify_url',
  create_partner_trade_by_buyer_return_url: '/aplipay/create_partner_trade_by_buyer/return_url',
  trade_create_by_buyer_return_url: '/alipay/trade_create_by_buyer/return_url',
  trade_create_by_buyer_notify_url: '/alipay/trade_create_by_buyer/notify_url'
};

function Alipay(alipay_config) {
  EventEmitter.call(this);

  //default config
  this.alipay_config = default_alipay_config;
  //config merge
  _.merge(this.alipay_config, alipay_config);
}

/**
 * @ignore
 */
inherits(Alipay, EventEmitter);

Alipay.prototype.route = function(app) {
  var self = this;
  app.get(this.alipay_config.create_direct_pay_by_user_return_url, function*() {
    yield self.create_direct_pay_by_user_return(this);
  });
  app.post(this.alipay_config.create_direct_pay_by_user_notify_url, function*
    () {
      self.create_direct_pay_by_user_notify(this.req, this.res)
    });
  app.post(this.alipay_config.refund_fastpay_by_platform_pwd_notify_url,
    function*() {
      self.refund_fastpay_by_platform_pwd_notify(this.req, this.res)
    });

  app.get(this.alipay_config.create_partner_trade_by_buyer_return_url,
    function*() {
      self.create_partner_trade_by_buyer_return(this.req, this.res)
    });
  app.post(this.alipay_config.create_partner_trade_by_buyer_notify_url,
    function*() {
      self.create_partner_trade_by_buyer_notify(this.req, this.res)
    });

  app.get(this.alipay_config.trade_create_by_buyer_return_url, function(req,
    res) {
    self.trade_create_by_buyer_return(this.req, this.res)
  });
  app.post(this.alipay_config.trade_create_by_buyer_notify_url, function(req,
    res) {
    self.trade_create_by_buyer_notify(this.req, this.res)
  });
}

//支付宝即时到帐交易接口
/*data{
 out_trade_no:'' //商户订单号, 商户网站订单系统中唯一订单号，必填
 ,subject:'' //订单名称 必填
 ,total_fee:'' //付款金额,必填
 ,body:'' //订单描述
 ,show_url:'' //商品展示地址 需以http://开头的完整路径，例如：http://www.xxx.com/myorder.html
 }*/

Alipay.prototype.create_direct_pay_by_user = function(data, ctx) {
  assert.ok(data.out_trade_no && data.subject && data.total_fee);

  //建立请求
  var alipaySubmit = new AlipaySubmit(this.alipay_config);

  var parameter = {
    service: 'create_direct_pay_by_user',
    seller_id: this.alipay_config.seller_id,
    partner: this.alipay_config.partner,
    payment_type: '1' //支付类型
      ,
    notify_url: this.alipay_config.host + this.alipay_config.create_direct_pay_by_user_notify_url //服务器异步通知页面路径,必填，不能修改, 需http://格式的完整路径，不能加?id=123这类自定义参数
      ,
    return_url: this.alipay_config.host + this.alipay_config.create_direct_pay_by_user_return_url //页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，不能写成http://localhost/
      ,
    seller_email: this.alipay_config.seller_email //卖家支付宝帐户 必填
      ,
    _input_charset: this.alipay_config['input_charset'].toLowerCase().trim()
  };
  _.merge(parameter, data);

  var url = alipaySubmit.buildRequestParaToString(parameter);
  return url;
}


Alipay.prototype.create_direct_pay_by_user_phone = function(data, res) {
  assert.ok(data.out_trade_no && data.subject && data.total_fee);

  //建立请求
  var alipaySubmit = new AlipaySubmit(this.alipay_config);

  var parameter = {
    service: 'create_direct_pay_by_user',
    partner: this.alipay_config.partner,
    payment_type: '1' //支付类型
      ,
    notify_url: this.alipay_config.host + this.alipay_config.create_direct_pay_by_user_notify_url //服务器异步通知页面路径,必填，不能修改, 需http://格式的完整路径，不能加?id=123这类自定义参数
      ,
    return_url: this.alipay_config.host + this.alipay_config.create_direct_pay_by_user_return_url //页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，不能写成http://localhost/
      ,
    seller_id: this.alipay_config.seller_id //卖家支付宝用户号 必填
      ,
    _input_charset: this.alipay_config['input_charset'].toLowerCase().trim()
  };
  _.merge(parameter, data);

  var url = alipaySubmit.buildRequestParaToString(parameter);
  var form = alipaySubmit.buildRequestForm(parameter, 'get', '提交')
  res.send(form);
}


//即时到账批量退款有密接口
/*  data{
    refund_date:'',//退款当天日期, 必填，格式：年[4位]-月[2位]-日[2位] 小时[2位 24小时制]:分[2位]:秒[2位]，如：2007-10-01 13:13:13
    batch_no: '', //批次号, 必填，格式：当天日期[8位]+序列号[3至24位]，如：201008010000001
    batch_num:'', //退款笔数, 必填，参数detail_data的值中，“#”字符出现的数量加1，最大支持1000笔（即“#”字符出现的数量999个）
    detail_data: '',//退款详细数据 必填，具体格式请参见接口技术文档
} */
Alipay.prototype.refund_fastpay_by_platform_pwd = function(data, res) {
  assert.ok(data.refund_date && data.batch_no && data.batch_num && data.detail_data);
  //建立请求
  var alipaySubmit = new AlipaySubmit(this.alipay_config);

  //构造要请求的参数数组，无需改动
  var parameter = {
    service: 'refund_fastpay_by_platform_pwd',
    partner: this.alipay_config.partner,
    notify_url: this.alipay_config.host + this.alipay_config.refund_fastpay_by_platform_pwd_notify_url,
    seller_email: this.alipay_config.seller_email,
    refund_date: data.refund_date,
    batch_no: data.batch_no,
    batch_num: data.batch_num,
    detail_data: data.detail_data,
    _input_charset: this.alipay_config['input_charset'].toLowerCase().trim()
  };

  var url = alipaySubmit.buildRequestParaToString(parameter);
  res.send(url);
}

//支付宝纯担保交易接口接口

Alipay.prototype.create_partner_trade_by_buyer = function(data, res) {
  //建立请求
  var alipaySubmit = new AlipaySubmit(this.alipay_config);

  //构造要请求的参数数组，无需改动
  var parameter = {
    service: 'create_partner_trade_by_buyer',
    partner: this.alipay_config.partner,
    payment_type: '1',
    notify_url: url.resolve(this.alipay_config.host, this.alipay_config.create_partner_trade_by_buyer_notify_url),
    return_url: url.resolve(this.alipay_config.host, this.alipay_config.create_partner_trade_by_buyer_return_url),
    seller_email: this.alipay_config.seller_email,
    out_trade_no: data.out_trade_no,
    subject: data.subject,
    price: data.price,
    quantity: data.quantity,
    logistics_fee: data.logistics_fee,
    logistics_type: data.logistics_type,
    logistics_payment: data.logistics_payment,
    body: data.body,
    show_url: data.show_url,
    receive_name: data.receive_name,
    receive_address: data.receive_address,
    receive_zip: data.receive_zip,
    receive_phone: data.receive_phone,
    receive_mobile: data.receive_mobile,

    _input_charset: this.alipay_config['input_charset'].toLowerCase().trim()
  };

  var url = alipaySubmit.buildRequestParaToString(parameter);
  res.send(url);
}

Alipay.prototype.send_goods_confirm_by_platform = function(data, res) {
  //建立请求
  var alipaySubmit = new AlipaySubmit(this.alipay_config);

  //构造要请求的参数数组，无需改动
  var parameter = {
    service: 'send_goods_confirm_by_platform',
    partner: this.alipay_config.partner,

    trade_no: data.trade_no,
    logistics_name: data.logistics_name,
    invoice_no: data.invoice_no,
    transport_type: data.transport_type,

    _input_charset: this.alipay_config['input_charset'].toLowerCase().trim()
  };

  alipaySubmit.buildRequestHttp(parameter, function(html_text) {
    //解析XML html_text
    var doc = new DOMParser().parseFromString(html_text);
    var is_success = doc.getElementsByTagName('is_success').item(0).firstChild
      .nodeValue
    if (is_success == 'T') {
      var out_trade_no = doc.getElementsByTagName('out_trade_no').item(0)
        .firstChild.nodeValue;
      var trade_no = doc.getElementsByTagName('trade_no').item(0).firstChild
        .nodeValue;
      self.emit('send_goods_confirm_by_platform_success', out_trade_no,
        trade_no, html_text);
    } else if (is_success == 'F') {
      var error = doc.getElementsByTagName('error').item(0).firstChild.nodeValue;
      self.emit('send_goods_confirm_by_platform_fail', error);
    }
  });
}

Alipay.prototype.trade_create_by_buyer = function(data, res) {
  //建立请求
  var alipaySubmit = new AlipaySubmit(this.alipay_config);

  //构造要请求的参数数组，无需改动
  var parameter = {
    service: 'trade_create_by_buyer',
    partner: this.alipay_config.partner,
    payment_type: '1',
    notify_url: url.resolve(this.alipay_config.host, this.alipay_config.trade_create_by_buyer_notify_url),
    return_url: url.resolve(this.alipay_config.host, this.alipay_config.trade_create_by_buyer_return_url),
    seller_email: this.alipay_config.seller_email,

    out_trade_no: data.out_trade_no,
    subject: data.subject,
    price: data.price,
    quantity: data.quantity,
    logistics_fee: data.logistics_fee,
    logistics_type: data.logistics_type,
    logistics_payment: data.logistics_payment,
    body: data.body,
    show_url: data.show_url,
    receive_name: data.receive_name,
    receive_address: data.receive_address,
    receive_zip: data.receive_zip,
    receive_phone: data.receive_phone,
    receive_mobile: data.receive_mobile,

    _input_charset: this.alipay_config['input_charset'].toLowerCase().trim()
  };

  var html_text = alipaySubmit.buildRequestForm(parameter);
  res.send(html_text);
}

Alipay.prototype.trade_create_by_buyer_return = function(ctx) {
  var self = this;

  var _GET = ctx.query;
  //计算得出通知验证结果
  var alipayNotify = new AlipayNotify(this.alipay_config);
  //验证消息是否是支付宝发出的合法消息
  alipayNotify.verifyReturn(_GET, function(verify_result) {
    if (verify_result) { //验证成功
      //商户订单号
      var out_trade_no = _GET['out_trade_no'];
      //支付宝交易号
      var trade_no = _GET['trade_no'];
      //交易状态
      var trade_status = _GET['trade_status'];

      if (trade_status == 'WAIT_BUYER_PAY') {
        self.emit('trade_create_by_buyer_wait_buyer_pay', out_trade_no,
          trade_no);
      } else if (trade_status == 'WAIT_SELLER_SEND_GOODS') {
        self.emit('trade_create_by_buyer_wait_seller_send_goods',
          out_trade_no, trade_no);
      } else if (trade_status == 'WAIT_BUYER_CONFIRM_GOODS') {
        self.emit('trade_create_by_buyer_wait_buyer_confirm_goods',
          out_trade_no, trade_no);
      } else if (trade_status == 'TRADE_FINISHED') {
        self.emit('trade_create_by_buyer_trade_finished', out_trade_no,
          trade_no);
      }

      ctx.body = 'success';
    } else {
      //验证失败
      self.emit("verify_fail");
      ctx.body = 'fail'
    }
  });
}

Alipay.prototype.trade_create_by_buyer_notify = function*(req, res) {
  var self = this;

  var _POST = yield parse(this, {
    limit: '1kb'
  });;
  //计算得出通知验证结果
  var alipayNotify = new AlipayNotify(this.alipay_config);
  //验证消息是否是支付宝发出的合法消息
  alipayNotify.verifyNotify(_POST, function(verify_result) {
    if (verify_result) { //验证成功
      //商户订单号
      var out_trade_no = _POST['out_trade_no'];
      //支付宝交易号
      var trade_no = _POST['trade_no'];
      //交易状态
      var trade_status = _POST['trade_status'];

      if (trade_status == 'WAIT_BUYER_PAY') {
        self.emit('trade_create_by_buyer_wait_buyer_pay', out_trade_no,
          trade_no);
      } else if (trade_status == 'WAIT_SELLER_SEND_GOODS') {
        self.emit('trade_create_by_buyer_wait_seller_send_goods',
          out_trade_no, trade_no);
      } else if (trade_status == 'WAIT_BUYER_CONFIRM_GOODS') {
        self.emit('trade_create_by_buyer_wait_buyer_confirm_goods',
          out_trade_no, trade_no);
      } else if (trade_status == 'TRADE_FINISHED') {
        self.emit('trade_create_by_buyer_trade_finished', out_trade_no,
          trade_no);
      }

      res.send("success");
    } else {
      //验证失败
      self.emit("verify_fail");
      res.send("fail");
    }
  });
}

Alipay.prototype.refund_fastpay_by_platform_pwd_notify = function(req, res) {
  var self = this;

  var _POST = req.body;
  //计算得出通知验证结果
  var alipayNotify = new AlipayNotify(this.alipay_config);
  //验证消息是否是支付宝发出的合法消息
  alipayNotify.verifyNotify(_POST, function(verify_result) {
    if (verify_result) { //验证成功
      //批次号
      var batch_no = _POST['batch_no'];
      //批量退款数据中转账成功的笔数
      var success_num = _POST['success_num'];
      //批量退款数据中的详细信息
      var result_details = _POST['result_details'];

      self.emit('refund_fastpay_by_platform_pwd_success', batch_no,
        success_num, result_details);

      res.send("success"); //请不要修改或删除
    } else {
      //验证失败
      self.emit("verify_fail");
      res.send("fail");
    }
  });
}

Alipay.prototype.create_partner_trade_by_buyer_return = function(req, res) {
  var self = this;

  var _GET = req.query;
  //计算得出通知验证结果
  var alipayNotify = new AlipayNotify(this.alipay_config);
  //验证消息是否是支付宝发出的合法消息
  alipayNotify.verifyReturn(_GET, function(verify_result) {
    if (verify_result) { //验证成功
      //商户订单号
      var out_trade_no = _GET['out_trade_no'];
      //支付宝交易号
      var trade_no = _GET['trade_no'];
      //交易状态
      var trade_status = _GET['trade_status'];

      if (trade_status == 'WAIT_BUYER_PAY') {
        self.emit('create_partner_trade_by_buyer_wait_buyer_pay',
          out_trade_no, trade_no);
      } else if (trade_status == 'WAIT_SELLER_SEND_GOODS') {
        self.emit('create_partner_trade_by_buyer_wait_seller_send_goods',
          out_trade_no, trade_no);
      } else if (trade_status == 'WAIT_BUYER_CONFIRM_GOODS') {
        self.emit(
          'create_partner_trade_by_buyer_wait_buyer_confirm_goods',
          out_trade_no, trade_no);
      } else if (trade_status == 'TRADE_FINISHED') {
        self.emit('create_partner_trade_by_buyer_trade_finished',
          out_trade_no, trade_no);
      }

      res.send("success");
    } else {
      //验证失败
      self.emit("verify_fail");
      res.send("fail");
    }
  });
}

Alipay.prototype.create_partner_trade_by_buyer_notify = function(req, res) {
  var self = this;

  var _POST = req.body;
  //计算得出通知验证结果
  var alipayNotify = new AlipayNotify(this.alipay_config);
  //验证消息是否是支付宝发出的合法消息
  alipayNotify.verifyNotify(_POST, function(verify_result) {
    if (verify_result) { //验证成功
      //商户订单号
      var out_trade_no = _POST['out_trade_no'];
      //支付宝交易号
      var trade_no = _POST['trade_no'];
      //交易状态
      var trade_status = _POST['trade_status'];

      if (trade_status == 'WAIT_BUYER_PAY') {
        self.emit('create_partner_trade_by_buyer_wait_buyer_pay',
          out_trade_no, trade_no);
      } else if (trade_status == 'WAIT_SELLER_SEND_GOODS') {
        self.emit('create_partner_trade_by_buyer_wait_seller_send_goods',
          out_trade_no, trade_no);
      } else if (trade_status == 'WAIT_BUYER_CONFIRM_GOODS') {
        self.emit(
          'create_partner_trade_by_buyer_wait_buyer_confirm_goods',
          out_trade_no, trade_no);
      } else if (trade_status == 'TRADE_FINISHED') {
        self.emit('create_partner_trade_by_buyer_trade_finished',
          out_trade_no, trade_no);
      }

      res.send("success");
    } else {
      //验证失败
      self.emit("verify_fail");
      res.send("fail");
    }
  });
}

Alipay.prototype.create_direct_pay_by_user_notify = function() {
  var self = this;
  var _POST = req.body;
  //计算得出通知验证结果
  var alipayNotify = new AlipayNotify(this.alipay_config);
  //验证消息是否是支付宝发出的合法消息
  alipayNotify.verifyNotify(_POST, function(verify_result) {
    if (verify_result) { //验证成功
      //商户订单号
      var out_trade_no = _POST['out_trade_no'];
      //支付宝交易号
      var trade_no = _POST['trade_no'];
      //交易状态
      var trade_status = _POST['trade_status'];

      if (trade_status == 'TRADE_FINISHED') {
        self.emit('create_direct_pay_by_user_trade_finished',
          out_trade_no, trade_no,
          function() {
            res.send("success"); //请不要修改或删除
          });
      } else if (trade_status == 'TRADE_SUCCESS') {
        self.emit('create_direct_pay_by_user_trade_success', out_trade_no,
          trade_no,
          function() {
            res.send("success"); //请不要修改或删除
          });
      }
    } else {
      //验证失败
      self.emit("verify_fail");
      res.send("fail");
    }
  });
}

Alipay.prototype.create_direct_pay_by_user_return = function*(ctx) {
  var self = this;

  var _GET = ctx.query;
  //计算得出通知验证结果
  var alipayNotify = new AlipayNotify(this.alipay_config);
  var verify_result = yield alipayNotify.verifyReturn(_GET);
  if (verify_result) { //验证成功

    //商户订单号
    var out_trade_no = _GET['out_trade_no'];
    //支付宝交易号
    var trade_no = _GET['trade_no'];
    //交易状态
    var trade_status = _GET['trade_status'];

    //http://localhost:8089/alipay/create_direct_pay_by_user/return_url?body=1&buyer_email=937257166%40qq.com&buyer_id=2088902389003345&exterface=create_direct_pay_by_user&is_success=T&notify_id=RqPnCoPT3K9%252Fvwbh3InWeOJE4RslIJAm2VLysouoMwlsNewPkZ%252BJqm8jRn7pD8692aLo&notify_time=2016-10-16+22%3A09%3A16&notify_type=trade_status_sync&out_trade_no=d602337c-8a29-4785-8110-f2c0f27003e5&payment_type=1&seller_email=oauth%40dodora.cn&seller_id=2088421937560320&subject=IDE&total_fee=0.01&trade_no=2016101621001004340286786461&trade_status=TRADE_SUCCESS&sign=bdc91ce835fc64d51b251b0d36b2dc13&sign_type=MD5
    //
    // http://localhost:8089/alipay/create_direct_pay_by_user/return_url?
    // body=1&buyer_email=937257166%40qq.com&buyer_id=2088902389003345&exterface=create_direct_pay_by_user
    // &is_success=T&notify_id=RqPnCoPT3K9%252Fvwbh3InWeOJE4RslIJAm2VLysouoMwlsNewPkZ%252BJqm8jRn7pD8692aLo
    // &notify_time=2016-10-16+22%3A09%3A16&notify_type=trade_status_sync
    // &out_trade_no=d602337c-8a29-4785-8110-f2c0f27003e5&payment_type=1
    // &seller_email=oauth%40dodora.cn&seller_id=2088421937560320&subject=IDE
    // &total_fee=0.01&trade_no=2016101621001004340286786461&trade_status=TRADE_SUCCESS
    // &sign=bdc91ce835fc64d51b251b0d36b2dc13&sign_type=MD5
    if (trade_status == 'TRADE_FINISHED') {
      self.emit('create_direct_pay_by_user_trade_finished',
        out_trade_no, trade_no);
    } else if (trade_status == 'TRADE_SUCCESS') {
      // self.emit('create_direct_pay_by_user_trade_success', out_trade_no,
      //   trade_no);
      yield order.order_success(out_trade_no, ctx, 'alipay');
    }
  } else {
    //验证失败
    self.emit("verify_fail");
    ctx.body = 'fail';
  }

}

//报关接口
Alipay.prototype.alipay_acquire_customs = function(data) {
  var self = this;
  //建立请求
  var alipaySubmit = new AlipaySubmit(this.alipay_config);

  //构造要请求的参数数组，无需改动
  var parameter = {
    service: 'alipay.acquire.customs',
    partner: this.alipay_config.partner,
    trade_no: data.trade_no,
    out_request_no: data.out_request_no,
    merchant_customs_code: data.merchant_customs_code,
    amount: data.amount,
    customs_place: data.customs_place,
    merchant_customs_name: data.merchant_customs_name,
    is_split: data.is_split || '',
    sub_out_biz_no: data.sub_out_biz_no || '',
    _input_charset: this.alipay_config['input_charset'].toLowerCase().trim()
  };

  var url = alipaySubmit.buildRequestForm(parameter),
    parsed_url = require('url').parse(url);
  return new Promise(function(resolve, reject) {
    var req = https.request({
      hostname: parsed_url.host,
      path: parsed_url.path,
      method: 'GET'
    }, function(res) {
      var responseText = '';
      res.on('data', function(chunk) {
        responseText += chunk;
      });
      res.on('end', function() {
        xml2js.parseString(responseText, {
          explicitArray: false
        }, function(err, result) {
          if (result.alipay.is_success === 'T') {
            var response = result.alipay.response,
              trade_no = response.alipay.trade_no;
            if (response.alipay.result_code === 'SUCCESS') {
              resolve(trade_no);
              // self.emit('alipay_acquire_customs_success', trade_no);
            } else {
              reject(response.alipay.detail_error_des);
              // self.emit('alipay_acquire_customs_fail', trade_no, response.alipay.detail_error_des);
            }
          } else {
            reject(result.alipay.error);
            // self.emit('alipay_acquire_customs_fail', trade_no, response.alipay.detail_error_des);
          }
        })
      });
    })
    req.end();
  })
}

exports.Alipay = Alipay;
