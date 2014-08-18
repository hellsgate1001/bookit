
(function(){
	var calendar;
	var app;
	var make = { _layer: {} };

	Application.ready(function(){
		setup()
	});

	var setup = function(){
		app = new Application('reserved')
	    Application.setGlobal(app);

	    defineTemplates();

		calendar = new Application.Calendar(app);
		calendar.make = make;
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
	}

	/*
	 Convert a date to day, month, tyear array
	 */
	var getDateParials = function(date) {
		var date = date || new Date;
		var day = moment(date).day();
		var month = moment(date).month();
		var year = moment(date).year();

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

	make.Month = function (day, month, year) {
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
		$('.calendar .dates>.' + name + '-view').removeClass('hidden');

		var nm = name + '-' + day + '-' + month + '-' + year + '-' + count;
		if(make._layer[nm]) return make._layer[nm];
		calendar.show(name);

		var date = new Date
	    var _date = new Date( year || moment(date).year()
					    	, month || moment(date).month()
					    	, day || moment(date).day()
					    );


	   return make._layer[nm] = make.Cells(name, count, {
	    	datetime: _date
	    });
	}

	make.Cells = function(type, count, data){
		var $cells= [];

	    var _data = {}
			for (var i = 0; i < count; i++) {
	    	cell = app.template.cells(type);

	    	_data['id'] = type + '-' + i
	    	_data['name'] = type + ' cell'
	    	_data['count'] = i + 1
	    	_data['count0'] = i

	    	for (var prop in data) {
	    		_data[prop] = data[prop]
	    	}
	    	var $cell = cell.toView('.' + type  +'-view .cells', _data)
	    	$cells.push( cell );
	    };

	    return $cells
	}

})();
