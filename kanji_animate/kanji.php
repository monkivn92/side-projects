<!DOCTYPE html>
<html>
<head>
	<title>kanji</title>
	<script src="jquery-3.1.1.min.js"></script>
	<script src="kanji.js"></script>
</head>
<body>

<div id="control-panel">

	<button id='btn-reset'>Reset</button>

	<button id='btn-run'>Run</button>

	<button id='btn-hide-number'>Hide Stroke Numbers</button>

</div>

<style>

	#control-panel{
		position: fixed;
		bottom: 0px;
		right: 0px;
		padding: 20px;
		border-top: 3px solid #000;
	}
	#control-panel button{
		padding: 5px;
		margin-right: 30px;
	}

</style>

<?php
	
	$file = $_GET['file'];

	$content = file_get_contents(__DIR__ . '/kanji/'.$file.'.svg');

	$content = str_replace(']>', '', $content);

	echo $content;

?>

</body>
</html>