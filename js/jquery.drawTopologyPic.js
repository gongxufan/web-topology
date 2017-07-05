/**
 * 根据环境模板ID显示网络拓扑图形
 * 入参: templateId环境模板ID,url节点数据获取url
 * @author gongxufan 2015/2/6
 */

;
(function ($, win) {
    //编辑器默认的显示参数
    win.editor = {};
    win.editor.config = {
        //新建节点默认尺寸
        defaultWidth: 32,
        defaultHeight: 32,
        //滚轮缩放比例
        defaultScal: 0.95,
        ////是否显示鹰眼对象
        eagleEyeVsibleDefault: false,
        //连线颜色
        strokeColor: "black",
        //连线宽度
        lineWidth: 1,
        //二次折线尾端长度
        offsetGap: 40,
        //线条箭头半径
        arrowsRadius: 5,
        //折线的方向
        direction: "horizontal",
        //节点文字颜色
        nodeFontColor: "black",
        //连线文字颜色
        lineFontColor: "black",
        //是否显示连线阴影
        showLineShadow: false,
        //节点旋转幅度
        rotateValue: 0.5,
        //节点缩放幅度
        nodeScale: 0.2,
        alpha: 1,
        containerAlpha: 0.5,
        nodeStrokeColor: "22,124,255",
        lineStrokeColor: "black",
        fillColor: "22,124,255",
        containerFillColor: "10,100,80",
        shadow: false,
        shadowColor: "rgba(0,0,0,0.5)",
        font: "12px Consolas",
        fontColor: "black",
        lineJoin: "lineJoin",
        borderColor: "10,10,100",
        borderRadius: 30,
        shadowOffsetX: 3,
        shadowOffsetY: 6
    };
    /**
     * 初始化指定模板的拓扑图
     * @param templateId 环境模板ID
     * @param topologyJson 拓扑图JSON结构
     * @param canvasId 页面定义的显示区域
     */
    function initStage(templateId, topologyJson, canvasId) {
        if (!canvasId || !templateId || !topologyJson) return;
        var canvas = document.getElementById(canvasId);
        if (topologyJson == "-1") {
            this.stage = new JTopo.Stage(canvas);
            this.modeIdIndex = 1;
            this.scene = new JTopo.Scene(this.stage);
        } else {
            canvas.width = topologyJson.width;
            canvas.height = topologyJson.height;
            this.stage = JTopo.createStageFromJson(topologyJson, canvas);
            this.scene = this.stage.childs[0];
        }
        //禁用滚轮缩放
        this.stage.wheelZoom = 0.95;
        this.stage.frames = -250;
        this.scene.mode = "drag";
        this.stage.centerAndZoom();
        this.scene.childs.forEach(function (n) {
            if (n) {
                n.dragable = false;
                n.showSelected = false;
                n.selected = false;
            }
        });
    };

    /**
     * 加载拓扑的json结构
     * @param templateId
     * @param canvasId
     */
    function showTopology(templateId, canvasId,url) {
        $.ajax({
            url: context + url,
            async: true,
            type: "POST",
            dataType: "json",
            data: {
                "templateId": templateId
            },
            error: function () {
                jAlert("服务器异常，请稍后重试..");
            },
            success: function (response) {
                var err = response.errorInfo;
                // 错误处理
                if (err && err != "ok") {
                    if (err == "-1") {
                        initStage(templateId, "-1",canvasId);
                    } else if (err == "logout") {
                        handleSessionTimeOut();
                        return;
                    } else {
                        jAlert(err);
                    }
                } else {
                    var topologyJson = response.topologyJson;
                    initStage(templateId, topologyJson, canvasId);
                }
            }
        });
    };

    $.fn.drawTopologyPic = function (options) {
        //参数校验
        if (!options.templateId || !options.url) return;
        this.html("<canvas id='drawTopoPic'>您的浏览器不支持HTML5!</canvas>");
        //开始加载
        showTopology(options.templateId, 'drawTopoPic',options.url);
    }
})(jQuery, window);