var snipetCount = 60;

function orfilter(words, title, keyword, bun) {
    var found = false;
    var cpos = null;
    for (var i=0; i < words.length; i++) {
        var word = words[i];
        //titlepos = title.indexOf(word);
        //keywordpos = (bun.toUpperCase()).indexOf((word.toUpperCase())); // Rev 
        var re = new RegExp(word, 'im');
        keywordpos = bun.search(re);
        if (keywordpos > -1) {
        //if (titlepos > -1 || keywordpos > -1) {
            found = true;
            cpos = keywordpos;
            break;
        }
        //cpos = ((cpos == null) && (keywordpos > -1)) ? keywordpos : cpos;
    }
    return found ? {"title":title, "keyword":keyword, "pos":cpos, "bun":bun} : false;
}

function andfilter(words, title, keyword, bun) {
    var cpos = null;
    for (var i=0; i < words.length; i++) {
        var word = words[i];
        //titlepos = title.indexOf(word);
        //keywordpos = (bun.toUpperCase()).indexOf((word.toUpperCase())); //Rev Yuji 
        var re = new RegExp(word, 'im');
        keywordpos = bun.search(re);
        if (keywordpos == -1) {
        //if (titlepos == -1 && keywordpos == -1) {
            return false;
        }
        cpos = ((cpos == null) && (keywordpos > -1)) ? keywordpos : cpos;
    }
    return {"title":title, "keyword":keyword, "pos":cpos, "bun":bun};
}

var highlightcolor = 'pink';
var decorate_front = '<span style="background:' + highlightcolor + ';">';
var decorate_back = '</span>';

function decorate(s) {
    return decorate_front + s + decorate_back;
}

function contains(arry, word) {
    for (var i=0; i < arry.length; i++) {
        if (arry[i] == word) {
            return true;
        }
    }
    return false;
}

function distinct(words) {
    var results = [];
    for (var i=0; i < words.length; i++) {
        var word = words[i];
        if (!contains(results, word)) {
            results.push(word);
        }
    }
    return results;
}

function search(words, op, manual_id) {
    var results = [];

    for (var i = 0; i < dai.length; i++) {
        if (typeof(dai[i]) == "undefined") {
            continue;
        }

        if (manual_id && manual_id != man[i]) {
            continue;
        }

        var filter = (op == "or") ? orfilter : andfilter;
        var filtered = filter(words, dai[i], key[i], bun[i]);
        if (filtered) {
            filtered = cutColor(filtered, words);
            var result = {"title":filtered.title,
                "keyword":filtered.keyword, "snip":filtered.snip, "link":body[i],
                "frontSnipped":filtered.frontSnipped,
                "backSnipped":filtered.backSnipped
                };
            results.push(result);
        }
    }
    return results;
}

function search_command(words, op) {
    var results = [];
    for (var i = 0; i < dai.length; i++) {
        if (typeof(dai[i]) == "undefined" || cf[i] == '') {
            continue;
        }

        //var filter = (op == "or") ? orfilter : andfilter;
        //var filtered = filter(words, dai[i], key[i], cf[i]);

        if (op == "or") {
            for (var j=0; j < words.length; j++) {
                var word = words[j];
                var re = new RegExp(word, 'im');
                keywordpos = dai[i].search(re);
                if (dai[i].search(re) > -1 || key[i].search(re) > -1 || cf[i].search(re) > -1) {
                    results.push({"title":dai[i], "keyword":key[i], "snip":cf[i], "link":body[i] });
                    break;
                }
            }
        } else {
            var found = true;
            for (var j=0; j < words.length; j++) {
                var word = words[j];
                var re = new RegExp(word, 'im');
                keywordpos_dai = dai[i].search(re);
                keywordpos_key = key[i].search(re);
                keywordpos_cf = cf[i].search(re);
                if (keywordpos_dai == -1 && keywordpos_key == -1 && keywordpos_cf == -1) {
                    found = false;
                    break;
                }
            }
            if (found) {
                results.push({"title":dai[i], "keyword":key[i], "snip":cf[i], "link":body[i] });
            }
        }

    }
    return results;
}
function cut(searchResult) {
    var pos = searchResult.pos;
    var bun = searchResult.bun
//------
    var ici0=1;
    var ici;
    while (pos > ici0  &&  ici0  >  0 ){
      ici=ici0+1;
      ici0=bun.indexOf( "\t", ici );
   }
   if (ici == 2 || ici < pos-snipetCount ) ici=pos-snipetCount;
//------------
   var snip;
    if ( ici == pos-snipetCount && ici>0 ) {
       snip = "..."+bun.slice(Math.max(ici , 0));
    }
    else{
       snip = bun.slice(Math.max(ici , 0));
    }
    key_pos=snip.indexOf("@@")+2; // ADD
    snip = snip.slice(0, Math.min((snipetCount * 2) + key_pos, bun.length));// Rev
    searchResult.frontSnipped = (pos - snipetCount > 0);
    searchResult.backSnipped = (pos + snipetCount < bun.length);
//-----------ADD --yuji----------------------
    if ( key_pos > 2 ) {
        if (key_pos > pos){
          snip= "@@@"+snip;
        }
        else{
          snip=snip.substr(key_pos);
        }
    }
    if ((snipetCount * 2) + key_pos < bun.length) snip=snip+" ...";
//------------------------------------------
    searchResult.snip = snip;
    return searchResult;
}

