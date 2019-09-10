/**
 * 提供属性面板相关操作的函数集，编辑器继承其全部功能
 *
 * 关于拓扑分层编辑注意点：
 * 1、对于同一层有多个子网点，设定每个子网所链接的层不同
 * 2、topoLevel,parentLevel,nextLevel的用处：
 *
 * topoLevel默认为1,表示某个节点所处的层，其包括普通的节点对象,Stage对象。
 * Scene对象为所有层公用，保存当前一共有多少层以及当前在第几层。
 * 每新建一个层会新建一个Stage对象，其parentLevel保存当前前的父层
 *
 * parentLevel默认为0，代表某个节点或者Stage对象所处层的父层，用于返回是寻找上层位置
 *
 * nextLevel默认为0,这个字段专门用于链接子网的节点，用户进入子网层时找到其链接的层所处的位置
 * @param mainControlDiv
 */
function propertyPanel(mainControlDiv) {
    //网络属性面板操作
    this.props = {
        "EC": [
            {"title": "交换机属性", "url": context + "switchesManage/showSwitches"}
        ],
        "FW": [{"title": "防火墙出口规则集", "url": context + "routerManage/showFireWallEgressRules"},
            {"title": "防火墙入口规则集", "url": context + "routerManage/showFireWallInRules"}],
        "VR": [
            {"title": "路由器属性", "url": context + "routerManage/showRouter"},
            /*{"title": "路由器连接信息", "url": context + "routerManage/showRouterConnect"},*/
            {"title": "路由规则集", "url": context + "routerManage/showRouterRules"} ,
            /* {"title": "网络访问规则集", "url": context + "routerManage/showNetworkAclRules"}, */
            /* {"title":"端口转发规则","url":context+"vr-portforwardrule.html"},*/
            {"title": "网络转发规则集", "url": context + "routerManage/showPortForwardRules"}
            /* {"title":"虚拟路由器类型","url":context+"vr-networktype.html"}*/
        ],
        "VM": [
            {"title": "虚拟机属性", "url": context + "templateManage/showVmTemplate"}
        ],
        "ECVR" : [{"title": "路由器网络属性", "url": context + "vmvrManage/showVmvrRouter"},
                  {"title": "子网属性", "url": context + "vmvrManage/showVmvrSwitch"},
                  {"title":"端口转发规则集","url":context+"vmvrManage/showVmvrpfRule"}]
    };
    this.control = $(mainControlDiv);
    //过渡窗口
    this.loadingWin = $("#loading");
    //帮助窗口
    this.helpWin = $("#help");
    //JSON数据压缩
    this.jsonCode = {
        x : "0",
        y : "1",
        width: "2",
        height: "3",
        visible: "4",
        alpha: "5",
        rotate: "6",
        scaleX: "7",
        scaleY: "8",
        strokeColor: "9",
        fillColor: "a",
        shadow: "b",
        shadowColor: "c",
        shadowOffsetX: "d",
        shadowOffsetY: "e",
        transformAble: "f",
        zIndex : "g",
        dragable: "h",
        selected: "i",
        showSelected: "j",
        isMouseOver: "k",
        deviceId: "l",
        dataType: "m",
        nodeImage: "n",
        text: "z",
        font: "o",
        fontColor: "p",
        textPosition: "q",
        textOffsetX: "r",
        textOffsetY: "s",
        borderRadius: "t",
        deviceA: "u",
        deviceZ: "v",
        lineType: "w",
        bundleOffset: "x",
        arrowsRadius: "y",
        lineWidth: "C",
        lineJoin: "D",
        elementType: "E",
        backgroundColor: "F",
        mode: "G",
        paintAll: "H",
        areaSelect: "I",
        translate: "J",
        translateX: "K",
        translateY: "L",
        lastTranslatedX: "M",
        lastTranslatedY: "N",
        visible: "P",
        version :"S",
        frames :"T",
        wheelZoom :"U",
        childs :"V",
        offsetGap : "O",
        borderColor : "A",
        direction : "B",
        templateId : "T",
        totalLevel : "Y",
        topoLevel : "Z",
        parentLevel : "X",
        nextLevel : "R"
    };
};

/**
 * 删除指定数据类型设备的属性面板
 * @param b 设备图形的dataType属性
 */
propertyPanel.prototype.clearOldPanels = function (b) {
    var c = this, a = c.props, d = a[b];
    if (c.control) {
        if (d) {
            var i;
            //删除面板
            for (i = 0; i < d.length; i++) {
                try {
                    c.control.accordion('remove', d[i]["title"]);
                    --i;
                } catch (e) {
                }
            }
            //清除ECVR的属性数组
            if(b == "ECVR"){
                for(var j = 0 ; j < d.length - 3 ; j++){
                    d.pop();
                    j--;
                }
            }
        }
    }
    };

/**
 * 创建属性面板
 * 1.普通设备的创建
 * 2.创建自定义路由的时候,需要动态的创建其连接的路由器信息
 * @param b 设备图形的dataType属性
 * @param templateid 节点的模板ID
 * @param moduleId 创建的节点ID
 * @param 自定义路由器的节点实例
 */
propertyPanel.prototype.createNewPanels = function (b, templateid, moduleId,node) {
    if (!templateid) templateid = "";
    var c = this, a = c.props, d = a[b];
    if (node instanceof JTopo.Node && node.dataType == "ECVR") {
        //固定的属性面板是3个
        d = d.slice(0, 3);
    }
    if (d) {
        var i = 0;
        for (i = 0; i < d.length; i++) {
            c.control.accordion('add', {
                title: d[i]["title"],
                content: "",
                selected: false,
                method: "post",
                href: d[i]["url"] + "?templateId=" + templateid + "&moduleId=" + moduleId+"&envTemplateId="+editor.templateId,
                loadingMessage: "loading..."
            });
            var e = c.control.accordion('getPanel', d[i]["title"]);
            if (i > 0)
                e.panel("refresh", d[i]["url"] + "?templateId=" + templateid + "&moduleId=" + moduleId+"&envTemplateId="+editor.templateId);
        }
        //打开第一个面板
        c.control.accordion("select", 0);
        //自定义路由器需要动态创建其连接的交换机
        if (node instanceof JTopo.Node && node.dataType == "ECVR") {
            //a["ECVR"] = a["ECVR"].slice(0,d.length);
            var connectedDevice = node.outLinks;
            if (connectedDevice.length > 0) {
                for (var j = 0; j < connectedDevice.length; j++) {
                    this.createPanel(editor,templateid, connectedDevice[j].nodeZ.text + "--路由器连接信息", false, connectedDevice[j].nodeZ.deviceId, connectedDevice[j].nodeZ.templateId, connectedDevice[j].id, context + "vmvrManage/showVmvrRouterConnect", true);
                }
            }
        }
    }
    };

/**
 * 刷新指定数据类型设备图形对应属性面板的页面
 * 不会重新创建面板
 * @param templateid 节点的模板ID
 * @param moduleId
 * @param dataType
 */
propertyPanel.prototype.refreshPanel = function (templateid, moduleId,dataType) {
    if(!templateid) templateid = "";
    var c = this, a = c.props,d = a[dataType];
    var e = c.control;
    if (e && d && d.length > 0) {
        var i = 0;
        for (i = 0; i < d.length; i++) {
            e.accordion('getPanel',d[i]["title"]).panel("refresh", d[i]["url"] + "?templateId=" + templateid + "&moduleId=" + moduleId+"&envTemplateId="+editor.templateId);
        }
    }

};

/**
 * 属性面板被选择事件
 * @param b
 * @param templateid
 * @param moduleId
 */
propertyPanel.prototype.selectPanel = function (b, templateid, moduleId,dataType) {
    return;
    var c = editor, a = c.props;
    if (!b || !moduleId) return;
    var e = c.control.accordion('getPanel', b);
    if (e) {
        var i = 0;
        for (i = 0; i < a[dataType].length; i++) {
            if (b == a[dataType][i]["title"]) {
                e.panel("refresh", a[dataType][i]["url"] + "?templateId=" + templateid + "&moduleId=" + moduleId+"&envTemplateId="+editor.templateId);
                break;
            }
        }
    }

};

/**
 * 创建制定的属性面板
 *
 * 双击虚拟路由器进入面板isShow为true,连线的时候只是把虚拟路由器连接的交换机信息添加到全局属性变量(isShow为false)
 * @param editor
 * @param vmvrId 自定义路由器的模板ID
 * @param name 面板名字
 * @param selected 是否选中
 * @param targetDeviceId 指向的
 * @param templateId 虚拟路由器指向的设备ID
 * @param moduleId deviceId
 * @param uri 页面地址
 * @param isShow 是否立即显示新增的面板
 */
