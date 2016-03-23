String.prototype.startWith=function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);        
}  

var tuitui = {};
tuitui.sdk = {};
tuitui.sdk.debug = false;
tuitui.sdk.PORTRAIT = 0;
tuitui.sdk.LANDSCAPE = 1;

tuitui.sdk.ALERT_DIALOG = 0;

tuitui.sdk.HINT_DIALOG = 0; 
tuitui.sdk.HINT_CLOSE_DIALOG = 1;
tuitui.sdk.HINT_CONFIRMATION_DIALOG = 2;

tuitui.sdk.config = {	
	max_buy_count : 1000,
	pay_waiting_retry : 10,
	pay_recharge_limit : [10, 20, 30, 50, 100, 200, 300, 500]
};

var filename = location.pathname;
var start = filename.lastIndexOf('/');
if (start != -1) {
	filename = filename.substr(start);
} 

if (filename.startWith('/v_')) {
	tuitui.sdk.screenType = tuitui.sdk.PORTRAIT;
} else {
	tuitui.sdk.screenType = tuitui.sdk.LANDSCAPE;
}

ns=$.initNamespaceStorage('tuitui.sdk.localStorage');

var storage=ns.localStorage;

if (!storage.get('accessed')) {
	tuitui.sdk.accessed = false;
	storage.set('accessed', true);
} else {
	tuitui.sdk.accessed = true;
}

tuitui.sdk.local = {
	empty_sn:'请输入充值卡序列号',
	empty_password:'请输入充值卡密码',
	empty_card_money:'请选择充值卡面额',
	not_enough_tuituibi:'推推币余额不足，去充值',
	right_to_pay:'立即支付',
	input_other:'输入其他',
	choose_tuituib_count:'请选择推推币的个数',
	tuib:'推推币',
	pay_success:'支付成功',
	pay_waiting_timeout:'支付已提交，您可以到订单详情查看支付结果',
	recharge_card_format:'您输入的卡号或密码有误，请检查后重新输入',
	pay:{
		alipay:{
			go_pay:'去支付宝付款'
		},
		shenzhoufu:{
			go_pay:'立即支付'
		},
		tuib:{
			go_pay:'立即支付',
			go_pay_not_enough:'推推币余额不足，去充值'
		},
		unionpay:{
			go_pay:'去银联付款'
		},
		weixin:{
			go_pay:'去微信付款'
		},
		duanxin:{
			go_pay:'立即支付'
		}
	},
	recharege_card:'充值卡'
	
};

if (typeof(TTAndroid) == 'undefined') {
	var TTAndroid = {}
	
	TTAndroid.showToast = function(str) {
		alert(str);
	}

	TTAndroid.showHintDialog = function(str) {
		alert(str);
	}
	
	TTAndroid.requestAlipay =function() {
	}

	TTAndroid.showLoadingDialog = function() {
		
	}
	
	TTAndroid.closeLoadingDialog = function() {
		
	}
	
	TTAndroid.notifyPaymentSuccess = function() {
		
	}
	
	TTAndroid.notifyPaymentFailed = function() {
		
	}
	
	TTAndroid.requestLoadUrl = function() {
		
	}
	
	TTAndroid.requestTuibRecharge = function(amount) {
		
	}
	
	TTAndroid.requestAibeiPay = function(type) {
		
	}
}

String.format = function() {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for ( var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var href = decodeURIComponent(window.location.search);
    var r = href.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};



$.getPayParams = function() {
	var app_id = $.getUrlParam('app_id'); 
	var order_id = $.getUrlParam('order_id'); 
	var product_id = $.getUrlParam('product_id'); 
	var product_name = $.getUrlParam('product_name'); 
	var product_description = $.getUrlParam('product_description');
	var amount = parseInt($.getUrlParam('amount')*100); 
	var user_id = $.getUrlParam('user_id'); 
	var user_name = $.getUrlParam('username'); 
	var token = $.getUrlParam('token'); 
	var balance = parseInt($.getUrlParam('balance')*100); 
	var channel_id = $.getUrlParam('channel_id');
	var webpay_paytype_url;
	var tuib_order = $.getUrlParam('tuib_order'); 
	var sdk_domain = $.getUrlParam('sdk_domain');
	
	if (tuib_order) {
		product_name = String.format('{0} {1}',  amount/100, tuitui.sdk.local.tuib);
		product_description = product_name;
	}
	
	try {
		webpay_paytype_url = $.parseJSON($.getUrlParam('webpay_paytype_url'));
	} catch(e) {
		webpay_paytype_url = [];
	} 
	
	$.each(webpay_paytype_url, function(n, value){
		value['card_money'] = '0';
	});

	var pay_params = {};
	pay_params['app_id'] = app_id;
	pay_params['order_id'] = order_id;
	pay_params['product_id'] = product_id;
	pay_params['product_name'] = product_name;
	pay_params['product_description'] = product_description;
	pay_params['amount'] = amount;
	pay_params['user_id'] = user_id;
	pay_params['username'] = user_name;
	pay_params['token'] = token;
	pay_params['balance'] = balance;
	pay_params['webpay_paytype_url'] = webpay_paytype_url;
	pay_params['channel_id'] = channel_id;
	pay_params['sdk_domain'] = sdk_domain;
	
	return pay_params;
}

$.showHintDialog = function() {
	if (arguments.length == 0 || arguments.length == 1) {
		return;
	}

	var str = arguments[0];
	var type = arguments[1];

	if (type == tuitui.sdk.HINT_DIALOG || 
		type == tuitui.sdk.HINT_CLOSE_DIALOG || 
		type == tuitui.sdk.HINT_CONFIRMATION_DIALOG) {
		TTAndroid.showHintDialog(str, type);
	}
}

$.showToast = function() {
	if (arguments.length == 0)
        return null;
	
    var str = arguments[0];
	TTAndroid.showToast(str);
}

$.showToastSchedule = function(str, time) {
	setTimeout(function() {
		$.showToast(str);
	}, time);
}

$.getDoPayPage = function() {
	if (tuitui.sdk.screenType == tuitui.sdk.PORTRAIT) {
		return 'v_index.html';
	} else {
		return 'h_index.html';
	}
}

$.getBuyTuibPage = function() {
	if (tuitui.sdk.screenType == tuitui.sdk.PORTRAIT) {
		return 'v_tuituib.html';
	} else {
		return 'h_tuituib.html';
	}
}

$.judgePayRechargeCardType = function(sn, password) {
	if (sn.length == 15 && password.length == 19) {
		return "liantong";
	} else if (sn.length == 19 && password.length == 18) {
		return "dianxin";
	} else if ((sn.length == 17 && password.length == 18) ||
			   (sn.length == 16 && password.length == 17) ||
			   (sn.length == 10 && password.length == 8)  ||
			   (sn.length == 16 && password.length == 21)) {
		return "yidong";
	}
	
	return "";
}

$.getPayPid = function(webpay_paytype_url, pay_name) {
	var ret = -1;
	
	$.each(webpay_paytype_url, function(n, value){
		if (value['name'] == pay_name) {
			ret = n;
			return;
		}
	});
	
	return ret;
}

$.getPayKey = function(webpay_paytype_url, index) {
	if (webpay_paytype_url.length == 0 || webpay_paytype_url.length <= index) {
		return '';
	}

	return webpay_paytype_url[index]['key'];
}

$.inputChange2Space = function(e) {
	this.value = this.value.replace(/\D/g, '').replace(/....(?!$)/g, '$& '); //替换空格前4位数字为4位数字加空格   
}