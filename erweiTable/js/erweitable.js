/**
 * 动态生成二维二级表格
 * @param string firstHeadName
 * @author liaowenlu
 * 
 * explain 此对象可用来创建二维二级表格
 * 		内置columns，rows 均放置了此维度的id，维度id对应的维度名称（一级列名），
 * 			维度id对应的区分范围，需要生成的二级列数量
 * 		内置对象tableStr用来存储生成完成后的html代码
 * 
 */
function erWeiErJiTable() {
	var columns = {
		ids: [],
		data: {},
		section: {},
		totalSize: 0
	};
	var rows = {
		ids: [],
		data: {},
		section: {},
		totalSize: 0
	};
	var tableStr = '';
	/**
	 * explain 添加表列头数据的方法
	 * @param {Object} id 			要添加的维度的id
	 * @param {Object} columnText	维度对象{维度id:维度名字}
	 * @param {Object} section		维度的区分度{维度id:[{区分度名称:区分度语义范围},{区分度名称:区分度语义范围}...]}
	 */
	this.addColumnHead = function(id, columnText, section) {
		if (!columns.data.hasOwnProperty(id)) {
			columns.ids.push(id);
			columns.data[id] = columnText;
			columns.section[id] = section;
			columns.totalSize += section.length;
		}
	};
	/**
	 * explain 添加表行头数据的方法
	 * @param {Object} id			要添加的维度的id
	 * @param {Object} columnText	维度对象{维度id:维度名字}
	 * @param {Object} section		维度的区分度{维度id:[{区分度名称:区分度语义范围},{区分度名称:区分度语义范围}...]}
	 */
	this.addRowsHead = function(id, columnText, section) {
		if (!rows.data.hasOwnProperty(id)) {
			rows.ids.push(id);
			rows.data[id] = columnText;
			rows.section[id] = section;
			rows.totalSize += section.length;
		}
	};
	/**
	 * explain 获得生成的虚拟table的完整html代码
	 */
	this.getHtmlStr = function() {
		changeTabelHtml();
		initTable();
		return tableStr;
	};
	this.loadData = function(data){
		$.ajax({
			type:"post",
			url:"",
			async:true
		});
	}
	/**
	 * 根据行列配置生成一个符合规范的表格html代码段
	 */
	var changeTabelHtml = function() {
		var that = this;
		/*获取二级列头基数*/
		var columnLength = columns.totalSize;
		/*获取二级行头基数*/
		var rowLength = rows.totalSize;
		/*存储行对象*/
		var trs = [];
		/*先动态生成所有表格，随后再进行列头合并，以及单元格内容的设置*/
		for (var i = 0; i < rowLength + 3; i++) {
			/*存储列对象*/
			var tds = [];
			for (var j = 0; j < columnLength + 3; j++) {
				var tdClass = generateTdClassByIndex(i, j)
				var aHtml = outAHtml("");
				var tdHtml = outTdAHtml(aHtml, tdClass);
				tds.push(tdHtml);
			}
			var trHtml = outTrHtml(tds);
			trs.push(trHtml);
		}
		tableStr = outTableHtml(trs);
	};
	/**
	 * explain 对生成的html代码段映射到一个div中
	 * 			用jquery对其进行相关操作设置
	 */
	var initTable = function(){
		/*虚拟一个div对象 用来填充table*/
		var div = document.createElement('div');
		div.setAttribute("id","ewejdiv");
		div.innerHTML = tableStr;
		/*开始初始化table的行列头*/
		/*先制定首行首列*/
		tdspan($(div),0,0,2,2).css("background-color","rgb(235, 243, 251)").html("综合统计");
		/*获取二级列头基数*/
		var columnLength = columns.ids.length;
		/*获取二级行头基数*/
		var rowLength = rows.ids.length;
		/*先遍历列头 并设置相应属性及样式*/
		for(var i=2,j=0 ; j< columnLength;j++){
			/*获得一级列头数组*/
			var id = columns.ids[j];
			/*获得二级列头数组*/
			var sections = columns.section[id];
			/*根据维度区分度来合并一级列头单元格，并设置单元格样式及内容*/
			tdspan($(div),0,i,0,sections.length)
				.css("background-color","rgb(235, 243, 251)")
				.html(columns.data[id]);
			for(var k = 0 ; k < sections.length; k++,i++){
				var section = sections[k];
				for(var key in section){
					/*设置二级列头，根据维度区分度提供的内容来设置*/
					$(div).find(".td_1_"+i).attr({
						"parent":id,
						"section":section[key]
					}).css("background-color","rgb(235, 243, 251)")
					.html(key)
				}
			}
		}
		/*遍历行头 并设置相应属性及样式  说明同上*/
		for(var i=2,j=0 ; j< rowLength;j++){
			var id = rows.ids[j];
			var sections = rows.section[id];
			tdspan($(div),i,0,sections.length,0)
				.css("background-color","rgb(235, 243, 251)")
				.html(rows.data[id]);
			for(var k = 0 ; k < sections.length; k++,i++){
				var section = sections[k];
				for(var key in section){
					$(div).find(".td_"+i+"_1").attr({
						"parent":id,
						"section":section[key]
					}).css("background-color","rgb(235, 243, 251)")
					.html(key)
				}
			}
		}
		
		/*制作合计行列样式*/
		tdspan($(div),0,columns.totalSize+2,2,0)
			.css("background-color","rgb(235, 243, 251)").html("合计");
		tdspan($(div),rows.totalSize+2,0,0,2)
			.css("background-color","rgb(235, 243, 251)").html("合计");
		tableStr = $(div).html();
	};
	/**
	 * 生成表html代码段
	 * @param {Object} trs 行对象集合
	 */
	var outTableHtml = function(trs) {
		var str = '';
		for (var i = 0; i< trs.length;i++) {
			str += trs[i];
		}
		return '<table id="ewejtable" >' + str + '</table>';
	};
	var outTrHtml = function(tds) {
		var str = '';
		for (var i = 0; i< tds.length;i++) {
			str += tds[i];
		}
		return '<tr>' + str + '</tr>';
	};
	var outTdAHtml = function(a, tdclass) {
		return '<td class="' + tdclass + '">' + a + '</td>';
	};
	var outTdHtml = function(tdclass) {
		return '<td class="' + tdclass + '"></td>'
	};
	var outAHtml = function(href) {
		return '<a href="' + href + '"></a>'
	};
	var objsize = function(obj) {
		var size = 0;
		for (var b in a) {
			size++;
		}
		return size;
	};
	/**
	 * 根据当前行列生成唯一的class
	 * @param {Object} trIndex
	 * @param {Object} tdIndex
	 */
	var generateTdClassByIndex = function(trIndex, tdIndex) {
		return "td_" + trIndex + "_" + tdIndex;
	};
	/**
	 * 单元格合并的处理函数 返回进行合并的单元格对象
	 * @param {Object} obj		给定一个目标父级（表级或以上元素对象）
	 * @param {Object} xindex	目标所在行位置
	 * @param {Object} yindex	目标所在列位置
	 * @param {Object} x	目标需要合并的行数量，（要求大于1）
	 * @param {Object} y	目标需要合并的列数量，（要求大于1）
	 */
	var tdspan = function(obj,xindex,yindex,x,y){
		if(x<1) x=1;
		if(y<1) y=1;
		obj.find(".td_"+xindex+"_"+yindex).attr({
			"rowspan":x,
			"colspan":y
		});
		for(var i=0;i<x;i++){
			/*定义当前行位置*/
			var _x = xindex+i;
			for (var j=0;j<y;j++) {
				/*定义当前列位置*/
				var _y = yindex+j;
				if(xindex != _x || yindex != _y)
					obj.find(".td_"+_x+"_"+_y).remove();
			}
		}
		return obj.find(".td_"+xindex+"_"+yindex);
	}
}