propertyPanel.prototype.createPanel = function(editor,vmvrId,name,selected,targetDeviceId,templateId,moduleId,uri,isShow){
    var c = editor, a = c.props, size = a['ECVR'].length;
    //双击虚拟路由器进入属性面板,需要创建其连接的交换机属性面板
    if (isShow){
        c.control.accordion('add', {
            title: name,
            content: "",
            selected: selected,
            method: "post",
            loadingMessage: "loading..."
        });
        var e = c.control.accordion('getPanel', name);
        e.panel("refresh", uri + "?vmvrId=" + vmvrId + "&templateId=" + templateId + "&moduleId=" + moduleId+"&envTemplateId="+editor.templateId+"&title="+name+"&size="+size);
    }
    //连线的时候只保存目标交换机的属性到全局属性变量
    for(var p = 0 ; p < size ; p++){
        if(a["ECVR"][p].title == name) return;
    }
    a["ECVR"].push( {"title": name, "url": uri + "?vmvrId=" + vmvrId + "&templateId=" + templateId + "&moduleId=" + moduleId+"&envTemplateId="+editor.templateId+"&title="+name+"&size="+size,"targetNetwork":targetDeviceId});
};

propertyPanel.prototype.showLoadingWindow = function(){
    //显示过渡窗口
    this.loadingWin.dialog({
        width: 200,
        height: 80,
        closed: false,
        cache: true,
        href: context + 'web-topology/loading.html',
        modal: true,
        minimizable : false,
        maximizable : false,
        draggable : false,
        noheader : true,
        shadow : false,
        resizable :false
    });
};

propertyPanel.prototype.showHelpWindow = function(){
    //显示帮助窗口
    this.helpWin.dialog({
        title:"帮助信息",
        width: 800,
        height: 600,
        cache: true,
        href: context + 'web-topology/help.html',
        modal: true,
        minimizable : false,
        maximizable : false,
        draggable : true,
        resizable : true
    });
};


propertyPanel.prototype.closeLoadingWindow = function(){
    //显示过渡窗口
    this.loadingWin.window('close');
};
/**
 * 保存序列化的JSON数据到服务器,为减少请求参数长度,进行了字符串的替换
 */
propertyPanel.prototype.saveToplogy = function (showAlert) {
        editor.mainMenu.hide();
        var self = this;
        this.showLoadingWindow();
        //先删除标尺线
        editor.utils.clearRuleLines();
        //保存container状态
        var containers = editor.utils.getContainers();
        for(var c=0 ; c < containers.length ; c++){
              var temp = [];
              var nodes = containers[c].childs;
              for(var n =0 ; n < nodes.length ; n++){
                  if(nodes[n] instanceof JTopo.Node){
                      temp.push(nodes[n].deviceId);
                  }
              }
            containers[c].childNodes = temp.join(",");
        }
        //设置拓扑当前层次和最大层次数
        var selectLevel = $("#selectLevel");
        var levels = selectLevel.find("option:selected");
        editor.stage.topoLevel = parseInt(levels.eq(0).val());
        if(editor.stage.topoLevel == -1) editor.stage.topoLevel = 1;
        editor.stage.parentLevel = $("#parentLevel").val();
        editor.scene.totalLevel = selectLevel.find("option").size() - 1;
        topologyJSON = editor.stage.toJson();
        if(topologyJSON){
            for(var key in this.jsonCode){//字符压缩
                topologyJSON = topologyJSON.replace(new RegExp('"'+ key +'"',"gm"),this.jsonCode[key]);
            }
            topologyJSON = topologyJSON.replace(new RegExp('",',"gm"),';');
            topologyJSON = topologyJSON.replace(new RegExp('"',"gm"),'@');
            topologyJSON = topologyJSON.replace(new RegExp('undefined',"gm"),'#');
        }
        $.ajax({
            url: context + "topologyManage/saveTopologyJSON",
            async: true,
            type: "POST",
            dataType: "json",
            data: {
                "topologyJSON": topologyJSON,
                "templateId": editor.templateId,
                "topologyId":editor.topologyId
            },
            error: function () {
                self.closeLoadingWindow();
                jAlert("服务器异常，请稍后重试..");
            },
            success: function (response) {
                var err = response.errorInfo;
                // 错误处理
                if (err && err != "ok") {
                    if (err == "logout") {
                        handleSessionTimeOut();
                        return;
                    } else {
                        self.closeLoadingWindow();
                        jAlert(err);
                    }
                } else {
                    self.replaceStage(editor.templateId,editor.topologyId,showAlert,editor.stage.topoLevel);
                    self.closeLoadingWindow();
                }
            }
        });
    };

/**
 * 加载环境模板ID对应的拓扑图JSON数据结构
 * @param backImg 拓扑图的背景图片
 * @param templateId 环境模板ID
 * @param topologyId 拓扑 表记录ID
 */
propertyPanel.prototype.loadTopology = function (backImg,templateId,topologyId,topoLevel) {
    if(!topoLevel) topoLevel = "";
    var self = this;
    self.showLoadingWindow();
    if (!templateId) {
        templateId = editor.templateId;
    }
    $.ajax({
        url: './topology.html',
        async: false,
        type: "GET",
        dataType: "html",
        data: {
            "templateId":templateId,
            "topologyId":topologyId,
            "topoLevel":topoLevel
        },
        error: function () {
            self.closeLoadingWindow();
            jAlert("服务器异常，请稍后重试..");
        },
        success: function (response) {
            response = JSON.parse(response);
            var err = response.errorInfo;
            // 错误处理
            if (err && err != "ok") {
                if(err == "-1"){
                    editor.init(backImg, templateId, topologyId,"-1","");
                }else if (err == "logout") {
                    handleSessionTimeOut();
                    return;
                } else {
                    self.closeLoadingWindow();
                    jAlert(err);
                }
            } else {
                var topologyJson = response.topologyJson;
                editor.init(backImg, templateId, topologyId, topologyJson,"");
            }
        }
    });
    };

/**
 * 清空所有节点
 * @param templateId
 */
propertyPanel.prototype.deleteAllNodes = function(templateId){
    if (!templateId) {
        return;
    }
    var self = this;
    jConfirm("确定要清空拓扑图吗?","清空拓扑图",function(ok){
        if(ok){
            editor.stage.childs.forEach(function(s){
                s.clear();
            });
            //连线重置
            editor.beginNode = null;
            editor.link = null;
            //清除属性面板
            editor.initPropertyPanle();
            self.showLoadingWindow();
            $.ajax({
                url: context + "topologyManage/deleteAllNodes",
                async: true,
                type: "POST",
                dataType: "json",
                data: {
                    "templateId":templateId
                },
                error: function () {
                    self.closeLoadingWindow();
                    jAlert("服务器异常，请稍后重试..");
                },
                success: function (response) {
                    var err = response.errorInfo;
                    // 错误处理
                    if (err && err != "ok") {
                        if (err == "logout") {
                            handleSessionTimeOut();
                            return;
                        } else {
                            self.closeLoadingWindow();
                            jAlert(err);
                        }
                    } else {
                        self.closeLoadingWindow();
                    }
                }
            });
        }
    });
}

/**
 * 删除ID指定的节点
 * @param id
 * @param type   节点:node,连线:link
 * @param dataType 设备数据类型
 */
propertyPanel.prototype.deleteNodeById = function(id,type,dataType){
    if (!id) {
        return;
    }
    var self = this;
    $.ajax({
        url: context + "topologyManage/deleteNodeById",
        async: false,
        type: "POST",
        dataType: "json",
        data: {
            "id": id,
            "type": type,
            "dataType" : dataType
        },
        error: function () {
            self.closeLoadingWindow();
            jAlert("服务器异常，请稍后重试..");
        },
        success: function (response) {
            var err = response.errorInfo;
            // 错误处理
            if (err && err != "ok") {
                if (err == "logout") {
                    handleSessionTimeOut();
                    return;
                } else {
                    self.closeLoadingWindow();
                    jAlert(err);
                }
            }
        }
    });
}
propertyPanel.prototype.getEnvTemplate = function () {
        var envListRes;
        $.ajax({
            url: context + "topology/getAllTemplates",
            async: false,
            type: "POST",
            dataType: "json",
            data: {
            },
            error: function () {
                alert("服务器异常，请稍后重试..");
            },
            success: function (response) {
                envListRes = response.envList;
            }
        });
        return envListRes;
    };

propertyPanel.prototype.initPropertyPanle = function () {
        var c = this;
        //回退是清除属性面板
        for (var datatype in this.props) {
            c.clearOldPanels(datatype);
        }
    };
/**
 * 重新加载属性面板页面
 * @param title 属性面板在中文标题
 * @param propTitle 属性数组索引
 * @param index 面板所在位置索引
 * @param templateId 属性ID
 */
propertyPanel.prototype.resetPanelProperty = function(title,propTitle,index,templateId){
    var cuurPanel = editor.control.accordion('getPanel',title);
    var d = editor.props[propTitle];
    //获取隐藏域中的moduleId和envTemplateId
    var moduleId = $("#nodeModuleIdHidden").val();
    var envTemplateId = $("#nodeEnvTemplateIdHidden").val();

    if(cuurPanel){
    	if(title.indexOf("路由器连接信息")>0){
    		cuurPanel.panel("refresh",d[index]["url"]);
        }else{
        	cuurPanel.panel("refresh",d[index]["url"] + "?templateId=" + templateId+"&moduleId="+moduleId+"&envTemplateId="+envTemplateId);
        }
    }

}

