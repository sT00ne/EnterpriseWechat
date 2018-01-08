/*
 导航栏功能
*/

// 注销
function Logout() {
	$.ajax({
		type: "post",
		url: _APP_ + "/Home/Login/Logout",
		success: function() {
			location.href = _APP_ + "/Home/Login/index";
		},
	});
}

// 个人信息
function UserInfo() {
	$.ajax({
		type: "post",
		// url: _URL_ + "/UserInfo",
		url: _APP_ + "/Home/Index/UserInfo",
		success: function(data) {
			if (data == 0) {
				alert("数据出错！");
			} else {
				$("#Userheader").html("<h3>个人信息</h3>");
				$("#User_Username").html("");
				$("#User_Name").html("<b>姓名：</b>" + data[0]["name"]);
				$("#User_Department").html("<b>部门：</b>" + data[0]["department"]);
				$("#User_Level").html("<b>职位：</b>" + data[0]["level"]);
				$("#User_OldPwd").html("");
				$("#User_NewPwd").html("");
				$("#User_PwdConfirm").html("");
				$("#Userfooter").html("<button type=\"button\" class=\"btn btn-info\" onclick=\"ChangePasswordInfo(" + data[0]["id"] + ")\">修改密码</button>");
			}
		},
	});
}


/*
	按钮功能
*/

// 表单确定
function PwdConfirm() {
	if ($("#OldPwd").val() == "") {
		$("#form-OldPwd").addClass("has-error");
	} else {
		$("#form-OldPwd").removeClass("has-error");
	}
	if ($("#NewPwd").val() != $("#PwdConfirm").val()) {
		$("#form-PwdConfirm").addClass("has-error");
	} else {
		$("#form-PwdConfirm").removeClass("has-error");
	}
	if (($("#OldPwd").val() != "") && ($("#NewPwd").val() == $("#PwdConfirm").val()) && ($("#NewPwd").val() != "")) {
		$("#BtnChangePassword").removeAttr("disabled", "disabled");
	} else {
		$("#BtnChangePassword").attr("disabled", "disabled");
	}
}

// 修改密码表单
function ChangePasswordInfo(id) {
	$("#Userheader").html("<h3>修改密码</h3>");
	$.ajax({
		type: "post",
		url: _APP_ + "/Home/Index/UserInfo",
		data: {
			id: id
		},
		success: function(data) {
			if (data == 0) {
				alert("数据出错！");
			} else {
				$("#User_Username").html("<b>用户名：</b>" + data[0]["username"]);
				$("#User_Name").html("<b>姓名：</b>" + data[0]["name"]);
				$("#User_Department").html("<b>部门：</b>" + data[0]["department"]);
				$("#User_Level").html("<b>职位：</b>" + data[0]["level"]);
				$("#User_OldPwd").html("<div class=\"form-group\" id=\"form-OldPwd\"><label class=\"control-label\" for=\"OldPwd\">旧密码</label><input type=\"password\" class=\"form-control\" id=\"OldPwd\" onchange=\"PwdConfirm()\"></div>");
				$("#User_NewPwd").html("<div class=\"form-group\"><label class=\"control-label\" for=\"NewPwd\">新密码</label><input type=\"password\" class=\"form-control\" id=\"NewPwd\" onchange=\"PwdConfirm()\"></div>");
				$("#User_PwdConfirm").html("<div class=\"form-group\" id=\"form-PwdConfirm\"><label class=\"control-label\" for=\"PwdConfirm\">确认新密码</label><input type=\"password\" class=\"form-control\" id=\"PwdConfirm\" onchange=\"PwdConfirm()\"></div>");
				$("#Userfooter").html("<button type=\"button\" class=\"btn btn-info\" onclick=\"ChangePassword(" + id + ")\" id=\"BtnChangePassword\" disabled=\"disabled\">确认修改</button>");
			}
		},
	});
}

