var header = $('header .bar').addClass('fixed')

$('.nav-icon.icon-menu').on('click', function(){

	if( $('body .menu.hidden').hasClass('hidden') ) {
		$('body .menu.hidden').removeClass('hidden');
		$('.hero.large').addClass('thin')

	} else {
		$('.hero.large').removeClass('thin')
		$('body .menu.hidden').removeClass('hidden');
		$('body .menu').off('clickoutside');
	}

	window.setTimeout(function(){
		$('body .menu').off('clickoutside').on('clickoutside', function(){
		$('.hero.large').removeClass('thin')
			$('body .menu').addClass('hidden');
			$('body .menu').off('clickoutside');
		});
		// Just fast enough
	}, 200);

})

