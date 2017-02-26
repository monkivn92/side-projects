<!DOCTYPE html>
<html>
<head>
  <meta charset="ISO-8859-1">
</head>
<body>
	

<?php

$dir = __DIR__."/kanji";

// Open a directory, and read its contents

if ($dh = opendir($dir))
{
	echo '<table>';

	while (($file = readdir($dh)) !== false  )
	{
		if($file != '.' && $file != '..')
		{
			if(strpos($file, '-') !== false)
			{
				$file = strstr($file, '-', true);
			}

			if(strpos($file, '.') !== false)
			{
				$file = strstr($file, '.', true);
			}
			echo '<tr><td>';
			echo $file .'</td>';
			echo '<td>&#' . hexdec($file);
			echo ';</td></tr>';
		}
	  	
	 
	}

	echo '</table>';


	closedir($dh);
}

?>
<style>
	td{
		width: 200px;
		font-size: 40px;
	}
</style>
</body>
</html>