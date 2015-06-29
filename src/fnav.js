/**
 *
 * @authors 张文双 (zhangwenshuang@edaijia-in.cn)
 * @date    2015-06-25 10:15:59
 * @description 侧边栏浮动导航
 * @version 1.0
 */
;
(function() {
    function loadScript(sScriptSrc, callbackfunction) {
        //gets document head element
        var oHead = document.getElementsByTagName('head')[0];
        if (oHead) {
            //creates a new script tag
            var oScript = document.createElement('script');

            //adds src and type attribute to script tag
            oScript.setAttribute('src', sScriptSrc);
            oScript.setAttribute('type', 'text/javascript');

            //calling a function after the js is loaded (IE)
            var loadFunction = function() {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    callbackfunction();
                }
            };
            oScript.onreadystatechange = loadFunction;

            //calling a function after the js is loaded (Firefox)
            oScript.onload = callbackfunction;

            //append the script tag to document head element
            oHead.appendChild(oScript);
        }
    }
    loadScript("http://h5.edaijia.cn/core/libs/jquery.min.js", function() {
        var FNav = function(opts) {
            this.opts = opts || {};
            this.init();
        };
        FNav.prototype = {
            defaults: {
                rootLen: 0,
                cIndex: 0,
                container: "<div id='edj-v2-hnav' class='edj-v2-hnav'><img class='edj-v2-logo' src='SLogo.png'/><form title='可输入订单号、手机号、司机工号' target='mainFrame' action='http://www.d.edaijia.cn/v2/index.php?r=system/search' method='get'><input type='hidden' value='system/search' name='r'><div><img src='Icon_Search.png' id='edj_v2_submit'/><input id='edj-v2-search' placeholder='司机/订单/客户'/></div></form></div><div id='edj-v2-fnav-box' class='edj-v2-fnav-box'><ul class='edj-v2-fnavs'></ul><div id='edj-v2-fnav-switch' class='edj-v2-fnav-switch'><div class='edj-v2-fnav-btn'></div></div></div>"
            }, //参数配置
            init: function() {
                var that = this;
                window.defaultsCountIndex = 0;
                that.render();
                that.bindEvts();
            },
            render: function() {
                var that = this,
                    listData = that.opts.NLData || [],
                    listHtml = "";
                if (listData.length > 0) {
                    listHtml = that.getNavHtml(listData);
                    $.when($("body").append(that.defaults.container)).then(function() {
                        $("#edj-v2-fnav-box > ul").html(listHtml);
                    });
                }
            },
            getNavHtml: function(lstData) {
                var that = this,
                    lstData = lstData || [],
                    resHtml = "",
                    item = {},
                    isRootClass = that.defaults && that.defaults.cIndex == 0 ? " root-branch" : "";
                for (var i = 0, len = lstData.length; i < len; i++) {
                    item = lstData[i];
                    if (item.hasSub) {
                        if (item.className) {
                            resHtml += "<li class='tree-branch " + isRootClass + "'><div><span class='edj-v2-ico-nav " + item.className + "'></span><span class='edj-v2-tree-title'>" + item.label + "</span><span class='right-arr'></span></div><ul>" + arguments.callee(item.navList) + "</ul></li>";
                        } else {
                            resHtml += "<li class='tree-branch " + isRootClass + "'><div><span class='edj-v2-tree-title'>" + item.label + "</span><span class='right-arr'></span></div><ul>" + arguments.callee(item.navList) + "</ul></li>";
                        }
                    } else {
                        resHtml += "<li class='tree-leaf'><a href='" + item.link + "'>" + item.label + "</a></li>"
                    }
                }
                that.defaults && that.defaults.cIndex++;
                return resHtml;
            },
            bindEvts: function() {
                $("body").delegate("#edj-v2-fnav-switch", "click", function() {
                    var btn = $(this).find(".edj-v2-fnav-btn");
                    var treat = $("#edj-v2-fnav-box");
                    var cli = $(".edj-v2-fnavs > li div"),
                        pcli = cli.parent(),
                        ev2hna = $("#edj-v2-hnav");
                    if (treat.hasClass("edj-v2-fnav-box-exp")) {
                        treat.removeClass("edj-v2-fnav-box-exp");
                        btn.removeClass("edj-v2-fnav-active");
                        treat.find(".edj-v2-fnavs .edj-v2-tree-title").css("display", "none");
                        pcli.removeClass("tree-branch-show");
                        cli.siblings("ul").hide();
                        cli.find("span.right-arr").removeClass("active-arr").hide();
                        ev2hna.find("img.edj-v2-logo").attr("src", "SLogo.png").css({
                            "width": "28px",
                            "marginLeft": "11px"
                        });;
                    } else {
                        treat.addClass("edj-v2-fnav-box-exp");
                        btn.addClass("edj-v2-fnav-active");
                        treat.find(".edj-v2-fnavs .edj-v2-tree-title").css("display", "inline-block");
                        cli.find("span.right-arr").show();
                        ev2hna.find("img.edj-v2-logo").attr("src", "Logo.png").css({
                            "width": "auto",
                            "marginLeft": "50px"
                        });
                    }
                }).delegate(".edj-v2-fnavs div", "click", function() {
                    if ($("#edj-v2-fnav-box").hasClass("edj-v2-fnav-box-exp")) {
                        var cli = $(this),
                            pcli = cli.parent();
                        if (pcli.hasClass("tree-branch")) { // Branch
                            // 树枝节点
                            if (pcli.hasClass("tree-branch-show")) {
                                cli.find("span.right-arr").removeClass("active-arr");
                                cli.siblings("ul").hide();
                                pcli.removeClass("tree-branch-show");
                            } else {
                                cli.siblings("ul").show();
                                cli.find("span.right-arr").addClass("active-arr");
                                pcli.addClass("tree-branch-show");
                            }
                        }
                    } else {
                        var btn = $("#edj-v2-fnav-switch").find(".edj-v2-fnav-btn");
                        var treat = $("#edj-v2-fnav-box");
                        var cli = $(".edj-v2-fnavs > li div"),
                            pcli = cli.parent();
                        $("#edj-v2-fnav-box").addClass("edj-v2-fnav-box-exp");
                        treat.addClass("edj-v2-fnav-box-exp");
                        btn.addClass("edj-v2-fnav-active");
                        treat.find(".edj-v2-fnavs .edj-v2-tree-title").css("display", "inline-block");
                        cli.find("span.right-arr").show();
                        $("#edj-v2-hnav").find("img.edj-v2-logo").attr("src", "Logo.png").css({
                            "width": "auto",
                            "marginLeft": "50px"
                        });
                    }
                }).delegate("#edj_v2_submit", "click", function() {
                    if ($.trim($("#edj-v2-search").val()).length <= 0) {
                        alert("请输入搜索内");
                    }
                });
            }
        }
        $(function() {
            var testData = [{
                label: "我",
                hasSub: true,
                className: "edj-v2-ico-user",
                navList: [{
                    label: "我的控制台",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "待办事项",
                    hasSub: true,
                    navList: [{
                        label: "待办事项1",
                        hasSub: false,
                        link: "http://www.baidu.com"
                    }, {
                        label: "待办事项2",
                        hasSub: true,
                        navList: [{
                            label: "公告事项1",
                            hasSub: false,
                            link: "http://www.edaijia.cn"
                        }, {
                            label: "公告事项2",
                            hasSub: false,
                            link: "http://www.edaijia.cn"
                        }]
                    }]
                }, {
                    label: "待办事项3",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "待办事项4",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }]
            }, {
                label: "公告",
                hasSub: true,
                className: "edj-v2-ico-notice",
                navList: [{
                    label: "公告事项1",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "公告事项2",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }]
            }, {
                label: "运营",
                hasSub: true,
                className: "edj-v2-ico-operate",
                navList: [{
                    label: "运营事项1",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "运营事项2",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }]
            }, {
                label: "呼叫中心",
                hasSub: true,
                className: "edj-v2-ico-call",
                navList: [{
                    label: "呼叫中心1",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "呼叫中心2",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }]
            }, {
                label: "客户",
                hasSub: true,
                className: "edj-v2-ico-client",
                navList: [{
                    label: "客户事项1",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "客户事项2",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }]
            }, {
                label: "品牌监控",
                hasSub: true,
                className: "edj-v2-ico-brand",
                navList: [{
                    label: "品牌监控事项1",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "品牌监控事项2",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }]
            }, {
                label: "司机管理",
                hasSub: true,
                className: "edj-v2-ico-driverm",
                navList: [{
                    label: "司机管理事项1",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "司机管理事项2",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }]
            }, {
                label: "市场",
                hasSub: true,
                className: "edj-v2-ico-market",
                navList: [{
                    label: "市场事项1",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "市场事项2",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }]
            }, {
                label: "财务",
                hasSub: true,
                className: "edj-v2-ico-finance",
                navList: [{
                    label: "财务事项1",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "财务事项2",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }]
            }, {
                label: "系统",
                hasSub: true,
                className: "edj-v2-ico-sys",
                navList: [{
                    label: "系统事项1",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }, {
                    label: "系统事项2",
                    hasSub: false,
                    link: "http://www.edaijia.cn"
                }]
            }];
            // var url = "/index.php?r=default/left";
            // $.ajax({
            //     url: url,
            //     type: type || 'GET',
            //     data: {},
            //     crossDomain: true,
            //     dataType: 'json',
            //     timeout: 5000,
            //     error:function(){},
            //     success: function(data) {
            new FNav({
                NLData: testData
            });
            //     }
            // });
            // $.when($.getScript("http://h5.edaijia.cn/core/utils/jquery.md5.js"),
            //     $.getScript("http://h5.edaijia.cn/core/libs/common.js")).then(function() {});
        });
    });
}())