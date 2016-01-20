/**
 * 动态生成二维表格
 * @param string firstHeadName
 * @author liaowenlu
 */
function erWerTable(firstHeadName){
	firstHeadName : firstHeadName,
	columns : {},
	rows : {},
	tableStr : '',
	this.addColumnHead : function(id,columnText){
		if(!this.columns.hasOwnProperty(id)){
			this.columns[id] = columnText;
		}
	},
	this.addRowsHead : function(id,columnText){
		if(!this.rows.hasOwnProperty(id)){
			this.rows[id] = columnText;
		}
	},
	this.getHtmlStr : function(){
		
	},
	changeTabelHtml : function(){
		/*定义制表html代码段*/
		var tablePrefix = '<table id="a" >';
		var tableSuffix = '</table>';
		var trPrefix = '<tr>';
		var trSuffix = '</tr>';
		var tdPrefix = '<td>';
		var tdSuffix = '</td>';
		var aPrefix1 = '<a href="';
		var aPrefix2 = '" >';
		var aSuffix = '</a>';
		/*定义组装table用的数组*/
		var 
	}
}
