$(document).ready(function() {


	restore_options();

	$('#custom_code').submit(function(){

		save_options();
		return false;
		
	});
    // Saves options to chrome.storage
	function save_options() 
	{
	  var js_code = $('#js_code').val(),
	  		rule_code = $('#rule_code').val();	

	  console.log(rule_code);

	  chrome.storage.sync.set({ "jscode": js_code, "rulecode": rule_code }, function() {
	    	$('#save_stt').html('Saved!');
	  });

	}

	// Restores select box and checkbox state using the preferences
	// stored in chrome.storage.
	function restore_options() 
	{
	  // Use default value color = 'red' and likesColor = true.
	  chrome.storage.sync.get({ "jscode": '',"rulecode": '' }, function(items) {

	    $('#js_code').html(items.jscode);
	    $('#rule_code').val(items.rulecode);
	    
	  });
	}

});