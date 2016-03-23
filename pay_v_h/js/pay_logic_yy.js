var pay_params = $.getPayParams();
var req_params = {};
req_params.select_index = 0;

$.switchTab = function (index) {
			var oBtn = document.getElementById('3_1').getElementsByTagName('li');
			var foot =document.getElementById('foot').children;

			var c = 'c_btn';

			for (var k=0; k < oBtn.length; k++)
			{
				oBtn[k].className = c;
				oBtn[k].style.color='#616161';

				if (tuitui.sdk.screenType == tuitui.sdk.PORTRAIT) {
					oBtn[k].style.borderBottom='3px solid #fff';
				} else {
					oBtn[k].style.borderRight='3px solid #fff';
				}


				if (!$($('.footerimg')[k]).hasClass('hide')) {
					$($('.footerimg')[k]).addClass('hide');
				} 
			}
			this.className =c+' '+'click_btn';
			
			var oDiv =document.getElementById('tab_content').children;
			$.each(oDiv,function(n,value) {
				value.style.display = 'none';
			});
			$('#content_' + oBtn[index].id).css('display', 'block');

			oBtn[index].style.color='#2196f3';
			if (tuitui.sdk.screenType == tuitui.sdk.PORTRAIT) {
				oBtn[index].style.borderBottom='3px solid #2196f3';
			} else {
				oBtn[index].style.borderRight='3px solid #2196f3';
			}
			
			$.pageGuideItemClick($(".page_guide_item_text>li")[index]);
			
			$($('.footerimg')[index]).removeClass('hide');

			req_params.select_index = index;
};

$.switchTabByName = function(name) {
	$.each(pay_params['webpay_paytype_url'],function(n,value) {
		if (value['key'] == name) {
			$.switchTab(n);
			return;
		}
	});
}

$.pageGuideItemClick = function(item) {
	var checkbjs = $(".page_guide_item_text>li>span>img[click=clicked]");
	if(checkbjs.length > 0){	
		var checkbj = checkbjs[0];
		var checSrc = $(checkbj).attr("src");
		if(checSrc.indexOf("after") != -1){
			var checPre = checSrc.toString().substring(0,checSrc.toString().lastIndexOf("after")-1);
			var checSup = checSrc.toString().substring(checSrc.toString().lastIndexOf("after")+5,checSrc.length);
			$(checkbj).attr("src",checPre+checSup).removeAttr("click");
		}
	}
			
	var clickSrc = $(item).find('img').attr("src");
	var iPre = clickSrc.toString().substring(0,clickSrc.toString().lastIndexOf("."));
	var iSup = clickSrc.toString().substring(clickSrc.toString().lastIndexOf("."),clickSrc.length);
	$(item).find('img').attr("src",iPre+"_after"+iSup).attr("click","clicked");		
}

