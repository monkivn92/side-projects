$(document).ready(function() {

	/////////////////////////////////////////////////////
	/************** No Script Section ******************/
	/////////////////////////////////////////////////////	
	var play_cnt = 1,
		audio_file ='',
		cur_time = 1;
	var time_wait, counter = $('#counter');
	addTimePlay();


	$('#btn_play').click(function(){

		$('#player')[0].load();
		$('#player')[0].play();
	});

	$('#player').on('timeupdate',function()		
	{
		var m = Math.floor(this.currentTime / 60),
			s = Math.floor(this.currentTime - m*60);
		counter.html(m + ' : ' + s);		
	});

	$('#player').on('ended',function(){
		if(play_cnt <3)
		{
			addTimeWait();
		}
		else
		{
			triggerHaveScriptAudio();
		}
		
	});

	$("#choose_audio_file").change(function(){

            var fileName = $(this).prop("files");
            audio_file = fileName[0].name;   
            $('#player_src').attr('src',audio_file);        
            $('#player_src2').attr('src',audio_file);        
			//$('#player')[0].load();
			//$('#player')[0].play();
    });

    $("#choose_kanji_image").change(function(){

            var fileName = $(this).prop("files");
            kanji_file = fileName[0].name;   
            
            $('#kanji-img').attr('src',kanji_file);      
			
    });

	function addTimePlay()
	{
		$('#time_play').html('Nghe không script lần '+play_cnt);
	}


	function addTimeWait()
	{
		$('#counter').html(cur_time);
		if(cur_time == 10)
		{
			clearTimeout(time_wait);
			
			cur_time = 1;

			$('#counter').empty();

			$('#player')[0].load();

			if(play_cnt <3)
			{
				$('#player')[0].play();
				play_cnt++;
				addTimePlay();
			}
			else
			{
				clearTimeout(time_wait);
				
			}
			
		}
		else
		{
			$('#counter').html(cur_time);
			cur_time++;
			time_wait = setTimeout(addTimeWait, 1000);
		}
	}

	/////////////////////////////////////////////////////
	/************** No Script Section ******************/
	/////////////////////////////////////////////////////
	var time_mapping;

	$('#save_mapping').click(function(){

		time_mapping = $.parseJSON($('#time_mapping').val());	
		alert('Saved!');	

	});

	function triggerHaveScriptAudio()
	{

		$(document).scrollTop( $("#p1").offset().top-30);
		
		$('#player2')[0].load();
		
		for (var key in time_mapping) 
		{
			eval('setTimeout( function(){$(document).scrollTop( $("#'+key+'").offset().top-30 );}, '+time_mapping[key]*1000+' );');	       
	       
	   	}	

		$('#player2')[0].play();


	}


	/////////////////////////////////////////////////////
	/************** Translation Section ******************/
	/////////////////////////////////////////////////////
	var cur_hl_id = 1, cur_tt_id = 1;
	
	$('.script-txt').click(function() {

		///Translate
		var txt_selected = window.getSelection(),
			range = txt_selected.getRangeAt(0),        // the range at first selection group
    		rect = range.getBoundingClientRect(); // and convert this to useful data   	
    	var this_txt = $(this),
    		this_top = this_txt.offset().top - window.scrollY;    		    		

    	if(txt_selected != '')
		{	

			var phonetic, meaning;
			$.get('http://mazii.net/api/search/'+txt_selected+'/3/1', function(data, status){

				phonetic = data.data[0].phonetic;
				meaning = data.data[0].means[0].mean;
						        
		        var div = document.createElement('div'); 
		        div.className = 'xtooltip' ; // make box
		        div.id = 'tt'+ cur_tt_id;
		        cur_tt_id++;
				div.setAttribute('contenteditable',true);
				div.style.position = 'absolute';              // fixed positioning = easy mode

				/*getBoundingClientRect() gets values with respect to
				the window(only the current visible portion of the page), 
				not the document(whole page).*/
				div.style.top = rect.top  - this_top + 40 + 'px' ; // abtract this_top to get real top value
				div.style.left = rect.left - 50 + 'px';	// -50 -> remove margin	of container		
				
				div.innerHTML = '('+phonetic+')'+meaning; //Mazii API
				
				this_txt.append(div);  
				//document.body.appendChild(div);  

				//hilite text
				hiLiteText('#F92672'); 

		    });
		}

		///HightLight
		function hiLiteText(hexColor) 
		{
		    var selection = window.getSelection().getRangeAt(0);
		    var selectedText = selection.extractContents();
		    var span = document.createElement('span');
		    span.id = 'hl'+cur_hl_id;
		    cur_hl_id++;
		    span.style.color = hexColor;
		    span.className = 'selected-text';
		    span.appendChild(selectedText);
		    selection.insertNode(span);
		}
	
	});	

	//Undo action
	$('#undo').click(function(){
		
		if(cur_tt_id >= 2)
		{
			$('#' + 'tt' + (cur_tt_id-1) ).remove();			
			cur_tt_id = cur_tt_id - 1;
			$('#' + 'hl' + (cur_hl_id-1) ).contents().unwrap();
			cur_hl_id = cur_hl_id - 1;
		}
		
	});	

	$('#clear-border').click(function(){
		
		$('.script-txt').addClass('no-border');
		
	});	


});