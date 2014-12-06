
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

	var storeDate = function(v){
		var d = Date.parse(v);
		if(d) {
			globalDate = d;
			return true;
		}
		return false;
	};

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
			storeDate( $(this).data('span').text() )
			fitInput.apply(this, [e]);
			showView();
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
		type = type || localStorage.lastLayer;
		//date = date || localStorage.lastDate;
		$('.calendar .dates>div').addClass('hidden');
		localStorage.lastLayer = type;
		localStorage.lastDate = date;

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
					    	)
	    	;

		globalDate = _date;

	    if( _date.toDateString() != globalDate.toDateString() ) {
	    	// A date has been pushed through the API,
	    	// therefore the view doesn't match the date.
	    	// Change the dateInput to the correct value.
			// app.template.view.dateInput.data('date', _date)
	    }

		if( !make.views ) make.views = {};
		if( make.views[nm] === undefined ) {
			// Generate a new model view for the calendar cell
			// make.views[nm] = new ModelTemplate('.' + name + '-view');

			/*
			 Resuse an existing interface, changing only the interface
			 model information. This saves regenerating another view as
			 this can be expensive for many views.
			 */

			make.views[nm] = app.template.get( app.Str('.%s-view', name) )
		}

		rangeView = make.views[nm];

		make.updateURL(name, _date);

		breadcrumbs.push({
			name: nm
			, date: _date
		});

		/*
		 This is a slight hotwire of updating the range in the
		 date input view.

		 This will be changed in favour of something more agnostic.
		 */
		app.template.view.dateInput.data('range', name)


		if(make._layer[nm]) {
			calendar.show(name);
			return make._layer[nm]
		}

		calendar.show(name);

	   	rangeView.data('layers', breadcrumbs);
	   	rangeView.data('date', _date).toView();

		$('.calendar .dates>.' + name + '-view').removeClass('hidden');

	   	return make._layer[nm] = make.Cells(name, count, {
	    	datetime: _date
	    });
	}

	make.updateURL = function(name, date){

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
			, date: moment(date).format('YYYY-MM-DD')
			, type: name
		});

		var title = app.Str('View %(date)s %(type)s', {
			date: moment(date).format('YYYY-MM-DD')
			, type: name
		});

	    window.history.pushState({ name: name, date: date}, title, url);
	}

	var cellLayers = {};
	make.Cells = function(type, count, data){
		var $cells= [];
	    var _data = {};
	    var cell;
	    var cells = cellLayers[type] || [];
		for (var i = 0; i < count; i++) {
	    	cell = cells[i] || app.template.create.cells(type);

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

	    cellLayers[type] = $cells;
	    return $cells;
	}

	window.addEventListener("popstate", function(e) {
	    make.Layer(
		    e.state.name
		    , e.state.date.getMonth()
		    , e.state.date.getDate()
		    , e.state.date.getFullYear()
	    )
	});

})();