/**
 * 编辑器对象，原型继承属性面板对象,提供编辑器的主要功能
 * @param mainControl 属性面板主框架
 */
function networkTopologyEditor(mainControl){
    //绘图参数
    this.config = {
        stageFrames : 500,
        //新建节点默认尺寸
        defaultWidth : 32,
        defaultHeight : 32,
        //滚轮缩放比例
        defaultScal : 0.95,
        ////是否显示鹰眼对象
        eagleEyeVsibleDefault : false,
        //连线颜色
        strokeColor : "black",
        //连线宽度
        lineWidth : 1,
        //二次折线尾端长度
        offsetGap : 40,
        //线条箭头半径
        arrowsRadius : 5,
        //折线的方向
        direction : "horizontal",
        //节点文字颜色
        nodeFontColor : "black",
        //连线文字颜色
        lineFontColor : "black",
        //是否显示连线阴影
        showLineShadow : false,
        //节点旋转幅度
        rotateValue : 0.5,
        //节点缩放幅度
        nodeScale : 0.2,
        alpha : 1,
        containerAlpha : 0.5,
        nodeStrokeColor : "22,124,255",
        lineStrokeColor : "black",
        fillColor :"22,124,255",
        containerFillColor : "10,100,80",
        shadow : false,
        shadowColor : "rgba(0,0,0,0.5)",
        font : "12px Consolas",
        fontColor:"black",
        lineJoin : "lineJoin",
        borderColor:"10,10,100",
        borderRadius : 30,
        shadowOffsetX : 3,
        shadowOffsetY : 6
    };
    //布局参数
    this.layout = {
    };
    //纪录节点最后一次移动的幅度
    this.lastMovedX = 0;
    this.lastMovedY = 0;
    //绘图区属性
    this.stage = null;
    this.scene = null;

    //连线类型
    this.lineType = "line";

    //业务数据
    this.currDeviceId = null;
    this.currDataType = null;
    this.modeIdIndex = 1;
    this.templateId = null;

    //当前选择的节点对象
    this.currentNode = null;
    //节点邮件菜单DOM对象
    this.nodeMainMenu = $("#nodeMainMenu");
    //连线邮件菜单DOM
    this.lineMenu = $("#lineMenu");
    //全局菜单
    this.mainMenu = $("#mainMenu");
    //节点文字修改菜单
    this.nodeTextMenu = $("#nodeTextMenu");
    //布局管理菜单
    this.layoutMenu = $("#layoutMenu");
    //节点文字方向
    this.nodeTextPosMenu = $("#nodeTextPosMenu");
    // 设备节点文字编辑框
    this.deviceEditText = $("#deviceText");
    //节点分组菜单
    this.groupMangeMenu = $("#groupMangeMenu");
    //节点对齐菜单
    this.groupAlignMenu = $("#groupAlignMenu");
    this.alignGroup = $("#alignGroup");
    //容器管理菜单
    this.containerMangeMenu = $("#containerMangeMenu");
    //拓扑层次导航
    this.selectLevel;
    //是否显示参考线
    this.showRuleLine = true;
    //标尺线数组
    this.ruleLines = [];
    //调用构造函数
    propertyPanel.call(this,document.getElementById(mainControl));
}

//原型继承
networkTopologyEditor.prototype = new propertyPanel();
/**
 *  动态更改样式
 */
networkTopologyEditor.prototype.setCSS = function () {
    //删除原有样式
    $("#theme").remove();
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    link.id = "theme";
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(link);
};

/**
 * 菜单初始化
 */
networkTopologyEditor.prototype.initMenus = function () {
    var self = this;
    self.lineMenu.blur(function(){
        if(self.currentNode)
         self.currentNode.text = self.deviceEditText.hide().val();
        else
            self.deviceEditText.hide();
    });

    //右键菜单事件处理
    self.nodeMainMenu.on("click",function(e){
        //菜单文字
        var text = $.trim($(e.target).text());
        if(text == "删除节点(Delete)"){
            editor.utils.deleteSelectedNodes();
        }else if(text == "复制节点(Shift+C)"){
            self.utils.cloneSelectedNodes();
        }else if(text == "撤销(Shift+Z)"){
            self.utils.cancleNodeAction();
        }else if(text == "重做(Shift+R)"){
            self.utils.reMakeNodeAction();
        }else{
            editor.utils.saveNodeInitState();
        }

        switch (text){
            case "放大(Shift+)":
                self.utils.scalingBig();
                self.utils.saveNodeNewState();
                break;
            case "缩小(Shift-)":
                self.utils.scalingSmall();
                self.utils.saveNodeNewState();
                break;
            case "顺时针旋转(Shift+U)":
                self.utils.rotateAdd();
                self.utils.saveNodeNewState();
                break;
            case "逆时针旋转(Shift+I)":
                self.utils.rotateSub();
                self.utils.saveNodeNewState();
                break;
            case "节点文字":
                return;
            default :

        }

        //关闭菜单
        $(this).hide();
    });

    self.nodeMainMenu.on("mouseover",function(e){
        //隐藏第三级菜单
        self.nodeTextPosMenu.hide();
        //菜单文字
        var text = $.trim($(e.target).text());
        var menuX =  parseInt(this.style.left) + $(document.getElementById('changeNodeText')).width();
        //边界判断
        if(menuX + self.nodeTextMenu.width() * 2 >= self.stage.width){
            menuX -= (self.nodeTextMenu.width() + self.nodeMainMenu.width());
        }
        if("节点文字" == text){
            self.layoutMenu.hide();
            self.nodeTextMenu.css({
                top: parseInt(this.style.top)+ $(document.getElementById('changeNodeText')).height(),
                left: menuX
            }).show();
        }else if("应用布局" == text){
            self.nodeTextMenu.hide();
            self.layoutMenu.css({
                top: parseInt(this.style.top),
                left: menuX
            }).show();
        } else{
            self.nodeTextMenu.hide();
        }
    });

    self.nodeTextMenu.on("click", function (e) {
        //菜单文字
        var text = $.trim($(e.target).text());
        if("修改节点文字" == text){
            editor.utils.saveNodeInitState();
            //隐藏菜单显示文字输入框
            self.nodeTextMenu.hide();
            self.nodeMainMenu.hide();
            self.deviceEditText.css({
                top: self.yInCanvas,
                left: self.xInCanvas
            }).show();
            self.deviceEditText.attr('value', self.currentNode.text);
            self.deviceEditText.focus();
            self.deviceEditText.select();
        }
    });

    //节点右键二级菜单
    self.nodeTextMenu.on("mouseover", function (e) {
        //菜单文字
        var text = $.trim($(e.target).text());
        if("调整节点文字位置" == text){
            //处于边界时三级菜单位置调整
            var menuX = parseInt(this.style.left) + $(document.getElementById('justfyNodeText')).width();
            if(parseInt(this.style.left) < parseInt(document.getElementById('nodeMainMenu').style.left)){
                menuX = parseInt(this.style.left) - $(document.getElementById('justfyNodeText')).width();
            }
            self.nodeTextPosMenu.css({
                top: parseInt(this.style.top) + $(document.getElementById('justfyNodeText')).height(),
                left: menuX
            }).show();
        }else{
            self.nodeTextPosMenu.hide();
        }
    });

    //修改节点文字位置菜单
    self.nodeTextPosMenu.on("click", function (e) {
        //菜单文字
        var text = $.trim($(e.target).text());
        if(self.currentNode && self.currentNode instanceof JTopo.Node){
            self.utils.saveNodeInitState();
            switch (text){
                case "顶部居左":
                    self.currentNode.textPosition = "Top_Left";
                    self.utils.saveNodeNewState();
                    break;
                case "顶部居中":
                    self.currentNode.textPosition = "Top_Center";
                    self.utils.saveNodeNewState();
                    break;
                case "顶部居右":
                    self.currentNode.textPosition = "Top_Right";
                    self.utils.saveNodeNewState();
                    break;
                case "中间居左":
                    self.currentNode.textPosition = "Middle_Left";
                    self.utils.saveNodeNewState();
                    break;
                case "居中":
                    self.currentNode.textPosition = "Middle_Center";
                    self.utils.saveNodeNewState();
                    break;
                case "中间居右":
                    self.currentNode.textPosition = "Middle_Right";
                    self.utils.saveNodeNewState();
                    break;
                case "底部居左":
                    self.currentNode.textPosition = "Bottom_Left";
                    self.utils.saveNodeNewState();
                    break;
                case "底部居中":
                    self.currentNode.textPosition = "Bottom_Center";
                    self.utils.saveNodeNewState();
                    break;
                case "底部居右":
                    self.currentNode.textPosition = "Bottom_Right";
                    self.utils.saveNodeNewState();
                    break;
                default :
            }
            $("div[id$='Menu']").hide();
        }
    });
    //连线菜单
    self.lineMenu.on("click",function(e){
        //关闭菜单
        $(this).hide();
        var text = $.trim($(e.target).text());
        switch (text){
            case "添加描述":
                editor.utils.addNodeText(this.style.left,this.style.top);
                break;
            case "删除连线":
                editor.utils.deleteLine()
                break;
            default :
        }
    });

    //系统设置菜单
    self.mainMenu.on("click", function (e) {
        //关闭菜单
        $(this).hide();
        var text = $.trim($(e.target).text());
        if (text.indexOf("参考线") != -1) {
            if (editor.showRuleLine) {
                editor.showRuleLine = false;
                $("#ruleLineSpan").text("显示参考线");
            }
            else {
                editor.showRuleLine = true;
                $("#ruleLineSpan").text("隐藏参考线");
            }
        }else if(text == "系统设置"){
            $('#settings').dialog({
                title: '系统设置',
                resizable:true,
                width: 600,
                height: 400,
                closed: false,
                cache: false,
                href: context + 'settings.html',
                modal: true,
                iconCls: 'icon-tip',
                toolbar: [{
                    text:'保存配置',
                    iconCls:'icon-save',
                    handler:function(){
                        alert('add')
                    }
                },'-',{
                    text:'重置',
                    iconCls:'icon-undo',
                    handler:function(){
                        alert('save')
                    }
                }],
                buttons: [{
                    text:'Ok',
                    iconCls:'icon-ok',
                    handler:function(){
                        alert('ok');
                    }
                },{
                    text:'Cancel',
                    handler:function(){
                        alert('cancel');
                    }
                }]
            });
        }
    });

    //节点分组菜单
    self.groupMangeMenu.on("click", function (e) {
        $(this).hide();
        var text = $.trim($(e.target).text());
        if(text == "新建分组"){
            self.utils.toMerge();
        }
    });
    //对齐
    self.groupAlignMenu.on("click", function (e) {
        var currNode = self.currentNode;
        var selectedNodes =  self.utils.getSelectedNodes();
        if(!currNode || !selectedNodes || selectedNodes.length == 0) return;
        $(this).hide();
        var text = $.trim($(e.target).text());
        selectedNodes.forEach(function (n) {
            if(n.deviceId == currNode.deviceId) return true;
            if(text == "水平对齐"){
                n.y = currNode.y;
            }else if(text == "垂直对齐"){
                n.x = currNode.x;
            }else{

            }
        });
    });
    self.groupMangeMenu.on("mouseover", function (e) {
        var text = $.trim($(e.target).text());
        if(text == "对齐方式"){
            //节点对齐
            var menuX = parseInt(this.style.left) + $(document.getElementById('alignGroup')).width();
            if(menuX + self.alignGroup.width() * 2 >= self.stage.width){
                menuX -= (self.alignGroup.width() + self.groupMangeMenu.width());
            }
            self.groupAlignMenu.css({
                top: parseInt(this.style.top) + $(document.getElementById('alignGroup')).height(),
                left: menuX
            }).show();
        }else{
            self.groupAlignMenu.hide();
        }
    });
    //容器管理菜单
    self.containerMangeMenu.on("click", function (e) {
        var cNode = editor.currentNode;
        if(!cNode instanceof JTopo.Container) return;
        $(this).hide();
        var text = $.trim($(e.target).text());
        if(text == "拆分"){
            self.utils.toSplit();
            self.utils.deleteNode(cNode)
        }
    });

    //容器管理菜单
    self.layoutMenu.on("click", function (e) {
        editor.currentNode.layout = {};
        $("div[id$='Menu']").hide();
        var text = $.trim($(e.target).text());
        if(text == "取消布局"){
            editor.currentNode.layout.on = false;
        }else if(text == "分组布局"){
            editor.currentNode.layout.on = true;
            editor.currentNode.layout.type = "auto";
        }else if(text == "树形布局"){
            editor.currentNode.layout.on = true;
            editor.currentNode.layout.type = "tree";
            editor.currentNode.layout.direction = "bottom";
            editor.currentNode.layout.width = 80;
            editor.currentNode.layout.height = 100;
            JTopo.layout.layoutNode(self.scene, self.currentNode, true);
        }else if(text == "圆形布局"){
            editor.currentNode.layout.on = true;
            editor.currentNode.layout.type = "circle";
            editor.currentNode.layout.radius = 200;
            JTopo.layout.layoutNode(self.scene, self.currentNode, true);
        }
    });
};
/**
 * 替换当前编
 * @param templateId
 * @param topologyId
 * @param showAlert 是否显示提示
 * @param topoLevel 所处拓扑层次
 */
