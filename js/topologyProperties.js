/**
 * create by cy 2015/01/09
 */

var topologyProperties = {};

/**
 * 检查是否为空
 */
topologyProperties.checkNull = function (srcEle) {
    var curId = $(srcEle).attr("id");
    if (!$.trim($("#" + curId).val())) {
        $("#" + curId + "_info").show().find("td").text("该项不能为空");
        return false;
    }
    $("#" + curId + "_info").hide().find("td").text("");
    return true;
};

/**
 * 检查是否为正整数
 */
topologyProperties.checkIsNum=function(srcEle){
	var curObj=$(srcEle);
	var curId=curObj.attr("id");
	var curValue=$.trim(curObj.val());
	var infoObj=$('#'+curId+'_info');
	if(!curValue){
		infoObj.show().find('td').text("该项不能为空");
		return false;
	}
	var reg=/^[0-9]*[1-9][0-9]*$/;
	if(!reg.test(curValue)){
		infoObj.show().find('td').text("请输入正整数");
		return false;
	}
	infoObj.hide().find("td").text("");
	return true;
}

/**
 * 检查规则属性面板是否为空
 */
topologyProperties.checkSelNull = function (srcEle) {
    var curId = $(srcEle).attr("id");
    if (!$.trim($("#" + curId).val())) {
        $("#" + curId + "_info").show().text("该项不能为空");
        return false;
    }
    $("#" + curId + "_info").hide().text("");
    return true;
};

/**
 * 检查路由器id是否为空
 */
topologyProperties.checkRouterNull = function (srcEle) {
    var curId = $(srcEle).attr("id");
    if (!$.trim($("#" + curId).val())) {
        $("#" + curId + "_info").show().text("路由器id不能为空");
        return false;
    }
    $("#" + curId + "_info").hide().text("");
    return true;
};

/**
 * 检查路由器id是否为空  vmvr
 */
topologyProperties.checkVMVRrouterNull = function (srcEle) {
    var curId = $(srcEle).attr("id");
    if (!$.trim($("#" + curId).val())) {
        $("#" + curId + "_info").show().find("td").text("路由器id不能为空");
        return false;
    }
    $("#" + curId + "_info").hide().find("td").text("");
    return true;
};

/**
 * 检查端口转发规则属性面板是否为空
 */
topologyProperties.checkPFNull = function (vmEle,pfEle) {
    var vmId = $(vmEle).attr("id");
    var pfId = $(pfEle).attr("id");
    if (!$.trim($("#" + vmId).val())&&!$.trim($("#" + pfId).val())) {
    	$("#"+vmId+"_info").parent().show();
    	$("#"+vmId+"_info").text("该项不能为空");
    	$("#"+pfId+"_info").text("该项不能为空");
        return false;
    }else if(!$.trim($("#" + vmId).val())&&''!=$.trim($("#" + pfId).val())){
    	$("#"+vmId+"_info").parent().show();
    	$("#"+vmId+"_info").text("该项不能为空");
    	$("#"+pfId+"_info").text("");
        return false;
    }else if(''!=$.trim($("#" + vmId).val())&&!$.trim($("#" + pfId).val())){
    	$("#"+vmId+"_info").parent().show();
    	$("#"+vmId+"_info").text("");
    	$("#"+pfId+"_info").text("该项不能为空");
        return false;
    }else{
    	$("#"+vmId+"_info").parent().hide();
    	$("#"+vmId+"_info").text("");
    	$("#"+pfId+"_info").text("");
    	return true;
    }
};

/**
 * 检查是否为ip地址
 */
topologyProperties.checkIsIp = function(srcEle){
	var curId = $(srcEle).attr("id");
	// 验证是否为空
	if (!$.trim($("#" + curId).val())) {
		$("#" + curId + "_info").show().find("td").text("该项不能为空");
        return false;
    }
	var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	if(!reg.test($.trim($("#" + curId).val()))){
		$("#" + curId + "_info").show().find("td").text("请输入Ip地址");
        return false;
	}
	$("#" + curId + "_info").hide().find("td").text("");
	return true;
};

/**
 * VM 复选框控制函数
 */
