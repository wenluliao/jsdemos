function myfun1(){
    //这是私有属性
    var private1 = "这是私有属性";
    var privateMethod = function(){
        alert(private1);
    }
    //这是实例属性
    this.publicvar = "这是实例属性";
    this.public1 = function(){
        privateMethod();
    }
    this.public2 = function(){
       alert(private1);
    }
}
var mf1 = new myfun1();
//alert(mf1.publicvar);	//访问正常
//mf1.public1();	//访问正常
//mf1.public2();	//访问正常

/*===============================*/

function myfun2(){
	this.staticvar = "实例化后只能访问到实力属性";
}
myfun2.staticvar = "这是静态属性";
myfun2.staticmethod = function(){
    alert(myfun2.staticvar);
}
var newfun2 = new myfun2();
//newfun2.staticmethod();//运行错误;
//alert(myfun2.staticvar);//访问到静态属性
//alert(newfun2.staticvar);//访问到实力属性

/*===================================*/
