define('lehu.h5.page.headlines', [
        'can',
        'zepto',
        'fastclick',
        'lehu.util',
        'lehu.h5.framework.comm',
        'lehu.h5.business.config',
        'lehu.hybrid',
        'lehu.h5.api',
        'lehu.utils.busizutil',

        'lehu.h5.header.footer',

        'text!template_components_headlines'
    ],

    function(can, $, Fastclick, util, LHFrameworkComm, LHConfig, LHHybrid, LHAPI, busizutil,
        LHFooter,
        template_page_headlines) {
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

                var renderList = can.mustache(template_page_headlines);
                var html = renderList(this.options);
                this.element.html(html);
                var param = can.deparam(window.location.search.substr(1));
                //    去除导航
                this.deleteNav();
                var api = new LHAPI({
                    url: that.URL + '/mobile-web-market/ws/mobile/v1/marketing/getLehuTop',
                    data: {},
                    method: 'get'
                });
                api.sendRequest()
                    .done(function(data) {

                        if(data.code == 1){
                            if(data.response == ""){
                                return false;
                            }
                            var CONTENT = data.response;
                            var html = "";
                            for(var i =0; i <CONTENT.length; i++){
                                if( CONTENT[i].id == param.id){
                                    html += '<p>' + CONTENT[i].begintime + '</p><p>' + CONTENT[i].articleTitle + '</p>';
                                    $('.line-content-title').empty().append(html);

                                    if(CONTENT[i].articleContent.indexOf('src="http://') > -1){
                                        CONTENT[i].articleContent = CONTENT[i].articleContent.replace(/src="http:/,'src="https:');
                                    }
                                    //安卓引用图片后面加webp格式后缀
                                    if (util.isMobile.Android()) {

                                        if(CONTENT[i].articleContent.indexOf('upaiyun') > -1){
                                            //JPG.PNG.WOFF.GIF
                                            if(CONTENT[i].articleContent.indexOf('.jpg"') > -1){
                                                CONTENT[i].articleContent = CONTENT[i].articleContent.replace(/.jpg"/, '.jpg!/format/webp"');
                                            }
                                            if(CONTENT[i].articleContent.indexOf('.png"') > -1){
                                                CONTENT[i].articleContent = CONTENT[i].articleContent.replace(/.png"/, '.png!/format/webp"');
                                            }
                                            if(CONTENT[i].articleContent.indexOf('.gif"') > -1){
                                                CONTENT[i].articleContent = CONTENT[i].articleContent.replace(/.gif"/, '.gif!/format/webp"');
                                            }
                                        }
                                    }
                                    $('.line-content-detail').html(CONTENT[i].articleContent);
                                    //标题
                                    if(util.isMobile.iOS() || util.isMobile.Android()){
                                        var jsonParams = {
                                            'funName': 'title_fun',
                                            'params': {
                                                "title": CONTENT[i].articleTitle
                                            }
                                        };
                                        LHHybrid.nativeFun(jsonParams);
                                    }
                                    return false;
                                }
                            }

                        }

                    })
                    .fail(function(error) {

                        util.tip("服务器错误！",3000);

                    });

                new LHFooter();
            },

            deleteNav:function () {
                var param = can.deparam(window.location.search.substr(1));
                if(param.hyfrom){
                    $('.header').hide();
                    return false;
                }
            },

            '.back click': function() {
                    history.go(-1);
            }
        });

        new RegisterHelp('#content');
    });