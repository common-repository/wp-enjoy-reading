/*!
Author: QiQiBoY
Update: 20010/11/12
Author URI: http://www.qiqiboy.com/
*/


(function() {

function $(id) {
    return document.getElementById(id)
}
function addListener(e, n, o, u) {
    if(e.addEventListener) {
		e.addEventListener(n, o, u);
		return true;
	} else if(e.attachEvent) {
		e['e' + n + o] = o;
		e[n + o] = function() {
			e['e' + n + o](window.event);
		};
		e.attachEvent('on' + n, e[n + o]);
		return true;
	}
	return false;
}
documentReady=(function(){
	var load_events = [],load_timer,script,done,exec,old_onload,init = function () {done = true;clearInterval(load_timer);while (exec = load_events.shift())exec(); if (script) script.onreadystatechange = '';};
	return function (func) {
		if (done) return func();
		if (!load_events[0]) {
			if (document.addEventListener)
				document.addEventListener("DOMContentLoaded", init, false);
			else if (/MSIE/i.test(navigator.userAgent)){
				document.write("<script id=__ie_onload defer src=//0><\/scr"+"ipt>");
				script = document.getElementById("__ie_onload");
				script.onreadystatechange = function() {
					if (this.readyState == "complete")
						init();
				};
			}else
			if (/WebKit/i.test(navigator.userAgent)) {
				load_timer = setInterval(function() {
					if (/loaded|complete/.test(document.readyState))
						init();
				}, 10);
			}else{
				old_onload = window.onload;
				window.onload = function() {
					init();
					if (old_onload) old_onload();
				};
			}
		}
		load_events.push(func);
	}
})();
function baseurl(){
	var url="http://"+window.location.host+"/wp-content/";
	var finds=document.getElementsByTagName('link');
	for(var i=0;i<finds.length;i++){
		if(finds[i].href.indexOf('wp-content')>0){
			url=finds[i].href.substring(0,finds[i].href.indexOf('wp-content')+11);
			break;
		}
	}
	return url;
}
var Class = {
	create: function() {
		return function() {
			this.init.apply(this, arguments);
		}
	}
}
var ajax=Class.create();//ajax io Class
ajax.prototype={
	init:function(options){
		this.url=options.url||window.location.href;//request address
		this.method=options.method||'GET';//request type: GET or POST
		this.before=options.before||new Function();//before request send
		this.dataType=options.dataType||'json';//Response data type
		this.send=options.send||null;//POST content
		this.after=options.after||new Function();//
		this.delay=options.delay||30;//delay time
		this.header=options.header||'';//request header, XXX=XXXX&YYY=YYYY
		this.success=options.success||new Function();//Response success
		this.error=options.error||new Function();//Response faild
		this.timeoutCallback=options.timeoutCallback||false;
		this.hasDo=false;
		this.sendxmlHttp();
	},
	
	createxmlHttp:function() {
		var xmlHttp;
		try {
			xmlHttp = new XMLHttpRequest()
		} catch(e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
			} catch(e) {
				try {
					xmlHttp = new ActiveXObject("Msxml2.XMLHTTP")
				} catch(e) {
					alert("Your browser does not support ajax!");
					return false
				}
			}
		}
		return xmlHttp
	},

	sendxmlHttp:function(){
		this.isTimeout=false;
		this.xmlHttp=this.createxmlHttp();this.before();
		this.xmlHttp.open(this.method, this.url, true);
		this.timer=setTimeout(this.bind(
			this.checkTimeout
		,this),this.delay*1000);
		this.setHeader(this.header);this.requestStatus=0;
		this.xmlHttp.onreadystatechange = this.bind(function() {
			switch(this.xmlHttp.readyState){
				case 1:
				case 2:
				case 3:break;
				case 4:
					if(!this.hasDo){
						this.hasDo=true;
						try{
							clearTimeout(this.timer);
							if(this.xmlHttp.status&&this.xmlHttp.status==200){
								if(this.xmlHttp.responseText.replace(/(^\s*)|(\s*$)/g, '')===''){this.error();this.after();return;}
								switch(this.dataType){
									case 'json':
											try{
												this.xmlHttp.responseText.match(/WER-(.*)-WER/);
												this.data=eval("("+RegExp.$1+")");
											}catch(e){
												alert(e+'   Parse error data!');
											}
											break;
									case 'text':
									case 'html':
									default:
											this.data=this.xmlHttp.responseText;
											break;
								}
								this.success();
							}else if(this.isTimeout){
								alert('Response timeout, the request to cancel! ! The current network is not good, or the server is busy, please try again later!');
								this.timeoutCallback?this.timeoutCallback():this.error();
							}else if(!this.isError){
								this.data=this.xmlHttp.responseText;
								this.error();
							}
							this.after();
						}catch(e){
							alert(e+' unknow error! Please contact imqiqiboy@gmail.com.');this.error();this.after();
						}
					}
					break;
				default:break;
			}
		},this);
		this.xmlHttp.send(this.send);
	},
	
	checkTimeout:function(){
		if(this.requestStatus!==4){
			this.isTimeout=true;
			this.xmlHttp.abort();
		}
		return;
	},
	
	setHeader:function(){
		this.xmlHttp.setRequestHeader('Ajax-Request','ajaxPaled');
		this.send==null?this.xmlHttp.setRequestHeader('Content-type', 'charset=UTF-8'):this.xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		var a=this.header.split('&');
		if(!a[0].length)return;
		for(var i=0;i<a.length;i++){
			if(b.length!=2)continue;
			this.xmlHttp.setRequestHeader(b[0],b[1]);
		}
	},
	
	bind:function(f,o){
		return function(){
			return f.apply(o,arguments);
		}
	}
}
options={
		uname:'',
		umail:'',
		uurl:'',
		isuser:0,
		cmts:10,
		from:'From: ',
		timefrom:'Time: ',
		postat:'Time: ',
		navbe:'page ',
		navaf:'',
		newer:'newer',
		older:'older',
		showcmt:'Comments',
		morecmt:'Load more comments',
		nocmt:'There is no comments.',
		str0:'loading Enjoy Reading files, please wait...',
		str1:'loading EnjoyReading page, please wait...',
		str2:'EnjoyReading page load success! Initialize...',
		str3:'loading request data, please wait...',
		str4:'Request timed out, or post request data too large, click the "Reload" try again!',
		str5:'Say something...',
		str6:'change',
		str7:'is submiting...',
		str8:'Please check your name!',
		str9:'Please check your email!',
		str10:'Please check your comment!',
		str11:'Please check your input!',
		str12:'Welcome back',
		str13:'Submit Comment',
		str13:'submit successfully!',
		bgimg:'#fff'
	}
documentReady(function(){
	new ajax({
		url:'?action=EnjoyReadingOptions',
		dataType:'json',
		success:function(){
			EnjoyReading.options=this.data;
		}
	});
	if($('EnjoyReadingStart'))
	$('EnjoyReadingStart').onclick=function(){
		window.scrollTo(0,0);
		if($('EnjoyReading-JS'))return;
		document.body.style.cursor='wait';
		document.body.style.overflow='hidden';
		document.body.innerHTML+='<div id="WER-cover" style="position:absolute;left:0;top:0;right:0;bottom:0;background:#000;opacity:0.9;filter:alpha(opacity=90);z-index:9999;"></div>'+
								'<div style="font-size:11px;line-height:50px;height:50px;position:absolute;width:300px;border:1px solid #aaa;background:#fff;margin-left:-150px;left:50%;top:50px;z-index:100000;" id="load-enjoyreading">'+
								'<div id="loadprogress" style="left:0;z-index:100001;position:absolute;height:100%;width:20%;background:#00df09;"></div><div style="left:0;padding-left:20px;position:absolute;z-index:100002;" id="load-enjoyreading-text">'+EnjoyReading.options.str0+'</div></div>';
		var JS=document.createElement('script'),
			CSS=document.createElement('link');
		JS.setAttribute('type','text/javascript');
		JS.setAttribute('src',baseurl()+'plugins/wp-enjoy-reading/js/wp-enjoy-reading.min.js');
		JS.id='EnjoyReading-JS';
		document.getElementsByTagName('head')[0].appendChild(JS);
		CSS.setAttribute('type','text/css');CSS.setAttribute('rel','stylesheet');CSS.setAttribute('media','screen');
		CSS.setAttribute('href',baseurl()+'plugins/wp-enjoy-reading/css/wp-enjoy-reading.css');
		document.getElementsByTagName('head')[0].appendChild(CSS);
		return false;
	}
});
window['EnjoyReading'] = {};
window['EnjoyReading']['addListener'] = addListener;
window['EnjoyReading']['baseurl'] = baseurl;
window['EnjoyReading']['options'] = options;
window['EnjoyReading']['ajax'] = ajax;
window['EnjoyReading']['documentReady'] = documentReady;
})();