networkTopologyEditor.prototype.replaceStage = function (templateId,topologyId,showAlert,topoLevel,parentLevel) {
    var self = this;
    $.ajax({
        url: context + "topologyManage/loadTopologyJSON",
        async: true,
        type: "POST",
        dataType: "json",
        data: {
            "templateId":templateId,
            "topologyId":topologyId,
            "topoLevel":topoLevel,
            "parentLevel":parentLevel
        },
        error: function () {
            self.closeLoadingWindow();
            jAlert("服务器异常，请稍后重试..");
        },
        success: function (response) {
            var err = response.errorInfo;
            // 错误处理
            if (err && err != "ok") {
               if (err == "logout") {
                    handleSessionTimeOut();
                    return;
                } else {
                    jAlert(err);
                }
            } else {
                var topologyJson = response.topologyJson;
                JTopo.replaceStageWithJson(topologyJson);
                if(editor.stage && editor.scene && editor.scene.childs && editor.scene.childs.length > 0){
                    editor.stage.centerAndZoom();
                }
                //改变当前层的父层
                $("#parentLevel").val(editor.stage.parentLevel);
                if(showAlert)
                    jAlert("保存成功!");
            }
        }
    });

};
/**
 * 编辑器初始化方法,根据请求返回结果加载空白的或者指定结构的拓扑编辑器
 * @param backImg     背景图片
 * @param templateId  环境模板ID
 * @param topologyId  拓扑记录ID
 * @param stageJson    拓扑JSON结构
 */
