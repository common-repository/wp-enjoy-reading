/*!
Author: QiQiBoY
Update: 20010/11/12
Author URI: http://www.qiqiboy.com/
*/

;(function() {

function $(id) {
    return document.getElementById(id)
}
function removeNode(obj){
	if(typeof obj == "string")$(obj).parentNode.removeChild($(obj));
	else obj.parentNode.removeChild(obj);
}
function insertBe(obj,tar){
	tar.parentNode.insertBefore(obj,tar);
}
function insertAf(obj,tar){
	tar.parentNode.insertBefore(obj,tar.nextSibling);
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
function SetCookie(c_name, value, expiredays, domain, path) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "": ";expires=" + exdate.toGMTString()) + ";domain=" + domain + ";path=" + path
}
function getStyle(element,property) {
	var value = element.style[property];
	if (!value) {
		if (document.defaultView && document.defaultView.getComputedStyle) {
			var css = document.defaultView.getComputedStyle(element, null);
			value = css ? css.getPropertyValue(property) : null;
		} else if (element.currentStyle) {
			value = element.currentStyle[property];
		}
	}
	return value == 'auto' ? '' : value;
}
function toggleStyle(id){
	$(id).style.display=$(id).style.display=='none'?'block':'none';
}
String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
function $$(c, t, p) {
	try{
		var at = p.getElementsByTagName(t);
	}catch(e){
		alert(e+'<br>some error!');
		var at = document.getElementsByTagName(t);
	}
	var ms = new Array();
	for (var i = 0; i < at.length; i++)
		if (hasClassName(at[i],c))
			ms.push(at[i]);
	return ms;
}
function preventDefault(e) {
	if (window.event) {
		window.event.cancelBubble = true;
		window.event.returnValue = false;
		return
	}
	if (e.preventDefault && e.stopPropagation) {
		e.preventDefault();
		e.stopPropagation()
	}
}
function hasClassName(o,c) {
    return new RegExp("(?:^|\\s+)" + c + "(?:\\s+|$)").test(o.className);
}
function addClassName(o,c) {
    if (!hasClassName(o,c)) {
        o.className = [o.className, c].join(" ").trim();
    }
}
function removeClassName(o,c) {
    if (hasClassName(o,c)) {
        var a = o.className;
        o.className = a.replace(new RegExp("(?:^|\\s+)" + c + "(?:\\s+|$)", "g"), " ");
    }
}
function toggleClassName(o,c) {
    hasClassName(o,c) ? removeClassName(o,c) : addClassName(o,c);
}
function IE(){
	if (/MSIE/i.test(navigator.userAgent))return true;
	else return false;
}
function windowXY(){
	return {'x':window.innerWidth || document.documentElement.clientWidth,'y':window.innerHeight || document.documentElement.clientHeight};
}
function getMousePoint(ev) {
    var x=y=0;
	if (typeof window.pageYoffset!= 'undefined') {
		x = window.pageXOffset;
		y = window.pageYOffset
	}
	else 
		if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
			x = document.documentElement.scrollLeft;
			y = document.documentElement.scrollTop
		}
		else 
			if (typeof document.body != 'undefined') {
				x = document.body.scrollLeft;
				y = document.body.scrollTop
			}
	if(!ev) ev=window.event;
	x += ev.clientX;
	y += ev.clientY;
	return {'x':x,'y':y};
}
function getObjPoint(o){
    var x=y=0;
	do {
		x += o.offsetLeft || 0;
		y += o.offsetTop  || 0;
		o = o.offsetParent;
	} while (o);

	return {'x':x,'y':y};
}

/* mag start */
var dataJson={},datapagenav={},commentsArr={},
	loadCommentTimer,
	submitTimer,
	iswitch=false,
	postStack=[],
	pagenavStack=[];