// 修改密码
function ChangePassword(id) {
	if (($("#NewPwd").val() != $("#PwdConfirm").val()) || ($("#NewPwd").val() == "")) {
		$("#form-PwdConfirm").addClass("has-error");
	} else {
		$.ajax({
			type: "post",
			url: _APP_ + "/Home/Index/ChangePassword",
			data: {
				'id': id,
				'OldPwd': $('#OldPwd').val(),
				'NewPwd': $('#NewPwd').val()
			},
			success: function(data) {
				if (data == 0) {
					$("#User_alert").html("数据出错！");
					$("#User_alert").addClass("alert-danger");
					$("#User_alert").fadeTo(1500, 500).slideUp(500, function() {
						$("#User_alert").html("");
						$("#User_alert").removeClass("alert-danger");
					});
				} else if (data == 1) {
					$("#User_alert").html("旧密码错误！");
					$("#User_alert").addClass("alert-danger");
					$("#User_alert").fadeTo(1500, 500).slideUp(500, function() {
						$("#User_alert").html("");
						$("#User_alert").removeClass("alert-danger");
					});
				} else {
					//隐藏modal
					$('#User_Info').modal('hide');
					$("#my_alert").addClass("alert-success");
					$("#my_alert").html("修改密码成功。");
					$("#my_alert").fadeTo(2000, 500).slideUp(500, function() {
						$("#my_alert").html("");
						$("#my_alert").removeClass("alert-success");
					});
				}
			},
		});
	}
}

//考勤
function Attendance(flag) {
	$.ajax({
		type: "post",
		url: _APP_ + "/Home/Index/Attendance",
		data: {
			"flag": flag
		},
		success: function(data) {
			switch (data) {
				case -1:
					$("#Attendance_alert").html("您已经考勤过了！");
					$("#Attendance_alert").addClass("alert-danger");
					$("#Attendance_alert").fadeTo(1500, 500).slideUp(500, function() {
						$("#Attendance_alert").html("");
						$("#Attendance_alert").removeClass("alert-danger");
					});
					break;
				case 0:
					$("#Attendance_alert").html("数据出错！");
					$("#Attendance_alert").addClass("alert-danger");
					$("#Attendance_alert").fadeTo(1500, 500).slideUp(500, function() {
						$("#Attendance_alert").html("");
						$("#Attendance_alert").removeClass("alert-danger");
					});
					break;
				case 1:
					$('#Attendance').modal('hide');
					$("#my_alert").html("上班考勤成功！");
					$("#my_alert").addClass("alert-success");
					$("#my_alert").fadeTo(2000, 500).slideUp(500, function() {
						$("#my_alert").html("");
						$("#my_alert").removeClass("alert-success");
					});
					break;
				case 2:
					$('#Attendance').modal('hide');
					$("#my_alert").html("下班考勤成功！");
					$("#my_alert").addClass("alert-success");
					$("#my_alert").fadeTo(2000, 500).slideUp(500, function() {
						$("#my_alert").html("");
						$("#my_alert").removeClass("alert-success");
					});
					break;
			}
		},
	});
}

/*
	链接功能
*/

// 详细公司公告
function Notice_showInfo(event) {
	var NoticeId = event.id.substr(7, 100);
	$.ajax({
		async: false, //设置成为 同步的
		type: "post",
		// url: _URL_ + "/NoticeInfo",
		url: _APP_ + "/Home/Index/NoticeInfo",
		data: {
			'id': NoticeId
		},
		success: function(data) {
			if (data == 0) {
				alert("数据出错！");
			} else {
				$("#Notice_Title").html(data[0]["title"]);
				$("#Notice_Content").html("<pre> "+data[0]["content"]+"</pre> ");
				$("#Notice_Date").html("发布日期:" + data[0]["noticedate"]);
				if (data[0]["filename"] != null) {
					$("#Notice_File").html("<a href='" + _PUBLIC_ + "/files/Uploads/" + data[0]["subname"] + data[0]["truename"] + "' target=\"_blank\" >" + data[0]["filename"] + "</a>");
				} else {
					$("#Notice_File").html("");
				}
			}
		},
	});
}

/*
	管理员功能
*/

//获取勾选的Checkbox
function getCheckbox() {
	var id_array=new Array();
	$('input[name="NoticeCheckbox"]:checked').each(function(){
    	id_array.push($(this).attr("id").substring(12,100));//向数组中添加被选中的id
	});
	var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
	return idstr;
}

//添加通知
function addNotify() {
	//清空表单
	$("#ModifyNotifyheader").html("添加通知");
	$("#Notifyid").val("");
	$("#inputNotifyTitle").val("");
	$("#inputNotifyContent").val("");
	$("#InputFile").replaceWith($("#InputFile").clone());
	$("#InputFileHelp").html("上传附件请点击按钮");
	//选择不同的通知类型
	if($("#pageHeader").html()=="营业部通知") {
		$("#inputNotifyIscompany").val("0");
	} else {
		$("#inputNotifyIscompany").val("1");
	}
}