topologyProperties.chxVmCheckfuc = function(srcEle,tarEle){
	var chx = $(srcEle).attr("checked");
	var tar_id = $(tarEle).attr("id");
	if (chx == "checked") {
		$("#"+tar_id).attr("readonly",false);
		$("#"+tar_id).on('input propertychange',function(){
			topologyProperties.checkIsIp("#"+tar_id)
		});
	} else {
		$("#"+tar_id).attr("readonly","readonly").val("");
		$('#'+tar_id).off('input propertychange');
		$("#"+tar_id+"_info").hide().find("td").text("");
	} 
};

/**
 * routerConnect复选框点击事件
 */
topologyProperties.chxOnCheck = function(srcEle,vmvrip4Topology){
	var chx = $(srcEle).attr("checked");
	if (chx == "checked") {
		$("#"+vmvrip4Topology).attr("readonly",false);
		$("#"+vmvrip4Topology).on('input propertychange',function(){
			topologyProperties.checkIsIp("#"+vmvrip4Topology)
		}); 
	} else {
		$("#"+vmvrip4Topology).attr("readonly","readonly").val("");
		$('#'+vmvrip4Topology).off('input propertychange');
		$("#"+vmvrip4Topology+"_info").hide().find("td").text("");
	} 
};

/**
 * 
 */
topologyProperties.checkprotocolPort = function(srcEle,tarEle){
	var curId = $(srcEle).attr("id");
	var tarId = $(tarEle).attr("id");
	var curVal = $("#" + curId).val();
    if (!$.trim(curVal)) {
    	$("#" + tarId).val("");
    	$("#" + tarId + "_info").show().find("td").text("该项不能为空");
        $("#" + curId + "_info").show().find("td").text("该项不能为空");
        return false;
    }else if('RDP'==$.trim(curVal)){
    	$("#" + tarId).val("3389");
    	$("#" + tarId + "_info").hide().find("td").text("");
    	$("#" + curId + "_info").hide().find("td").text("");
    	return true;
    }else if('SSH'==$.trim(curVal)){
    	$("#" + tarId).val("22");
    	$("#" + tarId + "_info").hide().find("td").text("");
    	$("#" + curId + "_info").hide().find("td").text("");
   	 	return true;
    }
   
}

/**
 *  保存虚拟机属性(新增&修改)
 */
