(function($) {
	//	try {
	//		if (!this) {
	//			this = {};
	//		}
	//	} catch (e) {
	//		this = {};
	//	}
	function mf() {
		this.o = {
			el: null,
			/*文档对象*/
			year: 0,
			/*年份*/
			month: 0,
			/*月份*/
			day: 0,
			/*日*/
			days: 0,
			/*这个月的总天数*/
			strDate: "",
			/*格式化后的日期 YYYY-MM-dd*/
			date: null,
			/*日期对象*/
			dateSplitChar: "-",
			/*时间分割符*/
			viewDateInfo: null,
			/*底部今日信息*/
			mouseOver: null,
			mouseOut: null,
			click: null,
			checkbox: false,
			selectYear: 0,
			/*年份层选择的年份临时存放的位置*/
			allInitEnd: false
		}

		var buildDate = function(that) {
				/*拼接上一个月结束*/
				/*拼接当月时间*/
				var strDate = '<tbody><tr class="MTitle" align="center"><td>周</td><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>';
				strDate += "<tr>";
				/*这个月的总天数*/
				var daysInMonth = getDaysInMonth(that);
				/*这个月的第一天在周几*/
				var firstWeek = getWeek(that, 1);
				/*这个月最后一天在周几*/
				var lastWeek = getWeek(that, daysInMonth);
				/*获取这个月今天的日子*/
				var currDate = getCurrentDate(that, false);
				/*如果1号不是新的一周，记录周期*/
				var weeknum = getWeekNum(that, 1);


				if (firstWeek != 0) {
					strDate += "<td class='WeekNum' width='50px'>" + (++weeknum) + "</td>";
				}
				/*填补空白日期*/
				for (var i = 0; i < firstWeek; i++) {
					strDate += "<td class='empty' width='50px'></td>";
				}
				for (var i = 1; i <= daysInMonth; i++) {
					var _day = initDateByDay(that, i, false);
					var week = getWeek(that, i);
					if (week == 6) {
						if (_day == currDate)
							strDate += "<td class='Wtoday' width='50px' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td></tr>";
						else
							strDate += "<td class='Wwday' width='50px' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td></tr>";
					} else if (week == 0) {
						if (_day == currDate)
							strDate += "<tr><td width='50px' class='WeekNum'>" + (++weeknum) + "</td><td class='Wtoday' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td>";
						else
							strDate += "<tr><td width='50px' class='WeekNum'>" + (++weeknum) + "</td><td class='Wwday' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td>";

					} else {
						if (_day == currDate)
							strDate += "<td width='50px' class='Wtoday' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td>";
						else
							strDate += "<td width='50px' class='Wday' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td>";
					}
				}

				for (var i = 0; i < 6 - lastWeek; i++) {
					strDate += "<td class='empty'></td>";
				}
				strDate += "</tr>";
				strDate += '</tbody>';
				that.o.el.find("#dateTable").html(strDate);
				that.o.el.find("#dpTitle .TopicYearMonth").html(that.o.year + "年" + (that.o.month + 1) + "月");
			}
			/*初始化dom对象和常用内部对象*/
		var buildDater = function(that) {
				var dateContainer = $("<div class='WdateDiv'></div>");
				//操作组容器
				var dateOption = '<div id="dpTitle">';
				dateOption += ' <div class="NavImg NavImgll"><a></a></div>';
				dateOption += '<div class="NavImg NavImgl"><a></a></div>';
				dateOption += '<div class="ShowYM">';
				/*添加年月展示title*/
				dateOption += '<span class="TopicYearMonth">' + that.o.year + "年" + (that.o.month + 1) + "月" + '</span></div>';
				/*添加月份选择层*/
				dateContainer.append("<div class='selectMonth'><span class='smyear'>" + that.o.year + "</span><span class='month' data='0'>1月</span><span class='month' data='1'>2月</span><span class='month' data='2'>3月</span><span class='month' data='3'>4月</span><span class='month' data='4'>5月</span><span class='month' data='5'>6月</span><span class='month' data='6'>7月</span><span class='month' data='7'>8月</span><span class='month' data='8'>9月</span><span class='month' data='9'>10月</span><span class='month' data='10'>11月</span><span class='month' data='11'>12月</span></div>");
				/*添加年份选择层*/
				dateContainer.append('<div class="selectYear"><div class="d_syYear"><div class="NavImg NavImgl"><a></a></div><span class="syYear">2010</span><div class="NavImg NavImgr"><a></a></div></div><div class="d_year"><span class="year"></span><span class="year"></span><span class="year"></span><span class="year"></span><span class="year"></span><span class="year"></span><span class="year"></span><span class="year"></span><span class="year"></span><span class="year"></span></div></div>');

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
				var daysInMonth = getDaysInMonth(that);
				/*这个月的第一天在周几*/
				var firstWeek = getWeek(that, 1);
				/*这个月最后一天在周几*/
				var lastWeek = getWeek(that, daysInMonth);
				/*获取这个月今天的日子*/
				var currDate = getCurrentDate(that, false);
				/*如果1号不是新的一周，记录周期*/
				var weeknum = getWeekNum(that, 1);

				if (that.o.viewDateInfo == null) {
					that.o.viewDateInfo = "今天是&nbsp;" + that.o.year + "年" + (that.o.month + 1) + "月" + that.o.day + "日&nbsp;&nbsp;星期";
					var todayWeek = getWeek(that, that.o.day);
					if (todayWeek == 0) that.o.viewDateInfo += "日";
					else if (todayWeek == 1) that.o.viewDateInfo += "一";
					else if (todayWeek == 2) that.o.viewDateInfo += "二";
					else if (todayWeek == 3) that.o.viewDateInfo += "三";
					else if (todayWeek == 4) that.o.viewDateInfo += "四";
					else if (todayWeek == 5) that.o.viewDateInfo += "五";
					else if (todayWeek == 6) that.o.viewDateInfo += "六";
				}


				if (firstWeek != 0) {
					strDate += "<td class='WeekNum' width='50px'>" + (++weeknum) + "</td>";
				}
				/*填补空白日期*/
				for (var i = 0; i < firstWeek; i++) {
					strDate += "<td class='empty' width='50px'></td>";
				}
				for (var i = 1; i <= daysInMonth; i++) {
					var _day = initDateByDay(that, i, false);
					var week = getWeek(that, i);
					if (week == 6) {
						if (_day == currDate)
							strDate += "<td class='Wtoday' width='50px' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td></tr>";
						else
							strDate += "<td class='Wwday' width='50px' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td></tr>";
					} else if (week == 0) {
						if (_day == currDate)
							strDate += "<tr><td width='50px' class='WeekNum'>" + (++weeknum) + "</td><td class='Wtoday' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td>";
						else
							strDate += "<tr><td width='50px' class='WeekNum'>" + (++weeknum) + "</td><td class='Wwday' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td>";

					} else {
						if (_day == currDate)
							strDate += "<td width='50px' class='Wtoday' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td>";
						else
							strDate += "<td width='50px' class='Wday' data='" + _day + "'>" + (that.o.checkbox ? "<input type='checkbox' class='cbday'>" : "") + "<span class='daynum'>" + i + "</span></td>";
					}
				}

				for (var i = 0; i < 6 - lastWeek; i++) {
					strDate += "<td class='empty'></td>";
				}
				strDate += "</tr>";
				strDate += '</tbody></table>';
				dateContainer.append(strDate);
				dateContainer.append("<div class='bottom'><span class='viewDateInfo'>" + that.o.viewDateInfo + "</span></div>");

				//拼接当月时间结束
				that.o.el.html(dateContainer);

				$("#tabAllDay td[class*='day']").mouseover(that.o.mouseOver);
				$("#tabAllDay td[class*='day']").mouseout(that.o.mouseOut);
				$("#tabAllDay td[class*='day']").click(that.o.click);
				/*为第一次初始化的dom对象添加相关事件*/
				initEvent(that);
				/*首次初始化完成*/
				that.o.allInitEnd = true;
			}
			/*初始化内部事件*/
		var initEvent = function(that) {
			var el = that.o.el;
			/*获取标头年月对象*/
			var tym = el.find(".TopicYearMonth");
			/*获取月份选择层*/
			var sm = el.find(".selectMonth");
			/*获取月份块*/
			var month_span = sm.find(".month");
			/*获取月份层中的年份标头对象*/
			var smyear = sm.find(".smyear");
			/*获取年份选择层*/
			var sy = el.find(".selectYear");
			/*获取年份层标头对象*/
			var syyear = sy.find(".syYear");
			/*获取年份块*/
			var year_span = sy.find(".year");
			/*获取年份层左箭头翻页对象*/
			var year_left = sy.find(".NavImgl");
			/*获取年份层右箭头翻页对象*/
			var year_right = sy.find(".NavImgr");

			/*绑定年月点击事件 展示月份选择层*/
			tym.bind("click", function() {
				that.o.selectYear = 0;
				smyear.html(that.o.year);
				sm.css("display", "block");
			});
			/*绑定鼠标离开月份层事件*/
			sm.bind("mouseleave", function() {
					sm.css("display", "none");
				})
				/*绑定月份块选择事件*/
			month_span.bind("click", function() {
					var selectdate = new Date((that.o.selectYear == 0) ? that.o.year : that.o.selectYear, $(this).attr("data"));
					sm.css("display", "none");
					that.initDate(selectdate);
				})
				/*绑定年份表头点击事件 展示年份选择层*/
			smyear.bind("click", function() {
					var year = that.o.year;
					year -= year % 10;
					for (var i = 0; i < year_span.length; i++) {
						year_span.eq(i).attr("data", year);
						year_span.eq(i).html(year++);
					}
					syyear.html(that.o.year);
					sy.css("display", "block");
				})
				/*绑定年份头表头点击事件 回到月份层*/
			syyear.bind("click", function() {
					sy.css("display", "none");
					sm.css("display", "block");
				})
				/*绑定年份块选择事件*/
			year_span.bind("click", function() {
					that.o.selectYear = $(this).attr("data");
					smyear.html(that.o.selectYear);
					sy.css("display", "none");
					sm.css("display", "block");
				})
				/*绑定年份层左翻页事件*/
			year_left.bind("click", function() {
					var year = parseInt(syyear.html());
					year -= 10;
					/*显示出翻页10年效果*/
					syyear.html(year);
					year -= year % 10;
					for (var i = 0; i < year_span.length; i++) {
						year_span.eq(i).attr("data", year);
						year_span.eq(i).html(year++);
					}
				})
				/*绑定年份层右翻页事件*/
			year_right.bind("click", function() {
				var year = parseInt(syyear.html());
				year += 10;
				/*显示出翻页10年效果*/
				syyear.html(year);
				year -= year % 10;
				for (var i = 0; i < year_span.length; i++) {
					year_span.eq(i).attr("data", year);
					year_span.eq(i).html(year++);
				}
			})
			/*添加上一年按钮事件*/
			el.find(".NavImg.NavImgll").bind("click", function() {
				var date = that.o.date;
				var opdate = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
				that.initDate(opdate);
			});
			/*添加上一月按钮事件*/
			el.find(".NavImg.NavImgl").bind("click", function() {
				var date = that.o.date;
				var month = parseInt(that.o.month, 10) - 1;
				var opdate = new Date(date.getFullYear(), month, date.getDate());
				that.initDate(opdate);
			});
			/*添加下一月按钮事件*/
			el.find(".NavImg.NavImgrr").bind("click", function() {
				var date = that.o.date;
				var opdate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
				that.initDate(opdate);
			});
			/*添加下一年按钮事件*/
			el.find(".NavImg.NavImgr").bind("click", function() {
				var date = that.o.date;
				var month = parseInt(that.o.month, 10) + 1;
				new Date().setMonth(month);
				var opdate = new Date(date.getFullYear(), month, date.getDate());
				that.initDate(opdate);
			});
		}
		/*初始化时间*/
		this.initDate = function(date) {
				var that = this;
				if (date == undefined || date == null)
					date = new Date();
				that.o.year = date.getFullYear();
				that.o.month = date.getMonth();
				that.o.day = date.getDate();
				that.o.days = date.getDay();
				that.o.strDate = strBuildDate(that);
				that.o.date = date;
				if (that.o.allInitEnd) buildDate(that);
				else buildDater(that);
			}
			/*获取这天是今年的第几周*/
		var getWeekNum = function(that, day) {
				/*获取今年的总天数*/
				var daysForYear = function() {
					var num = 0;
					for (var i = 0; i < that.o.month; i++) {
						var d = new Date(that.o.year, i + 1, 0);
						num += d.getDate();
					}
					num += day
					return num;
				}();
				/*获取今年第一条是周几*/
				var yearFirstDayOnWeek = getWeek(that, day, 0);
				/*定义周数*/
				var week = 0;
				if (yearFirstDayOnWeek == 0) {
					/*如果起步是星期天的算法*/
					week = Math.ceil(daysForYear / 7) - 1;
				} else {
					var md = 7 - yearFirstDayOnWeek;
					daysForYear -= md;
					if (daysForYear <= 0) week = 0;
					else week = Math.ceil(daysForYear / 7);
				}
				return week;
			}
			/*这个日期是这周的第几天*/
		var getWeek = function(that, day, month) {
				var odate = new Date(that.o.year, (month == null || month == undefined) ? that.o.month : month, day);
				return odate.getDay();
			}
			/*一个月有多少天*/
		var getDaysInMonth = function(that, month) {
				var temp = new Date(that.o.year, (month == null || month == undefined) ? that.o.month + 1 : month, 0);
				return temp.getDate();
			}
			/*根据天返回Date*/
		var initDateByDay = function(that, day, isDate) {
				month = parseInt(that.o.month, 10) + 1;
				var temp = new Date(that.o.year + "-" + month + "-" + day);
				if (isDate)
					return temp;
				else
					return that.o.year + "-" + month + "-" + day
			}
			/*返回当前Date：yyyy-MM-dd*/
		var getCurrentDate = function(that, isDate) {
			var c = new Date();
			month = parseInt(c.getMonth(), 10) + 1;
			var temp = new Date(c.getFullYear() + "-" + month + "-" + c.getDate());
			if (isDate)
				return temp;
			else
				return c.getFullYear() + "-" + month + "-" + c.getDate();
		}
		var strBuildDate = function(that) {
			return that.o.year + that.o.dateSplitChar + that.o.month + 1 + that.o.dateSplitChar + that.o.day;
		}

		/*获取当前月选中的天数*/
		this.mfGetSelectChecks = function() {
			var cbdp = this.o.el;
			var dates = new Array();
			var checks = cbdp.find('.cbday:checked');
			for (var index = 0; index < checks.length; index++) {
				var checkBox = checks.eq(index);
				dates.push(checkBox.parent().attr("data"));
			}
			return dates;
		}
	}

	/*用来创建复选框日历的工具*/
	$.fn.mfDataPicker = function(options) {
		//		debugger;
		var el = $(this.get(0));
		var $mf = new mf();
		$mf.o = $.extend({}, {
			strDate: "",
			dateSplitChar: "-", //时间分割符
			mouseOver: null,
			mouseOut: null,
			click: null
		}, options);
		$mf.o.el = el;
		$mf.initDate();
		return $mf;
	}
})(jQuery);