//编辑通知
function editNotify() {
	if(getCheckbox() == "") {
		//没有选择编辑的通知
		$("#my_alert").html("请选择一个通知！");
		$("#my_alert").addClass("alert-warning");
		$("#my_alert").fadeTo(1500, 500).slideUp(500, function() {
			$("#my_alert").html("");
			$("#my_alert").removeClass("alert-warning");
		});
	} else if(getCheckbox().indexOf(",")>0) {
		//选了多个，取第一个
		var result = getCheckbox().split(",");
		var id = result[0];
	} else {
		//只选择了一个
		var id = getCheckbox();
	}
	if(id) {
		$("#ModifyNotifyheader").html("修改通知");
		if($("#inputNotifyTitle").val()=="")
		{
			$("#inputNotifyTitle").val()
		}
		$.ajax({
			type: "post",
			url: _APP_ + "/Home/Index/NoticeInfo",
			data: {
				'id': id
			},
			success: function(data) {
				if (data == 0) {
					alert("数据出错！");
				} else {
					$("#Notifyid").val(id);
					$("#inputNotifyIscompany").val(data[0]["iscompany"]);
					$("#inputNotifyTitle").val(data[0]["title"]);
					$("#inputNotifyContent").val(data[0]["content"]);
					$("#InputFile").replaceWith($("#InputFile").clone());
					if(data[0]["filename"] != null) {
						$("#InputFileHelp").html("现在的附件为："+data[0]["filename"]);
					} else {
						$("#InputFileHelp").html("没有上传过附件");
					}
					$("#btnModifyNotify").html("修改");
				}
				$('#ModifyNotify').modal('show');
			},
		});
	}
}
//删除确认
function delConfirm() {
	if(getCheckbox() == ""){
		//没有勾选
		$("#my_alert").html("请选择需要删除的通知！");
		$("#my_alert").addClass("alert-warning");
		$("#my_alert").fadeTo(1500, 500).slideUp(500, function() {
			$("#my_alert").html("");
			$("#my_alert").removeClass("alert-warning");
		});
	} else {
		//勾选多个与一个的提示不同
		if(getCheckbox().indexOf(",")>0) {
			//勾选多个
			$("#my_alert").html("<p>要删除这些删除的通知？</p><p><button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"delNotify()\">确认删除</button> <button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"delCancel()\">取消删除</button></p>");
		} else {
			// 勾选一个
			$("#my_alert").html("<p>要删除这个删除的通知？</p><p><button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"delNotify()\">确认删除</button> <button type=\"button\" class=\"btn btn-default btn-sm\" onclick=\"delCancel()\">取消删除</button></p>");
		}
		$("#my_alert").addClass("alert-danger");
		$("#my_alert").attr("style","display:block");
	}
}
//删除通知
function delNotify() {
	var id = getCheckbox();
	$.ajax({
		type: "post",
		url: _APP_ + "/Home/Notify/delNotify",
		data: {
			'id': id
		},
		success: function(data) {
			if (data == 0) {
				$("#my_alert").html("删除失败！");
				$("#my_alert").removeClass("alert-danger").addClass("alert-warning");
				$("#my_alert").fadeTo(1500, 500).slideUp(500, function() {
					$("#my_alert").html("");
					$("#my_alert").removeClass("alert-warning");
				});
			} else if (data == -1) {
				$("#my_alert").html("没有权限！");
				$("#my_alert").removeClass("alert-danger").addClass("alert-danger");
				$("#my_alert").fadeTo(1500, 500).slideUp(500, function() {
					$("#my_alert").html("");
					$("#my_alert").removeClass("alert-danger");
				});
			} else {
				$("#my_alert").html("删除成功！");
				$("#my_alert").removeClass("alert-danger").addClass("alert-success");
				$("#my_alert").removeAttr("hidden");
				$("#my_alert").fadeTo(1500, 500).slideUp(500, function() {
					$("#my_alert").html("");
					$("#my_alert").removeClass("alert-success");
				});
			}
		},
	});
	loadData(window.location.href, "OA", "OA", true);
}

//取消删除
function delCancel() {
	$("#my_alert").slideUp(500, function() {
		$("#my_alert").html("");
		$("#my_alert").removeClass("alert-danger");
	});
}
//验证通知表单
function NotifyConfirm () {
	var flag = 0;
	if($("#inputNotifyTitle").val()==""){
		console.info($("#inputNotifyTitle").val());
		$("#formgroup-NotifyTitle").addClass("has-error");
	} else {
		$("#formgroup-NotifyTitle").removeClass("has-error");
		flag++;
	}
	if($("#inputNotifyContent").val()==""){
		$("#formgroup-NotifyContent").addClass("has-error");
	} else {
		$("#formgroup-NotifyContent").removeClass("has-error");
		flag++;
	}
	if(flag == 2) {
		return true;
	} else {
		return false;
	}
}
//提交通知表单
function saveNotify () {
// NotifyConfirm();
	if (NotifyConfirm()) {
		$("#formNotify").submit();
	} else {
		$("#Notify_alert").html("标题和正文不能为空！");
		$("#Notify_alert").addClass("alert-danger");
		$("#Notify_alert").fadeTo(1500, 500).slideUp(500, function() {
			$("#Notify_alert").removeClass("alert-danger");
			$("#Notify_alert").html("");
		});
	}
}