topologyProperties.saveVmTemplateTopology=function(){
	//取值
	var templateName=$.trim($('#templateName4Topology').val());//模板名称
	var displayName=$.trim($('#displayName4Topology').val());//虚拟机显示名称
	var networkId=$('#networkId4Topology').val();//子网模板名称
	var serviceOffering=$('#serviceOffering4Topology').val();//计算方案
	var csTemplateName=$('#csTemplateName4Topology').val();//平台主机模板名称
	var diskOffering=$('#diskOffering4Topology').val();//磁盘方案
	var spendTime=$.trim($('#spendTime4Topology').val());//预计部署使用时长（秒）
	var user=$.trim($('#user4Topology').val());//演练使用用户名
	var password=$.trim($('#password4Topology').val());//演练使用用户口令
	var protocol=$('#protocol4Topology').val();//访问协议
	var port=$.trim($('#port4Topology').val());//端口
	
	var isIpfixed=$('#isIpfixed4Topology').attr('checked');//Ip地址是否固定
	isIpfixed=isIpfixed?true:false;
	var ipv4=$.trim($('#ipv44Topology').val());//IPV4地址
	
	var isReturn=$('#isReturn4Topology').attr('checked');//查询时是否返回
	isReturn=isReturn?true:false;
	var isCanlogin=$('#isCanlogin4Topology').attr('checked');//是否可登陆
	isCanlogin=isCanlogin?true:false;
	var isNeedAllocated=$('#isNeedAllocated4Topology').attr('checked');//是否可分配
	isNeedAllocated=isNeedAllocated?true:false;
	var isTarget=$('#isTarget4Topology').attr('checked');//是否是目标机
	isTarget=isTarget?true:false;
	var isExpendForUser=$('#isExpendForUser4Topology').attr('checked');//是否可增加
	isExpendForUser=isExpendForUser?true:false;
	var isweb = $('#isweb4Topology').attr('checked');//是否web服务器
	isweb = isweb?true:false;
	
	var vmRepeatNum=$('#vmRepeatNum4Topology').val();//扩展次数
	
	var envTemplateId=$('#envTemplateIdHidden').val();
	var vmtemplateId=$('#templateIdHidden').val();
	var moduleId = $("#moduleIdHidden").val();
    var jtopoNode = editor.utils.getNodeByKey("deviceId",moduleId);
    // 获取jTopo.node 
    var nodeJson = jtopoNode.toJson();
    // 替换undefined为# 
    if(nodeJson){
        nodeJson = nodeJson.replace(new RegExp('undefined',"gm"),'#');
    }
    
	//验证
	var temp1 = topologyProperties.checkNull("#templateName4Topology");
	temp1 = topologyProperties.checkNull("#displayName4Topology") && temp1;
	temp1 = topologyProperties.checkNull("#networkId4Topology") && temp1;
	temp1 = topologyProperties.checkNull("#serviceOffering4Topology") && temp1;
	temp1 = topologyProperties.checkNull("#csTemplateName4Topology") && temp1;
	// 放开对diskOffering4Topology的非空判断
	//temp1 = topologyProperties.checkNull("#diskOffering4Topology") && temp1;
	temp1 = topologyProperties.checkIsNum("#spendTime4Topology") && temp1;
	temp1 = topologyProperties.checkNull("#user4Topology") && temp1;
	temp1 = topologyProperties.checkNull("#password4Topology") && temp1;
	//temp1 = topologyProperties.checkNull("#protocol4Topology") && temp1;
	//temp1 = topologyProperties.checkNull("#port4Topology") && temp1;
	//当isIpfixed为true时，则验证
	if(isIpfixed){
		temp1 = topologyProperties.checkIsIp("#ipv44Topology") && temp1;
	}
	
	if (!temp1) {
		return;
	}
	
	$('#saveVmBtn').attr('disabled',true);
	$.ajax({
		url:context+'/templateManage/saveVmTemplateTopology',
		async:true,
		type:'post',
		data:{
			"envTemplateId":envTemplateId,"vmtemplateId":vmtemplateId,"nodeJson":nodeJson,
			"vmtemplateName":csTemplateName,
			"templateName":templateName,"displayName":displayName,"networkId":networkId,"serviceOffering":serviceOffering,
			"diskOffering":diskOffering,"spendTime":spendTime,"user":user,"password":password,"protocol":protocol,"port":port,
			"isIpfixed":isIpfixed,"ipv4":ipv4,"isReturn":isReturn,"canLogin":isCanlogin,"needAllocated":isNeedAllocated,
			"isTarget":isTarget,"isExpendForUser":isExpendForUser,"isweb":isweb,"vmRepeatNum":vmRepeatNum
		},
		dataType:'json',
		success:function(data){
			 var err = data.errorInfo;
	           // 错误处理
	           if (err && err != "ok") {
	               if (err == "logout") {
	                   handleSessionTimeOut();
	                   $("#saveVmBtn").attr("disabled",false);
	               } else {
	                   jAlert(err);
	                   $("#saveVmBtn").attr("disabled",false);
	               }
	               return;
	           } else {
	        	   $("#saveVmBtn").attr("disabled",false);
	        	   //设置值给node
	        	   jtopoNode.id = data.nodeId;
	        	   jtopoNode.templateId = data.vmtemplateId;
	        	   jAlert("保存成功！");
	        	   //设置弹出框自动消除 
	        	   setTimeout(jOk, 2000);
	        	   // 交换机属性面板刷新一次
	        	   editor.resetPanelProperty('虚拟机属性','VM','0',data.vmtemplateId);
	           }
		},
		error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
        }  
	});
}

/**
 *保存交换机属性(新增or修改)
 */
