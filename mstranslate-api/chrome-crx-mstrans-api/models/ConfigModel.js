var g_config = new Object();
g_config.source = "en";
g_config.target = "vi";
g_config.delay = 30;
g_config.learn = 1;

function ConfigModel(){
	this.loadConfig = function(callback){
		chrome.storage.local.get("config", function (obj) {
			if(obj.hasOwnProperty("config")){
				g_config = obj.config;
			}
			chrome.storage.local.set({"config": g_config}, function() {});	
			if (callback != null)
				callback();
		});	
	}
	
	this.saveConfig = function(){
		chrome.storage.local.set({"config": g_config}, function() {});	
	}
};