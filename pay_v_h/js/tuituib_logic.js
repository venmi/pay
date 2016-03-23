$(document).ready(function(){
		var req_params = {};
		req_params.amount = '0';
		
		var contentH = $("#content_li>li>h2");
		for(var i=0;i<contentH.length;i++){
			
				$(contentH[i]).bind("click",function(){
					$(this).parent().siblings().css({"background":"","color":"#ffbc4a"});
					$(this).parent().siblings().find("p").css("border-right","1px solid #ffe3b8");
					$(this).parent().siblings().find("input").css("color","#ffbc4a");
									
					$(this).parent().css({"background":"#ffbc4a","color":"#FFF"});
					$(this).find("p").css("border-right","1px solid #fff");
					$(this).parent().find("input").css("color","#fff");

					if ($(this).attr('value') == '') {
						return;
					}

					req_params.amount = $(this).attr('value') || $("#count").attr('value');
					$('#amount').html(' ' + req_params.amount + ' ');
				});
						
		}
		
		$("#count").on('input',function(e){
			var count = $.trim($('#count').val());

			if (!/^[1-9]\d*$/.test(count)) {
				$("#count").attr("value",'');
				$('#amount').html(' 0 ');
				return;
			}
			
			if (parseInt(count) > tuitui.sdk.config.max_buy_count) {
				$("#count").attr("value", '' + tuitui.sdk.config.max_buy_count);
				$('#amount').html(' '+tuitui.sdk.config.max_buy_count+' ');
				return;
			}
		
			if ($('#count').val() == '') {
				req_params.amount = '0';
				return;
			}

			req_params.amount = $('#count').val();

		    $('#amount').html(' ' + $('#count').val() + ' ');
		});
		
		/* 判断屏幕大小 */
		setInterval(function (){
            var h=document.documentElement.clientHeight;
            if(h < 185){
                $('.footer').css('display','none');
            }else{
                $('.footer').css('display','block');
            }
        },50);
		
		$("#count").blur(function(){
				if ( $.trim($('#count').val()) ==''){
					$("#count").attr("value", tuitui.sdk.local.input_other);
					return;
				} 
						
				req_params.amount = $("#count").val();
				$('#amount').html(' ' + req_params.amount + ' ');
		});
		
		$('#do_pay').click(function() {
			if (req_params.amount != '0' && req_params.amount != '') {
				TTAndroid.requestTuibRecharge(req_params.amount);
				location.href = String.format('{0}{1}', $.getDoPayPage(), location.search);
			} else {
				$.showToast(tuitui.sdk.local.choose_tuituib_count);
			}
		});
		
	});