topologyProperties.saveTopologySwitch = function(){
	var networkName = $("#networkName4Topology").val();
    var displayName = $("#displayName4Topology").val();
    var networkTypeId = $("#networkTypeId4Topology").val();
    var envTemplateId = $("#ExtChangeenvTemplateId4Topology").val();
    var networkServiceName = $("#networkServiceName4Topology").val();
    var gatewayIp = $("#gatewayIp4Topology").val();
    var netmask = $("#netmask4Topology").val();
    var dns1 = $("#dns14Topology").val();
    var dns2 = $("#dns24Topology").val();
    var networkId = $("#networkIdHidden").val();
    
    var moduleId = $("#moduleIdHidden").val();
    var jtopoNode = editor.utils.getNodeByKey("deviceId",moduleId);
    // 获取jTopo.node 
    var nodeJson = jtopoNode.toJson();
    // 替换undefined为# 
    if(nodeJson){
        nodeJson = nodeJson.replace(new RegExp('undefined',"gm"),'#');
    }
    //非空验证
    var temp1 = topologyProperties.checkNull("#networkName4Topology");
    temp1 = topologyProperties.checkNull("#displayName4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#networkTypeId4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#ExtChangeenvTemplateId4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#networkServiceName4Topology") && temp1;
    temp1 = topologyProperties.checkIsIp("#gatewayIp4Topology") && temp1;
    temp1 = topologyProperties.checkIsIp("#netmask4Topology") && temp1;
    temp1 = topologyProperties.checkIsIp("#dns14Topology") && temp1;
    temp1 = topologyProperties.checkIsIp("#dns24Topology") && temp1;
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#extchangeSave").attr("disabled",true);
    $.ajax({
       url: context + "/switchesManage/saveTopologySwitch",
       async: true,
       type: 'post',
       data: {"networkName": networkName, "displayName": displayName, "networkTypeId":networkTypeId,"envTemplateId": envTemplateId,
           "networkServiceName": networkServiceName,"gatewayIp":gatewayIp,"netmask":netmask,"dns1":dns1,"dns2":dns2,
           "nodeJson":nodeJson,"networkId":networkId},
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#extchangeSave").attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#extchangeSave").attr("disabled",false);
               }
               return;
           } else {
        	   $("#extchangeSave").attr("disabled",false);
        	   //console.info(data.networkId+'----'+data.nodeId);
        	   //设置值给node
        	   jtopoNode.id = data.nodeId;
        	   jtopoNode.templateId = data.networkId;
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   // 虚拟机属性面板刷新一次
        	   editor.resetPanelProperty('子网属性','EC','0',data.networkId);
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};

/**
 * 保存路由器属性(新增or修改)
 */
topologyProperties.saveRouterTopology = function(){
	var routerId = $("#routerIdHidden").val();
	var routerName = $("#routerName4Topology").val();
    var envTemplateId = $("#envTemplateId4Topology").val();
    var routerType = $("#routerType4Topology").val();
    var isVpc = $("#isVpc4Topology").attr("checked");
    var networkId = $("#networkId4Topology").val();
    var isredundancyrouter = $("#isredundancyrouter4Topology").attr("checked");
    var csTemplateName = $("#csTemplateName4Topology").val();
    var serviceOffering = $("#serviceOffering4Topology").val();
    
    var moduleId = $("#moduleIdHidden").val();
    var jtopoNode = editor.utils.getNodeByKey("deviceId",moduleId);
    // 获取jTopo.node 
    var nodeJson = jtopoNode.toJson();
    // 替换undefined为# 
    if(nodeJson){
        nodeJson = nodeJson.replace(new RegExp('undefined',"gm"),'#');
    }
    //非空验证
    var temp1 = topologyProperties.checkNull("#routerName4Topology");
    temp1 = topologyProperties.checkNull("#envTemplateId4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#routerType4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#networkId4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#csTemplateName4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#serviceOffering4Topology") && temp1;
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#saveRouterBtn").attr("disabled",true);
    $.ajax({
       url: context + "/routerManage/saveTopologyRouter",
       async: true,
       type: 'post',
       data: {"routerId": routerId, "routerName": routerName, "envTemplateId":envTemplateId,"routerType": routerType,
           "isVpc": isVpc,"networkId":networkId,"isredundancyrouter":isredundancyrouter,"csTemplateName":csTemplateName,
           "serviceOffering":serviceOffering,"nodeJson":nodeJson},
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#saveRouterBtn").attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#saveRouterBtn").attr("disabled",false);
               }
               return;
           } else {
        	   $("#saveRouterBtn").attr("disabled",false);
        	   //console.info(data.routerId+'----'+data.nodeId);
        	   //设置值给node
        	   jtopoNode.id = data.nodeId;
        	   jtopoNode.templateId = data.routerId;
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   // 交换机属性面板刷新一次
        	   editor.resetPanelProperty('路由器属性','VR','0',data.routerId);
        	   //editor.resetPanelProperty('路由器连接信息','VR','1',data.routerId);
        	   editor.resetPanelProperty('路由规则集','VR','1',data.routerId);
        	   editor.resetPanelProperty('防火墙出口规则集','VR','2',data.routerId);
        	   editor.resetPanelProperty('防火墙入口规则集','VR','3',data.routerId);
        	   //editor.resetPanelProperty('网络访问规则集','VR','4',data.routerId);
        	   editor.resetPanelProperty('网络转发规则集','VR','4',data.routerId);
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};

/**
 * 保存路由器连接信息（新增or修改）
 */
topologyProperties.saveRouterConnTopology = function(routerConnectIdHidden,vmvrRouterId4Topology,
		vmvrNetworkTpltId4Topology,isPublicIp4Topology,publicIpnum4Topology,isFixedIp4Topology,
		vmvrip4Topology,vmvrnetmask4Topology,routerConnSaveBtn,resetVmvrRouterConnBtn){
	
	var routerConnectId = $("#"+routerConnectIdHidden).val();
	var routerId = $("#"+vmvrRouterId4Topology).val();
    var networkId = $("#"+vmvrNetworkTpltId4Topology).val();
    var isPublicIp = $("#"+isPublicIp4Topology).attr("checked"); //是否公共ip
    var publicIpnum = $("#"+publicIpnum4Topology).val();
    
    var isFixedIp =   $("#"+isFixedIp4Topology).attr("checked"); // 是否指定IP
    //console.info("isFixedIp==="+isFixedIp);
    var ip = $("#"+vmvrip4Topology).val();
    var netmask = $("#"+vmvrnetmask4Topology).val();
    
    //非空验证
    var temp1 = topologyProperties.checkNull("#"+vmvrRouterId4Topology);
    temp1 = topologyProperties.checkNull("#"+vmvrNetworkTpltId4Topology) && temp1;
    temp1 = topologyProperties.checkNull("#"+publicIpnum4Topology) && temp1;
    temp1 = topologyProperties.checkNull("#"+vmvrnetmask4Topology) && temp1;
    if(isFixedIp){
    	temp1 = topologyProperties.checkNull("#"+vmvrip4Topology) && temp1;
    }
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#"+routerConnSaveBtn).attr("disabled",true);
    $.ajax({
       url: context + "/vmvrManage/saveTopologyVmvrRouterConn",
       async: true,
       type: 'post',
       data: {"routerId": routerId, "routerConnectId": routerConnectId, "networkId":networkId,"isPublicIp":isPublicIp,
    	   		"publicIpnum":publicIpnum,"isFixedIp":isFixedIp,"ip":ip,"netmask":netmask
    	   },
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#"+routerConnSaveBtn).attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#"+routerConnSaveBtn).attr("disabled",false);
               }
               return;
           } else {
        	   $("#"+routerConnSaveBtn).attr("disabled",false);
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   // 属性面板刷新一次
        	   $("#"+resetVmvrRouterConnBtn).trigger("click");
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};

/**
 * 保存路由规则集(新增or修改)
 */
topologyProperties.saveRouterRuleTopology = function(){
	var routerId = $("#routerRuleTemplateIdHidden").val();
	var routerRuleSetId = $("#routerRuleRuleSetId4Topology").val();
    //非空验证
    var temp1 = topologyProperties.checkRouterNull("#routerRuleTemplateIdHidden");
    temp1 = temp1 && topologyProperties.checkSelNull("#routerRuleRuleSetId4Topology");
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#routerRuleSaveBtn").attr("disabled",true);
    $.ajax({
       url: context + "/routerManage/saveTopologyRouterRule",
       async: true,
       type: 'post',
       data: {"routerId": routerId, "routerRuleSetId": routerRuleSetId},
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#routerRuleSaveBtn").attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#routerRuleSaveBtn").attr("disabled",false);
               }
               return;
           } else {
        	   $("#routerRuleSaveBtn").attr("disabled",false);
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   // 交换机属性面板刷新一次 
        	   editor.resetPanelProperty('路由规则集','VR','1',routerId);
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};

/**
 * 保存防火墙出口规则集(新增or修改)
 */
topologyProperties.saveFirewallEgressRuleTopology = function(){
	var routerId = $("#routerRuleTemplateIdHidden").val();
	var routerRuleSetId = $("#firewallEgressRuleSetId4Topology").val();
    //非空验证
    var temp1 = topologyProperties.checkRouterNull("#routerRuleTemplateIdHidden");
    temp1 = temp1 && topologyProperties.checkSelNull("#firewallEgressRuleSetId4Topology");
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#firewallEgressSaveBtn").attr("disabled",true);
    $.ajax({
       url: context + "/routerManage/saveFireWallEgressRule",
       async: true,
       type: 'post',
       data: {"routerId": routerId, "routerRuleSetId": routerRuleSetId},
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#firewallEgressSaveBtn").attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#firewallEgressSaveBtn").attr("disabled",false);
               }
               return;
           } else {
        	   $("#firewallEgressSaveBtn").attr("disabled",false);
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   // 交换机属性面板刷新一次 
        	   editor.resetPanelProperty('防火墙出口规则集','VR','2',routerId);
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};

/**
 * 保存网络访问规则集(新增or修改)
 */
topologyProperties.saveNetworkAclRuleTopology = function(){
	var routerId = $("#networkAclRuleTemplateIdHidden").val();
	var routerRuleSetId = $("#networkAclRuleRuleSetId4Topology").val();
    //非空验证
    var temp1 = topologyProperties.checkRouterNull("#networkAclRuleTemplateIdHidden");
    temp1 = temp1 && topologyProperties.checkSelNull("#networkAclRuleRuleSetId4Topology");
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#networkAclSaveBtn").attr("disabled",true);
    $.ajax({
       url: context + "/routerManage/saveNetworkAclRule",
       async: true,
       type: 'post',
       data: {"routerId": routerId, "routerRuleSetId": routerRuleSetId},
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#networkAclSaveBtn").attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#networkAclSaveBtn").attr("disabled",false);
               }
               return;
           } else {
        	   $("#networkAclSaveBtn").attr("disabled",false);
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   // 交换机属性面板刷新一次 
        	  editor.resetPanelProperty('网络访问规则集','VR','4',routerId);
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};

/**
 * 保存防火墙入口规则集(新增or修改)
 */
topologyProperties.saveFirewallInRuleTopology = function(){
	var routerId = $("#fileWallInTemplateIdHidden").val();
	var routerRuleSetId = $("#firewallInRuleSetId4Topology").val();
    //非空验证
    var temp1 = topologyProperties.checkRouterNull("#fileWallInTemplateIdHidden");
    temp1 = temp1 && topologyProperties.checkSelNull("#firewallInRuleSetId4Topology");
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#firewallInSaveBtn").attr("disabled",true);
    $.ajax({
       url: context + "/routerManage/saveFireWallInRule",
       async: true,
       type: 'post',
       data: {"routerId": routerId, "routerRuleSetId": routerRuleSetId},
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#firewallInSaveBtn").attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#firewallInSaveBtn").attr("disabled",false);
               }
               return;
           } else {
        	   $("#firewallInSaveBtn").attr("disabled",false);
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   // 交换机属性面板刷新一次 
        	   editor.resetPanelProperty('防火墙入口规则集','VR','3',routerId);
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};

/**
 * 保存端口转发规则集(新增or修改)
 */
topologyProperties.saveRouterPortforwardRuleTopology = function(){
	var routerId = $("#portforwardTemplateIdHidden").val();
	var vmId = $("#vm_template_id4Topology").val();
	var routerRuleSetId = $("#vr_pfRuleSetId4Topology").val();
	
    //非空验证
    var temp1 = topologyProperties.checkRouterNull("#portforwardTemplateIdHidden");
    temp1 = temp1 && topologyProperties.checkPFNull('#vm_template_id4Topology','#vr_pfRuleSetId4Topology');
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#portforwardRuleSaveBtn").attr("disabled",true);
    $.ajax({
       url: context + "/routerManage/savePortForwardRule",
       async: true,
       type: 'post',
       data: {"routerId": routerId,"vmId":vmId, "routerRuleSetId": routerRuleSetId},
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#portforwardRuleSaveBtn").attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#portforwardRuleSaveBtn").attr("disabled",false);
               }
               return;
           } else {
        	   $("#portforwardRuleSaveBtn").attr("disabled",false);
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   // 交换机属性面板刷新一次 
        	   editor.resetPanelProperty('网络转发规则集','VR','5',routerId);
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};

/**********************************VMVR*****************************************************/

/**
 * VMVR 路由器属性  保存操作
 */
topologyProperties.saveRouterVmvrTopology = function(){
	var routerId = $("#routerIdHidden").val();
	var routerName = $("#routerName4Topology").val();
    var envTemplateId = $("#envTemplateId4Topology").val();
    var routerType = $("#routerType4Topology").val();
    var isVpc = $("#isVpc4Topology").attr("checked");
    var networkId = $("#networkId4Topology").val();
    var isredundancyrouter = $("#isredundancyrouter4Topology").attr("checked");
    var csTemplateName = $("#csTemplateName4Topology").val();
    var serviceOffering = $("#serviceOffering4Topology").val();
    
    var moduleId = $("#moduleIdHidden").val();
    var jtopoNode = editor.utils.getNodeByKey("deviceId",moduleId);
    // 获取jTopo.node 
    var nodeJson = jtopoNode.toJson();
    // 替换undefined为# 
    if(nodeJson){
        nodeJson = nodeJson.replace(new RegExp('undefined',"gm"),'#');
    }
    //非空验证
    var temp1 = topologyProperties.checkNull("#routerName4Topology");
    temp1 = topologyProperties.checkNull("#envTemplateId4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#routerType4Topology") && temp1;
    // 自定义路由的网络ID不验证，下拉框灰掉
    //temp1 = topologyProperties.checkNull("#networkId4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#csTemplateName4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#serviceOffering4Topology") && temp1;
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#saveRouterBtn").attr("disabled",true);
    $.ajax({
       url: context + "/vmvrManage/saveTopologyVmvrRouter",
       async: true,
       type: 'post',
       data: {"routerId": routerId, "routerName": routerName, "envTemplateId":envTemplateId,"routerType": routerType,
           "isVpc": isVpc,"networkId":networkId,"isredundancyrouter":isredundancyrouter,"csTemplateName":csTemplateName,
           "serviceOffering":serviceOffering,"nodeJson":nodeJson},
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#saveRouterBtn").attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#saveRouterBtn").attr("disabled",false);
               }
               return;
           } else {
        	   $("#saveRouterBtn").attr("disabled",false);
        	   //设置值给node
        	   jtopoNode.id = data.nodeId;
        	   jtopoNode.templateId = data.routerId;
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   
        	   //刷新属性面板
        	   editor.resetPanelProperty('路由器网络属性','ECVR','0',data.routerId);
        	   editor.resetPanelProperty('子网属性','ECVR','1',data.routerId);
        	   editor.resetPanelProperty('端口转发规则集','ECVR','2',data.routerId);
        	   
        	   // 连接信息面板刷新
        	   var a = editor.props;
        	   var size = a['ECVR'].length;
        	   for (var int = 3; int < size; int++) {
        		   var title = a['ECVR'][int]["title"];
        		   var cuurPanel = editor.control.accordion('getPanel',title);
        		   var url = a['ECVR'][int]["url"];
        		   //console.info('------title='+title+',int='+int+',url=='+url);
        		   url = url.replace("vmvrId=","vmvrId="+data.routerId);
        		   //console.info("replace--url="+url);
        		   if(cuurPanel){
        			   cuurPanel.panel("refresh",url);
        		   }
        	   }
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};

/**
 * saveVmvrPfRuleTopology  
 * 自定义路由   端口转发规则 保存操作  
 */
topologyProperties.saveVmvrPfRuleTopology = function(){
	var routerId = $("#portforwardTemplateIdHidden").val();
	var routerRuleSetId = $("#vmvr_pfRuleSetId4Topology").val();
    //非空验证
    var temp1 = topologyProperties.checkRouterNull("#portforwardTemplateIdHidden");
    temp1 = temp1 && topologyProperties.checkSelNull("#vmvr_pfRuleSetId4Topology");
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#VmvrPfRuleSaveBtn").attr("disabled",true);
    $.ajax({
       url: context + "/vmvrManage/saveVmvrPfRuleTopology",
       async: true,
       type: 'post',
       data: {"routerId": routerId, "routerRuleSetId": routerRuleSetId},
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#VmvrPfRuleSaveBtn").attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#VmvrPfRuleSaveBtn").attr("disabled",false);
               }
               return;
           } else {
        	   $("#VmvrPfRuleSaveBtn").attr("disabled",false);
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   // 交换机属性面板刷新一次 
        	   editor.resetPanelProperty('端口转发规则集','ECVR','2',routerId);
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};

/**
 * 保存VMVR 交换机的属性  
 */
topologyProperties.saveVMVRTopologySwitch = function(){
	var routerId = $("#vmvrRouterId4Extchange").val();
	var networkName = $("#networkName4Topology").val();
    var displayName = $("#displayName4Topology").val();
    var networkTypeId = $("#networkTypeId4Topology").val();
    var envTemplateId = $("#ExtChangeenvTemplateId4Topology").val();
    //var networkServiceName = $("#networkServiceName4Topology").val();
    var gatewayIp = $("#gatewayIp4Topology").val();
    var netmask = $("#netmask4Topology").val();
    var dns1 = $("#dns14Topology").val();
    var dns2 = $("#dns24Topology").val();
    var networkId = $("#networkIdHidden").val();
    
    var moduleId = $("#moduleIdHidden").val();
    var jtopoNode = editor.utils.getNodeByKey("deviceId",moduleId);
    // 获取jTopo.node 
    var nodeJson = jtopoNode.toJson();
    // 替换undefined为# 
    if(nodeJson){
        nodeJson = nodeJson.replace(new RegExp('undefined',"gm"),'#');
    }
    //非空验证
    var temp1 = topologyProperties.checkNull("#networkName4Topology");
    // 检测路由器ID不能为空
    temp1 = topologyProperties.checkVMVRrouterNull("#vmvrRouterId4Extchange") && temp1;
    temp1 = topologyProperties.checkNull("#displayName4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#networkTypeId4Topology") && temp1;
    temp1 = topologyProperties.checkNull("#ExtChangeenvTemplateId4Topology") && temp1;
    //temp1 = topologyProperties.checkNull("#networkServiceName4Topology") && temp1;
    if (!temp1) {
        return;
    }
    // 设置保存按钮灰掉 
    $("#extchangeSave").attr("disabled",true);
    $.ajax({
       url: context + "/vmvrManage/saveTopologyVmvrSwitch",
       async: true,
       type: 'post',
       data: {"routerId":routerId,"networkName": networkName, "displayName": displayName, "networkTypeId":networkTypeId,"envTemplateId": envTemplateId,
           /*"networkServiceName": networkServiceName,*/
           "gatewayIp":gatewayIp,"netmask":netmask,"dns1":dns1,"dns2":dns2,
           "nodeJson":nodeJson,"networkId":networkId},
       dataType: 'json',
       success: function (data) {
           var err = data.errorInfo;
           // 错误处理
           if (err && err != "ok") {
               if (err == "logout") {
                   handleSessionTimeOut();
                   $("#extchangeSave").attr("disabled",false);
               } else {
                   jAlert(err);
                   $("#extchangeSave").attr("disabled",false);
               }
               return;
           } else {
        	   $("#extchangeSave").attr("disabled",false);
        	   //console.info(data.routerId+'----'+data.nodeId);
        	   //设置值给node
        	   jtopoNode.id = data.nodeId;
        	   jtopoNode.templateId = data.routerId;
        	   jAlert("保存成功！");
        	   //设置弹出框自动消除 
        	   setTimeout(jOk, 2000);
        	   // 虚拟机属性面板刷新一次
        	   editor.resetPanelProperty('子网属性','ECVR','1',data.routerId);
        	   //路由器属性面板也刷新一次
        	   editor.resetPanelProperty('路由器网络属性','ECVR','0',data.routerId);
           }
       },
       error:function(xhr,textStatus,errorThrown){ 
       		jAlert("服务器异常，请稍后重试..");
       }  
   });
};


