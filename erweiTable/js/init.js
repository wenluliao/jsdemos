$(function(){
	var ewejtable = new erWeiErJiTable();
	ewejtable.addColumnHead("sex","性别",[{'男':'=1'},{'女':'=0'}]);
	ewejtable.addRowsHead("age","年龄",[{'小于30':'<30'},{'30~40':['>=30','<40']}])
	$("body").html(ewejtable.getHtmlStr());
})