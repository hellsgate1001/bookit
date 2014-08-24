
;(function(window){

	var header = $('header .bar')
		, sticky = false
		, lastpos
		, scroll
		, top
		;

	header.addClass('static').removeClass('fixed')

	$(window).scroll(function (event) {
	    scroll = $(window).scrollTop();
	    // Do something
	    // console.log(scroll);
	    top = header.position().top;

	    if( !sticky && scroll > top) {
	    	lastpos = (!sticky) ? top: lastpos;
	    	if(!sticky) header.removeClass('static').addClass('fixed');
	    	sticky = true;
	    } else if( scroll < lastpos && sticky) {
	    	if(sticky) header.addClass('static').removeClass('fixed');
	    	sticky = false;
	    }
	});

})(window)
