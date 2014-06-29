	$('body .menu').on('clickoutside', function(){
		$('body .menu').addClass('hidden')
	});

$('.nav-icon.icon-menu').hover(function(){
	$('body .menu.hidden').removeClass('hidden')
}, function(){
	// $('body .menu.hidden').off('clickout');
})