//返回通知编辑信息（返回文字信息，是否成功）
function callback(message,success)  
{  
    if(success==false)  
    {  
        $("#Notify_alert").html(message);
		$("#Notify_alert").addClass("alert-danger");
		$("#Notify_alert").fadeTo(1500, 500).slideUp(500, function() {
			$("#Notify_alert").html("");
			$("#Notify_alert").removeClass("alert-danger");
		});
    }  
    else{  
        $('#ModifyNotify').modal('hide');
		$("#my_alert").html(message);
		$("#my_alert").addClass("alert-success");
		$("#my_alert").fadeTo(2000, 500).slideUp(500, function() {
			$("#my_alert").html("");
			$("#my_alert").removeClass("alert-success");
		}); 
    }
    //重新加载列表
    loadData(window.location.href, "OA", "OA", true);
}  

/*
	全局功能
*/

//Ajax跳转
function Ajaxopt() {
	$('body').on('click', 'a[target!="_blank"]', function(event) {
		var url = $(this).attr("href");
		var title = $(this).attr("title_old"); //获取新链接的title
		loadData(url, title, $('title').text(), true); //读取数据
		event.preventDefault(); //防止跳转
	});
}

//获取并加载数据(地址, title, 旧的title. 是否点击的前进后退)
function loadData(url, title, title_old, isPush) {

	// $.ajax({
	// 	url:url,
	// 	data: {"flag":"ajax"},
	// 	dataType: "html",
	// 	type: "post",
	// 	beforeSend:function(jqXHR, settings){    //加载前操作 #content的DIV变化
	// 		$('.main').fadeTo(500,0.3);
	// 	},
	// 	complete:function(){                     //加载后操作 #content的DIV变化
	// 		$('.main').fadeTo(200,1);
	// 	},
	// 	success:function(data){               //加载成功的操作
	// 		// var a = data;
	// 		// console.info(data);
	// 		// var wrappedObj = $("<code></code>").append($(data));  
	//   			//var table = $(".main", data);  
	//   			//console.info(table);
	// 		// $(".main").html(data[0]); 
	// 		$(".main").load(url + ".main",function(){        //开始加载
	//                          $('.main').fadeTo(200,1);           //完成后 内容部分重新显示
	//                          window.document.title = title;          //设置标题
	//            }); 
	// 		var state = {
	// 			title: title,
	// 			url: url
	// 		};
	// 		//添加历史记录
	// 		if (isPush) {
	// 			window.history.pushState(state, $('title').text(), url);
	// 		}
	// 		//添加监听
	// 		$(window).bind('popstate', function(e) {
	// 			loadData(location.href, title_old, $('title').text(), false);
	// 			return false;
	// 		});
	// 	}
	// });

	$('.main').fadeTo(300, 0.3); //内容部分模糊
	$(".main").load(url + " .main", function() { //开始加载
		$('.main').fadeTo(100, 1); //完成后 内容部分重新显示
		//window.document.title = title; //设置标题
		Lesswords();
		// Pagination();
	});
	var state = {
		title: title,
		url: url
	};

	//添加历史记录
	if (isPush) {
		window.history.pushState(state, $('title').text(), url);
	}
	//添加监听
	$(window).bind('popstate', function(e) {
		loadData(location.href, title_old, $('title').text(), false);
		return false;
	});
}

// 控制链接的字数
function Lesswords() {
	$(".NoticeTitle").each(function() {
		// alert($(this).text().length) 
		if ($(window).width() > 768) {
			var maxwidth = 35;
		} else {
			var maxwidth = 15;
		}
		if ($(this).text().length > maxwidth) {
			$(this).text($(this).text().substring(0, maxwidth));
			$(this).html($(this).html() + '...');
		}
	});
}

//点击li，以勾选
function checkitem(obj) {
	obj.children[0].checked = !obj.children[0].checked;
	$('input[name="NoticeCheckbox"]').click(function(event){
		event.stopPropagation();
	});
}
