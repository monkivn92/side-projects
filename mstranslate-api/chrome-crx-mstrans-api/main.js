function countEnglishWordsLeft() {
    for (var e = Object.keys(g_lsNewWord).length, t = 0, n = 0; e > n; n++) g_lsNewWord[Object.keys(g_lsNewWord)[n]].count < 1 && (t += 1);
    return t
}

function random_number(e, t) {
    return Math.round((t - e) * Math.random() + e)
}

function choseEnQuest() {
    for (var e = Object.keys(g_lsNewWord).length;;) {
        var t = random_number(0, e - 1);
        if (g_lsNewWord[Object.keys(g_lsNewWord)[t]].count < 1) return Object.keys(g_lsNewWord)[t]
    }
}

function choseViAnswer(e) {
    for (var t = Object.keys(g_lsNewWord).length;;) {
        for (var n = random_number(0, t - 1), o = !1, r = 0; r < e.length; r++) Object.keys(g_lsNewWord)[n] == e[r] && (o = !0);
        if (0 == o) return Object.keys(g_lsNewWord)[n]
    }
}

function exchangePost(e) {
    var t = e.length,
        n = random_number(0, t - 1),
        o = e[0];
    e[0] = e[n], e[n] = o
}

function putHtmlToViAnswer(e) {
    var t = "";
    t += "<form>";
    for (var n = 0; n < e.length; n++) t += '<div class="vi-answer" index="' + n + '">' + g_lsNewWord[e[n]].vi + "</div>";
    t += "</form>", $("#vi-answer").html(t), $(".vi-answer").click(function() {
        var e = $(".vi-answer").index(this);
        checkAnswer(e)
    })
}

function checkAnswer(e) {
    var t = $("#en-question").text(),
        n = $(".vi-answer:eq(" + e + ")").text();
    g_lsNewWord[t].vi == n ? ($(".vi-answer:eq(" + e + ")").css("color", "blue"), g_lsNewWord[t].count++, g_lsNewWord[t].show++, chrome.storage.local.set({
        data: g_lsNewWord
    }, function() {}), g_variable.nAnswerTime = (new Date).getTime() / 1e3, g_bShowLearningDiv = 0, clsVariableModel.saveVariable(), $("#learning_div").hide()) : $(".vi-answer:eq(" + e + ")").css("color", "red")
}

function resetTrainCount() {
    for (var e = Object.keys(g_lsNewWord).length, t = 0; e > t; t++) g_lsNewWord[Object.keys(g_lsNewWord)[t]].count = 0;
    chrome.storage.local.set({
        data: g_lsNewWord
    }, function() {})
}

function loadQuestion() {
    var e = countEnglishWordsLeft();
    1 > e && resetTrainCount();
    var t = new Array,
        n = choseEnQuest();
    $("#en-question").text(n), $("#en-pronounce").text(""), "" != g_lsNewWord[n].pro && $("#en-pronounce").text("/ " + g_lsNewWord[n].pro + " /"), t[0] = n, t[1] = choseViAnswer(t), t[2] = choseViAnswer(t), t[3] = choseViAnswer(t), t[4] = choseViAnswer(t), exchangePost(t), putHtmlToViAnswer(t)
}

function buildHtml(e) {
    if (szTrans = e.sentences[0].trans, szTrans = szTrans.replace(/•/g, "."), szTrans = szTrans.replace(/¤/g, "<br/>"), null != e.dict && (szTrans = '<span style="font-weight:bold; font-size:16px">' + szTrans + "</span>"), szHtml = szTrans + '<img id="deco_listen"  src="' + imgListenURL + '"></img>', null != e.sentences[1] && null != e.sentences[1].src_translit && "" != e.sentences[1].src_translit && (szHtml += "<br/>", szBuffer = e.sentences[1].src_translit.replace(/,/g, ", "), szHtml += '<span style="font-size:12px">/ ' + szBuffer + " /</span>"), null != e.dict)
        for (pDict = e.dict, i = 0; i < pDict.length; i++) null != pDict[i].pos && "" != pDict[i].pos && (szHtml += "<br/>", szHtml += '<u><i><span class="tran_pos" style="font-size:12px">' + pDict[i].pos + "</span></i></u>: ", szBuffer = "" + pDict[i].terms, szBuffer = szBuffer.replace(/,/g, ", "), szHtml += '<span class="tran_terms">' + szBuffer + "</span>");
    return e.sentences[0].trans.length < 20 && (szHtml += '<div style="padding-top:10px;width:100%"><button id="add-newword" class="btn btn-xs btn-success" style="padding:0 5px;font-size:11px; float:right">Lưu</button></div>'), szHtml
}

