$(document).ready(function() {

//======================= START ====================//
$('svg').css({'width':'400px' , 'height':'400px'});

var g_id = $('svg>g>g').attr('id');

var p_id = g_id + '-s';

var all_path = $('path[id ^= "'+p_id+'"]');

var all_path_len = all_path.length;

var all_text = $('g[id ^= "kvg:StrokeNumbers"] text');

var all_path_len = all_text.length;

var j = 0;
//======================= START ====================//

resetAll();

function resetAll()
{
	j = 0;

	for (var i = 0; i < all_path_len; i++) 
	{
		$path_length = (all_path[i]).getTotalLength();

		$(all_path[i]).css({'stroke-dasharray':$path_length, 'stroke':'red', 'stroke-dashoffset': $path_length});
		//console.log(i);
	}
}


function animateKanji()
{

	$(all_path[j]).animate({'stroke-dashoffset': '0px'}, 1000, Timer());		
}

function Timer()
{
	if(j < all_path_len)
	{
		j++;
		setTimeout(animateKanji,1500);
	}
	
}


$('#btn-reset').click(function(){	

	resetAll();

});

$('#btn-run').click(function(){	

	animateKanji();
	
});

$('#btn-hide-number').click(function(){	

	all_text.hide();
	
});




});