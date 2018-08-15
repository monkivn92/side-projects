CKEDITOR.plugins.add( 'vuongpv', {
    
    init: function( editor ) {
		
		editor.addCommand("vuonghello", {
			exec: function(edt) {
				//console.log(edt);
				alert('Oh, hi there!');
			}
		});
		
		editor.ui.addButton('HelloVuong', {
			label: "Hello Vuong",
			command: 'vuonghello',
			toolbar: 'pvv',
			icon: 'https://avatars1.githubusercontent.com/u/5500999?v=2&s=16'
		});
    }
});

