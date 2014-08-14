var make = { _layer: {} };

calendar = new Application.Calendar(app);

make.Year = function(day, month, year) {
    return make.Layer('year', 0, 0, year, 12, 'YYYY')
};

make.Month = function (day,month, year) {
    var count = new Date(year, month, day).getDate();
    return make.Layer('month', day, month, year, count, 'MMM')

};

make.Week = function (day,month, year) {
    var count = new Date(year, month, day).getDate();
    return make.Layer('week', day, month, year, 52, 'YYYY')

};

make.Day = function (day, month, year) {
    return make.Layer('day', day, month, year, 24, 'dddd')
};


make.Layer = function(name, day, month, year, count, format) {
	$('.calendar .dates>.' + name + '-view').removeClass('hidden');

	if(make._layer[name]) return make._layer[name]
	calendar.show(name);

    var date = new Date;
    var day = day || moment(date).day();
    var month = month || moment(date).month();
    var year = year || moment(date).year();

   return make._layer[name] = make.Cells(name, count, {
    	format: moment().format(format)
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

    	for (var prop in data) {
    		_data[prop] = data[prop]
    	}
    	var $cell = cell.toView('.' + type  +'-view', _data)
    	$cells.push( cell );
    };

    return $cells
}

calendar.make = make;

Application.ready(function(){
    var app = new Application('reserved')
        ;

    Application.setGlobal(app);

	app.template.define('cells', '.calendar .%(key)s-cell', {
		id: undefined
		// , date: undefined
	});

	var date = new Date;
	var day = moment(date).day();
	var month = moment(date).month();
	var year = moment(date).year();

    // Hide all the views.
	ms = make.Month(0, month, year);

	$('.range ul li a').click(function(){
		$('.calendar .dates>div').addClass('hidden');
		if(!make[ $(this).data('type') ]) {
			console.warn( $(this).data('type') + ' view does not exist');
			return
		}
		make[ $(this).data('type') ](day, year, month);
		return false;
	})
});
