QUnit.module('Template', {
	setup: function(){
		this.selector = '.test.template';
		this.app = new Application();

	}
	, teardown: function() {
		$('body .test-templates').remove();
		//app.destroy()
	}
});

QUnit.test( "Exists", function( assert ) {
	var template = $(this.selector);
  	assert.ok( template.length > 0, template.length + ' template $elements ' );
  	assert.ok( template.find('.calendar').length > 0, template.length + ' template calendar $elements ' );
});


/*
 <div class="templates hidden">
     <div class="calendar">
         <div class="month-cell" id='{{ id }}'>
             <div class="date">{{ date }}</div>
         </div>
     </div>
 </div>
*/

QUnit.test( "Test has been setup", function exists_Template( assert ) {
	var templates = $(this.selector)[0];
	assert.ok(templates)
});

QUnit.test( "Can receive HTML", function html_Template( assert ) {
	var html = '<div/>';
	var temp = new Template();
	temp.html(html);
	assert.equal(temp.html(), html, 'HTML is stored correctly');
	// assert.equal(temp.toHTMLString(), html, 'toHTMLString is fed from HTML');
});

QUnit.test( "Can receive a selector", function selector_newSelector_Template( assert ) {
	var temp = new Template(this.selector);
	assert.equal(temp.selector(), '.template ' + this.selector, 'Selector passed through constructor');

	// renamed the selector;
	var newSelector = '.template .new.selector';
	temp.selector(newSelector)
	assert.equal(temp.selector(), '.template ' + newSelector, 'change the selector after instansiation');

});

QUnit.test( "Can receive name/selector", function name_selector_Template( assert ) {
	var name = 'templateName';
	var temp = new Template(name, this.selector);

	assert.equal(temp.name(), name, 'Name passed through constructor');
	assert.equal(temp.selector(), '.template ' + this.selector, 'Selector passed through constructor');

});

QUnit.test( "Can define an Application implement", function define_monthCell_Template( assert ) {

	assert.ok( (new Application).template.define, '(new Application).template.define exists')
	// Define a template based on a DOM template
	this.app.template.define('monthCell', '.calendar .month-view');
	//  Use a DOM template instantly
	var template = new this.app.template.monthCell();

  	assert.ok(template, 'A template is defined');


	// Application.template.calendarCell('month');
	this.app.template.define('calendarCell', function(key){
	        // 'calendar .month-cell'
	    return 'calendar .%(key)s-view'
	});

	/*
	<div class="calendar">
	    <div class="dates">
	        <div class="day-view">
	            <h3>Day view</h3>
	            <!-- A day view is broken in hourly (selected) intervals
	            with each booking listed start and end time. -->
	        </div>
	        <!-- in here will list a period of dates -->
	        <div class="week-view">
	            <h3>Week view</h3>
	            <!-- A stack of of days, divided horizonally by a selected
	            time range. -->
	        </div>
	        <div class="month-view">
	            <h3>Month view</h3>
	            <!-- up to 36 blocks of the selected month.
	            Each month has a number next to the event -->
	        </div>
	        <div class="year-view">
	            <h3>Year view</h3>
	            <!-- Each cell is a month of the selected year, each month
	            has an event with a count. Each count is a booking number -->
	        </div>
	    </div>
	</div>
	*/

	// Define a simple selector
	this.app.template.define('calendar', '.calendar .dates .%(key)s-view');
	                 // 'calendar', '.calendar .dates .month-view'
	// Use a defined Template
	var templateDay 	= new this.app.template.calendar('day');
  	assert.ok(templateDay, 'A template is defined with auto selector');

	var templateWeek 	= new this.app.template.calendar('week');
  	assert.ok(templateWeek, 'A template is defined with auto selector');

	var templateMonth 	= new this.app.template.calendar('month');
  	assert.ok(templateMonth, 'A template is defined with auto selector');

	var templateYear 	= new this.app.template.calendar('year');
  	assert.ok(templateYear, 'A template is defined with auto selector');

});

QUnit.test( "Multi definition loadout", function multi_definition_Template( assert ) {
	var space = {
	    name:     'subs'
	    // The selector for the parent.
	    // regardless of how many children definitions
	    // are applied; this should parenatize all.
	    , selector: '.calendar'
	}

	var definition = {
	    day:        /* .calendar */ '.dates .day-cell'
	    , week:     /* .calendar */ '.dates .week-cell'
	    , month:    /* .calendar */ '.dates .%(key)s-cell'
	}

	this.app.template.define(space, definition);


	var templateGroup 	= this.app.template.subs();
  	assert.equal('day' in this.app.template.subs(), true, 'Correct day object template');
  	assert.equal('week' in this.app.template.subs(), true, 'Correct week object template');
  	assert.equal('month' in this.app.template.subs(), true, 'Correct month object template');

	var templateDay 	= this.app.template.subs('day');

  	assert.equal('.template ' +  definition.day, templateDay.selector(), 'Correct day template');

	var templateWeek 	= this.app.template.subs('week');

  	assert.equal('.template ' +  definition.week, templateWeek.selector(), 'Correct week template');

  	var templateMonth 	= this.app.template.subs('month');

  	assert.equal( sprintf( '.template ' + definition.month, {key:'month'}), templateMonth.selector(),
  		'Correct month templated selector');

});


QUnit.test( "Advanced loadout", function space_definition_Template( assert ) {
  	var space = {

	    // master template containers.
	    // littered throughout your DOM.
	    namespace:  '.test.templates'

	    // Namespaced DOM entities
	    // should be hidden (using CSS)
	    , hidden:   false

	    // the name of your template, to
	    // assign to the Application.template
	    // space.
	    , name:     'dates'
	    // The selector for the parent.
	    // regardless of how many children definitions
	    // are applied; this should parenatize all.
	    , selector: '.calendar'
	}

	var definition = {
					/*
					 .calendar is as this should be applied by the parent
					 selector.
					 */
	    day:        /* .calendar */ '.dates .day-cell'
	    , week:     /* .calendar */ '.dates .week-cell'
	          //    /* .calendar */ '.dates .month-cell'
	    , month:    /* .calendar */ '.dates .%(key)s-cell'
	    , year:     /* .calendar */ '.dates .%(key)s-cell'
	}

	// This is mostly syntax should; as under the hood; a single
	// template will be returned for each, using the parental
	// data space and definitions as reference.
	//
	// Application.template.calendarCell('month');
	this.app.template.define(space, definition);

	// By definition one object can be called out of the scope.
	// regardless of the template; the references should be the same.
	var templateDay 	= new this.app.template[space.name]('day');
	var templateWeek 	= new this.app.template[space.name]('week');
	var templateMonth	= new this.app.template[space.name]('month');
	var templateYear 	= new this.app.template[space.name]('year');

  	assert.equal(templateDay.selector(), space.namespace  + ' ' + definition.day, 'selector is sub key');
  	assert.equal(templateWeek.selector(), space.namespace  + ' ' + definition.week, 'selector is sub key');
  	assert.equal(templateMonth.selector(), sprintf(space.namespace  + ' ' + definition.month, { key: 'month'}),
  		'selector is sprintf keyed');
  	assert.equal(templateYear.selector(), sprintf(space.namespace  + ' ' + definition.year, { key: 'year'}),
  		'selector is sprintf keyed');

});

this.app = new Application
t = this.app.template