function tryPushStack(stack,args) {
	stack.push(args);
	return true
}
document.body.style.background=EnjoyReading.options.bgimg;
new EnjoyReading.ajax({
	url:'?action=EnjoyReadingIndex',
	dataType:'text',
	before:function(){
		$('load-enjoyreading-text').innerHTML=EnjoyReading.options.str1;
		$('loadprogress').style.width='50%';
	},
	success:function(){
		document.body.innerHTML=this.data+'<div id="WER-cover" style="position:absolute;left:0;top:0;right:0;bottom:0;background:#000;opacity:0.9;filter:alpha(opacity=90);z-index:9999;"></div>'+
								'<div style="font-size:11px;line-height:50px;height:50px;position:absolute;width:300px;border:1px solid #aaa;background:#fff;margin-left:-150px;left:50%;top:50px;z-index:100000;" id="load-enjoyreading">'+
								'<div id="loadprogress" style="left:0;z-index:100001;position:absolute;height:100%;width:80%;background:#00df09;"></div><div style="left:0;padding-left:20px;position:absolute;z-index:100002;" id="load-enjoyreading-text">'+EnjoyReading.options.str1+'</div></div>';
		document.body.className+=' WER';
		getPosts('index');$('WER-setTheme').onclick=preview_theme;
	},
	after:function(){
		document.body.style.cursor='auto';
	}
	
});

function sumArr(arr,from,to){
	if(from==to)return 0;
	var sum=0;
	for(var i=from;i<to;i++){
		sum+=arr[i];
	}
	return sum;
}

function getPosts(c){
	if(!dataJson[c])dataJson[c]=[];
	if(!datapagenav[c])datapagenav[c]=[];
	var sum=0,
		post_from=offset=dataJson[c].length,
		page_from=datapagenav[c].length,
		_pagenav=new Array();
	for(var i=0;i<5;i++){
		var rand=Math.floor(Math.random()*7+1);
		sum+=rand;
		_pagenav.push(rand);
	}
	closeFrame();
	new EnjoyReading.ajax({
		url:'?action=EnjoyReadingPosts&number=' + sum + '&offset=' + offset +(c == 'index' ? '' : '&catname='+c.replace(/\?/,'&')),
		before:function(){
			if($('load-enjoyreading-text')){
				$('load-enjoyreading-text').innerHTML=EnjoyReading.options.str3;
				$('loadprogress').style.width='99%';
			}
			$('WER-container').innerHTML='<div id="WER-loading-div" style="background:#fff url('+EnjoyReading.baseurl()+'plugins/wp-enjoy-reading/img/ajax-loader.gif) center center no-repeat;"></div>';
		},
		dataType:'json',
		success:function(){
			var _json=this.data;
			var post_num=page_num=0;
			if(_json.length<sum){
				var _sum=0;
				while(_sum<_json.length){
					_sum+=_pagenav[page_num++];
				}
				_pagenav=_pagenav.splice(0,page_num);
				_pagenav[page_num-1]=_json.length-sumArr(_pagenav,0,page_num-1);
			}else{
				page_num=_pagenav.length;
			}
			post_num=_pagenav[0];
			dataJson[c] = dataJson[c].concat(_json);
			datapagenav[c] = datapagenav[c].concat(_pagenav);
			loadPost(c,post_from,post_num);
			setPageNav(c,page_from,page_num);
		},
		error:function(){
			$('WER-cover').style.display="none";
			$('WER-loading-div').innerHTML='<p>Oops, failed to load data. <small><a id="errorthing" href="javascript:void(0);">[Reload]</a></small></p>';
			$('WER-loading-div').style.background='url('+EnjoyReading.baseurl()+'plugins/wp-enjoy-reading/img/clock.jpg) 0px 20px no-repeat';
			$('errorthing').onclick=function(){
				getPosts(c);
			}
		},
		after:function(){
			if($('load-enjoyreading'))
				removeNode('load-enjoyreading');
			if($('WER-cover'))
				$('WER-cover').style.display='none';
			document.body.style.overflow='auto';
		},
		timeoutCallback:function(){
			this.error();
			$('WER-loading-div').innerHTML+='<p style="background:#fff;display:inline;">'+EnjoyReading.options.str4+'</p>';
		}
	});
}

