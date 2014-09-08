
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
		var d = app.template.define('cells', '.calendar .%(key)s-cell', {
			id: undefined
			// , date: undefined
		});

		/*
		 this instantly runs the static template to define the structure and
		 run the view binding. Pass an optional object to init as you would
		 use `.get(name, options)`.

		 You can access variables into the defined model like:

		 	app.template.view.dateInput.model.date = Date.parse('last week friday')
		 	// or preferred
		 	app.template.view.dateInput.data('date', Date.parse('yesterday') );

		 */
		app.template.defineStatic('dateInput', '.date-input-container').init();

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
	var lastWidth 	= 0;
	var globalDate 	= Date.parse('today');
	var breadcrumbs = [];

	var fitInput = function(event){
		if(this === window) return false;
		$(this).data('span').text( $(this).val() );
		lastWidth = $(this).data('span').width();
		$(this).width( lastWidth );
	};

	var setupDateInput = function() {
		$dateInput = $('.date-input');

		$dateInput.each(function(){
			if( !$(this).data('span') ) {

				var $span =  $('<span/>', {
					text:  $(this).val()
					,'class': $(this).attr('class')
				}).appendTo(
					$(this).parent()
				).hide();

				$(this).data('span', $span);
			}
		})


		$dateInput.on('focus', function(e){
			fitInput.apply(this, [e]);
		});

		$dateInput.on('blur', function(e){
			fitInput.apply(this, [e]);
			globalDate = Date.parse( $(this).val() );
		});

		$dateInput.on('keyup', function(e){
			$dateInput.data('span').text( $dateInput.val() );
			if( $dateInput.width() < $dateInput.data('span').width()) fitInput();
		});

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

		var m = make[ type ].apply(make, getDateParials(date) );
		// fitInput.apply($dateInput);
		return m
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
			// make.views[nm] = new ModelTemplate('.' + name + '-view');
			make.views[nm] = app.template.get( app.Str('.%s-view', name) )
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

		if( !make.originalPathName ) {
			make.originalPathName = location.pathname;

			// remove end slash
			if( make.originalPathName.slice(-1) === '/' ){
				make.originalPathName = make.originalPathName.slice(0, -1);
			}
		}

		// Get current path (clean)
		var url = app.Str('%(path)s/%(date)s/%(type)s', {
			path: make.originalPathName
			, date: moment(_date).format('YYYY-MM-DD')
			, type: name
		});

		var title = app.Str('View %(date)s %(type)s', {
			date: moment(_date).format('YYYY-MM-DD')
			, type: name
		});

	    window.history.pushState(name, title, url);

	   	return make._layer[nm] = make.Cells(name, count, {
	    	datetime: _date
	    });
	}

	make.Cells = function(type, count, data){
		var $cells= [];

	    var _data = {};

		for (var i = 0; i < count; i++) {
	    	cell = app.template.create.cells(type);

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

	window.addEventListener("popstate", function(e) {
	    debugger;
	    console.log(location.pathname, e);
	});

})();
