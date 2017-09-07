define('lehu.h5.page.stores', [
		'can',
		'zepto',
		'fastclick',
		'lehu.util',
		'lehu.h5.framework.comm',
		'lehu.h5.business.config',
		'lehu.hybrid',
		'lehu.h5.api',
		'imgLazyLoad',
		'lehu.utils.busizutil',
		'lehu.h5.header.footer',

		'text!template_components_stores'
	],

	function(can, $, Fastclick, util, LHFrameworkComm, LHConfig, LHHybrid, LHAPI, imgLazyLoad, busizutil, LHFooter, template_page_stores) {
		'use strict';

		Fastclick.attach(document.body);

		var RegisterHelp = can.Control.extend({
			
			initData: function() {
				this.URL = busizutil.httpgain();
			},
 			/**
			 * [init 初始化]
			 * @param  {[type]} element 元素
			 * @param  {[type]} options 选项
			 */
			init: function(element, options) {
				var that = this;

				this.initData();

				var renderList = can.mustache(template_page_stores);
				var html = renderList(this.options);
				this.element.html(html);

				var param = can.deparam(window.location.search.substr(1));

				if(param.hyfrom == 'app') {
					if(util.isMobile.iOS()) {
						//标题
						var jsonParams = {
							'funName': 'title_fun',
							'params': {
								"title": "汇银乐虎全球购-门店活动"
							}
						}
						LHHybrid.nativeFun(jsonParams);
					}
				}

				//去除导航
				this.deleteNav();

				var api = new LHAPI({
					url: that.URL + '/mobile-web-market/ws/mobile/v1/marketing/storeActivity',
					data: {},
					method: 'get'
				});
				api.sendRequest()
					.done(function(data) {
						if(data.code == 1) {
							var CONTENT = data.response;
							var html = "";
							for(var i = 0; i < CONTENT.length; i++) {
								html += '<div class="stores-list-box"><img class="lazyload" src="images/big_goods_back.png" data-img="' + CONTENT[i].img + '"  data-url="' + CONTENT[i].url + '"><p>' + CONTENT[i].title + '</p></div>';
							}
							$('.stores-list').empty().append(html);

							//图片懒加载
							$.imgLazyLoad()
						}
					})
					.fail(function(error) {
						util.tip(error.msg);
					});
				new LHFooter();
			},

			deleteNav: function() {
				var param = can.deparam(window.location.search.substr(1));

				if(param.hyfrom) {
					$('.header').hide();
					return false;
				}
			},

			'.stores-list img click': function(element, event) {

				var URLTITLE = element.attr('data-url');
				console.log(URLTITLE);
				window.location.href = element.attr('data-url');

				return false;
			},

			'.back click': function() {
				history.go(-1);
			}
		});

		new RegisterHelp('#content');
	});