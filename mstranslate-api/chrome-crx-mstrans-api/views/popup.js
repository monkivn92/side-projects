var clsConfigModel = new ConfigModel();

clsConfigModel.loadConfig(
	function(){
		if(g_config.hasOwnProperty("source"))
			$("#source-language").val(g_config.source);
				
		if(g_config.hasOwnProperty("target"))
			$("#target-language").val(g_config.target);		

		if(g_config.hasOwnProperty("delay"))
			$("#time-delay").val(g_config.delay);			

		if(g_config.hasOwnProperty("learn"))
			$("#bLearn").prop('checked', g_config.learn);
	}
);

// Event
$( "#source-language" ).change(function() {
	var language = this.value;
	clsConfigModel.loadConfig(
		function(){
			g_config.source = language;
			clsConfigModel.saveConfig();			
		}	
	);	
});

$( "#target-language" ).change(function() {
	var language = this.value;
	clsConfigModel.loadConfig(
		function(){
			g_config.target = language;
			clsConfigModel.saveConfig();			
		}	
	);
});

$( "#time-delay" ).keyup(function() {
	var nDelay = parseInt(this.value);
	clsConfigModel.loadConfig(
		function(){
			g_config.delay = nDelay;
			clsConfigModel.saveConfig();			
		}	
	);
});

$('#bLearn').click(function() {
	var bLearn = 0;
    var $this = $(this);
    if ($this.is(':checked'))
        bLearn = 1;
		
	var nDelay = parseInt(this.value);
	clsConfigModel.loadConfig(
		function(){
			g_config.learn = bLearn;
			clsConfigModel.saveConfig();			
		}	
	);		
});
