(function(){
	var Class = jsface.Class
		, extend = jsface.extend
		, events = {
			ready: []
		}
		;

	var Application = Class({
		type: 'Application'
		, Class: Class
		, extend: extend
		, Component: Class
		, constructor: function(name){
			this.name = name || this.type;
		}
		, template: {
			get: function(selector) {
				// Pick a template from the view. If the template has been used
				// before a cached version may be
				// returned, unless otherwise acclaimed.
				var html = $(selector)[0].outerHTML;
				return html;
			}
		}
		, mixins: {
			Event: function(){}
		}
	});

	Application.ready = function(f) {
		if(f !== undefined) {
			events.ready.push(f);
		}
	};

	window.Application = Application
})()
;(function($){
	var app = new Application()
		;

	var Calendar = app.Component([app.CollectionMixins], {
		constructor: function(date){
			this.date = date;
		}
		, show: function(range, dateString){
			// present a view to the interface
			// pick a view
			var date = Date.parse(dateString || new Date());
			var dates = this.dates[range](date);
			$('.calendar .dates .' + range + '-view').removeClass('hidden');
		}
		, dates: {
			month: function(date){
				date = date || new Date();
				var m = moment(date)
					, dayCount = m.daysInMonth()
					, firstDate = m.startOf('month')
					, endDate = m.endOf('month')
					// Current looking at
					, currentDay = undefined
					, template = ''
					;

				for (var i = 0; i < dayCount; i++) {
					currentDay = dayCount[i];
					template = app.template.calendarCell('month');
				};

				debugger;
			}
		}
	});

	app.extend(Application, [Calendar])
})()
;(function($){
	var app = new Application()
		;
	// http://www.collectionsjs.com/
	var CollectionMixin app.mixins.CollectionMixin = app.Class({
		collection: function(){
		}
	})
	Application.prototype.mixins.CollectionMixin = CollectionMixin;
	app.extend(Application, [CollectionMixin])
	debugger;
})()
