//页面rem
(function(doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			var clientWidth = $(".nwrapper").width();
			/*if (!clientWidth) return;*/
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';

		};
	if(!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var userNameLength = 0;
var captchaLength = 0;

$('.txt-phone').on('keyup', function() {

	userNameLength = $(this).length;
	enableLogin();
});

$('.txt-sms-captcha').on('keyup', function() {
	captchaLength = $(this).length;
	enableLogin();
})

function enableLogin() {
	if(userNameLength > 0 && captchaLength > 0) {
		$('.btn-login').removeClass('btn-disabled');
	} else {
		$('.btn-login').addClass('btn-disabled');
	}
};

function countdown(time) {
	setTimeout(function() {
		if(time > 0) {
			time--;
			$(this).find('.btn-retransmit').text(time + 's后重发').addClass('btn-retransmit-disabled');
			that.countdown.call(that, time);
		} else {
			$(this).find('.btn-retransmit').text('获取验证码').removeClass('btn-retransmit-disabled');
		}
	}, 1000);
}

function checkmobile(mobile) {
	if(!mobile) {
		return false;
	}
	return /^1\d{10}$/.test(mobile);
}

$(".txt-phone").on('focus', function() {
	$(".item-tips").css("display", "none");
})

$(".txt-sms-captcha").on('focus', function() {
	$(".item-tips").css("display", "none");
})

$(".reg-protocol i").on('click', function() {
	$(".reg-protocol").toggleClass('reg-protocol-selected');
})

$(".btn-retransmit").on('click', function() {

	/*	if($(this).hasClass("btn-retransmit-disabled")) {
			return false;
		}*/

	var userName = $(".txt-phone").val();

	if(userName == "") {
		$(".err-msg").text("手机号码不能为空").parent().css("display", "block");
		return false;
	}

	if(!checkmobile(userName)) {
		$(".err-msg").text("手机号码格式错误").parent().css("display", "block");
		return false;
	}

	/*$.post("http://121.196.208.98:28080/mobile-web-user/ws/mobile/v1/user/getIdentifyingCode", {
			phoneCode: userName,
		},
		function(data) {
			console.log(data);
			if(data.code == 1) {
				countdown.call(60);
				$(".item-tips").css("display", "none");
			} else {
				$(".err-msg").text("短信验证码发送失败").parent().css("display", "block");
			}
		});*/

	var settings = {
		type: 'POST',
		url: 'http://121.196.208.98:28080/mobile-web-user/ws/mobile/v1/user/getIdentifyingCode?sign=' + encription(this.param),
		cache: false,
		dataType: "json",
		data: JSON.stringify({
			phoneCode: userName,
		}),
		headers: {
			"Content-Type":   "application/json"
		},
		success: function(data) {
			console.log(data);
			if(data.code == 1) {
				countdown.call(60);
				$(".item-tips").css("display", "none");
			} else {
				$(".err-msg").text("短信验证码发送失败").parent().css("display", "block");
			}
		}
	}
	$.ajax(settings);

});

//md5加密
function encription(params) {
	var Keyboard = '00BE62201707188DE8A63ZGH66D46yTXNREG1423';
	var mdName = 'key=' + Keyboard + '&body=' + JSON.stringify(params);
	return md5(mdName);
}

$(".btn-login").on('click', function() {

	if($(this).hasClass('btn-disabled')) {
		return false;
	}

	var userName = $(".txt-phone").val();
	var captcha = $(".txt-sms-captcha").val();

	if(userName == "") {
		$(".err-msg").text("手机号码不能为空!").parent().css("display", "block");
		return false;
	}
	if(captcha == "") {
		$(".err-msg").text("验证码不能为空!").parent().css("display", "block")
		return false;
	}

	if(!checkmobile(userName)) {
		$(".err-msg").text("手机号码格式错误!").parent().css("display", "block");
		return false;
	}

	var param = {
		'phoneCode': userName,
		'identifyingcode': captcha,
	};

	$.post("http://121.196.208.98:28080/mobile-web-user/ws/mobile/v1/recommend/login", {
		param: param,
	}, function(data) {
		if(data.code == 1) {
			window.location.href = referee.html;
		} else {
			$(".err-msg").text(data.msg).parent().css("display", "block");
		}
	});

});