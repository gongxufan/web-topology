var Util = {};
Util.getRootPath = function() {
	var curWwwPath = window.document.location.href;
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName, 7);
	var localhostPath = curWwwPath.substring(0, pos);
	var projectName = pathName
			.substring(0, pathName.substr(1).indexOf('/') + 2);
	return localhostPath + projectName;
};
//js国际化,加载属性文件
Util.loadProperties = function (lang){
    jQuery.i18n.properties({
        name: 'js',
        path: context + 'js/i18n/',
        mode: 'map',
        language: lang,
        callback: function () {
            // 加载成功后设置显示内容
        }
    });

}
//服务主路径
var context = Util.getRootPath();

// 保存每次load后的页面，出措施恢复当前页面元素
$globalHtmlFragment = "系统繁忙，请稍后重试...";

/*
 * 转向重新登录页面
 */
function handleSessionTimeOut() {
    location.href = context + "topoLogin/login";
}

/*
 * load请求响应的处理：分三种情况 1.前端系统服务异常 2.session超时，包括前端服务和api 3.api调用异常处理
 *
 * @param $globalHtmlFragment 出错前页面的快照，是index.jsp页面下main里面的所有代码包括js
 * @param res load请求返回的html代码
 *  @param status ajax请求状态码 @homePage 登陆页面
 */
function handleLoadResponse(globalHtmlFragment, response, status) {
    // 服务器异常错误处理
    if (status == 'error') {
        if (typeof globalHtmlFragment == "string") {
            $("#main").html(
                    "<div id='rightBoxHead' class='boxHead'>"
                    + globalHtmlFragment + "</div>");
        }
        jAlert('服务器异常，稍后重试...');
        return;
    }
    if (!response) {
        return;
    }
    // 保存当前页面快照
    if (response && status == "success") {
        // 转换为json对象
        try {
            // 如果无法转换成json对象，说明不是返回的错误
            var res = $.parseJSON(response);
        } catch (e) {
            // 当前页面快照
            $globalHtmlFragment = $("#main > *").clone(true);
            return;
        }
    }

    var err = res.errorInfo;
    // session超时，则重新登录
    if (err == "logout") {
        if (typeof globalHtmlFragment == "string") {
            $("#main").html(
                    "<div id='rightBoxHead' class='boxHead'>"
                    + globalHtmlFragment + "</div>");
        } else {
            $("#main").empty();
            globalHtmlFragment.appendTo($("#main"));
        }
        handleSessionTimeOut();
    } else {// 普通错误
        $("#main").empty();
        if (typeof globalHtmlFragment == "string") {
            $("#main").html(
                    "<div id='rightBoxHead' class='boxHead'>"
                    + globalHtmlFragment + "</div>");
        } else {
            //globalHtmlFragment.appendTo($("#main"));
            $("#main").html(globalHtmlFragment);
        }
        jAlert(err);
    }
}

/*
 * 局部请求页面错误处理 将错误信息现实到相应的div中,使用与action标签请求结果处理
 */
function handleLoadResponse4Special(shownDiv, response, status) {
    // 服务器异常错误处理
    if (status == 'error') {
        shownDiv.html("服务器异常，请稍后重试...");
        return;
    }
    if (!response) {
        return;
    }
    // 保存当前页面快照
    if (response && status == "success") {
        // 转换为json对象
        try {
            // 如果无法转换成json对象，说明不是返回的错误
            var res = $.parseJSON(response);
        } catch (e) {
            // 当前页面快照
            $globalHtmlFragment = $("#main > *").clone(true);
            return true;
        }
    }
    var err = res.errorInfo;
    // session超时，则重新登录
    if (err == "logout") {
        shownDiv.html("登陆超时，即将自动登陆...");
        handleSessionTimeOut();
    } else {// 普通错误
        shownDiv.html(err);
    }
}

/**
 * 验证密码 不能为空，必须含有数字、字母、特殊字符,
 * 
 * @param v
 * @returns
 */
function checkpassword(v, p, min, max) {
	var flag = 0;
	if (v != p) {
		jAlert("两次输入的密码不一致");
		return false;
	}
	var numasc = 0;
	var charasc = 0;
	var otherasc = 0;
	if (0 == v.length) {
		jAlert("密码不能为空");
		return false;
	} else if (v.length < min || v.length > max) {
		jAlert("密码至少" + min + "个字符,最多" + max + "个字符");
		return false;
	} else {
		for (var i = 0; i < v.length; i++) {
			var asciiNumber = v.substr(i, 1).charCodeAt();
			if (asciiNumber >= 48 && asciiNumber <= 57) {
				numasc += 1;
			}
			if ((asciiNumber >= 65 && asciiNumber <= 90)
					|| (asciiNumber >= 97 && asciiNumber <= 122)) {
				charasc += 1;
			}
			if ((asciiNumber >= 33 && asciiNumber <= 47)
					|| (asciiNumber >= 58 && asciiNumber <= 64)
					|| (asciiNumber >= 91 && asciiNumber <= 96)
					|| (asciiNumber >= 123 && asciiNumber <= 126)) {
				otherasc += 1;
			}
		}
		if(numasc!=0){
			flag++;
		}
		if(charasc!=0){
			flag++;
		}
		if(otherasc!=0){
			flag++;
		}
		if (flag<2) {
			jAlert("密码必须包含数字、字母、字符至少两种");
			return false;
		} else {
			return true;
		}
	}
};