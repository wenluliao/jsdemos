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
	this.addColumnHead = function(id, columnText, section) {
		if (!columns.data.hasOwnProperty(id)) {
			columns.ids.push(id);
			columns.data[id] = columnText;
			columns.section[id] = section;
			columns.totalSize += section.length;
		}
	};
	this.addRowsHead = function(id, columnText, section) {
		if (!rows.data.hasOwnProperty(id)) {
			rows.ids.push(id);
			rows.data[id] = columnText;
			rows.section[id] = section;
			rows.totalSize += section.length;
		}
	};
	this.getHtmlStr = function() {
		changeTabelHtml();
		initdata();
		return tableStr;
	};
	var changeTabelHtml = function() {
		var that = this;
		/*获取二级列头基数*/
		var columnLength = columns.totalSize;
		/*获取二级行头基数*/
		var rowLength = rows.totalSize;
		/*存储行对象*/
		var trs = [];
		/*先动态生成所有表格，随后再进行列头合并，以及单元格内容的设置*/
		for (var i = 0; i < rowLength + 2; i++) {
			/*存储列对象*/
			var tds = [];
			for (var j = 0; j < columnLength + 2; j++) {
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
	var initdata = function(){
		var div = document.createElement('div');
		div.setAttribute("id","ewejdiv");
		div.innerHTML = tableStr;
		Ext.select(".td_0_0").set({"colspan":2,"rowspan":2});
		console.log(div.innerHTML);
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
		return '<td calss="' + tdclass + '">' + a + '</td>';
	};
	var outTdHtml = function(tdclass) {
		return '<td calss="' + tdclass + '"></td>'
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
	var generateTdClassByIndex = function(trIndex, tdIndex) {
		return "td_" + trIndex + "_" + tdIndex;
	}
}


Ext.onReady(function() {
	var ewejtable = new erWeiErJiTable();
	ewejtable.addColumnHead("sex","性别",[{'男':'=1'},{'女':'=0'}]);
	ewejtable.addRowsHead("age","年龄",[{'小于30':'<30'},{'30~40':['>=30','<40']}])
	
//	console.log(ewejtable.getHtmlStr());
	Ext.select("body").update(ewejtable.getHtmlStr());
})