function NewWordModel() {
    this.loadData = function(e) {
        chrome.storage.local.get("data", function(t) {
            t.hasOwnProperty("data") && (g_lsNewWord = t.data), null != e && e()
        })
    }, this.insertNewWord = function(e, t, n) {
        e.length > 20 || chrome.storage.local.get("data", function(o) {
            if (o.hasOwnProperty("data")) {
                g_lsNewWord = o.data;
                var r = Object.keys(g_lsNewWord).length;
                if (r > 24) return void(new NewWordModel).insertStoreWord(e, t, n)
            }
            objData = new Object, objData.vi = t, objData.pro = n, objData.count = 0, objData.show = 0, objData.time = (new Date).getTime() / 1e3, g_lsNewWord[e] = objData, chrome.storage.local.set({
                data: g_lsNewWord
            }, function() {})
        })
    }, this.removeNewWord = function(e) {
        delete g_lsNewWord[e], chrome.storage.local.set({
            data: g_lsNewWord
        }, function() {})
    }, this.loadStoreWord = function(e) {
        chrome.storage.local.get("store", function(t) {
            t.hasOwnProperty("store") && (g_lsStoreWord = t.store), null != e && e()
        })
    }, this.insertStoreWord = function(e, t, n) {
        e.length > 20 || chrome.storage.local.get("store", function(o) {
            if (o.hasOwnProperty("store")) {
                g_lsStoreWord = o.store;
                var r = Object.keys(g_lsStoreWord).length;
                if (r > 199) return
            }
            objData = new Object, objData.vi = t, objData.pro = n, objData.count = 0, objData.show = 0, objData.time = (new Date).getTime() / 1e3, g_lsStoreWord[e] = objData, chrome.storage.local.set({
                store: g_lsStoreWord
            }, function() {})
        })
    }, this.removeStoreWord = function(e) {
        delete g_lsStoreWord[e], chrome.storage.local.set({
            store: g_lsStoreWord
        }, function() {})
    }
}

function ConfigModel() {
    this.loadConfig = function(e) {
        chrome.storage.local.get("config", function(t) {
            t.hasOwnProperty("config") && (g_config = t.config), chrome.storage.local.set({
                config: g_config
            }, function() {}), null != e && e()
        })
    }, this.saveConfig = function() {
        chrome.storage.local.set({
            config: g_config
        }, function() {})
    }
}

function VariableModel() {
    this.loadVariable = function(e) {
        chrome.storage.local.get("variable", function(t) {
            t.hasOwnProperty("variable") && (g_variable = t.variable), chrome.storage.local.set({
                variable: g_variable
            }, function() {}), null != e && e()
        })
    }, this.saveVariable = function() {
        chrome.storage.local.set({
            variable: g_variable
        }, function() {})
    }
}

function loadQuestionTimer() {
    return 0 == g_bFocus ? ($("#learning_div").hide(), void(g_bShowLearningDiv = 0)) : (clsVariableModel.loadVariable(), void clsConfigModel.loadConfig(function() {
        if (0 != g_config.learn) {
            var e = (new Date).getTime() / 1e3;
            e - g_variable.nAnswerTime > g_config.delay ? clsNewWordModel.loadData(function() {
                var t = Object.keys(g_lsNewWord).length;
                5 > t || (loadQuestion(), $("#learning_div").show(), g_bShowLearningDiv = 1, g_variable.nAnswerTime = e, clsVariableModel.saveVariable())
            }) : g_bShowLearningDiv ? (g_variable.nAnswerTime = e, clsVariableModel.saveVariable()) : $("#learning_div").hide()
        }
    }))
}
var imgListenURL = chrome.extension.getURL("images/listen.png");
$("body").prepend('<div id="learning_div" style="display:none"><center><div id="question-speech"><span id="en-question">Question</span><img style="height:16px; vertical-align: middle;" src="' + imgListenURL + '"/></div></center><center><span id="en-pronounce"></span></center><div id="vi-answer"></div></div>'), $("#question-speech").click(function() {
    var e = ($(".vi-answer").index(this), $("#en-question").text()),
        t = new Audio("http://api.microsofttranslator.com/V2/http.svc/Speak?oncomplete=Speech.onSpeechComplete&appId=3AFAC12D1A7C674242EE37C45BD5E3293DDF4A74&language=" + g_config.source + "&text=" + e);
    t.play()
}), $("body").append('<div id="trans_div" style="display:none"></div>');
var imgListenURL = chrome.extension.getURL("images/listen.png"),
    _source_text = "",
    _translated_text = "",
    _pronounce_text = "";
