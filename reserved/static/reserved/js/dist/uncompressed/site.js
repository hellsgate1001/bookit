// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
;	$('body .menu').on('clickoutside', function(){
		$('body .menu').addClass('hidden')
	});

$('.nav-icon.icon-menu').hover(function(){
	$('body .menu.hidden').removeClass('hidden')
}, function(){
	// $('body .menu.hidden').off('clickout');
})
;
Application.ready(function($){
	// var app = new Application('reserved')
		;
	// var calendar = new Calendar();

	// Hide all the views.
	$('.calendar .dates>div').addClass('hidden');
	app.calendar.show('month');

});
