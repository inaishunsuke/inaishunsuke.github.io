// fontsize
function setActiveStyleSheet(title) {
	var i, a, main;
	
	var max_link	= document.getElementsByTagName('link').length;
	
	for(i=0; i<max_link; i++) {
		a	= document.getElementsByTagName("link")[i];
		if( a.getAttribute('rel') ){
			if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
				a.disabled = true;
				if(a.getAttribute("title") == title){
					a.disabled = false;
				}
			}
		}
	}
}

function getActiveStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if( a.getAttribute('rel') ){
			if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled){
				return a.getAttribute("title");
			}
		}
	}
	return 'Default';
}

function getPreferredStyleSheet() {
var i, a;
for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
if(a.getAttribute("rel").indexOf("style") != -1


&& a.getAttribute("rel").indexOf("alt") == -1
&& a.getAttribute("title")
) return a.getAttribute("title");
}
return null;
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' '){
			c = c.substring(1,c.length);
		}
		if (c.indexOf(nameEQ) == 0){
			return c.substring(nameEQ.length,c.length);
		}
	}
	return 'Default';
}

window.onload = function(e) {
var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
//setActiveStyleSheet(title);
}

window.onunload = function(e) {
var title = getActiveStyleSheet();
createCookie("style", title, 365);
}

var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);


/*
 * yuga.js 0.7.1
 * Copyright (c) 2009 Kyosuke Nakamura (kyosuke.jp)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Since:     2006-10-30
 * Modified:  2009-01-27
 *
 * jQuery 1.3.1
 */
