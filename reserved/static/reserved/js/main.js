$('.nav-icon.icon-menu').on('click', function(){

	$('body .menu.hidden').removeClass('hidden');
	window.setTimeout(function(){
		$('body .menu').off('clickoutside').on('clickoutside', function(){
			$('body .menu').addClass('hidden');
			$('body .menu').off('clickoutside');
		});
		// Just fast enough
	}, 200);
})
