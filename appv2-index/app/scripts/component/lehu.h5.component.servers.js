define('lehu.h5.component.servers', [
        'zepto',
        'can',
        'lehu.h5.business.config',
        'lehu.util',
        'lehu.h5.api',
        'lehu.hybrid',
        'underscore',
        'md5',

        'tripledes',
        'modeecb',
        'lehu.utils.busizutil',

        'text!template_components_servers'
    ],

    function($, can, LHConfig, util, LHAPI, LHHybrid, _, md5,
              tripledes, modeecb, busizutil,
             template_components_servers) {
        'use strict';

        return can.Control.extend({

            init: function() {

                this.initData();

                this.render();
            },

            initData: function() {
                this.URL = LHHybrid.getUrl();
            },

            render: function() {
                var renderFn = can.view.mustache(template_components_servers);
                var html = renderFn(this.options.data, this.helpers);
                this.element.html(html);

            //    去除导航
                this.deleteNav();

            },

            deleteNav:function () {
                var param = can.deparam(window.location.search.substr(1));
                if(param.hyfrom == "app"){
                    $('.header').hide();
                    return false;
                }
            },


            '.back click': function() {
                    history.go(-1);
            },

        });
    });