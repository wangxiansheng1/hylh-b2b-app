define('lehu.h5.page.service', [
		'can',
		'zepto',
		'fastclick',
		'lehu.util',
		'lehu.h5.framework.comm',
		'lehu.h5.business.config',
		'lehu.hybrid',
		'lehu.h5.api',
		"imgLazyLoad",

		'lehu.h5.header.footer',
		'lehu.h5.header.download',

		'text!template_components_service'
	],

	function(can, $, Fastclick, util, LHFrameworkComm, LHConfig, LHHybrid, LHAPI, imgLazyLoad, LHFooter, LHDownload, template_components_service) {
		'use strict';

		Fastclick.attach(document.body);

		var Service = can.Control.extend({

			/**
			 * [init 初始化]
			 * @param  {[type]} element 元素
			 * @param  {[type]} options 选项
			 */
			init: function(element, options) {
				var that = this;

				var renderList = can.mustache(template_components_service);
				var html = renderList(this.options);
				this.element.html(html);

				//img图片懒加载
				$.imgLazyLoad();

				//去除导航
				this.deleteNav();

				var param = can.deparam(window.location.search.substr(1));

				if(param.hyfrom == 'app') {
					if(util.isMobile.iOS()) {
						//标题
						var jsonParams = {
							'funName': 'title_fun',
							'params': {
								"title": "汇银乐虎供应链介绍"
							}
						};
						LHHybrid.nativeFun(jsonParams);
					}
				}
			},

			deleteNav: function() {
				var param = can.deparam(window.location.search.substr(1));
				if(param.hyfrom || util.isMobile.QQ() || util.isMobile.WeChat()) {
					$('.header').hide();
					$('.fullgive_ad').css('margin-top', 0);
					return false;
				}
			},

			'.back click': function() {
				history.go(-1);
			}
		});

		new LHFooter();
		new Service('#content');

	});