networkTopologyEditor.prototype.init = function (backImg,templateId,topologyId,stageJson,templateName) {
    if(!stageJson){
        jAlert("加载拓扑编辑器失败!");
        return;
    }
    this.templateId = templateId;
    this.topologyId = topologyId;
    //创建JTOP舞台屏幕对象
    var canvas = document.getElementById('drawCanvas');
    canvas.width = $("#contextBody").width();
    canvas.height = $("#contextBody").height();
    //加载空白的编辑器
    if(stageJson == "-1"){
        this.stage = new JTopo.Stage(canvas);
        this.stage.topoLevel = 1;
        this.stage.parentLevel = 0;
        this.modeIdIndex = 1;
        this.scene=  new JTopo.Scene(this.stage);
        this.scene.totalLevel = 1;
    }else{
        this.stage = JTopo.createStageFromJson(stageJson, canvas);
        this.scene = this.stage.childs[0];
    }
    $("#parentLevel").val(this.stage.parentLevel);
    //拓扑层次切换
    var options = "";
    for(var i = 1; i <= this.scene.totalLevel ;i++){
        options += '<option value="' + i +'" ';
        if( i == this.stage.topoLevel){
            options += 'selected="selected" ';
        }
        options += '>编辑第' + i + '层</option>';
    }
    $("#selectLevel").append(options);
    //滚轮缩放
    this.stage.frames = this.config.stageFrames;
    this.stage.wheelZoom = this.config.defaultScal;
    this.stage.eagleEye.visible = this.config.eagleEyeVsibleDefault;

    this.scene.mode = "normal";
    //背景由样式指定
    //this.scene.background = backImg;

    //用来连线的两个节点
    this.tempNodeA = new JTopo.Node('tempA');
    this.tempNodeA.setSize(1, 1);
    this.tempNodeZ = new JTopo.Node('tempZ');
    this.tempNodeZ.setSize(1, 1);
    this.beginNode = null;
    this.link = null;
    var self = this;

    //初始化菜单
    this.initMenus();
    //双击编辑文字
    this.scene.dbclick(function(e){
        if(e.target)
            self.currentNode = e.target;
        else
            return;
        if(e.target != null && e.target instanceof JTopo.Node){
            var nType = e.target.dataType;
            //非设备节点双击不刷新面板
            if(nType == "CL" || nType == "HO"){
                return;
            }
            //子网图形，双击进入子网编辑界面，实现分层网络拓扑设计
            if( nType == "subnet"){
                //新建编辑层先判断当前层是否已经保存好
                if(!editor.utils.hasUnSavedNode()){
                    jAlert("在进入新编辑层之前，请保存好当前编辑层内容!");
                    return;
                }
                if(!self.selectLevel){
                    self.selectLevel = $("#selectLevel");
                }
                //进入下一层分两种情况：1，下一层没有节点，直接在当前层加一。2，下一层有节点，直接跳转到相应的层
                var subnetNode = editor.utils.getNode(e.target.id);
                if(!subnetNode) return;
                var currLevel = subnetNode.nextLevel;
                //获取下一层
                if (currLevel != "0") {//转到下一层
                    editor.stage.topoLevel = parseInt(currLevel);
                } else {//层自增
                    currLevel = editor.stage.topoLevel = self.selectLevel.find("option").size();
                    //设置子网节点的nextLevel属性
                    e.target.nextLevel = currLevel;
                    if(!editor.utils.saveNode(e.target.id,currLevel)) return;
                }
                //设置当前层的父层
                var options = self.selectLevel.find("option");
                var isCreated = false;
                for (var o = 0; o < options.length; o++) {
                    if (currLevel == options[o].value) {
                        isCreated = true;
                        $(options[o]).attr("selected", "selected");
                    }
                }
                if (!isCreated) {
                    editor.stage.id = "";
                    var newOption = "<option selected='selected' value='" + currLevel + "'>编辑第" + currLevel + "层</option>";
                }
                self.selectLevel.append(newOption);
                self.replaceStage(editor.templateId, editor.topologyId, false, currLevel, e.target.topoLevel);
            }
            //按下左键加载属性面板
            var deviceTemplateId = e.target.templateId;
            //防火墙去其连接的路由器模板ID
            if(e.target.dataType == "FW"){
                var fwLinks = e.target.outLinks.concat(e.target.inLinks);
                fwLinks.forEach(function (l) {
                    if(l.nodeA.dataType == "VR"){
                        deviceTemplateId = l.nodeA.templateId;
                    }
                    if(l.nodeZ.dataType == "VR"){
                        deviceTemplateId = l.nodeZ.templateId;
                    }
                    return false;
                });
            }
            if (self.currDeviceId) {
                if (e.target.deviceId == self.currDeviceId && e.target.dataType != "ECVR") {//自定义路由器每次双击都要刷新整个panel
                    self.refreshPanel(deviceTemplateId, e.target.deviceId, e.target.dataType);
                } else {
                    self.clearOldPanels(self.currDataType);
                    self.createNewPanels(e.target.dataType, deviceTemplateId, e.target.deviceId, e.target);
                }
            } else {
                self.clearOldPanels(self.currDataType);
                self.createNewPanels(e.target.dataType, deviceTemplateId, e.target.deviceId, e.target);
            }
            //更新当前选中状态的模型
            self.currDeviceId = e.target.deviceId;
            self.currDataType = e.target.dataType;
            //双击设置隐藏域的值
            $("#nodeModuleIdHidden").val(e.target.deviceId);
            $("#nodeEnvTemplateIdHidden").val(editor.templateId);
        }
    });
    //数去焦点,设置节点文字
    self.deviceEditText.blur(function(){
        if(self.currentNode){
            self.currentNode.text = self.deviceEditText.hide().val();
            self.utils.saveNodeNewState();
        } else
            self.deviceEditText.hide();
    });

    //清除起始节点不完整的拖放线
    this.scene.mousedown(function(e){
        if (self.link && !self.isSelectedMode  && (e.target == null || e.target === self.beginNode || e.target === self.link)) {
            this.remove(self.link);
        }
    });

    //鼠标悬浮
    var midList = [];
    this.scene.click(function (e) {
        if(e.target && e.target.midNode){
            e.target.midNode.visible = true;
            return;
        }
        if(e.target && e.target instanceof JTopo.Link && !e.target.hasPaintMid && e.target.lineType == 'line'){
            var nodeA = e.target.nodeA, nodeZ = e.target.nodeZ;
            //移除当前连线
            this.remove(e.target);
            //重建连线
            //中间小节点
            var midNode = new JTopo.CircleNode('');
            midNode.type = 'tag';
            midNode.radius = 3;
            midNode.fillColor = '255,0,0';
            midNode.alpha = 0.7;
            midNode.setLocation(e.x,e.y);
            this.add(midNode)
            var m = new JTopo.Link(nodeA, midNode);
            var n = new JTopo.Link(midNode, nodeZ);
            m.lineType = "line";
            m.strokeColor = self.config.strokeColor;
            m.lineWidth = self.config.lineWidth;
            n.lineType = "line";
            n.strokeColor = self.config.strokeColor;
            n.lineWidth = self.config.lineWidth;
            this.add(m);
            this.add(n);
            m.hasPaintMid = true;
            m.midNode = midNode;
            n.hasPaintMid = true;
            n.midNode = midNode;
            midList.push(midNode);
        }
    });
    this.scene.mouseout(function (e) {
        if(e.target == null || (e.target != null && !e.target instanceof JTopo.Link))
        for (var i = 0; i < midList.length; i++) {
            midList[i].visible = false;
        }
    });
    //处理右键菜单，左键连线
    this.scene.mouseup(function(e){
        if(e.target && e.target.type == 'tag')
            return false;
        if(e.target )
            self.currentNode = e.target;
        if(e.target && e.target instanceof  JTopo.Node && e.target.layout && e.target.layout.on && e.target.layout.type && e.target.layout.type !="auto")
            JTopo.layout.layoutNode(this, e.target,true,e);
        if (e.button == 2 ) {//右键菜单
            $("div[id$='Menu']").hide();
            var menuY =  e.layerY ? e.layerY : e.offsetY;
            var menuX =  e.layerX ? e.layerX : e.offsetX;
            //记录鼠标触发位置在canvas中的相对位置
            self.xInCanvas = menuX;
            self.yInCanvas = menuY;
            if(e.target){
                //处理节点右键菜单事件
                if(e.target instanceof JTopo.Node){
                    var selectedNodes = self.utils.getSelectedNodes();
                    //如果是节点多选状态弹出分组菜单
                    if(selectedNodes && selectedNodes.length > 1){
                        //判断边界出是否能完整显示弹出菜单
                        if(menuX + self.groupMangeMenu.width() >= self.stage.width){
                            menuX -= self.groupMangeMenu.width();
                        }
                        if(menuY + self.groupMangeMenu.height() >= self.stage.height){
                            menuY -= self.groupMangeMenu.height();
                        }
                        self.groupMangeMenu.css({
                            top: menuY,
                            left: menuX
                        }).show();
                    }else{
                        //判断边界出是否能完整显示弹出菜单
                        if(menuX + self.nodeMainMenu.width() >= self.stage.width){
                            menuX -= self.nodeMainMenu.width();
                        }
                        if(menuY + self.nodeMainMenu.height() >= self.stage.height){
                            menuY -= self.nodeMainMenu.height();
                        }
                        self.nodeMainMenu.css({
                            top: menuY,
                            left: menuX
                        }).show();
                    }
                }else if(e.target instanceof JTopo.Link){//连线右键菜单
                    if(e.target.lineType == "rule"){
                        editor.utils.hideRuleLines();//删除标尺线
                    }else{
                        self.lineMenu.css({
                            top: e.layerY ? e.layerY : e.offsetY,
                            left: e.layerX ? e.layerX : e.offsetX
                        }).show();
                    }
                }else if(e.target instanceof JTopo.Container){//容器右键菜单
                    self.containerMangeMenu.css({
                        top: e.layerY ? e.layerY : e.offsetY,
                        left: e.layerX ? e.layerX : e.offsetX
                    }).show();
                }
            }else{
                //判断边界出是否能完整显示弹出菜单
                if(menuX + self.mainMenu.width() >= self.stage.width){
                    menuX -= self.mainMenu.width();
                }
                if(menuY + self.mainMenu.height() >= self.stage.height){
                    menuY -= self.mainMenu.height();
                }
                self.mainMenu.css({
                    top: menuY,
                    left: menuX
                }).show();
            }

        } else if (e.button == 1) {//中键

        } else if (e.button == 0) {//左键
            if(e.target != null && e.target instanceof JTopo.Node && !self.isSelectedMode){
                if(self.beginNode == null){
                    self.beginNode = e.target;
                    if(self.lineType == "line"){
                        self.link = new JTopo.Link(self.tempNodeA, self.tempNodeZ);
                        self.link.lineType = "line";
                    }else if(self.lineType == "foldLine"){
                        self.link = new JTopo.FoldLink(self.tempNodeA, self.tempNodeZ);
                        self.link.lineType = "foldLine";
                        self.link.direction =  self.config.direction;
                    }else if(self.lineType == "flexLine"){
                        self.link = new JTopo.FlexionalLink(self.tempNodeA, self.tempNodeZ);
                        self.link.direction =  self.config.direction;
                        self.link.lineType = "flexLine";
                    }else if(self.lineType == "curveLine"){
                        self.link = new JTopo.CurveLink(self.tempNodeA, self.tempNodeZ);
                        self.link.lineType = "curveLine";
                    }
                    self.link.dashedPattern = 2;
                    self.link.lineWidth = self.config.lineWidth;
                    self.link.shadow = self.config.showLineShadow;
                    self.link.strokeColor =  JTopo.util.randomColor();
                    this.add(self.link);
                    self.tempNodeA.setLocation(e.x, e.y);
                    self.tempNodeZ.setLocation(e.x, e.y);
                }else if(e.target && e.target instanceof JTopo.Node && self.beginNode !== e.target){//结束连线
                    var endNode = e.target;
                    //判断两个节点是否有循环引用
                    for(var el = 0; el < endNode.outLinks.length ; el++){
                        //存在循环引用，线条变红
                        if(endNode.outLinks[el].nodeZ == self.beginNode){
                            if(self.link)
                                this.remove(self.link);
                            self.beginNode = null;
                            return;
                        }
                    }
                    //节点间是否有重复连线,即起点到终点有两条以上连线
                    for(var el2 = 0; el2 < self.beginNode.outLinks.length ; el2++){
                        //起始节点已经有一条线指向目标节点
                        if(self.beginNode.outLinks[el2].nodeZ == endNode){
                            if(self.link)
                                this.remove(self.link);
                            self.beginNode = null;
                            return;
                        }
                    }
                    //自定义路由器设备不能被别的设备指向
                    if(endNode.dataType == "ECVR"){
                        if(self.link)
                            this.remove(self.link);
                        self.beginNode = null;
                        return;
                    }
                    //自定义网络直接连接的设备必须是交换机
                    if(self.beginNode.dataType == "ECVR"){
                        if(endNode && endNode.dataType != "EC"){
                            if(self.link)
                                this.remove(self.link);
                            self.beginNode = null;
                            return;
                        }else{//每连接一个交换机，就在属性面板上添加一个连接信息属性面板
                            self.createPanel(self,self.beginNode.templateId,endNode.text + "--路由器连接信息",true,endNode.deviceId,endNode.templateId,self.beginNode.id, context + "vmvrManage/showVmvrRouterConnect",false);
                        }
                    }
                    //防火墙只能连接一个路由器
                    if(self.beginNode.dataType == "FW"){
                        if(endNode && endNode.dataType != "VR"){
                            if(self.link)
                                this.remove(self.link);
                            self.beginNode = null;
                            return;
                        }else{//只能连接一个VR
                            if(self.beginNode.outLinks.length > 0){
                                if(self.link)
                                    this.remove(self.link);
                                self.beginNode = null;
                                return;
                            }
                        }
                    }
                    if(self.beginNode.dataType == "VR"){//VR也只能连一个防火墙
                        if(endNode && endNode.dataType == "FW"){
                            var lines = endNode.outLinks.concat(endNode.inLinks);
                            for(var ln = 0 ; ln < lines.length; ln++){
                                if(lines[ln].nodeA.dataType == "VR" || lines[ln].nodeZ.dataType == "VR"){
                                    if(self.link)
                                        this.remove(self.link);
                                    self.beginNode = null;
                                    return;
                                }
                            }
                        }
                    }
                    var l;
                    if(self.lineType == "line"){
                        l = new JTopo.Link(self.beginNode, endNode);
                        l.lineType = "line";
                    }else if(self.lineType == "foldLine"){
                        l = new JTopo.FoldLink(self.beginNode, endNode);
                        l.direction = self.config.direction;
                        l.bundleOffset = self.config.offsetGap;//折线拐角处的长度
                        l.lineType = "foldLine";
                    }else if(self.lineType == "flexLine"){
                        l = new JTopo.FlexionalLink(self.beginNode, endNode);
                        l.direction = self.config.direction;
                        l.lineType = "flexLine";
                        l.offsetGap = self.config.offsetGap;
                    }else if(self.lineType == "curveLine"){
                        l = new JTopo.CurveLink(self.beginNode, endNode);
                        l.lineType = "curveLine";
                    }
                    //连线所处拓扑层级
                    l.topoLevel = editor.stage.topoLevel;
                    l.parentLevel = $("#parentLevel").val();
                    l.fontColor = self.config.lineFontColor;
                    //保存线条所连接的两个节点ID
                    l.deviceA = self.beginNode.deviceId;
                    l.deviceZ = endNode.deviceId;
                    if(self.lineType != "curveLine")
                        l.arrowsRadius = self.config.arrowsRadius;
                    l.strokeColor = self.config.strokeColor;
                    l.lineWidth = self.config.lineWidth;

                    this.add(l);
                    self.beginNode = null;
                    this.remove(self.link);
                    self.link = null;
                }else{
                    self.beginNode = null;
                }
            }else{
                if(self.link)
                    this.remove(self.link);
                self.beginNode = null;
            }
        }
    });

    //动态更新连线坐标
    this.scene.mousemove(function(e){
        if(!self.isSelectedMode && self.beginNode )
            self.tempNodeZ.setLocation(e.x, e.y);
    });

    this.scene.mousedrag(function(e){
        if(!self.isSelectedMode && self.beginNode )
            self.tempNodeZ.setLocation(e.x, e.y);
    });

    //单击编辑器隐藏菜单
    this.stage.click(function(event){
        editor.utils.hideRuleLines();
        if(event.button == 0){
            // 关闭弹出菜单（div）
           $("div[id$='Menu']").hide();
        }
    });

    this.stage.mouseout(function(e){
        //清空标尺线
        editor.utils.hideRuleLines();
        //删掉节点带出来的连线
        if (self.link && !self.isSelectedMode && (e.target == null || e.target === self.beginNode || e.target === self.link)) {
            self.scene.remove(self.link);
        }
    });

    //画布尺寸自适应
    this.stage.mouseover(function(e){
        if(editor.stage){
            var w = $("#contextBody").width(),wc = editor.stage.canvas.width,
                h = $("#contextBody").height(),hc = editor.stage.canvas.height;
            if(w > wc){
                editor.stage.canvas.width = $("#contextBody").width();
            }
            if(h > hc){
                editor.stage.canvas.height = $("#contextBody").height();
            }
            editor.stage.paint();
        }
    });

    //按下ctrl进入多选模式，此时选择节点不能画线
    $(document).keydown(function (e) {
        if(e.shiftKey){//组合键模式
            switch (e.which){
                //放大 ctrl+=
                case  187:
                case  61:
                    //单个节点可以撤销操作
                    if(editor.currentNode instanceof JTopo.Node){
                        //保存初始状态
                        editor.utils.saveNodeInitState();
                        editor.utils.scalingBig();
                        editor.utils.saveNodeNewState();
                    }else{
                        editor.utils.scalingBig();
                    }
                    //return false;
                    break;
                //缩小 ctrl+-
                case 189:
                case  173:
                    if(editor.currentNode instanceof JTopo.Node){
                        //保存初始状态
                        editor.utils.saveNodeInitState();
                        editor.utils.scalingSmall();
                        editor.utils.saveNodeNewState();
                    }else{
                        editor.utils.scalingSmall();
                    }
                    //return false;
                    break;
                case  70:
                    //ctrl+f 全屏显示
                    editor.utils.showInFullScreen(editor.stage.canvas,'RequestFullScreen');
                    //return false;
                    break;
                case  72:
                    //h 帮助
                    editor.showHelpWindow();
                    //return false;
                    break;
                case  71:
                    //ctrl+g 居中显示
                    editor.utils.showInCenter();
                    //return false;
                    break;
                case  73:
                    //shif+I 逆时针旋转
                    if(editor.currentNode instanceof JTopo.Node){
                        editor.utils.saveNodeInitState();
                        editor.utils.rotateSub();
                        editor.utils.saveNodeNewState();
                    }
                    //return false;
                    break;
                case  76:
                    //shift+L 参考线
                    editor.showRuleLine = !editor.showRuleLine;
                    //return false;
                    break;
                case  67:
                    editor.utils.cloneSelectedNodes();
                    //return false;
                    break;
                case  80:
                    //ctrl + p
                    editor.utils.showPic();
                    //return false;
                    break;
                case  82:
                    //单个节点重做
                    if(editor.currentNode instanceof JTopo.Node){
                        editor.utils.reMakeNodeAction();
                    }
                    //return false;
                    break;
                case  83:
                    //ctrl+s 保存
                    editor.saveToplogy(true);
                    //return false;
                    break;
                case  85:
                    //shif+U 顺时针旋转
                    if(editor.currentNode instanceof JTopo.Node){
                        editor.utils.saveNodeInitState();
                        editor.utils.rotateAdd();
                        editor.utils.saveNodeNewState();
                    }
                    //return false;
                    break;
                case  87:
                    jAlert("ctrl + w 另存为");
                    //return false;
                    break;
                case  89:
                    //ctrl+y
                    editor.utils.clear();
                    //return false;
                    break;
                case  90:
                    //单个节点撤销
                    if(editor.currentNode instanceof JTopo.Node){
                        editor.utils.cancleNodeAction();
                    }
                    //return false;
                    break;
            }
        }else if(e.which == 46){//单独按下delete
            editor.utils.deleteSelectedNodes();
            //return false;
        }else if(e.which == 17){//单独按下ctrl
            self.isSelectedMode = true;
            //return false;
        }
    });
    $(document).keyup(function (e) {
        if(e.which == 17){
            self.isSelectedMode = false;
            return false;
        }
    });
    //第一次进入拓扑编辑器,生成stage和scene对象
    if(stageJson == "-1"){
        this.saveToplogy(false);
    }
    //编辑器初始化完毕关闭loading窗口
    this.closeLoadingWindow();
}

