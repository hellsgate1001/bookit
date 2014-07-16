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

QUnit.test( "Test has been setup", function( assert ) {
	var templates = $(this.selector)[0];
	assert.ok(templates)
});

QUnit.test( "Can receive HTML", function( assert ) {
	var html = '<div class="templates hidden"><div class="calendar"><div class="month-cell" id="{{ id }}"><div class="date">{{ date }}</div></div></div></div>';
	var temp = new Template();
	temp.html(html);
	assert.equal(temp.html(), html, 'HTML is stored correctly');
	assert.equal(temp.toHTMLString(), html, 'toHTMLString is fed from HTML');
});

QUnit.test( "Can receive a selector", function( assert ) {
	var temp = new Template(this.selector);
	assert.equal(temp.selector(), this.selector, 'Selector passed through constructor');

	// renamed the selector;
	var newSelector = '.template .new.selector';
	temp.selector(newSelector)
	assert.equal(temp.selector(), newSelector, 'change the selector after instansiation');

});

QUnit.test( "Can receive name/selector", function( assert ) {
	var name = 'templateName';
	var temp = new Template(name, this.selector);

	assert.equal(temp.name(), name, 'Name passed through constructor');
	assert.equal(temp.selector(), this.selector, 'Selector passed through constructor');

});

QUnit.test( "toHTMLString", function( assert ) {
	var actualHTML = $(this.selector)[0].outerHTML
	var temp = new Template(this.selector);

	assert.equal(temp.toHTMLString(), actualHTML, '');
});

QUnit.test( "Can define a Application implement", function( assert ) {
	// Define a template based on a DOM template
	this.app.template.define('monthCell', '.calendar .month-cell');
	//  Use a DOM template instantly
	var template = new this.app.template.monthCell();

  	assert.ok(template, 'A template is defined');


	// Application.template.calendarCell('month');
	this.app.template.define('calendarCell', function(key){
	        // 'calendar .month-cell'
	    return 'calendar .%(key)s-cell'
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



QUnit.test( "Advanced loadout", function( assert ) {
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
	    , name:     'calendar'
	}

	var definition = {
	    day:        '.calendar .dates .day-cell'
	    , week:     '.calendar .dates .week-cell'
	          //    '.calendar .dates .month-cell'
	    , month:    '.calendar .dates .%(key)s-cell'
	    , year:     '.calendar .dates .%(key)s-cell'
	}

	// Application.template.calendarCell('month');
	this.app.template.define(space, definition);

	var templateDay 	= new this.app.template.calendar('day');

  	assert.equal(templateDay.namespace(), space.namespace, 'Namespace can be changed');
  	assert.equal(templateDay.hidden(), space.hidden, 'hidden can be set false');
  	assert.equal(templateDay.name(), space.name, 'name can be set as applicarion definition');

});
