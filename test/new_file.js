var test = function(){
	var a = 'a';
	this.b = function(){
		alert(a);
	}
	var init = function(){
		a = "aaaa";
	}
	return init()
};
var nt = new test();
nt.b();
