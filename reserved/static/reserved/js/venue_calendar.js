
(function(){
	// var calendar;
	var app;
	make = { _layer: {}, views: {} };
	views = make.views;

	Application.ready(function(){
		setup()
	});

	var setup = function(){
		app = new Application('reserved')
	    Application.setGlobal(app);

	    defineTemplates();

		calendar = new Application.Calendar(app);
		calendar.make = make;
		app.calendar = calendar;
		setupUI();

	}

	var defineTemplates = function(){

		/*
		 Define all the templating library elements, of which
		 become accessible through the (Application).template
		 object.
		 */
		app.template.define('cells', '.calendar .%(key)s-cell', {
			id: undefined
			// , date: undefined
		});
	}

	var setupUI = function(){
	    // Hide all the views.

		$('.range ul li a').click(function(){
			showView( $(this).data('type') );
			return false;
		});

		// Pick a view to display
		showView(localStorage.lastLayer || 'Month');
		setupDateInput();
	}


	var $dateInput;
	var lastWidth = 0;
	var globalDate = Date.parse('today');
	var breadcrumbs=[];

	var fitInput = function(){
		$dateInput.$span.text( $dateInput.val() );
		lastWidth = $dateInput.$span.width();
		$dateInput.width( lastWidth );
	};

	var setupDateInput = function() {
		$dateInput = $('#dayDateInput');

		if( !$dateInput.$span ) {
			$dateInput.$span = $('<span/>', {
				id: $dateInput.attr('id') + '_span'
				, text:  $dateInput.val()
				,'class': $dateInput.attr('class')
			}).appendTo(
				$dateInput.parent()
			).hide()
		}


		$dateInput.on('focus', function(e){
			fitInput();
		});

		$dateInput.on('blur', function(e){
			fitInput();
			globalDate = Date.parse( $(this).val() );
		});

		$dateInput.on('keyup', function(e){
			$dateInput.$span.text( $dateInput.val() );
			if( $dateInput.width() < $dateInput.$span.width()) fitInput();
		});

		fitInput();
	}

	/*
	 Convert a date to day, month, tyear array
	 */
	var getDateParials = function(date) {
		var date = date || globalDate;
		var m = moment(date);
		var day = m.day();
		var month = m.month();
		var year = m.year();

		return [day, month, year];
	}

	var showView = function(type, date){
		$('.calendar .dates>div').addClass('hidden');
		localStorage.lastLayer = type
		if(!make[ type ]) {
			console.warn( type + ' view does not exist');
			return
		};

		return make[ type ].apply(make, getDateParials(date) );
	}

	make.Year = function(day, month, year) {
	    return make.Layer('year', 0, 0, year, 12)
	};

	make.Month = function(day, month, year) {
	    var count = new Date(year, month, 0).getDate();
	    return make.Layer('month', day, month, year, count)
	};

	make.Week = function (day,month, year) {
	    return make.Layer('week', day, month, year, 7)

	};

	make.Day = function (day, month, year) {
	    return make.Layer('day', day, month, year, 24)
	};


	make.Layer = function(name, day, month, year, count) {
		var rangeView
			, date 	= globalDate
			, m 	= moment(date)
			, nm 	= name + '-' + day + '-' + month + '-' + year + '-' + count
	    	, _date = new Date( year    || m.year()
						    	, month || m.month()
					    		, day   || m.day()
					    	);

		if( !make.views ) make.views = {};
		if( make.views[nm] === undefined ) {
			// Generate a new model view for the calendar cell
			make.views[nm] = new ModelTemplate('.' + name + '-view');
		}

		rangeView = make.views[nm];


		if(make._layer[nm]) {
			calendar.show(name);
			return make._layer[nm]
		}

		calendar.show(name);

	   	rangeView.data('layers', breadcrumbs);
	   	rangeView.data('date', _date).toView();

		$('.calendar .dates>.' + name + '-view').removeClass('hidden');

		breadcrumbs.push({
			name: nm
			, date: _date
		});

	   	return make._layer[nm] = make.Cells(name, count, {
	    	datetime: _date
	    });
	}

	make.Cells = function(type, count, data){
		var $cells= [];

	    var _data = {};

		for (var i = 0; i < count; i++) {
	    	cell = app.template.cells(type);

	    	_data.id 		= type + '-' + i
	    	_data.name 		= type + ' cell'
	    	_data.count 	= i + 1
	    	_data.count0 	= i

	    	for (var prop in data) {
	    		_data[prop] = data[prop]
	    	}
	    	var $cell = cell.toView('.' + type  +'-view .cells', _data)
	    	$cells.push( cell );
	    };

	    return $cells
	}

})();
