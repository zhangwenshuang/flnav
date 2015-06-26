/**
 *
 * @authors 张文双 (wyzxzws@126.com)
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
    loadScript("http://libs.baidu.com/jquery/1.9.1/jquery.min.js", function() {
        var FLNav = function(opts) {
            this.opts = opts || {};
            this.init();
        };
        FLNav.prototype = {
            defaults: {
                rootLen: 0,
                cIndex: 0,
                container: "<div id='edj-v2-fnav-box' class='edj-v2-fnav-box'><ul class='edj-v2-fnavs'></ul><div id='edj-v2-fnav-switch' class='edj-v2-fnav-switch'><div class='edj-v2-fnav-btn'></div></div></div>"
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
                        pcli = cli.parent();
                    if (treat.hasClass("edj-v2-fnav-box-exp")) {
                        treat.removeClass("edj-v2-fnav-box-exp");
                        btn.removeClass("edj-v2-fnav-active");
                        treat.find(".edj-v2-fnavs .edj-v2-tree-title").css("display", "none");
                        pcli.removeClass("tree-branch-show");
                        cli.siblings("ul").hide();
                        cli.find("span.right-arr").removeClass("active-arr").hide();
                    } else {
                        treat.addClass("edj-v2-fnav-box-exp");
                        btn.addClass("edj-v2-fnav-active");
                        treat.find(".edj-v2-fnavs .edj-v2-tree-title").css("display", "inline-block");
                        cli.find("span.right-arr").show();
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
                    link: "http://www.youku.com"
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
                            link: "http://www.youku.com"
                        }, {
                            label: "公告事项2",
                            hasSub: false,
                            link: "http://www.youku.com"
                        }]
                    }]
                }, {
                    label: "待办事项3",
                    hasSub: false,
                    link: "http://www.youku.com"
                }, {
                    label: "待办事项4",
                    hasSub: false,
                    link: "http://www.youku.com"
                }]
            }, {
                label: "公告",
                hasSub: true,
                className: "edj-v2-ico-notice",
                navList: [{
                    label: "公告事项1",
                    hasSub: false,
                    link: "http://www.youku.com"
                }, {
                    label: "公告事项2",
                    hasSub: false,
                    link: "http://www.youku.com"
                }]
            }, {
                label: "运营",
                hasSub: true,
                className: "edj-v2-ico-operate",
                navList: [{
                    label: "运营事项1",
                    hasSub: false,
                    link: "http://www.youku.com"
                }, {
                    label: "运营事项2",
                    hasSub: false,
                    link: "http://www.youku.com"
                }]
            }, {
                label: "呼叫中心",
                hasSub: true,
                className: "edj-v2-ico-call",
                navList: [{
                    label: "呼叫中心1",
                    hasSub: false,
                    link: "http://www.youku.com"
                }, {
                    label: "呼叫中心2",
                    hasSub: false,
                    link: "http://www.youku.com"
                }]
            }, {
                label: "客户",
                hasSub: true,
                className: "edj-v2-ico-client",
                navList: [{
                    label: "客户事项1",
                    hasSub: false,
                    link: "http://www.youku.com"
                }, {
                    label: "客户事项2",
                    hasSub: false,
                    link: "http://www.youku.com"
                }]
            }, {
                label: "品牌监控",
                hasSub: true,
                className: "edj-v2-ico-brand",
                navList: [{
                    label: "品牌监控事项1",
                    hasSub: false,
                    link: "http://www.youku.com"
                }, {
                    label: "品牌监控事项2",
                    hasSub: false,
                    link: "http://www.youku.com"
                }]
            }, {
                label: "员工管理",
                hasSub: true,
                className: "edj-v2-ico-driverm",
                navList: [{
                    label: "员工管理事项1",
                    hasSub: false,
                    link: "http://www.youku.com"
                }, {
                    label: "员工管理事项2",
                    hasSub: false,
                    link: "http://www.youku.com"
                }]
            }, {
                label: "市场",
                hasSub: true,
                className: "edj-v2-ico-market",
                navList: [{
                    label: "市场事项1",
                    hasSub: false,
                    link: "http://www.youku.com"
                }, {
                    label: "市场事项2",
                    hasSub: false,
                    link: "http://www.youku.com"
                }]
            }, {
                label: "财务",
                hasSub: true,
                className: "edj-v2-ico-finance",
                navList: [{
                    label: "财务事项1",
                    hasSub: false,
                    link: "http://www.youku.com"
                }, {
                    label: "财务事项2",
                    hasSub: false,
                    link: "http://www.youku.com"
                }]
            }, {
                label: "系统",
                hasSub: true,
                className: "edj-v2-ico-sys",
                navList: [{
                    label: "系统事项1",
                    hasSub: false,
                    link: "http://www.youku.com"
                }, {
                    label: "系统事项2",
                    hasSub: false,
                    link: "http://www.youku.com"
                }]
            }];
            new FLNav({
                NLData: testData
            });
        });
    });
}())