function color(searchResult, words) {
    for (var i=0;i < words.length; i++) {
        var word = words[i];
        searchResult.snip = safeReplace(searchResult.snip, words[i]);
        searchResult.title = safeReplace(searchResult.title, words[i]);
    }
    var snip=searchResult.snip;
    var ici2=0;
// ------------ Rev ito -------------//
    while (true) {
       ici0= snip.indexOf("<",ici2);    
       if ( ici0 == -1) break;
       ici3=snip.indexOf("<",ici0+1);   
       ici1=snip.indexOf(">",ici2);
       if ( ici1 == -1 ) break;
       if ( ici1 > ici3 && ici3 > 0 ) {
          snip=snip.substr(1,ici0-1)+"&lt;"+snip.substr(ici0+1);
          ici2=ici3+4;
       }
       else{
         ici2=ici1+1;
       }
    } 
    snip=snip.replace("@@@","<b>");
    snip=snip.replace("@@","</b><br>");
    var k_pos=snip.indexOf("\t");
    var kai=0;
    while ( k_pos > 0){
        snip = snip.replace("\t","<br>");
        kai++;
        if ( kai >2 ) snip=snip.substr(0,k_pos);
        k_pos=snip.indexOf("\t");
     }
//--------------------------------------- // 
    searchResult.snip=snip;
    return searchResult;
}

function safeReplace(target, word) {
//alert(target);
    var decoratedWord = decorate(word);
    var segs1 = target.split(decorate_front);
    var resjoined = [];
    for (var j=0; j < segs1.length; j++) {
        var segs2 = segs1[j].split(decorate_back);
        var res = [];
        for (var k=0; k < segs2.length; k++) {
            res.push(segs2[k].replace(new RegExp("(" + word + ")", "gi"), decorate_front + "$1" + decorate_back));
            //res.push(segs2[k].replace(new RegExp(word, "g"), decoratedWord));
        }
        resjoined.push(res.join(decorate_back));
    }
     return resjoined.join(decorate_front);
}

function cutColor(searchResult, words) {
    return color(cut(searchResult), words);
}

function init() {
/*
    if (!parent.parent.location.search) {
        return;
    }
*/
    //var params = mjt.formdecode(parent.parent.location.search.substr(1));
    var words = "";
    var manual_id = "";
    if (window.location.search.length > 1) {
        var params = mjt.formdecode(window.location.search.substr(1));
        words = params.words;
        manual_id = params.manual_id;
    }
    var orgwords = words;
    var omitted = false;
    var resultList = mjt.run('resultList');
//    if (words.indexOf('\\') > -1) {
//        words = words.replace(/\\/g, '');
//        omitted = true;
//    }
//    if (words.indexOf("'") > -1) {
// //     words = words.replace(/\'/g, '');
//      words = words.replace("'","\'");
//      omitted = true;
//    }
     if (!words.length) {
        if (omitted) {
            mjt.run('notice', resultList.notice, []);
        }
        return;
    }

    var op = params.and_or;
    var st = params.search_type;
    words = words.replace(/　/g, " ");

    // マニュアル検索でない場合。
    if (st && st != 3) {
        manual_id = "";
    }

    // 検索文字列を配列に展開。
    var wordArray = getSearchWordArray(words, op);

    //var wordArray = words.split(" ");
    
    var searchWords = new Array();
    for (var i=0; i < wordArray.length; i++) {
        var word = wordArray[i];
        if (word.length && !contains(searchWords, word)) {
            searchWords.push(word);
        }
    }

    document.getElementById('keywords').value = orgwords;
    if (document.getElementById('manual_id')) {
        document.getElementById('manual_id').value = manual_id;
    }
    if (searchWords.length) {
        if (st && st == 2) {
            var results = search_command(searchWords, op);
        } else {
            var results = search(searchWords, op, manual_id);
        }
        results.omitted = omitted;
        if (results.length) {
            mjt.run('search-results', resultList.displayResults, [words, results]);
        } else {
            mjt.run('search-results', resultList.displayNoResults, [words, results]);
        }
        if (omitted) {
            mjt.run('notice', resultList.notice, []);
        }
    }
}