/**
 * 图元拖放功能实现
 * @param modeDiv
 * @param drawArea
 */
networkTopologyEditor.prototype.drag = function (modeDiv, drawArea, text) {
    if (!text) text = "";
    var self = this;
    //拖拽开始,携带必要的参数
    modeDiv.ondragstart = function (e) {
        e = e || window.event;
        var dragSrc = this;
        var backImg = $(dragSrc).find("img").eq(0).attr("src");
        backImg = backImg.substring(backImg.lastIndexOf('/') + 1);
        var datatype = $(this).attr("datatype");
        try {
            //IE只允许KEY为text和URL
            e.dataTransfer.setData('text', backImg + ";" + text + ";" + datatype);
        } catch (ex) {
            console.log(ex);
        }
    };
    //阻止默认事件
    drawArea.ondragover = function (e) {
        e.preventDefault();
        return false;
    };
    //创建节点
    drawArea.ondrop = function (e) {
        e = e || window.event;
        var data = e.dataTransfer.getData("text");
        var img, text,datatype;
        if (data) {
            var datas = data.split(";");
            if (datas && datas.length == 3) {
                img = datas[0];
                text = datas[1];
                datatype = datas[2];
                var node = new JTopo.Node();
                node.fontColor = self.config.nodeFontColor;
                node.setBound((e.layerX ? e.layerX : e.offsetX) - self.scene.translateX - self.config.defaultWidth / 2, (e.layerY ? e.layerY : e.offsetY) - self.scene.translateY - self.config.defaultHeight / 2,self.config.defaultWidth,self.config.defaultHeight);
                //设备图片
                node.setImage('./icon/' + img);
                //var cuurId = "device" + (++self.modeIdIndex);
                var cuurId = "" + new Date().getTime() * Math.random();
                node.deviceId = cuurId;
                node.dataType = datatype;
                node.nodeImage = img;
                ++self.modeIdIndex;
                node.text = text;
                node.layout = self.layout;
                //节点所属层次
                node.topoLevel = parseInt($("#selectLevel").find("option:selected").val());
                //节点所属父层次
                node.parentLevel = $("#parentLevel").val();
                //子网连接点的下一个层,默认为0
                node.nextLevel = "0";
                self.scene.add(node);

                //加载属性面板
                /* if(self.currDataType)
                 self.clearOldPanels(self.currDataType)
                 self.currDeviceId = cuurId;
                 self.createNewPanels(datatype,self.templateId,self.currentModeId);*/
                //self.currDataType = datatype;
                self.currentNode = node;
            }
        }
        if (e.preventDefault()) {
            e.preventDefault();
        }
        if (e.stopPropagation()) {
            e.stopPropagation();
        }
    }
}

