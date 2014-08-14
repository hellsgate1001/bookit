(function($){

	var Calendar = Application.Component(Application.Basic, {

		constructor: function(date){
			this.date = date;
		}
		, show: function(range, dateString){
			// present a view to the interface
			// pick a view
			var date = Date.parse(dateString || new Date());
			var dates = (this.dates[range])? this.dates[range](date): undefined;
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
					// ntemplate = Application.g().template.calendarCell('month');
				};

				// debugger;
			}
		}
	});

	Application.extend(Calendar, [Application.CollectionMixins]);
	Application.Calendar = Calendar;

	Application.prototype.Calendar = Calendar;

})($)
