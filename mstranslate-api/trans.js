$(document).ready(function() {

	$('#text-source').click(function() {

		var txt_selected = window.getSelection(),
			range = txt_selected.getRangeAt(0),        // the range at first selection group
    		rect = range.getBoundingClientRect(); // and convert this to useful data

    	   // finally append


		if(txt_selected != '')
		{	
		
			$.get('http://api.microsofttranslator.com/V2/Ajax.svc/Translate?from=ja&to=vi&text='+txt_selected+'&contentType=text/plain&appId=3AFAC12D1A7C674242EE37C45BD5E3293DDF4A74', function(data, status){
		                
		        
		        //var txt_trans = '<p>'+ txt_selected + ' : ' + data.replace('"','').replace('"','') +'</p>';  
		        //$('#text-trans').append(txt_trans);

		        var div = document.createElement('div');   // make box
				div.style.border = '2px solid black';      // with outline
				div.style.position = 'absolute';              // fixed positioning = easy mode
				div.setAttribute('contenteditable', 'true');             // editable
				div.className = 'xtooltip';             // class name
				div.style.top = rect.top - 40 + 'px' ;       // set coordinates
				div.style.left = rect.left + 'px';
				div.style.height = '20px'; // and size
				div.style.width = 'auto';
				div.style.padding = '5px';
				div.innerHTML= data.replace('"','').replace('"','');
				document.body.appendChild(div);   

		    });
		}

	});	
	
});