//编辑器实例
var editor = new networkTopologyEditor('mainControl');

//工具方法
editor.utils = {
    //获取所有选择的节点实例
    getSelectedNodes : function(){
        var selectedNodes = [];
        var nodes = editor.scene.selectedElements;
        return nodes.forEach(function(n){
            if(n.elementType === "node")
                selectedNodes.push(n);
        }),selectedNodes;
    },
    //获取标尺线对象
    getRuleLines : function(){
        var ruleLines = [];
        editor.stage.childs.forEach(function(s){
            s.childs.forEach(function(n){
                if(n.elementType === "link" && n.lineType == "rule")
                    ruleLines.push(n);
            });
        });
        return ruleLines;
    },
    //删除标尺线
    clearRuleLines : function(){
        for(var i=0 ; i < editor.ruleLines.length ; i++){
            editor.scene.remove(editor.ruleLines[i]);
        }
        editor.ruleLines = [];
        return this;
    },
    //重新创建标尺线对象
    reCreateRuleLines : function(){
        if(  editor.ruleLines && editor.ruleLines.length == 2) {
            editor.scene.add(editor.ruleLines[0]);
            editor.scene.add(editor.ruleLines[1]);
        }
        return this;
    },
    //显示标尺线
    showRuleLines : function (x,y) {
        if(  editor.ruleLines && editor.ruleLines.length == 2) {
            editor.ruleLines[0].visible = true;
            editor.ruleLines[1].visible = true;
           /* editor.ruleLines[0].nodeA.setLocation(0 - editor.scene.translateX, y );
            editor.ruleLines[0].nodeZ.setLocation(JTopo.stage.width - editor.scene.translateX,y);
            editor.ruleLines[1].nodeA.setLocation(x,0 - editor.scene.translateY);
            editor.ruleLines[1].nodeZ.setLocation(x,JTopo.stage.height - editor.scene.translateY);*/
            editor.ruleLines[0].nodeA.y = y;
            editor.ruleLines[0].nodeZ.y = y;
            editor.ruleLines[1].nodeA.x = x;
            editor.ruleLines[1].nodeZ.x = x;
        }
        return this;
    },
    //隐藏标尺线
    hideRuleLines : function () {
        if( editor.ruleLines &&  editor.ruleLines.length == 2){
            editor.ruleLines[0].visible = false;
            editor.ruleLines[1].visible = false;
        }
        return this;
    },
    //节点分组合并
    toMerge : function(){
        var selectedNodes = this.getSelectedNodes();
        // 不指定布局的时候，容器的布局为自动(容器边界随元素变化）
        var container = new JTopo.Container();
        container.textPosition = 'Top_Center';
        container.fontColor = editor.config.fontColor;
        container.borderColor = editor.config.borderColor;
        container.borderRadius = editor.config.borderRadius;
        //节点所属层次
        container.topoLevel = editor.stage.topoLevel;
        container.parentLevel = $("#parentLevel").val();
        editor.scene.add(container);
        selectedNodes.forEach(function(n){
            container.add(n);
        });
    },
    //分组拆除
    toSplit : function(){
        if(editor.currentNode instanceof  JTopo.Container){
            editor.currentNode.removeAll();
            editor.scene.remove(editor.currentNode);
        }
    },
    //删除连线
    deleteLine : function(){
        if(editor.currentNode instanceof  JTopo.Link){
            editor.scene.remove(editor.currentNode);
            if(editor.currentNode.id)
                editor.deleteNodeById(editor.currentNode.id,"link");
            editor.currentNode = null;
            editor.lineMenu.hide();
        }
    },
    //删除节点
    deleteNode : function(n){
        editor.scene.remove(n);
        if (n.id)
            editor.deleteNodeById(n.id, n.elementType, n.dataType);
        editor.currentNode = null;
        //连线重置
        editor.beginNode = null;
        if (editor.link)
            editor.scene.remove(editor.link);
        editor.link = null;
    },
    //删除选择的节点
    deleteSelectedNodes : function(){
        var self = this;
        var nodes = editor.scene.selectedElements;
        if(nodes && nodes.length > 0){
            jConfirm("确定要移除该设备吗?","移除设备",function(ok){
                if(ok){
                    editor.showLoadingWindow();
                    for(var i=0 ; i < nodes.length ; i++){
                        self.deleteNode(nodes[i]);
                    }
                    editor.closeLoadingWindow();
                }
            });
        }
    },
    //放大
    scalingBig : function(){
        if(editor.currentNode instanceof  JTopo.Node){
            editor.currentNode.scaleX += editor.config.nodeScale;
            editor.currentNode.scaleY += editor.config.nodeScale;
        }else{
            editor.stage.zoomOut(editor.stage.wheelZoom);
        }
    },
    //缩小
    scalingSmall : function(){
        if(editor.currentNode instanceof  JTopo.Node){
            editor.currentNode.scaleX -= editor.config.nodeScale;
            editor.currentNode.scaleY -= editor.config.nodeScale;
        }else{
            editor.stage.zoomIn(editor.stage.wheelZoom);
        }
    },
    //顺时针旋转
    rotateAdd : function(){
        if(editor.currentNode instanceof  JTopo.Node) {
            editor.currentNode.rotate += editor.config.rotateValue;
        }
    },
    //逆时针旋转
    rotateSub : function(){
        if(editor.currentNode instanceof  JTopo.Node) {
            editor.currentNode.rotate -= editor.config.rotateValue;
        }
    },
    //清空编辑器
    clear : function(){
        //删除节点表对应的节点记录
        editor.deleteAllNodes(editor.templateId);
    },
    //拓扑图预览
    showPic : function () {
        if(editor.ruleLines && editor.ruleLines.length > 0){
            this.clearRuleLines();
        }
        editor.stage.saveImageInfo();
    },
    //复制节点
    cloneNode: function (n) {
        if(n instanceof  JTopo.Node) {
            var newNode = new JTopo.Node();
            n.serializedProperties.forEach(function (i) {
                //只复制虚拟机的模板属性
                if (i == "templateId" && n.dataType != "VM") return true;
                newNode[i] = n[i];
            });
            newNode.id = "";
            newNode.alpha = editor.config.alpha;
            newNode.strokeColor = editor.config.nodeStrokeColor;
            newNode.fillColor = editor.config.fillColor;
            newNode.shadow = editor.config.shadow;
            newNode.shadowColor = editor.config.shadowColor;
            newNode.font = editor.config.font;
            newNode.fontColor = editor.config.nodeFontColor;
            newNode.borderRadius = null;
            newNode.shadowOffsetX = editor.config.shadowOffsetX;
            newNode.shadowOffsetY = editor.config.shadowOffsetY;
            newNode.layout = n.layout;
            newNode.selected = false;
            //var deviceNum = ++editor.modeIdIndex;
            //newNode.deviceId = "device" + deviceNum;
            newNode.deviceId = "" + new Date().getTime() * Math.random();;
            newNode.setLocation(n.x + n.width, n.y + n.height);
            newNode.text = n.text;
            newNode.setImage(n.image);
            editor.scene.add(newNode);
        }
    },
    //复制选择的节点
    cloneSelectedNodes : function(){
        var self = this;
        var nodes = editor.scene.selectedElements;
        nodes.forEach(function(n){
            if(n.elementType === "node")
                self.cloneNode(n);
        })
    },
    //全屏显示
    showInFullScreen: function (element, method) {
        var usablePrefixMethod;
        ["webkit", "moz", "ms", "o", ""].forEach(function (prefix) {
                if (usablePrefixMethod) return;
                if (prefix === "") {
                    // 无前缀，方法首字母小写
                    method = method.slice(0, 1).toLowerCase() + method.slice(1);
                }
                var typePrefixMethod = typeof element[prefix + method];
                if (typePrefixMethod + "" !== "undefined") {
                    if (typePrefixMethod === "function") {
                        usablePrefixMethod = element[prefix + method]();
                    } else {
                        usablePrefixMethod = element[prefix + method];
                    }
                }
            }
        );
        return usablePrefixMethod;
    },
    //居中显示
    showInCenter : function(){
        editor.stage.centerAndZoom();
    },
    //添加节点描述文字
    addNodeText : function(x,y){
        var a = editor.currentNode.nodeA,z = editor.currentNode.nodeZ;
        editor.deviceEditText.css({
            top: y,
            left : x,
            display : "block"
        });
        editor.deviceEditText.attr('value', editor.currentNode.text);
        editor.deviceEditText.focus();
        editor.deviceEditText.select();
        editor.currentNode.text = "";
    },
    //重做与撤销
    undoReDo : function(){
        if(editor.currentNode instanceof  JTopo.Node)
            editor.currentNode.restore();
    },
    //创建标尺线
    createRuleLines : function(x,y){
        if(editor.showRuleLine){
            //新建两条定点连线
            if(editor.ruleLines.length == 0){
                var nodeHA = new JTopo.Node(),nodeHZ = new JTopo.Node();
               /* nodeHA.setLocation(0 - editor.scene.translateX, y );
                nodeHZ.setLocation(JTopo.stage.width - editor.scene.translateX,y);*/
                nodeHA.setLocation(JTopo.stage.width * -2, y );
                nodeHZ.setLocation(JTopo.stage.width * 2,y);
                nodeHA.setSize(1,1);
                nodeHZ.setSize(1,1);
                var nodeVA = new JTopo.Node(),nodeVZ = new JTopo.Node();
              /*  nodeVA.setLocation(x,0 - editor.scene.translateY);
                nodeVZ.setLocation(x,JTopo.stage.height - editor.scene.translateY); */
                nodeVA.setLocation(x,JTopo.stage.height * -2);
                nodeVZ.setLocation(x,JTopo.stage.width * 2);
                nodeVA.setSize(1,1);
                nodeVZ.setSize(1,1);
                var linkH = new JTopo.Link(nodeHA,nodeHZ);
                var linkV = new JTopo.Link(nodeVA,nodeVZ);
                linkH.lineType = "rule";
                linkV.lineType = "rule";
                linkH.lineWidth = 1; // 线宽
                linkH.dashedPattern = 2; // 虚线
                linkV.lineWidth = 1; // 线宽
                linkV.dashedPattern = 2; // 虚线
                linkH.strokeColor = "255,0,0";
                linkV.strokeColor = "0,255,0";
                //保存标尺线
                editor.ruleLines.push(linkH);
                editor.ruleLines.push(linkV);
                editor.scene.add(linkH);
                editor.scene.add(linkV);
            }else{
                editor.utils.showRuleLines(x,y);
            }
        }
    },
    //获取所有的容器对象
    getContainers : function(){
        var containers = [];
        editor.stage.childs.forEach(function(s){
            s.childs.forEach(function(n){
                if(n.elementType === "container")
                    containers.push(n);
            });
        });
        return containers;
    },
    //根据指定的key返回节点实例
    getNodeByKey : function(key,value){
        var node = null;
        editor.stage.childs.forEach(function(s){
            s.childs.forEach(function(n){
                if(n.elementType === "node" && n[key] == value){
                    node = n;
                    return node;
                }
            });
        });
        return node;
    },
    //撤销对节点的操作
    cancleNodeAction : function(){
        if(editor.currentNode.currStep <= 0)
            return;
        --editor.currentNode.currStep;
        for(var p in editor.currentNode){
            if(p != "currStep")
                editor.currentNode[p] = (editor.currentNode.historyStack[editor.currentNode.currStep])[p];
        }
    },
    //重做节点操作
    reMakeNodeAction : function(){
        if(editor.currentNode.currStep >= editor.currentNode.maxHistoryStep ||
            editor.currentNode.currStep >= editor.currentNode.historyStack.length -1)
            return;
        editor.currentNode.currStep++;
        for(var q in editor.currentNode){
            if(q != "currStep")
                editor.currentNode[q] = (editor.currentNode.historyStack[editor.currentNode.currStep])[q];
        }
    },
    //保存节点新的状态
    saveNodeNewState : function(){
        //如果历史栈超过最大可记录历史长度，丢弃第一个元素
        if(editor.currentNode.historyStack.length >= editor.currentNode.maxHistoryStep + 1){
            editor.currentNode.historyStack.shift();
        }
        editor.currentNode.historyStack.push(JTopo.util.clone(editor.currentNode));
        editor.currentNode.currStep = editor.currentNode.historyStack.length - 1;
    },
    //保存节点初始状态,便于回退
    saveNodeInitState: function () {
        if(!editor.currentNode.hasInitStateSaved){
            editor.currentNode.historyStack.push(JTopo.util.clone(editor.currentNode));
            editor.currentNode.hasInitStateSaved = true;
        }
    },
    //查找节点,便居中闪动显示
    findNodeAndFlash : function (text) {
        if(!text) return;
        var self = this;
        var text = text.trim();
        var nodes =  editor.stage.find('node[text="'+text+'"]');
        if(nodes.length > 0){
            var node = nodes[0];
            this.unSelectAllNodeExcept(node);
            node.selected = true;
            var location = node.getCenterLocation();
            // 查询到的节点居中显示
            editor.stage.setCenter(location.x, location.y);
            function nodeFlash(node, n){
                if(n == 0) {
                    //self.unSelectAllNodeExcept(node);
                    return;
                };
                node.selected = !node.selected;
                setTimeout(function(){
                    nodeFlash(node, n-1);
                }, 300);
            }
            // 闪烁几下
            nodeFlash(node, 6);
        }else{
            jAlert("没有找到该节点,请输入完整的节点名称!")
        }
    },
    hasUnSavedNode : function () {
        var saved = true;
        editor.stage.childs.forEach(function(s){
            if(!saved) return false;
            s.childs.forEach(function(n){
                //id属性无有效值，说明该节点没有保存到数据库,排除参考线
                if(!n.id){
                    if(n.elementType == "link"){
                        if(n.lineType != "rule"){
                            saved = false;
                            return false;
                        }
                    }else{
                        saved = false;
                        return false;
                    }
                }
            });
        });
        return saved;
    },
    //取消出参数节点外所有节点的选中状态
    unSelectAllNodeExcept : function (node) {
        editor.stage.childs.forEach(function(s){
            s.childs.forEach(function(n){
                //id属性无有效值，说明该节点没有保存到数据库
                if(n.deviceId != node.deviceId){
                    n.selected = false;
                }
            });
        });
    },
    //查找是否当前层已经有子网保存
    hasSavedSubnet : function () {
        var saved = false;
        editor.stage.childs.forEach(function(s){
            s.childs.forEach(function(n){
                if(n.id && n.elementType == "node" && n.dataType == "subnet"){
                    saved = true;
                    return saved;
                }
            });
        });
        return saved;
    },
    getNode : function (id) {
        var node;
        $.ajax({
            url: context + "topologyManage/getNode",
            async: false,
            type: "POST",
            dataType: "json",
            data: {
                "id":id
            },
            error: function () {
                jAlert("服务器异常，请稍后重试..");
            },
            success: function (response) {
                var err = response.errorInfo;
                // 错误处理
                if (err && err != "ok") {
                    if (err == "logout") {
                        handleSessionTimeOut();
                        return;
                    } else {
                        jAlert(err);
                    }
                } else {
                    node = response.node;
                }
            }
        });
        return node;
    },
    saveNode : function (id,nextLevel) {
        var ok = false;
        $.ajax({
            url: context + "topologyManage/saveNode",
            async: false,
            type: "POST",
            dataType: "json",
            data: {
                "id":id,
                "nextLevel":nextLevel
            },
            error: function () {
                jAlert("服务器异常，请稍后重试..");
            },
            success: function (response) {
                var err = response.errorInfo;
                // 错误处理
                if (err && err != "ok") {
                    if (err == "logout") {
                        handleSessionTimeOut();
                        return false;
                    } else {
                        jAlert(err);
                    }
                } else {
                    ok = true;
                }
            }
        });
        return ok;
    }
};
