$(document).ready(function() {

    //~~~~~~~~~~~~~~~~~~~~~~ KeyBoard Events
    var ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 917777,
        rKey = 82,
        sKey = 83,
        pKey = 80,
        oKey = 79,
        l_arrow = 37,
        r_arrow = 39;

    $(document).keydown(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });

    $(document.body).keydown(function(e) {

    	if($('#lock-kb').is(':checked'))
    	{
    		return true;
    	}

        if (e.keyCode == oKey)
        {
            $("#audio_file").click();//Select audio file
        }

        if (e.keyCode == pKey)
        {
            $('#player')[0].load();
            $('#player')[0].play();//Play audio file
        }

        if (e.keyCode == rKey)
        {
            $('#player')[0].load(); //Reload audio file
        }

        if (e.keyCode == sKey)
        {
            saveTextAsFile(); //Save all work
        }

        if (e.keyCode == l_arrow)
        {
            sliderControler('prev'); //Save all work
        }

        if (e.keyCode == r_arrow)
        {
            
            sliderControler('next'); //Save all work
        }

    });

    //~~~~~~~~~~~~~~~~~~~~~~ Controller Section
    $('#kanji-panel').dblclick(function(event) {

    	$('#hidden-controller').toggleClass('active');
    });

    $('#rm-kotoba').click(function(event) {

    	$('#kanji-panel>p').last().remove();
    	return false;
    });

    $('#back-slide').click(function(event) {

    	sliderControler('prev'); //Save all work
    	return false;
    });

    $('#next-slide').click(function(event) {

    	sliderControler('next'); //Save all work
    	return false;
    });
    
    $('#open-audio').click(function(event) {

    	$("#audio_file").click();//Select audio file
    	return false;
    });



    //~~~~~~~~~~~~~~~~ Source Text Import  
    var max_length = 700,
            card_num = $('.card-item').length;

    if(!card_num)
    {      
        var src_txt = $('#kikitori-src').html();
        
        var lines = src_txt.split('\n');

        var cleant_src_txt = [];

        $(lines).each(function(idx, elm){

            var cleant_item = elm.trim();

            if(cleant_item != '')
            {
                cleant_src_txt.push(cleant_item);
            }
        });  

        var cur_arr_idx = 0;
        var cur_card_id = 1; 

        $('#kikitori-panel').append('<div id="c1" class="card-item active"></div>');

        importText();
    }     
    

    function importText()
    { 

        if(cur_arr_idx == cleant_src_txt.length -1)
        {
            return;
        }            

        var cur_card_html = $('#c'+cur_card_id).html();

        $('#c'+cur_card_id).html( cur_card_html + cleant_src_txt[cur_arr_idx]);          

        if( $('#c'+cur_card_id).innerHeight() < 700)
        {
            cur_arr_idx++;
            importText();
        }    
        else
        {
            $('#c'+cur_card_id).html( cur_card_html );

            cur_card_id++;            

            $('#kikitori-panel').append('<div id="c'+cur_card_id+'" class="card-item"></div>');

            importText();
        
        }
    }  


    //~~~~~~~~~~~~~ Audio Process

    $("#audio_file").change(function(){

            var fileName = $(this).prop("files");
            audio_file = fileName[0].name;   
            $('#player_src').attr('src',audio_file);   
            $('#player')[0].load();    
            //$('#player')[0].play();    

    });

    //~~~~~~~~~ Slideshow

    function sliderControler(action)
    {
        var slide_num = $('.card-item').length;
        var active_slide = $('.card-item.active');
        

        if(action == 'next')
        {
            if( active_slide.next().length != 0)
            {
                active_slide.next().addClass('active');
                active_slide.removeClass('active');
            }
            else
            {
                /*active_slide.removeClass('active');
                $('#c1').addClass('active');*/
                return false;

            }
        }
        else
        {
            if( active_slide.prev().length != 0)
            {
                active_slide.prev().addClass('active');
                active_slide.removeClass('active')
            }
            else
            {
                /*active_slide.removeClass('active');
                $('#c'+slide_num).addClass('active');*/
                return false;
            }
        }
    }

    /////////////////////////////////////////////////////
	/************** Translation Section ******************/
	/////////////////////////////////////////////////////
	var cur_hl_id = 1, cur_tt_id = 1;
	
	$('#kikitori-panel').click(function() {
		
		///Translate
		if($('#lock-tran').is(':checked'))
    	{
    		return true;
    	}

	/*	var txt_selected = window.getSelection(),
			range = txt_selected.getRangeAt(0),        // the range at first selection group
    		rect = range.getBoundingClientRect(); // and convert this to useful data   	
    	var this_txt = $(this),
    		this_top = this_txt.offset().top - window.scrollY;*/

	    	var txt_selected = window.getSelection()    		    		

	    	if(txt_selected != '')
			{	

				var phonetic, meaning;
				$.get('http://mazii.net/api/search/'+txt_selected+'/3/1', function(data, status){

				phonetic = data.data[0].phonetic;
				meaning = data.data[0].means[0].mean;
						        
		      /*  var div = document.createElement('div'); 
		        div.className = 'xtooltip' ; // make box
		        div.id = 'tt'+ cur_tt_id;
		        cur_tt_id++;
				div.setAttribute('contenteditable',true);
				div.style.position = 'absolute';              // fixed positioning = easy mode

				getBoundingClientRect() gets values with respect to
				the window(only the current visible portion of the page), 
				not the document(whole page).
				div.style.top = rect.top  - this_top + 40 + 'px' ; // abtract this_top to get real top value
				div.style.left = rect.left - 50 + 'px';	// -50 -> remove margin	of container		
				
				//div.innerHTML = '('+phonetic+')'+meaning; //Mazii API
				div.innerHTML = meaning; //Mazii API*/
				
				$('#kanji-panel').append('<p><span class="jp-lang">'+txt_selected+' 「 '+phonetic+ ' 」</span><span class="vi-lang"> : '+meaning +'</span><p>');  
				

		    });
		} 
	});	   

    function saveTextAsFile()
    {
        var textToWrite = document.documentElement.outerHTML;
        var textFileAsBlob = new Blob([textToWrite], {type:'text/html'});
        var fileNameToSaveAs = "saved_namachuukei.html";
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null)
        {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else
        {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();
    }
});