(function($) {
	try {
		if (!$.mf) {
			$.mf = {};
		}
	} catch (e) {
		$.mf = {};
	}
	$.mf.o = {
		el: null,	/*文档对象*/
		year: 0,	/*年份*/
		month: 0,	/*月份*/
		day: 0,		/*日*/
		days: 0,	/*这个月的总天数*/
		strDate: "",/*格式化后的日期 YYYY-MM-dd*/
		date: null,	/*日期对象*/
		dateSplitChar: "-", /*时间分割符*/
		viewDateInfo: null,	/*底部今日信息*/
		mouseOver: null,
		mouseOut: null,
		click: null,
		checkbox: false
	}
	/*初始化dom对象和常用内部对象*/
	$.mf.buildDater = function() {
		var dateContainer = $("<div class='WdateDiv'></div>");
		//操作组容器
		var dateOption = '<div id="dpTitle">';
		dateOption += ' <div class="NavImg NavImgll"><a></a></div>';
		dateOption += '<div class="NavImg NavImgl"><a></a></div>';
		dateOption += '<div class="ShowYM">';
		dateOption += '<span class="TopicYearMonth">'+$.mf.o.year+"年"+($.mf.o.month+1)+"月"+'</span></div>';
		dateContainer.append("<div class='selectMonth'><span class='smyear'>"+$.mf.o.year+"</span><span class='month' data='0'>1月</span><span class='month' data='1'>2月</span><span class='month' data='2'>3月</span><span class='month' data='3'>4月</span><span class='month' data='4'>5月</span><span class='month' data='5'>6月</span><span class='month' data='6'>7月</span><span class='month' data='7'>8月</span><span class='month' data='8'>9月</span><span class='month' data='9'>10月</span><span class='month' data='10'>11月</span><span class='month' data='11'>12月</span></div>");
		dateOption += '<div class="NavImg NavImgrr"><a></a></div>';
		dateOption += '<div class="NavImg NavImgr"><a></a></div>';
		dateOption += '<div style="float: right;"></div>';
		dateOption += '</div>';
		dateContainer.append(dateOption);
		/*拼接上一个月结束*/
		/*拼接当月时间*/
		var strDate = '<table id="dateTable" class="WdayTable" border="0" cellspacing="0" cellpadding="0" width="100%">' + '<tbody><tr class="MTitle" align="center"><td>周</td><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>';
		strDate += "<tr>";
		/*这个月的总天数*/
		var daysInMonth = $.mf.getDaysInMonth();
		/*这个月的第一天在周几*/
		var firstWeek = $.mf.getWeek(1);
		/*这个月最后一天在周几*/
		var lastWeek = $.mf.getWeek(daysInMonth);
		/*获取这个月今天的日子*/
		var currDate = $.mf.getCurrentDate(false);
		/*如果1号不是新的一周，记录周期*/
		var weeknum = $.mf.getWeekNum(1);
		
		if($.mf.o.viewDateInfo==null){
			$.mf.o.viewDateInfo="今天是&nbsp;"+$.mf.o.year+"年"+($.mf.o.month+1)+"月"+$.mf.o.day+"日&nbsp;&nbsp;星期";
			var todayWeek = $.mf.getWeek($.mf.o.day);
			if(todayWeek==0) $.mf.o.viewDateInfo+="日";
			else if(todayWeek==1)$.mf.o.viewDateInfo+="一";
			else if(todayWeek==2)$.mf.o.viewDateInfo+="二";
			else if(todayWeek==3)$.mf.o.viewDateInfo+="三";
			else if(todayWeek==4)$.mf.o.viewDateInfo+="四";
			else if(todayWeek==5)$.mf.o.viewDateInfo+="五";
			else if(todayWeek==6)$.mf.o.viewDateInfo+="六";
		}
		
		
		if(firstWeek != 0){
			strDate += "<td class='WeekNum' width='50px'>"+(++weeknum)+"</td>";
		}
		/*填补空白日期*/
		for (var i = 0; i < firstWeek; i++) {
			strDate += "<td class='empty' width='50px'></td>";
		}
		for (var i = 1; i <= daysInMonth; i++) {
			var _day = $.mf.getDateByDay(i, false);
			var week = $.mf.getWeek(i);
			if (week == 6) {
				if (_day == currDate)
					strDate += "<td class='Wtoday' width='50px' data='" + _day + "'>"+($.mf.o.checkbox?"<input type='checkbox' class='cbday'>":"")+"<span class='daynum'>" + i + "</span></td></tr>";
				else
					strDate += "<td class='Wwday' width='50px' data='" + _day + "'>"+($.mf.o.checkbox?"<input type='checkbox' class='cbday'>":"")+"<span class='daynum'>" + i + "</span></td></tr>";
			} else if (week == 0) {
				if (_day == currDate)
					strDate += "<tr><td width='50px' class='WeekNum'>"+(++weeknum)+"</td><td class='Wtoday' data='" + _day + "'>"+($.mf.o.checkbox?"<input type='checkbox' class='cbday'>":"")+"<span class='daynum'>" + i + "</span></td>";
				else
					strDate += "<tr><td width='50px' class='WeekNum'>"+(++weeknum)+"</td><td class='Wwday' data='" + _day + "'>"+($.mf.o.checkbox?"<input type='checkbox' class='cbday'>":"")+"<span class='daynum'>" + i + "</span></td>";
				
			} else {
				if (_day == currDate)
					strDate += "<td width='50px' class='Wtoday' data='" + _day + "'>"+($.mf.o.checkbox?"<input type='checkbox' class='cbday'>":"")+"<span class='daynum'>" + i + "</span></td>";
				else
					strDate += "<td width='50px' class='Wday' data='" + _day + "'>"+($.mf.o.checkbox?"<input type='checkbox' class='cbday'>":"")+"<span class='daynum'>" + i + "</span></td>";
			}
		}

		for (var i = 0; i < 6 - lastWeek; i++) {
			strDate += "<td class='empty'></td>";
		}
		strDate += "</tr>";
		strDate += '</tbody></table>';
		dateContainer.append(strDate);
		dateContainer.append("<div class='bottom'><span class='viewDateInfo'>"+$.mf.o.viewDateInfo+"</span></div>");
		
		//拼接当月时间结束
		$.mf.o.el.html(dateContainer);
		//bind handler
		$("#dpTitle a").each(function(i) {
			if (i == 0) {
				$(this).click(function() {
					var date = $.mf.o.date;
					var opdate = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
					$.mf.getDate(opdate);
				});
			}
			if (i == 1) {
				$(this).click(function() {
					var date = $.mf.o.date;
					var month = parseInt($.mf.o.month, 10)-1;
					var opdate = new Date(date.getFullYear() , month , date.getDate());
					$.mf.getDate(opdate);
				});
			}
			if (i == 2) {
				$(this).click(function() {
					var date = $.mf.o.date;
					var opdate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
					$.mf.getDate(opdate);
				});
			}
			if (i == 3) { //下一月
				$(this).click(function() {
					var date = $.mf.o.date;
					var month = parseInt($.mf.o.month, 10) + 1;
					new Date().setMonth(month);
					var opdate = new Date(date.getFullYear() , month , date.getDate());
					$.mf.getDate(opdate);
				});
			}
		});
		$("#dpTitle input").each(function(i) {
			if (i == 0) {
				var month = $.mf.o.month + 1;
				$(this).val(month + "月");
			}
			if (i == 1) {
				$(this).val($.mf.o.year);
			}
		});
		$("#tabAllDay td[class*='day']").mouseover($.mf.o.mouseOver);
		$("#tabAllDay td[class*='day']").mouseout($.mf.o.mouseOut);
		$("#tabAllDay td[class*='day']").click($.mf.o.click);
	}
	/*初始化内部事件*/
	$.mf.initEvent = function(){
		var el = $.mf.o.el;
		var tym = el.find(".TopicYearMonth");
		var sm = el.find(".selectMonth");
		var month_span = el.find(".month");
		tym.bind("click",function(){
			sm.css("display","block");
			sm.bind("mouseleave",function(){
				sm.css("display","none");
			})
		});
		month_span.bind("click",function(){
			var selectdate = new Date($.mf.o.year,$(this).attr("data"));
			$.mf.getDate(selectdate);
		})
	}
	$.mf.getDate = function(date) {
			if (date == undefined || date == null)
				date = new Date();
			$.mf.o.year = date.getFullYear();
			$.mf.o.month = date.getMonth();
			$.mf.o.day = date.getDate();
			$.mf.o.days = date.getDay();
			$.mf.o.strDate = $.mf.strBuildDate();
			$.mf.o.date = date;
			$.mf.buildDater();
			$.mf.initEvent();
		}
		/*获取这天是今年的第几周*/
	$.mf.getWeekNum = function(day) {
			/*获取今年的总天数*/
			var daysForYear = function(){
				var num = 0;
				for(var i = 0;i < $.mf.o.month ;i++){
					var d = new Date($.mf.o.year,i+1,0);
					num += d.getDate();
				}
				num += day
				return num;
			}();
			/*获取今年第一条是周几*/
			var yearFirstDayOnWeek = $.mf.getWeek(day,0);
			/*定义周数*/
			var week = 0;
			if(yearFirstDayOnWeek == 0){
				/*如果起步是星期天的算法*/
				week = Math.ceil(daysForYear / 7)-1;
			}else{
				var md = 7-yearFirstDayOnWeek;
				daysForYear -= md;
				if(daysForYear <= 0) week = 0;
				else week = Math.ceil(daysForYear / 7);
			}
			return week;
		}
		/*这个日期是这周的第几天*/
	$.mf.getWeek = function(day,month) {
			var odate = new Date($.mf.o.year, (month == null || month == undefined)?$.mf.o.month : month, day);
			return odate.getDay();
		}
		/*一个月有多少天*/
	$.mf.getDaysInMonth = function(month) {
			var temp = new Date($.mf.o.year,(month == null || month == undefined)?$.mf.o.month+1:month,0);
			return temp.getDate();
		}
		/*根据天返回Date*/
	$.mf.getDateByDay = function(day, isDate) {
			month = parseInt($.mf.o.month, 10) + 1;
			var temp = new Date($.mf.o.year + "-" + month + "-" + day);
			if (isDate)
				return temp;
			else
				return $.mf.o.year + "-" + month + "-" + day
		}
		/*返回当前Date：yyyy-MM-dd*/
	$.mf.getCurrentDate = function(isDate) {
		var c = new Date();
		month = parseInt(c.getMonth(), 10) + 1;
		var temp = new Date(c.getFullYear() + "-" + month + "-" + c.getDate());
		if (isDate)
			return temp;
		else
			return c.getFullYear() + "-" + month + "-" + c.getDate();
	}
	$.mf.strBuildDate = function() {
		return $.mf.o.year + $.mf.o.dateSplitChar + $.mf.o.month + 1 + $.mf.o.dateSplitChar + $.mf.o.day;
	}
	/*用来创建复选框日历的工具*/
	$.fn.mfDataPicker = function(options) {
//		debugger;
		var el = $(this.get(0));
		$.mf.o = $.extend({}, {
			strDate: "",
			dateSplitChar: "-", //时间分割符
			mouseOver: null,
			mouseOut: null,
			click: null
		}, options);
		$.mf.o.el = el;
		$.mf.getDate();
		return $.mf;
	}
	/*获取选中的天数*/
	$.fn.mfGetSelectChecks = function(){
		var cbdp = $(this.get(0));
		var dates = new Array();
		var checks = cbdp.find('.cbday:checked');
		for (var index = 0 ; index < checks.length ; index++) {
			var checkBox = checks.eq(index);
			dates.push(checkBox.parent().attr("data"));
		}
		return dates;
	}
})(jQuery);