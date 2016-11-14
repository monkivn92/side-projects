$(document).ready(function() {

	var cur_url;

	console.log('Run JS is running!');
	
    cur_url = document.location.href;
	

    chrome.storage.sync.get({ "jscode": '',"rulecode": '' }, function(items) {

    	var rule_code = new RegExp(items.rulecode);
    	
	    if( rule_code = '' || !rule_code.test(cur_url) )
		{
			return;
		}
		
		eval(items.jscode);
	    
	});


});