(function($) {

	$(function(){
    var $targetElement = '.wordBreak';
    if($.browser.msie) {
        $($targetElement).css('word-break', 'break-all');
    } else {
        $($targetElement).each(function(){
            if(navigator.userAgent.indexOf('Firefox/2') != -1) {
                $(this).html($(this).text().split('').join('<wbr />'));
            } else {
                $(this).html($(this).text().split('').join(String.fromCharCode(8203)));
            }
        });
    }
});
	
$(function() {
	$.yuga.rollover();
	$.yuga.scroll();
	$.yuga.tab();
	$.yuga.stripe();
	$.yuga.css3class();
});

//---------------------------------------------------------------------

$.yuga = {
	// URIを解析したオブジェクトを返すfunction
	Uri: function(path){
		var self = this;
		this.originalPath = path;
		//絶対パスを取得
		this.absolutePath = (function(){
			var e = document.createElement('span');
			e.innerHTML = '<a href="' + path + '" />';
			return e.firstChild.href;
		})();
		//絶対パスを分解
		var fields = {'schema' : 2, 'username' : 5, 'password' : 6, 'host' : 7, 'path' : 9, 'query' : 10, 'fragment' : 11};
		var r = /^((\w+):)?(\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/.exec(this.absolutePath);
		for (var field in fields) {
			this[field] = r[fields[field]];
		}
		this.querys = {};
		if(this.query){
			$.each(self.query.split('&'), function(){
				var a = this.split('=');
				if (a.length == 2) self.querys[a[0]] = a[1];
			});
		}
	},
	//ロールオーバー
	rollover: function(options) {
		var c = $.extend({
			hoverSelector: '.imgover, .allimg img',
			groupSelector: '.imggroup',
			postfix: '_on'
		}, options);
		//ロールオーバーするノードの初期化
		var rolloverImgs = $(c.hoverSelector).filter(isNotCurrent);
		rolloverImgs.each(function(){
			this.originalSrc = $(this).attr('src');
			this.rolloverSrc = this.originalSrc.replace(new RegExp('('+c.postfix+')?(\.gif|\.jpg|\.png)$'), c.postfix+"$2");
			this.rolloverImg = new Image;
			this.rolloverImg.src = this.rolloverSrc;
		});
		//グループ内のimg要素を指定するセレクタ生成
		var groupingImgs = $(c.groupSelector).find('img').filter(isRolloverImg);
			//通常ロールオーバー
		rolloverImgs.not(groupingImgs).hover(function(){
			$(this).attr('src',this.rolloverSrc);
		},function(){
			$(this).attr('src',this.originalSrc);
		});
		//グループ化されたロールオーバー
		$(c.groupSelector).hover(function(){
			$(this).find('img').filter(isRolloverImg).each(function(){
				$(this).attr('src',this.rolloverSrc);
			});
		},function(){
			$(this).find('img').filter(isRolloverImg).each(function(){
				$(this).attr('src',this.originalSrc);
			});
		});
		//フィルタ用function
		function isNotCurrent(i){
			return Boolean(!this.currentSrcYuga);
		}
		function isRolloverImg(i){
			return Boolean(this.rolloverSrc);
		}
		},
	//ページ内リンクはするするスクロール
	scroll: function(options) {
		//ドキュメントのスクロールを制御するオブジェクト
		var scroller = (function() {
			var c = $.extend({
				easing:100,
				step:30,
				fps:60,
				fragment:''
			}, options);
			c.ms = Math.floor(1000/c.fps);
			var timerId;
			var param = {
				stepCount:0,
				startY:0,
				endY:0,
				lastY:0
			};
			//スクロール中に実行されるfunction
			function move() {
				if (param.stepCount == c.step) {
					//スクロール終了時
					setFragment(param.hrefdata.absolutePath);
					window.scrollTo(getCurrentX(), param.endY);
				} else if (param.lastY == getCurrentY()) {
					//通常スクロール時
					param.stepCount++;
					window.scrollTo(getCurrentX(), getEasingY());
					param.lastY = getEasingY();
					timerId = setTimeout(move, c.ms); 
				} else {
					//キャンセル発生
					if (getCurrentY()+getViewportHeight() == getDocumentHeight()) {
						//画面下のためスクロール終了
						setFragment(param.hrefdata.absolutePath);
					}
				}
			}
			function setFragment(path){
				location.href = path
			}
			function getCurrentY() {
				return document.body.scrollTop  || document.documentElement.scrollTop;
			}
			function getCurrentX() {
				return document.body.scrollLeft  || document.documentElement.scrollLeft;
			}
			function getDocumentHeight(){
				return document.documentElement.scrollHeight || document.body.scrollHeight;
			}
			function getViewportHeight(){
				return (!$.browser.safari && !$.browser.opera) ? document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight : window.innerHeight;
			}
			function getEasingY() {
				return Math.floor(getEasing(param.startY, param.endY, param.stepCount, c.step, c.easing));
			}
			function getEasing(start, end, stepCount, step, easing) {
				var s = stepCount / step;
				return (end - start) * (s + easing / (100 * Math.PI) * Math.sin(Math.PI * s)) + start;
			}
			return {
				set: function(options) {
					this.stop();
					if (options.startY == undefined) options.startY = getCurrentY();
					param = $.extend(param, options);
					param.lastY = param.startY;
					timerId = setTimeout(move, c.ms); 
				},
				stop: function(){
					clearTimeout(timerId);
					param.stepCount = 0;
				}
			};
		})();
		$('a[href^=#], area[href^=#]').not('a[href=#], area[href=#]').each(function(){
			this.hrefdata = new $.yuga.Uri(this.getAttribute('href'));
		}).click(function(){
			var target = $('#'+this.hrefdata.fragment);
			if (target.length == 0) target = $('a[name='+this.hrefdata.fragment+']');
			if (target.length) {
				scroller.set({
					endY: target.offset().top,
					hrefdata: this.hrefdata
				});
				return false;
			}
		});
	},
	//タブ機能
	tab: function(options) {
		var c = $.extend({
			tabNavSelector:'.tabNav',
			activeTabClass:'active'
		}, options);
		$(c.tabNavSelector).each(function(){
			var tabNavList = $(this).find('a[href^=#], area[href^=#]');
			var tabBodyList;
			tabNavList.each(function(){
				this.hrefdata = new $.yuga.Uri(this.getAttribute('href'));
				var selecter = '#'+this.hrefdata.fragment;
				if (tabBodyList) {
					tabBodyList = tabBodyList.add(selecter);
				} else {
					tabBodyList = $(selecter);
				}
				$(this).unbind('click');
				$(this).click(function(){
					tabNavList.removeClass(c.activeTabClass);
					$(this).addClass(c.activeTabClass);
					tabBodyList.hide();
					$(selecter).show();
					return false;
				});
			});
			tabBodyList.hide()
			tabNavList.filter(':first').trigger('click');
		});
	},
	//奇数、偶数を自動追加
	stripe: function(options) {
		var c = $.extend({
			oddClass:'odd',
			evenClass:'even'
		}, options);
		$('ul, ol').each(function(){
			//JSでは0から数えるのでevenとaddを逆に指定
			$(this).children('li:odd').addClass(c.evenClass);
			$(this).children('li:even').addClass(c.oddClass);
		});
		$('table, tbody').each(function(){
			$(this).children('tr:odd').addClass(c.evenClass);
			$(this).children('tr:even').addClass(c.oddClass);
		});
	},
	//css3のクラスを追加
	css3class: function() {
		//:first-child, :last-childをクラスとして追加
		$('body :first-child').addClass('firstChild');
		$('body :last-child').addClass('lastChild');
		//css3の:emptyをクラスとして追加
		$('body :empty').addClass('empty');
	}
};
})(jQuery);
