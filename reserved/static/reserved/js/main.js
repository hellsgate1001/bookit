var header = $('header .bar').addClass('fixed')

$('.menu ul li[data-show]')
	.addClass('has-child').hover(function(){
		$('.menu ul li .' + $(this).data('show') ).toggleClass('hidden')
	})

$('.nav-icon.icon-menu').on('click', function(){
	var $hiddenMenu = $('body .menu.hidden');

	if( $hiddenMenu.hasClass('hidden') ) {
		$hiddenMenu.removeClass('hidden');
		$('.hero.large').addClass('thin')

	} else {
		$('.hero.large').removeClass('thin')
		$hiddenMenu.removeClass('hidden');
		$('body .menu').off('clickoutside');
	}

	window.setTimeout(function(){
		$('body .menu').off('clickoutside').on('clickoutside', function(){
		$('.hero.large').removeClass('thin')
			$('body .menu').addClass('hidden');
			$('body .menu').off('clickoutside');

			$('.menu ul li[data-show]').addClass('hidden')
		});
		// Just fast enough
	}, 200);

})

