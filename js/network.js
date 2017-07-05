var allNetworkProperties={"EC":[{"title":"网络属性","url":context+"extchange-network.html"}],
		                  "FW":[],
		                 "VR":[{"title":"网络属性","url":context+"vr-network.html"},
                               {"title":"路由器连接信息","url":context+"vr-routerconnectinfo.html"},
                               {"title":"路由规则集","url":context+"vr-routerrule.html"} ,
		                       {"title":"防火墙出口规则","url":context+"firewalloutrules.html"},
		                       {"title":"防火墙入口规则","url":context+"firewallinrules.html"},
		                       /* {"title":"网络访问规则集","url":context+"vr-networkaclruleset.html"},*/
                              /* {"title":"端口转发规则","url":context+"vr-portforwardrule.html"},*/
                               {"title":"网络转发规则信息","url":context+"vr-networkPFRuleSet.html"}
                              /* {"title":"虚拟路由器类型","url":context+"vr-networktype.html"}*/],
		    		      "VM":[{"title":"虚拟机属性","url":context+"vm.html"}]
		                  };
var currentid;
var NetworkTopology = function(a,b)
{
	var c=this;
	c.props=a;
	c.control=$(b);
};
NetworkTopology.prototype.clearOldPanels=function(b)
{
	var c=this,a=c.props,d=a[b];
	if (c.control)
	{
			if (d)
			{
				var i;
				for (i=0;i<d.length;i++)
				{
					try {
						c.control.accordion('remove',d[i]["title"]);
					} catch (e) {
					}
				}
			}
	}
};
NetworkTopology.prototype.createNewPanels=function(b,templateid,moduleid)
{
	var c=this,a=c.props,d=a[b];
	if (d)
	{
		this.clearOldPanels(b);
		var i=0;
		for (i=0;i<d.length;i++)
		{
			c.control.accordion('add', {
				title : d[i]["title"],
				content : "",
				selected : false,
				method : "post",
				href : "",
				loadingMessage : "loading..."
			});
			var e=c.control.accordion('getPanel',d[i]["title"]);
			e.panel("refresh",d[i]["url"]+"?templateid="+templateid+"&moduleid="+moduleid);
		}
		
	}
};

/**
 * 切换的时候会引发重复加载，创建的时候统一加载好属性面板
 * @param b
 * @param templateid
 * @param moduleid
 */
NetworkTopology.prototype.selectPanel=function(b,templateid,moduleid)
{
	return;
	var c=this,a=c.props;
	if (!b || !moduleid) return;
	var m=document.getElementById(moduleid);
	if (m)
	{
		dd=m.datatype;
	    if (dd)
	    {
	    	d=a[dd];
			if (d)
			{
				var e=c.control.accordion('getPanel',b);
				if (e)
				{
					var i=0;
					for (i=0;i<d.length;i++)
					{
						if (b==d[i]["title"])
						{
							e.panel("refresh",d[i]["url"]+"?templateid="+templateid+"&moduleid="+moduleid);
							break;
						}
					}
				}
			}
	    }
	}
};

NetworkTopology.prototype.saveToplogy = function(toplogyXML){
	$.ajax({
		url : context + "topology/saveTopologyXML",
		async : true,
		type : "POST",
		dataType : "json",
		data:{
			"topologyXML":toplogyXML,
			"templateId":com.xjwgraph.Global.templateid
		},
		error : function() {
            jAlert("服务器异常，请稍后重试..");
		},
		success : function(response) {
			var err = response.errorInfo;
			// 错误处理
			if (err && err != "ok") {
				if (err == "logout") {
					//handleSessionTimeOut();
					return;
				} else {
					alert(err);
				}
			} else {
				jAlert("保存成功");
			}
		}
	});
};

NetworkTopology.prototype.getEnvTemplate = function(){
	var envListRes;
	$.ajax({
		url : context + "topology/getAllTemplates",
		async : false,
		type : "POST",
		dataType : "json",
		data:{
		},
		error : function() {
			alert("服务器异常，请稍后重试..");
		},
		success : function(response) {
			envListRes= response.envList;
		}
	});
	return envListRes;
};

NetworkTopology.prototype.initPropertyPanle = function(){
	var c = this;
	//回退是清除属性面板
    for(var datatype in allNetworkProperties){
    	c.clearOldPanels(datatype);
    }
};
/**
 * 缩放拓扑图
 */
NetworkTopology.prototype.scaling = function (l) {
    var a = com.xjwgraph.Global;
    if (l && a) {
        a.lineTool.initScaling(l);
        a.modeTool.initScaling(l);
        a.baseTool.initScaling(l);
    }
};
