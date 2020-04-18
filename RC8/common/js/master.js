

// mzfch.js
function getCookieVal (offset) {
  var endstr = document.cookie.indexOf (";", offset);
  if (endstr == -1)
    endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}

function GetCookie (name) {
  var arg = name + "=";
  var alen = arg.length;
  var clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg)
      return getCookieVal (j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) 
      break;
  }
  return null;
}

function SetCookie (name, value) {
  var argv = SetCookie.arguments;
  var argc = SetCookie.arguments.length;
  var expires = (argc > 2) ? argv[2] : null;
  var path = (argc > 3) ? argv[3] : null;
  var domain = (argc > 4) ? argv[4] : null;
  var secure = (argc > 5) ? argv[5] : false;
  document.cookie = name + "=" + escape (value) +
    ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
    ((path == null) ? "" : ("; path=" + path)) +
    ((domain == null) ? "" : ("; domain=" + domain)) +
    ((secure == true) ? "; secure" : "");
}


var plugin = 0;
function check_flash (mver) {
	plugin = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ? navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
	if ( plugin ) {
		if ( parseInt(plugin.description.substring(plugin.description.indexOf(".")-2)) != " " ){
			plugin = parseInt(plugin.description.substring(plugin.description.indexOf(".")-2)) >= mver;
		}else{
			plugin = parseInt(plugin.description.substring(plugin.description.indexOf(".")-1)) >= mver;
		}
	}
	else if (navigator.userAgent && navigator.userAgent.indexOf("MSIE")>=0 
	   && (navigator.userAgent.indexOf("Windows 95")>=0 || navigator.userAgent.indexOf("Windows 98")>=0 || navigator.userAgent.indexOf("Windows NT")>=0)) {
		document.write('<SCRIPT LANGUAGE=VBScript\> \n');
		document.write('on error resume next \n');
		document.write('plugin = ( IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.'+mver+'")))\n');
		document.write('</SCRIPT\> \n');
	}
}


function GetFlashName (fl1, fl2, snum) {
var flash = fl1;
		if (!(num2 = GetCookie(flash+'snum'))) num2 = 0;
		if (snum <= num2) {// show second flash
			flash = fl2;
		}
		else {
			num2++;
			var expdate = new Date();
			expdate.setTime(expdate.getTime() + (30*365*24*60*60));
			SetCookie(flash+'snum',num2,expdate);
		}
return flash;
}

function flash_or_html (flash, w, h, func, fver, ff, fl2, snum, basedir, flashvar) {

var fver = (fver > 0) ? fver : 3; // min flash version
var ff = (ff) ? ff : false; //force_flash
var snum = (snum > 0) ? snum : 1;
check_flash (fver);

var embedstr = "";

	if ( plugin || ff) {		
		if (fl2) flash = GetFlashName (flash, fl2, snum);
			document.write('<p><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='+fver+',0,0,0" width="'+w+'" height="'+h+'">');
			//document.write('<object STYLE="Z-INDEX:-100" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='+fver+',0,0,0" width="'+w+'" height="'+h+'">');
			document.write('<param name=movie value="'+flash+'">');
			document.write('<param name=quality value=high>');
			document.write('<param name=WMode value=Transparent>');

			embedstr = '<embed src="' + flash + '" ';

			if(basedir != null || basedir != undefined) {
				document.write('<param name="base" value="'+basedir+'">');
				embedstr = embedstr + 'base="' + basedir + '" ';
			}
			if(flashvar != null || flashvar != undefined) {
				document.write('<param name="FlashVars" value="xmlname='+flashvar+'">');
				embedstr = embedstr + 'FlashVars="xmlname=' + flashvar + '" ';
			}

			embedstr = embedstr + 'quality=high pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="'+w+'" height="'+h+'">';

			document.write(embedstr);
			document.write('</embed>');
			document.write('</object></p>');
		} else if (!(navigator.appName && navigator.appName.indexOf("Netscape")>=0 && navigator.appVersion.indexOf("2.")>=0)){
			eval(func);

	}
}


// highlight.js
/* フォーム初期値消す */
function eraseTA(obj) {
	if (obj.value == obj.defaultValue) obj.value = "";
}

/* フォームのハイライト */
var currentlyActiveInputRef = false;
var currentlyActiveInputClassName = false;

function highlightActiveInput()
{
	if(currentlyActiveInputRef){
		currentlyActiveInputRef.className = currentlyActiveInputClassName;
	}
	currentlyActiveInputClassName = this.className;
	this.className = 'inputHighlighted';
	currentlyActiveInputRef = this;
}

function blurActiveInput()
{
	this.className = currentlyActiveInputClassName;
}

var initInputHighlightScript = window.onload;
window.onload = function(){
	var tags = ['INPUT','TEXTAREA'];
	
	for(tagCounter=0;tagCounter<tags.length;tagCounter++){
		var inputs = document.getElementsByTagName(tags[tagCounter]);
		for(var no=0;no<inputs.length;no++){
			if(inputs[no].className && inputs[no].className=='doNotHighlightThisInput')continue;
			
			if(inputs[no].tagName.toLowerCase()=='textarea' || (inputs[no].tagName.toLowerCase()=='input' && inputs[no].type.toLowerCase()=='text')){
				inputs[no].onfocus = highlightActiveInput;
				inputs[no].onblur = blurActiveInput;
			}
		}
	}
	if(initInputHighlightScript)
	initInputHighlightScript();
}



// rollover.js
var initRollovers = window.onload;
window.onload = function(){
	if (!document.getElementById) return
	
	var aPreLoad = new Array();
	var sTempSrc;

  var setup = function(aImages) {
		for (var i = 0; i < aImages.length; i++) {
			if (aImages[i].className == 'imgover') {
				var src = aImages[i].getAttribute('src');
				var ftype = src.substring(src.lastIndexOf('.'), src.length);
				var hsrc = src.replace(ftype, '_on'+ftype);
	
				aImages[i].setAttribute('hsrc', hsrc);
				
				aPreLoad[i] = new Image();
				aPreLoad[i].src = hsrc;
				
				aImages[i].onmouseover = function() {
					sTempSrc = this.getAttribute('src');
					this.setAttribute('src', this.getAttribute('hsrc'));
				}
				
				aImages[i].onmouseout = function() {
					if (!sTempSrc) sTempSrc = this.getAttribute('src').replace('_on'+ftype, ftype);
					this.setAttribute('src', sTempSrc);
				}
			}
		}
	};

	var aImages = document.getElementsByTagName('img');
	setup(aImages);
	var aInputs = document.getElementsByTagName('input');
	setup(aInputs);

	if(initRollovers) {
		initRollovers();
	}
}



// window open
function m_win(url,windowname,width,height) {
 var features="location=no, menubar=no, status=yes, scrollbars=yes, resizable=yes, toolbar=no";
 if (width) {
  if (window.screen.width > width)
   features+=", left="+(window.screen.width-width)/2;
  else width=window.screen.width;
  features+=", width="+width;
 }
 if (height) {
  if (window.screen.height > height)
   features+=", top="+(window.screen.height-height)/2;
  else height=window.screen.height;
  features+=", height="+height;
 }
 window.open(url,windowname,features);
}