function getSearchWordArray(words, op) {
    var chars = String(words).split("");
    var tmp_char = new Array();
    var search_words = new Array();
    var quart_index = false;
    for (var i=0; i < chars.length;i++) {
        var c = chars[i];

        if (c.charCodeAt(0) == 92) {
        //if (c.charCodeAt(0) == 92 || c.charCodeAt(0) == 165) {
        //if (c == '\\') {

            if (chars[i + 1] && chars[i + 1] == '?') {
                tmp_char.push('\\?');
                i++;
            } else if (chars[i + 1] && chars[i + 1] == '"') {
                tmp_char.push('"');
                i++;
            } else if (chars[i + 1] && chars[i + 1].charCodeAt(0) == 92) {
            //} else if (chars[i + 1] && (chars[i + 1].charCodeAt(0) == 92 || chars[i + 1].charCodeAt(0) == 165)) {
            //} else if (chars[i + 1] && chars[i + 1] == '\\') {
                tmp_char.push('\\\\');
                i++;
            } else {
                tmp_char.push('\\\\');
            }
        } else if (c == '?') {
            // 任意の一文字検索
            tmp_char.push('.');
        } else if (c == '"') {
            // ダブルクォートでくくられた文字列はそのまま検索する。
            if (quart_index === false) {
                // 一応追加しておいて、クォートを閉じたときにインデックスを削除。
                quart_index = tmp_char.length;
                tmp_char.push('"');
            } else {
                tmp_char.splice(quart_index, 1);
                //tmp_char = array_values($tmp_char);
                quart_index = false;
            }
        } else if (c == '.') {
            // メタ文字検索
            tmp_char.push('\\.');
        } else if (c == ' ') {
            // スペースが来たらクォート中でなければ検索配列に追加。
            if (quart_index === false && tmp_char) {
                tmp_word = tmp_char.join("");
                if (tmp_word == '.') {
                    // ワイルドカードのみの場合、andはそれ以外で検索、
                    // orは反応しない。
                    if (op == 'or') {
                        return new Array();
                    }
                } else {
                    search_words.push(tmp_word);
                }
                tmp_char = new Array();
            } else if (quart_index !== false) {
                tmp_char.push(c);
            }
        } else {
            // その他通常文字は普通に追加。

            c = c.replace(/\?/g, "\\?");
            c = c.replace(/\*/g, "\\*");
            c = c.replace(/\./g, "\\.");
            c = c.replace(/\|/g, "\\|");
            c = c.replace(/\[/g, "\\[");
            c = c.replace(/\]/g, "\\]");
            c = c.replace(/\^/g, "\\^");
            c = c.replace(/\$/g, "\\$");
            c = c.replace(/\+/g, "\\+");
            c = c.replace(/\{/g, "\\{");
            c = c.replace(/\}/g, "\\}");
            c = c.replace(/\(/g, "\\(");
            c = c.replace(/\)/g, "\\)");

            tmp_char.push(c);
        }
    }

    if (tmp_char) {
        tmp_word = tmp_char.join('');
        if (tmp_word == '.') {
            // ワイルドカードのみの場合、andはそれ以外で検索、
            // orは反応しない。
            if (op == 'or') {
                return new Array();
            }
        } else {
            search_words.push(tmp_word);
        }
    }
//console.log(search_words);
    return search_words;
}

