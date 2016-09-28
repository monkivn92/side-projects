var _data = new Object();
var _store = new Object();
var _config = new Object();
_config.source = "en";
var _nSort = 0;
var _bDesc = false;
var imgListenURL = chrome.extension.getURL("images/listen.png");

$(".sortIndex").click(function() {
	var nIndex = $(".sortIndex").index(this);
	if (nIndex == _nSort)
		_bDesc = !_bDesc;
	else
		_nSort = nIndex;
	renderData();
});		

function loadData(){
	chrome.storage.local.get("data", function (obj) {
		if(obj.hasOwnProperty("data")){
			_data = obj.data;
			renderData();
		}
	});		
}

function loadStore(){
	chrome.storage.local.get("store", function (obj) {
		if(obj.hasOwnProperty("store")){
			_store = obj.store;
			renderData();
		}
	});		
}

function loadConfig(){
	chrome.storage.local.get("config", function (obj) {
		if(obj.hasOwnProperty("config")){
			_config = obj.config;
		}
	});		
}

function createClickEvent(){
	$("#clear").click(function() {
		_data={};
		_store={};
		chrome.storage.local.set({"data": _data}, function() {});
		chrome.storage.local.set({"store": _store}, function() {});		
		renderData();
	});	
	
	$("#add").click(function() {
		var szWord = $( "#add-newword" ).val();
		if (szWord.trim() != ""){
			var szTranslated = $( "#add-translated" ).val();
			var szPronounce = $( "#add-pronounce" ).val();
			insertNewWord(szWord, szTranslated, szPronounce);
		}
	});		

	$(".removeNewWord").click(function() {
		var szWord = $(this).attr("name");
		removeNewWord(szWord);
		renderData();
	});	

	$(".removeStoreWord").click(function() {
		var szWord = $(this).attr("name");
		removeStoreWord(szWord);
		renderData();
	});		
	
	$(".LearnOff").click(function() {
		szWord = $(this).attr("name");
		turnToLearn(szWord, false);		
	});				

	$(".LearnOn").click(function() {
		szWord = $(this).attr("name");
		turnToLearn(szWord, true);
	});					
	
	$(".speech").click(function() {
		var szWord = $(this).attr("name");
		playAudio(szWord);
	});	
	
	$('.newword').blur(function() {
		var szWord = $(this).attr("name");
		var szEdit = $(this).text().trim();
		if (szWord != szEdit){
			if (typeof _data[szWord] != "undefined") {
				_data[szEdit] = _data[szWord];
				delete _data[szWord];		  
			}	

			if (typeof _store[szWord] != "undefined") {
				_store[szEdit] = _store[szWord];
				delete _store[szWord];			   
			}	
			chrome.storage.local.set({"data": _data}, function() {});
			chrome.storage.local.set({"store": _store}, function() {});
			loadData();
			loadStore();
		}
	});	
	
	$('.translate').blur(function() {
		var szWord = $(this).attr("name");
		var szEdit = $(this).text().trim();
		
		if (typeof _data[szWord] != "undefined") {
			_data[szWord].vi = szEdit;
		}	

		if (typeof _store[szWord] != "undefined") {
			_store[szWord].vi = szEdit;
		}	
		chrome.storage.local.set({"data": _data}, function() {});
		chrome.storage.local.set({"store": _store}, function() {});
		loadData();
		loadStore();		
	});		
	
	$('.pronounce').blur(function() {
		var szWord = $(this).attr("name");
		var szEdit = $(this).text().trim();
		
		if (typeof _data[szWord] != "undefined") {
			_data[szWord].pro = szEdit;
		}	

		if (typeof _store[szWord] != "undefined") {
			_store[szWord].pro = szEdit;
		}	
		chrome.storage.local.set({"data": _data}, function() {});
		chrome.storage.local.set({"store": _store}, function() {});
		loadData();
		loadStore();		
	});		
}