function applyTemplate(c,from,number){
	var json=dataJson[c];
	if(!json.length)return "<h3>There is nothing!</h3>";
	var data='',j=0;
	for(var i=from;i<from+number;i++){
		data+='<div class="WER-post box'+(j++)+'" id="post-'+json[i].id+'"><div class="WER-singlecontent"><div class="WER-articletitle"><a class="WER-title" href="'+json[i].posturl+'" rel="bookmark">'+
				json[i].title+'</a></div><div class="WER-articlefrom"><span class="WER-category">'+EnjoyReading.options.from+json[i].cat+'</span>&#160;&#160;&#160;&#160;<span class="WER-indextime">'+EnjoyReading.options.timefrom+json[i].time+'</span></div>'+
				'<div class="WER-articleimg">';
		if(json[i].thumd!='')data+='<img src='+json[i].thumd+'/>';
		data+='</div><div class="WER-articlesummary">'+json[i].excerpt+'</div></div></div>';
	}
	return data;
}
function getRand(number){
	var rand;
	switch(number){
		case 4:rand=Math.floor(Math.random()*4+1);break;
		case 5:rand=Math.floor(Math.random()*6+1);
				break;
		default:rand=1;break;
	}
	return rand;
}
function loadPost(c,from,number){
	var rand=getRand(number);
	var data=applyTemplate(c,from,number);
	$('WER-container').style.right='0px';
	switchAnimate(500, $('WER-container').offsetWidth, function(){
		singlePost(c,from,number);
		if(!from)addClassName($('WER-indexpre'),'none');
		else removeClassName($('WER-indexpre'),'none');
		if(!$$('current','a',$('WER-pagenav'))[0].nextSibling)addClassName($('WER-indexnex'),'none');
		else removeClassName($('WER-indexnex'),'none');
		switchAnimate(150, 50 ,function(){
			switchAnimate(100, 30 ,function(){
				switchAnimate(50, 15 ,function(){
					switchAnimate(20, 7, function(){
						iswitch=false;
					});
				});
			});
		});
	}, function(){
		$('WER-container').innerHTML=data;
		$('WER-container').className="WER-tmp"+number+"_"+getRand(number);
		bindcategoryEvent();
	});
	tryPushStack(postStack,arguments);
}
function switchAnimate(time, length, callback2, callback1){
	var start=new Date();
	var AnimateTimer=setInterval(function(){
		var now=new Date();
		if(now-start<time){
			$('WER-container').style.right=Math.floor(((now-start)/time)*100)/100*length+'px';
		}else{
			clearInterval(AnimateTimer);
			$('WER-container').style.right=length+'px';
			if(callback1)callback1();
			start=new Date();
			AnimateTimer=setInterval(function(){
				var now=new Date();
				if(now-start<time){
					$('WER-container').style.right=(length-Math.floor(((now-start)/time)*100)/100*length)+'px';
				}else{
					clearInterval(AnimateTimer);
					if(callback2)callback2();
				}
			},4);
		}
	},4);
}
function setPageNav(c,from,number,_cur){
	var mypagebar,navbar='<a id="WER-indexpre" class="WER-prev none" href="javascript:;"><img src="'+EnjoyReading.baseurl()+'plugins/wp-enjoy-reading/img/spacer.gif" class="pre"></a><div id="WER-indexpagebar" class="WER-indexpagebar">',current=_cur?_cur:from;
	if(!$('WER-pagenav')){
		mypagebar=document.createElement('div');
		mypagebar.id="WER-pagenav";
		insertAf(mypagebar,$('WER-container').parentNode);
	}else{
		mypagebar=$('WER-pagenav');
	}
	if(from>0)navbar+='<a id="WER-newer" title="'+EnjoyReading.options.newer+'" class="WER-newer" href="javascript:void(0)">'+EnjoyReading.options.newer+'</a>';
	for(var i=from;i<from+number;i++){
		navbar+='<a title="'+EnjoyReading.options.navbe+(i+1)+EnjoyReading.options.navaf+'" rel="'+datapagenav[c][i]+'" class="WER-nav';
		if(i==current)navbar+=' current';
		navbar+='" href="javascript:void(0)">'+(i+1)+'</a>';
	}
	if(number>=5)navbar+='<a id="WER-older" title="'+EnjoyReading.options.older+'" class="WER-older" href="javascript:void(0)">'+EnjoyReading.options.older+'</a>';
	navbar+='</div><a id="WER-indexnex" class="WER-next" href="javascript:;"><img src="'+EnjoyReading.baseurl()+'plugins/wp-enjoy-reading/img/spacer.gif" class="nex"></a>';
	mypagebar.innerHTML=navbar;
	
	var navs=$$('WER-nav','a',mypagebar);
	for(var i=0;i<navs.length;i++){
		(function(){
			var _i=i;
			navs[_i].onclick=function(){
				if(iswitch)return;
				iswitch=true;
				loadPost(c,sumArr(datapagenav[c],0,from+_i),parseInt(navs[_i].rel));
				removeCurrentClassName(navs,_i);
				addClassName(navs[_i],'current');
				tryPushStack(pagenavStack,[c,from,number,from+_i]);
			}
		})();
	}
	
	if($('WER-newer')||0)$('WER-newer').onclick=function(){
				if(iswitch)return;
				iswitch=true;
				loadPost(c,sumArr(datapagenav[c],0,from-1),datapagenav[c][from-1]);
				setPageNav(c,from-5,5,from-1);
			}
	if($('WER-older')||0)$('WER-older').onclick=function(){
				if(iswitch)return;
				iswitch=true;
				if(datapagenav[c].length>from+number){
					loadPost(c,sumArr(datapagenav[c],0,from+5),datapagenav[c][from+5]);
					setPageNav(c,from+5,5);
				} else getPosts(c);
			}
	if($('WER-indexpre')||0)$('WER-indexpre').onclick=function(){
				var pre=$$('current','a',$('WER-indexpagebar'))[0];
				if(pre.previousSibling)pre.previousSibling.onclick();
			};
	if($('WER-indexnex')||0)$('WER-indexnex').onclick=function(){
				var nex=$$('current','a',$('WER-indexpagebar'))[0];
				if(nex.nextSibling)nex.nextSibling.onclick();
			};
	document.onkeydown = function(ev) {
		switchShortCut(ev);
	}
	tryPushStack(pagenavStack,[c,from,number,current]);
}
function removeCurrentClassName(navs,curNum){
	for(var i=0;i<navs.length;i++){
		removeClassName(navs[i],'current');
	}
}
function bindcategoryEvent(p){
	var cats;
	if(!p)cats=$$('WER-category','span',$('WER-container'));
	else cats=$$('WER-articlefrom','div',$(p));
	for(var i=0;i<cats.length;i++){
		(function(){
			var _i=i,cata=cats[_i].getElementsByTagName('a');
			if(cata.length){
				for(var j=0;j<cata.length;j++){
					(function(){
						var _j=j;
						addListener(cata[_j],'click',function(e){
							preventDefault(e);
							if(iswitch)return;
							iswitch=true;
							returnBack(cata[_j].innerHTML);
							var cname=cata[_j].href.replace(/^http:\/\/.*\//gi,'');
							if(dataJson[cname]){
								loadPost(cname,0,datapagenav[cname][0]);
								datapagenav[cname].length<5?setPageNav(cname,0,datapagenav[cname].length):setPageNav(cname,0,5);
							}else{
								getPosts(cname);
							}
						},false);
					})();
				}
			}
		})();
	}
}
function returnBack(text){
	if(!notEmpty('WER-returnBack')){
		var returnHome=document.createElement('div');
		returnHome.id='WER-returnBack';
		insertBe(returnHome,$('WER-container'));
	}else{
		returnHome=$('WER-returnBack');
		returnHome.style.display="block";
	}
	returnHome.innerHTML='<a id="return_Back" class="return-back" rel="nofollow" href="#">Back</a>';
	returnHome.innerHTML+='<span class="WER-archname">'+text+'</span>';
	
	$('return_Back').onclick=function(){
		if(iswitch)return;
		while((b=postStack[postStack.length-1][0])!='index'){
			postStack.pop();pagenavStack.pop();
		}
		returnHome.style.display="none";
		loadPost.apply(null, postStack.pop());
		setPageNav.apply(null, pagenavStack.pop());
		return false;
	}
}
function singlePost(c,from,number){
	var posts=$$('WER-title','a',$('WER-container'));
	for(var i=0;i<posts.length;i++){
		(function(){
			var _i=i;
			posts[_i].onclick=function(){
				loadAllPost(c,_i,from,number);
				return false;
			};
		})();
	}
}

function loadAllPost(c,i,from,number){
	var mySingle,data='',j=i,json=dataJson[c];
	i=i+from;
	if(!$('WER-the_frame')){
		myFrame=document.createElement('div');
		myFrame.id="WER-the_frame";
		document.body.appendChild(myFrame);
	}
	$('WER-the_frame').innerHTML='<div id="WER-single_frame"></div>';
	$('WER-the_frame').style.display="block";
	$('WER-cover').style.display="block";
	data+='<div id="WER-close"><a href="javascript:void(0)"></a></div><div class="WER-post_body" style="width: 745px; height: 100%; overflow: hidden;">'+
			'<div class="WER-articlearea"><div id="WER-dragErea" class="WER-detailheading"><div class="WER-articleinfo"><div class="WER-title"><h2>'+json[i].title+'</h2></div><div class="WER-articlefrom">'+EnjoyReading.options.from+json[i].cat+'&nbsp;&nbsp;&nbsp;'+EnjoyReading.options.postat+json[i].time+'&nbsp;&nbsp;&nbsp;</div></div>'+
			'<div class="WER-articleoperate"></div></div>'+
			'<div class="WER-detailcontentouter"><div class="WER-detailcontent">'+json[i].content+'</div>'+
			'</div></div></div>'+
			'<div id="WER-commentarea" class="WER-commentarea"><div class="WER-commentheading">'+EnjoyReading.options.showcmt+'(<span class="WER-commentnum">'+json[i].com_number+'</span>)</div>'+
			'<div id="WER-commentinput" class="WER-commentinput WER-comment"><div class="WER-inputbox"><textarea tabindex="1" id="WER-comment">'+EnjoyReading.options.str5+'</textarea></div><div id="WER-commentsend" class="WER-commentsend">';
	if(EnjoyReading.options.isuser)data+='<div id="WER-welcome">Login in as <b>'+EnjoyReading.options.uname+'</b>.</div>';
	else if(EnjoyReading.options.umail!='')data+='<div id="WER-welcome">'+EnjoyReading.options.str12+', <b>'+EnjoyReading.options.uname+'</b>. <a id="WER-change" href="javascript:void(0);">'+EnjoyReading.options.str6+'</a></div>';
	data+='<div id="WER-author_info"';
	if(EnjoyReading.options.isuser||EnjoyReading.options.umail!='')data+=' class="WER-author_info"';
	data+='><p><input type="text" tabindex="2" size="16" value="'+EnjoyReading.options.uname+'" id="WER-author" name="author"><label for="author" id="required1"><small>Name</small></label></p>'+
			'<p><input type="text" tabindex="3" size="16" value="'+EnjoyReading.options.umail+'" id="WER-email" name="email"><label for="email" id="required1"><small>Mail</small></label></p>'+
			'<p><input type="text" tabindex="4" size="16" value="'+EnjoyReading.options.uurl+'" id="WER-url" name="url"><label for="url" id="required1"><small>Website</small></label></p>';
	data+='</div><p><input type="submit" value="'+EnjoyReading.options.str13+'" tabindex="5" id="WER-submit" name="submit"><input type="hidden" id="WER-comment_post_ID" value="'+json[i].id+'" name="comment_post_ID"><input type="hidden" value="0" id="WER-comment_parent" name="comment_parent"><img src="'+EnjoyReading.baseurl()+'plugins/wp-enjoy-reading/img/loading.gif" id="WER-sumitload">'+
			'</div></div>';
	data+='<div id="WER-commentscontainer" class="WER-commentscontainer"><div class="WER-comment_ctn">'+
			'<ol id="WER-thecomments"><div id="WER-commentloading"></div></ol><a class="WER-morecomments" href="javascript:void(0);">'+EnjoyReading.options.morecmt+'<img src="'+EnjoyReading.baseurl()+'plugins/wp-enjoy-reading/img/loading.gif" class="WER-morecmtload"></a></div></div>';
	$('WER-single_frame').innerHTML=data;
	$('WER-close').onclick=function(){
		if(iswitch)return;
		closeFrame();
	}
	$('WER-cover').onclick=function(){
		if(iswitch)return;
		closeFrame();
	}
	addListener($('WER-comment'),'focus',function(e){
				loadCommentBox();
			},false);
	addListener($('WER-single_frame'),'click',function(e){
				closeCommentBox(e,j,from,number);
			},false);
	addListener($('WER-submit'),'click',function(e){
				submitComment({'author':'WER-author','email':'WER-email','url':'WER-url','comment':'WER-comment','submit':'WER-submit','comment_post_ID':'WER-comment_post_ID','comment_parent':'WER-comment_parent'});
			},false);
	if(!EnjoyReading.options.isuser&&EnjoyReading.options.umail!='')
		addListener($('WER-change'),'click',function(e){
				changeAuthor();
			},false);
	loadComments(json[i].id,EnjoyReading.options.cmts,0);
	document.onkeydown = function(ev) {
		if(iswitch)return;
		if(!ev)ev=window.event;
		if (ev.keyCode == 37&&j-1+from>=0)loadAllPost(c,j-1,from,number);
		if (ev.keyCode == 39&&j+1+from<json.length)loadAllPost(c,j+1,from,number);
	}
	bindcategoryEvent('WER-dragErea');
}
function closeFrame(){
	if(!$('WER-the_frame'))return;
	$('WER-the_frame').innerHTML='';
	$('WER-the_frame').style.display="none";
	$('WER-cover').style.display="none";
	document.onkeydown = function(ev) {
		switchShortCut(ev);
	}
}
function switchShortCut(ev){
	if(!$('WER-indexpre'))return;
	if(!ev)ev=window.event;
	if (ev.keyCode == 37)$('WER-indexpre').onclick();
	if (ev.keyCode == 39)$('WER-indexnex').onclick();
}
function loadComments(postId,number,start){
	if(!commentsArr[''+postId]){
		commentsArr[''+postId]=new Array(2);
		commentsArr[''+postId][0]=new Array();
		commentsArr[''+postId][1]=new Array();
	}
	if(commentsArr[''+postId][0].length<=start){
		new EnjoyReading.ajax({
			url:'?action=EnjoyReadingCmts&postid=' + postId + '&number='+number+'&offset=' + start,
			dataType:'json',
			before:function(){
				iswitch=true;
			},
			success:function(){
				var _json=this.data
				commentsArr[''+postId][0]=commentsArr[''+postId][0].concat(_json[0]);
				commentsArr[''+postId][1]=_json[1];
				applyComment(_json,postId);
			},
			error:function(){
				if($('WER-commentloading')||0)removeNode($('WER-commentloading'));
				if($('WER-loadcommenterror')||0)removeNode($('WER-loadcommenterror'));
				$('WER-thecomments').innerHTML+='<li id="WER-loadcommenterror" class="WER-comment"><p>Oops, failed to load data. <small><a id="WER-errorthing" href="javascript:void(0);">[Reload]</a></small></p></li>';
				$('WER-errorthing').onclick=function(){loadComments(postId,number,start)};
			},
			after:function(){
				if($('WER-single_frame'))removeClassName($$('WER-morecomments','a',$('WER-single_frame'))[0],'show');
				iswitch=false;
			}
		});
	}else{
		applyComment(commentsArr[''+postId],postId);
		if(notEmpty('WER-single_frame'))removeClassName($$('WER-morecomments','a',$('WER-single_frame'))[0],'show')
	}
}
function applyComment(_json,postId){
	var json=_json[0],hasmore=_json[1],data='';
	if(!json.length)data='<li class="WER-comment"><div class="WER-commentcontent"><div class="WER-author_name">'+EnjoyReading.options.nocmt+'</div></div></li>';
	else{
		for(var i=0;i<json.length;i++){
			data+='<li class="WER-comment"><div class="WER-commentcontent"><div class="WER-author_avatar">'+json[i].avatar+
					'</div><div class="WER-author_name"><a class="WER-author" id="WER-commentauthor-'+json[i].comid+'" target="_blank" href="'+json[i].comurl+'">'+json[i].comauthor+'</a></div>'+
					'<div class="WER-comment_content">'+json[i].content+'</div><div class="WER-comment_info" id="'+json[i].comid+'-'+json[i].parentid+'">'+json[i].comdate+'</div></li>'
		}
		if(notEmpty('WER-single_frame')){
			if(hasmore[0]){
				$$('WER-morecomments','a',$('WER-single_frame'))[0].style.display="block";
				$$('WER-morecomments','a',$('WER-single_frame'))[0].onclick=function(){
					loadComments(postId,10,hasmore[1]);
					addClassName($$('WER-morecomments','a',$('WER-single_frame'))[0],'show')
				}
			}else{
				$$('WER-morecomments','a',$('WER-single_frame'))[0].style.display="none";
			}
		}else return;
	}
	if($('WER-commentloading')||0)removeNode($('WER-commentloading'));
	if($('WER-loadcommenterror')||0)removeNode($('WER-loadcommenterror'));
	$('WER-thecomments').innerHTML+=data;
}
function submitComment(options){
	if(checkInput(options.author,options.email,options.comment)){
		switch(checkInput(options.author,options.email,options.comment)){
			case options.author:alert(EnjoyReading.options.str8);
					break;
			case options.email:alert(EnjoyReading.options.str9);
					break;
			case options.comment:alert(EnjoyReading.options.str10);
					break;
			default:alert(EnjoyReading.options.str11);
		}
		loadCommentBox();
		return false;
	}
	
	new EnjoyReading.ajax({
		dataType:'text',
		send:'action=EnjoyReadingSubmit'+'&author='+encodeURIComponent($(options.author).value)+'&email='+encodeURIComponent($(options.email).value)+'&url='+encodeURIComponent($(options.url).value)+'&comment='+encodeURIComponent($(options.comment).value)+'&comment_post_ID='+encodeURIComponent($(options.comment_post_ID).value)+'&comment_parent='+encodeURIComponent($(options.comment_parent).value),
		method:'POST',
		before:function(){
			beforeSubmit(options.author,options.email,options.url,options.comment,options.submit);
			addClassName($('WER-sumitload'),'show');
			iswitch=true;
		},
		success:function(){
			if(notEmpty(options.submit))$(options.submit).value=EnjoyReading.options.str14;
			var newli=document.createElement('li');
			newli.className="WER-comment WER-newcomment";
			insertBe(newli,$('WER-thecomments').childNodes[0]);
			newli.innerHTML=this.data;
			clearInput(options.comment);
			disableSubmit(options);
			$('WER-commentscontainer').scrollTop='0';
		},
		error:function(){
			$(options.submit).value="Submit Comment";
			$(options.submit).disabled=false;
			myAlert(this.data);
		},
		after:function(){
			afterSubmit(options.author,options.email,options.url,options.comment,options.submit);
			removeClassName($('WER-sumitload'),'show');
			iswitch=false;
		},
		timeoutCallback:function(){
			this.error();
			disableSubmit(options);
		}
	});
}
function disableSubmit(options){
	var timeout=15;
	submitTimer=setInterval(function(){
		if(timeout>0&&notEmpty(options.submit)){
			$(options.submit).value=''+timeout;
			timeout--;
		}else{
			clearInterval(submitTimer);
			if(notEmpty(options.submit)){
				$(options.submit).value="Submit Comment";
				$(options.submit).disabled=false;
			}
		}
	},1000);
}
function beforeSubmit(){
	for(var i=0;i<arguments.length;i++){
		if(notEmpty(arguments[i]))$(arguments[i]).disabled=true;
		if(notEmpty(arguments[i]))$(arguments[i]).style.cursor = 'wait';
		if(/submit/i.test(arguments[i]))if(notEmpty(arguments[i]))$(arguments[i]).value=EnjoyReading.options.str7;
		if(/comment/i.test(arguments[i]))if(notEmpty(arguments[i]))$(arguments[i]).style.background="url("+EnjoyReading.baseurl()+"plugins/wp-enjoy-reading/img/ajax-loader.gif) no-repeat center center #fafafa";
	}
}
function afterSubmit(){
	for(var i=0;i<arguments.length;i++){
		if(!/submit/i.test(arguments[i]))if(notEmpty(arguments[i]))$(arguments[i]).disabled=false;
		if(/author|url|email|comment/i.test(arguments[i]))if(notEmpty(arguments[i]))$(arguments[i]).style.cursor = 'text';
		if(/submit/i.test(arguments[i]))if(notEmpty(arguments[i]))$(arguments[i]).style.cursor = 'pointer';
		if(/comment/i.test(arguments[i]))if(notEmpty(arguments[i]))$(arguments[i]).style.background="#fff";
	}
}
function checkInput(){
	for(var i=0;i<arguments.length;i++){
		if(notEmpty(arguments[i]))if($(arguments[i]).value==''||(/email/i.test(arguments[i])&&!/^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/.test($(arguments[i]).value))){
			$(arguments[i]).style.backgroundColor="#fdff00";
			return arguments[i];
		}else{
			if(/comment/i.test(arguments[i]))$(arguments[i]).style.backgroundColor="#fff";
			else $(arguments[i]).style.backgroundColor="transparent";
		}
	}
	return false;
}
function clearInput(){
	for(var i=0;i<arguments.length;i++){
		if(notEmpty(arguments[i]))$(arguments[i]).value='';
	}
}
function loadCommentBox(){
	if(EnjoyReading.options.isuser||EnjoyReading.options.umail!=''){
		if(notEmpty('WER-author_info')&&getStyle($('WER-author_info'),'display')=='block'){
			addClassName($('WER-commentarea'),'WER-active1');
			addClassName($('WER-commentarea'),'WER-active2');
		}else addClassName($('WER-commentarea'),'WER-active1');
	}else addClassName($('WER-commentarea'),'WER-active');
	if($('WER-comment').value==EnjoyReading.options.str5)$('WER-comment').value='';
	document.onkeydown=null;
}
function closeCommentBox(e,j,from,number){
	if(!notEmpty('WER-commentinput'))return;
	var a=getMousePoint(e);
	var b=getObjPoint($('WER-commentinput'));
	if(a.x<b.x||a.x>$('WER-commentinput').offsetWidth+b.x||a.y<b.y||a.y>b.y+$('WER-commentinput').offsetHeight){
		removeClassName($('WER-commentarea'),'WER-active');
		removeClassName($('WER-commentarea'),'WER-active1');
		removeClassName($('WER-commentarea'),'WER-active2');
		if($('WER-comment').value=='')$('WER-comment').value=EnjoyReading.options.str5;
		document.onkeydown = function(ev) {
			if(!ev)ev=window.event;
			if (ev.keyCode == 37&&j-1+from>=0)loadAllPost(j-1,from,number);
			if (ev.keyCode == 39&&j+1+from<dataJson.length)loadAllPost(j+1,from,number);
		}
	}
}
function changeAuthor(){
	if(getStyle($('WER-author_info'),'display')=='none'){
		$('WER-author_info').style.display="block";
		addClassName($('WER-commentarea'),'WER-active2');
	}else{
		$('WER-author_info').style.display="none";
		removeClassName($('WER-commentarea'),'WER-active2');
	}
}

function preview_theme(){
	if(!$('WER-themePanel')){
		var themePanel=document.createElement('div');
		themePanel.id="WER-themePanel";
		document.body.appendChild(themePanel);
	}else var themePanel=$('WER-themePanel');
	var xy=getObjPoint($('WER-container').parentNode);
	themePanel.style.left=xy.x+'px';
	themePanel.style.top=xy.y+'px';
	themePanel.style.display='block';
	themePanel.innerHTML='<div id="themePanel_header"><span class="ico_skin"></span>Theme Options</div>'+
						'<a href="#" id="themePanel_close" class="WER-close" title="close">X</a><div id="themePanel_body"></div>';
	$('themePanel_close').onclick=function(){
		themePanel.style.display='none';
	}
	if(dataJson['set_themes']&&dataJson['set_themes']!=''){
		applyThemeTmp(dataJson['set_themes']);
	}else
	new EnjoyReading.ajax({
		url:'?action=getAllThemes',
		before:function(){
			$('themePanel_body').style.background='url('+EnjoyReading.baseurl()+'plugins/wp-enjoy-reading/img/ajax-loader.gif) no-repeat center center #fff';
		},
		success:function(){
			dataJson['set_themes']=this.data;
			applyThemeTmp(dataJson['set_themes']);
		},
		error:function(){
			alert('Oops, failed to load data.');
		},
		after:function(){
			$('themePanel_body').style.background='#fff';
		}
	});
}
function applyThemeTmp(json){
	var data='<ul>';
	for(var i=0;i<json.length;i++){
		data+='<li class="WER-theme"><img src="'+json[i][1]+'"/><p class="tempName">'+json[i][0]+'</p><div class="WER-mask"></div></li>';
	}
	data+='</ul>';
	$('themePanel_body').innerHTML=data;
	var themes=$$('WER-theme','li',$('themePanel_body'));
	for(var i=0;i<themes.length;i++){
		(function(){
			var _i=i;
			themes[_i].onclick=function(){
				var themess=$$('WER-theme','li',$('themePanel_body'));
				for(var i=0;i<themess.length;i++){
					removeClassName(themess[i].getElementsByTagName('img')[0],'choose');
				}
				addClassName(this.getElementsByTagName('img')[0],'choose');
				SetCookie('ajax_theme',_i,7,EnjoyReading.baseurl().replace(/http:\/\//gi,'').replace(/\/.*/gi,''),'/');
				document.body.style.background=json[_i][2];
			}
		})();
	}
}
function notEmpty(node){
	return $(node)||0;
}
/* end mag */
})();