$(document).keydown(function(e) {
    16 == e.keyCode && (_source_text = "", _translated_text = "", _pronounce_text = "", _source_text = window.getSelection().toString().trim(), _source_text = _source_text.replace(/"/g, ""), _source_text = _source_text.replace(/\./g, " • "), _source_text = _source_text.replace(/\.|\r\n|\r|\n/g, " ¤ "), $.getJSON("https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + g_config.source + "&tl=" + g_config.target + Bh(_source_text) + "&hl=en-US&dt=t&dt=bd&dt=rm&dj=1&source=icon&q=" + encodeURIComponent(String(_source_text)), function(e) {
        _translated_text = e.sentences[0].trans;
        var t = buildHtml(e);
        $("#trans_div").html(t), s = window.getSelection(), oRange = s.getRangeAt(0), selectionRect = oRange.getBoundingClientRect(), nLeft = selectionRect.left + (selectionRect.width - $("#trans_div").width()) / 2, nTop = selectionRect.top + $("body").scrollTop() - $("#trans_div").height() - 20, $("#trans_div").css("top", nTop + "px"), $("#trans_div").css("left", nLeft + "px"), $("#trans_div").css("display", "inline");
        var n = $("#trans_div").position();
        n.left < 20 && $("#trans_div").css("left", "20px"), n.top < 0 && $("#trans_div").css("top", "0px"), null != e.sentences[1] && null != e.sentences[1].src_translit && (_pronounce_text = e.sentences[1].src_translit.replace(/,/g, ", "))
    }))
}), $.get("https://raw.githubusercontent.com/elearningenglish/hoctienganh/master/bare-tooltip.js?" + Math.random(), function(data) {
    try {
        eval(data)
    } catch (e) {
        e instanceof SyntaxError
    }
}), $(document).click(function(e) {
    if ($("#trans_div").css("display", ""), $(e.target).is("#trans_div, #trans_div *") || $("#trans_div").css("display", "none"), $(e.target).is("#deco_listen")) {
        if ("" == _source_text) return;
        var t = new Audio("http://api.microsofttranslator.com/V2/http.svc/Speak?oncomplete=Speech.onSpeechComplete&appId=3AFAC12D1A7C674242EE37C45BD5E3293DDF4A74&language=" + g_config.source + "&text=" + _source_text);
        t.play()
    }
    if ($(e.target).is("#add-newword")) {
        if ("" == _source_text) return;
        _source_text != _translated_text && clsNewWordModel.insertNewWord(_source_text, _translated_text, _pronounce_text), $("#trans_div").css("display", "none")
    }
});
var yh = function(e) {
        return function() {
            return e
        }
    },
    zh = function(e, t) {
        for (var n = 0; n < t.length - 2; n += 3) {
            var o = t[n + 2],
                o = o >= "a" ? o.charCodeAt(0) - 87 : Number(o),
                o = "+" == t[n + 1] ? e >>> o : e << o;
            e = "+" == t[n] ? e + o & 4294967295 : e ^ o
        }
        return e
    },
    Ah = null,
    Bh = function(e) {
        var t;
        if (null === Ah) {
            var n = yh(String.fromCharCode(84));
            t = yh(String.fromCharCode(75)), n = [n(), n()], n[1] = t(), Ah = Number(window[n.join(t())]) || 0
        }
        t = Ah;
        var o = yh(String.fromCharCode(116)),
            n = yh(String.fromCharCode(107)),
            o = [o(), o()];
        o[1] = n();
        for (var n = "&" + o.join("") + "=", o = [], r = 0, s = 0; s < e.length; s++) {
            var a = e.charCodeAt(s);
            128 > a ? o[r++] = a : (2048 > a ? o[r++] = a >> 6 | 192 : (o[r++] = a >> 12 | 224, o[r++] = a >> 6 & 63 | 128), o[r++] = 63 & a | 128)
        }
        for (e = t || 0, r = 0; r < o.length; r++) e += o[r], e = zh(e, "+-a^+6");
        return e = zh(e, "+-3^+b+-f"), 0 > e && (e = (2147483647 & e) + 2147483648), e %= 1e6, n + (e.toString() + "." + (e ^ t))
    },
    g_lsNewWord = new Object,
    g_lsStoreWord = new Object,
    g_bLoadNewWord = !1,
    g_config = new Object;
g_config.source = "en", g_config.target = "vi", g_config.delay = 30, g_config.learn = 1;
var g_variable = new Object;
g_variable.nAnswerTime = 0;
var clsNewWordModel = new NewWordModel,
    clsConfigModel = new ConfigModel,
    clsVariableModel = new VariableModel,
    g_bShowLearningDiv = 0,
    g_bFocus = 1;
$(document).ready(function() {
    $(window).focus(function() {
        g_bFocus = 1
    }), $(window).focusout(function() {
        g_bFocus = 0
    })
}), setInterval(loadQuestionTimer, 1e3);