$(document).ready(function(){		
		$(".fuc").click(function() {
			$(".fuc").hide();
		});
		
		if ($(".fuc").length != 0) {
			if (tuitui.sdk.accessed) {
				$(".fuc").hide();
			} else {
				$('.func').show();
			}
		}
	
		var tabItem = "", footItem = "";  
		$.each(pay_params['webpay_paytype_url'],function(n,value) {
			
			var tabItemStyle = 'border-bottom';
			if (tuitui.sdk.screenType == tuitui.sdk.LANDSCAPE) {
				tabItemStyle = 'border-right';
			}

			var tabItemTpl1 = '<li class="c_btn click_btn" id = "{0}" style="{1}: 3px solid #2196f3; color: #2196f3;"><span><img src="images/{2}_coin_after.png" click="clicked"/></span><p>{3}</p></li>';
			var tabItemTpl2 = '<li class="c_btn" id="{0}"><span><img src="images/{1}_coin.png"/></span><p>{2}</p></li>';

			var footItemTpl1 = '<div class="footerimg"><a href="javascript:;" id="do_pay_{0}"><input class="footerimgs" type="button" value="{1}"></a></div>';
			var footItemTpl2 = '<div class="footerimg hide"><a href="javascript:;" id="do_pay_{0}"><input class="footerimgs" type="button" value="{1}"></a></div>';

			if (n == 0) {
				tabItem += String.format(tabItemTpl1, value['key'], tabItemStyle, value['key'], value['name']);
				footItem += String.format(footItemTpl1, value['key'], tuitui.sdk.local.pay[value['key']]['go_pay']);
			} else {
				tabItem += String.format(tabItemTpl2, value['key'], value['key'], value['name']);
				footItem += String.format(footItemTpl2, value['key'], tuitui.sdk.local.pay[value['key']]['go_pay']);	
			}

		});

		var rechargeItem = '';
		$.each(tuitui.sdk.config.pay_recharge_limit,function(n,value) {
			var recharegeItemTpl = '<li value="{0}"><p><i>￥</i>{1}</p><span>{2}</span></li>';

			if (pay_params.amount <= value * 100) {
				rechargeItem += String.format(recharegeItemTpl, value, value, tuitui.sdk.local.recharege_card);
			}
			
		});
	
		$('#content_li').html(rechargeItem);

		$('.page_guide_item_text').html(tabItem);
		$('#foot').html(footItem);

		$('.user_name').text(pay_params.username);
		$('.product_name').text(pay_params.product_name);
		$('.amount').text(' ' + pay_params.amount/100 + ' ');
		$('.balance').text(' ' + pay_params.balance/100 + ' ');
		
		$.updateTuibState = function() {
			if (pay_params.amount > pay_params.balance) {
				$('#do_pay_tuib>input')[0].value = tuitui.sdk.local.not_enough_tuituibi;
			} else {
				$('#do_pay_tuib>input')[0].value = tuitui.sdk.local.right_to_pay;
			}
		}

		if ($('#do_pay_tuib>input').length != 0) {
			$.updateTuibState();
		}
		
		$(".close").click(function(){
			$(".assshow").hide();
			$(".aass").css({"position":"","left":"","top":""});
		})
		
		$(".shuom a").click(function(){
			$(".assshow").show();
			$(".aass").css({"position":"fixed","left":"0px","top":"0px"});
		})

		
		/*$("#content_li>li>a>img").bind("click",function(){
			var checkedObjs = $("#content_li>li>a>img[click=clicked]");
			if(checkedObjs.length > 0){	
				var checkedObj = checkedObjs[0];
				var checkedSrc = $(checkedObj).attr("src");
				if(checkedSrc.indexOf("after") != -1){
					var checkedPre = checkedSrc.toString().substring(0,checkedSrc.toString().lastIndexOf("after")-1);
					var checkedSup = checkedSrc.toString().substring(checkedSrc.toString().lastIndexOf("after")+5,checkedSrc.length);
					$(checkedObj).attr("src",checkedPre+checkedSup).removeAttr("click");
				}
			}
			
			var clickImgSrc = $(this).attr("src");
			var imgPre = clickImgSrc.toString().substring(0,clickImgSrc.toString().lastIndexOf("."));
			var imgSup = clickImgSrc.toString().substring(clickImgSrc.toString().lastIndexOf("."),clickImgSrc.length);
			$(this).attr("src",imgPre+"_after"+imgSup).attr("click","clicked");

			pay_params['webpay_paytype_url'][req_params.select_index]['card_money'] = $(this).attr("alt");

		});*/
		
		
		/* 充值卡金额 */
		var contentH = $("#content_li>li");
		for(var i=0;i<contentH.length;i++){
				
				$(contentH[i]).bind("click",function(){
					$(this).addClass("intro");
					$.each($(this).siblings(), function(n, value) {
						$(value).find("p").css({"border-right":"1px solid #ffbc4a","color":"#ffbc4a"});
						$(value).find("span").css("color","#ffbc4a");
						$(value).removeClass();
					});

					$(this).find("p").css({"border-right":"1px solid #fff","color":"#fff"});
					$(this).find("span").css("color","#fff");

					pay_params['webpay_paytype_url'][req_params.select_index]['card_money'] = $(this).attr("value");
				});		
		}
		
//		$(".input_text").click(function(){
//			$(document).scrollTop(700);
//		})
		
		var oBtn = document.getElementById('3_1').getElementsByTagName('li');
		var i=0;
		for(i=0;i<oBtn.length;i++)
		{
				oBtn[i].index=i;
				oBtn[i].onclick = function () {
					$.switchTab(this.index);
				}  
		}
		

		if (tuitui.sdk.screenType == tuitui.sdk.PORTRAIT) {
			/* 支付方式 */
			for(i=0; i<oBtn.length; i++){
				$("#3_1").css('width' , (i+1)*20+'%');
				$("#3_1 li").css('width' , 1 /(i+1) *100+'%');
				$("#3_1 li:last").css('background' , 'none');	
			}
		}

		if ($('#do_pay_alipay').length != 0) {

			$('#do_pay_alipay').click(function(){
				TTAndroid.requestAlipay();
			});

		}
		
		if ($('#do_pay_unionpay').length != 0) {

			$('#do_pay_unionpay').click(function(){
				TTAndroid.requestAibeiPay("union");
			});
			
		}

		if ($('#do_pay_weixin').length != 0) {

			$('#do_pay_weixin').click(function(){
				TTAndroid.requestAibeiPay("wechat");
			});
			
		}

	
		if ($('#do_pay_duanxin').length != 0) {

			$('#do_pay_duanxin').click(function(){
				TTAndroid.requestAibeiPay("sms");
			});
			
		}
	
		var retryWaitingCount = 0;
		
		function waitingPayResult() {
			retryWaitingCount++;
			
			$.ajax({
				url: String.format('{0}{1}', pay_params['sdk_domain'], '/mobile/pay/waiting_for_pay_result'),
				data: {
					app_id:pay_params['app_id'],
					user_id:pay_params['user_id'],
					channel_id:pay_params['channel_id'],
					login_token:pay_params['token'],
					sid:pay_params['order_id'],
				},
				type: "POST",
				dataType: 'JSONP',
				success:function(data) {
					//$.showToast(JSON.stringify(data));

					if (data.ret == 0) {
						TTAndroid.closeLoadingDialog();
						TTAndroid.notifyPaymentSuccess();
					} else if (data.ret == -19044) {
						if (retryWaitingCount < tuitui.sdk.config.pay_waiting_retry) {
							setTimeout(function(){waitingPayResult();}, 2000); 
						} else {
							TTAndroid.closeLoadingDialog();
							$.showToast(tuitui.sdk.local.pay_waiting_timeout, tuitui.sdk.HINT_DIALOG, true);
						}
						
					} else {
						TTAndroid.closeLoadingDialog();
						$.showToast(data.msg, tuitui.sdk.HINT_DIALOG, false);
					}
				},
				error:function(er){
					TTAndroid.closeLoadingDialog();
					$.showToast(er, tuitui.sdk.HINT_DIALOG, true);
				}
			});
		}
		
		if ($('#do_pay_shenzhoufu').length != 0) {

			$('#content_shenzhoufu .xuhao')[0].onkeydown = $.inputChange2Space;  
            $('#content_shenzhoufu .xuhao')[0].onkeyup = $.inputChange2Space;  
            $('#content_shenzhoufu .xuhao')[0].onkeypress = $.inputChange2Space; 

            $('#content_shenzhoufu .password')[0].onkeydown = $.inputChange2Space;  
            $('#content_shenzhoufu .password')[0].onkeyup = $.inputChange2Space;  
            $('#content_shenzhoufu .password')[0].onkeypress = $.inputChange2Space;  

			$('#do_pay_shenzhoufu').click(function(){

				var sn = $('#content_shenzhoufu .xuhao')[0].value;
				var password = $('#content_shenzhoufu .password')[0].value;
				
				sn = $.trim(sn.replace(/\s{1,}/g,"")); 
				password = $.trim(password.replace(/\s{1,}/g,"")); 

				if (pay_params['webpay_paytype_url'][req_params.select_index]['card_money'] == '0') {
					$.showToast(tuitui.sdk.local.empty_card_money, tuitui.sdk.ALERT_DIALOG);
					return;
				} else if (sn == tuitui.sdk.local.empty_sn || sn.length == 0) {
					$.showToast(tuitui.sdk.local.empty_sn, tuitui.sdk.ALERT_DIALOG);
					return;
				} else if (password == tuitui.sdk.local.empty_password || password.length == 0) {
					$.showToast(tuitui.sdk.local.empty_password, tuitui.sdk.ALERT_DIALOG);
					return;
				} 
				
				var rechargeCardType = $.judgePayRechargeCardType(sn, password);
				
				if (rechargeCardType == "") {
					$.showToast(tuitui.sdk.local.recharge_card_format, tuitui.sdk.ALERT_DIALOG);
					return;
				}
			
				TTAndroid.showLoadingDialog();
			
				$.ajax({
					headers: {
						"Referer": location.host,
					},
					url: String.format('{0}{1}', pay_params['sdk_domain'], pay_params['webpay_paytype_url'][req_params.select_index].uri), 
					data: {
						app_id:pay_params['app_id'],
						user_id:pay_params['user_id'],
						channel_id:pay_params['channel_id'],
						login_token:pay_params['token'],
						sid:pay_params['order_id'],
						pid:pay_params['webpay_paytype_url'][req_params.select_index].pid,
						card_money:pay_params['webpay_paytype_url'][req_params.select_index].card_money,
						sn:sn,
						password:password
					},
					type: "POST",
					dataType: 'JSONP',
					success:function(data) {
						if (data.ret == 0 && data.data.pay_ret == 0) {
							waitingPayResult();
						} else {
							TTAndroid.closeLoadingDialog();
							
							if (data.ret == 0) {
								$.showToast(data.data.pay_msg, tuitui.sdk.HINT_DIALOG, false);
							} else {
								$.showToast(data.msg, tuitui.sdk.HINT_DIALOG, false);
							}
						}
					},
					error:function(er){
						TTAndroid.closeLoadingDialog();
						$.showToast(er, tuitui.sdk.HINT_DIALOG, true);
					}
				});
			});
		}
		
		if ($('#do_pay_tuib').length != 0) {
			$('#do_pay_tuib').click(function(){
				if (pay_params.amount <= pay_params.balance) {
					TTAndroid.requestTuibPay(pay_params['webpay_paytype_url'][req_params.select_index]['pid']);
				} else {
					location.href = String.format('{0}{1}', $.getBuyTuibPage(), location.search);
				}
			});
		}
		
		$('#get_user_currency').click(function(){

			if ($($('.footerimg')[index]).hasClass('hide')) {
				$('.footerimg')[2].class = 'footerimg';
			} else {
				$('.footerimg')[2].class = 'footerimg hide';
			}
			

			TTAndroid.showLoadingDialog();
			
			$.ajax({
				headers: {
					"Referer": location.host,
				},
				url: String.format('{0}{1}', pay_params['sdk_domain'], '/mobile/pay/get_user_currency'),
				data:{
					app_id:pay_params['app_id'],
					user_id:pay_params['user_id'],
					channel_id:pay_params['channel_id'],
					login_token:pay_params['token']
				},
				type: "POST",
				dataType: 'JSONP',
				success:function(data) {
					TTAndroid.closeLoadingDialog();
					if (data.ret == 0) {
						var balance = parseInt(data.data['balance']*100); 
						pay_params['balance'] = balance;
						$('.balance').text(' ' + pay_params.balance/100 + ' ');

						$.updateTuibState();
					} else {
						$.showToast(data.msg, tuitui.sdk.ALERT_DIALOG);
					}
				},
				error:function(er){
					TTAndroid.closeLoadingDialog();
					//$.showToast(er);
				}
			});
			
		});
	});