function renderData(){
	
	var szHtml = "";
	var j = 1;
	var sortable = [];
	
	for (var item in _data){
		if (_data[item].show === undefined)
			_data[item].show = 0;
		if (_data[item].time === undefined)
			_data[item].time = 0;
		if (_data[item].pro === undefined)
			_data[item].pro ="";			
		sortable.push([item, _data[item].vi, _data[item].pro, _data[item].show, _data[item].time]);
	}
	if (_nSort > 0)
		sortable.sort(function(a, b) {
			if (_bDesc)
				return a[_nSort] > b[_nSort]
			else
				return b[_nSort] > a[_nSort]
			}
		)	
	
	var nCount = Object.keys(_data).length;
	for (var i=0; i<nCount; i++){
		szName = JSON.stringify(sortable[i][0]);
		pDate = new Date(1000 * sortable[i][4]);
		
		szHtml += "<tr>";
		szHtml += "<td>" + (i + 1) + "</td>";
		szHtml += '<td><input class="LearnOff" type="checkbox" name=' + szName + ' checked/></td>';
		szHtml += '<td contenteditable="true" class="newword" name=' + szName + '>' + sortable[i][0] + "</td>";
		szHtml += '<td contenteditable="true" class="translate" name=' + szName + '>' + sortable[i][1] + "</td>";
		szHtml += '<td contenteditable="true" class="pronounce" name=' + szName + '>' + sortable[i][2] + "</td>";
		szHtml += "<td>" + sortable[i][3] + "</td>";
		szHtml += "<td>" + pDate.toLocaleDateString() + "</td>";		
		szHtml += '<td><img style="width: 20px;" class="speech" src="' + imgListenURL + '"/ name=' + szName + '></td>';
		szHtml += '<td><a class="removeNewWord" name=' + szName + ' href="#">Xóa</a></td>';
		szHtml += "</tr>";
	}	
	
	sortable = [];
	for (var item in _store){
		if (_store[item].show === undefined)
			_store[item].show = 0;
		if (_store[item].time === undefined)
			_store[item].time = 0;	
		if (_store[item].pro === undefined)
			_store[item].pro ="";				
		sortable.push([item, _store[item].vi, _store[item].vi, _store[item].show, _store[item].time]);
	}
	
	if (_nSort > 0)
		sortable.sort(function(a, b) {
			if (_bDesc)
				return a[_nSort] > b[_nSort]
			else
				return b[_nSort] > a[_nSort]
			}
		)	
		
	nCount = Object.keys(_store).length;
	for (var i=0; i<nCount; i++){
		szName = JSON.stringify(sortable[i][0]);
		pDate = new Date(1000 * sortable[i][4]);
		
		szHtml += "<tr>";
		szHtml += "<td>" + (i + 1) + "</td>";
		szHtml += '<td><input class="LearnOn" type="checkbox" name=' + szName + '/></td>';
		szHtml += "<td>" + sortable[i][0] + "</td>";
		szHtml += "<td>" + sortable[i][1] + "</td>";
		szHtml += "<td>" + sortable[i][2] + "</td>";
		szHtml += "<td>" + sortable[i][3] + "</td>";
		szHtml += "<td>" + pDate.toLocaleDateString() + "</td>";
		szHtml += '<td><img style="width: 20px;" class="speech" src="' + imgListenURL + '"/ name=' + szName + '></td>';
		szHtml += '<td><a class="removeStoreWord" name=' + szName + ' href="#">Xóa</a></td>';
		szHtml += "</tr>";
	}	
	
	$('#lsNewWord').html(szHtml);
	
	createClickEvent();
}

function removeNewWord(source_text){
	delete _data[source_text];
	chrome.storage.local.set({"data": _data}, function() {});
	loadData();
}

function removeStoreWord(source_text){
	delete _store[source_text];
	chrome.storage.local.set({"store": _store}, function() {});
	loadStore();
}

function playAudio(szWords){
	if (szWords == "")
		return;
				
	//var audio = new Audio("http://translate.google.com/translate_tts?tl=en&q=" + szWords);
	
	var audio = new Audio("http://api.microsofttranslator.com/V2/http.svc/Speak?oncomplete=Speech.onSpeechComplete&appId=3AFAC12D1A7C674242EE37C45BD5E3293DDF4A74&language=" + _config.source + "&text=" + szWords)
	audio.play();		
}	

function turnToLearn(source_text, bOn){
	if (bOn){
		_data[source_text] = _store[source_text];
		delete _store[source_text];
	}
	else{
		_store[source_text] = _data[source_text];
		delete _data[source_text];	
	}
	chrome.storage.local.set({"data": _data}, function() {});
	chrome.storage.local.set({"store": _store}, function() {});
	loadData();
	loadStore();	
}

insertNewWord = function(source_text, tranlsated_text, pronounce_text){
	if (source_text.length > 20)
		return;
		
	chrome.storage.local.get("data", function (obj) {
		if(obj.hasOwnProperty("data")){
			_data = obj.data;
			var nCount = Object.keys(_data).length;
			if (nCount > 24){
				insertStoreWord(source_text, tranlsated_text, pronounce_text);
				return;
			}
		}
		
		objData = new Object();
		objData.vi = tranlsated_text;
		objData.pro = pronounce_text;
		objData.count = 0;
		objData.show = 0;
		objData.time = new Date().getTime() / 1000;
		_data[source_text] = objData;
		chrome.storage.local.set({"data": _data}, function() {});	
		renderData();
	});				
}

insertStoreWord = function(source_text, tranlsated_text, pronounce_text){
	if (source_text.length > 20)
		return;
		
	chrome.storage.local.get("store", function (obj) {
		if (obj.hasOwnProperty("store")){
			_store = obj.store;
			var nCount = Object.keys(_store).length;
			if (nCount > 199)
				return;
		}
		objData = new Object();
		objData.vi = tranlsated_text;
		objData.pro = pronounce_text;
		objData.count = 0;
		objData.show = 0;
		objData.time = new Date().getTime() / 1000;			
		_store[source_text] = objData;
		chrome.storage.local.set({"store": _store}, function(){});	
		renderData();
	});				
}	

loadConfig();
loadData();
loadStore();