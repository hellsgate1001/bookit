;(function($){

    // Configurations for a space object.
    var space = {
        // name selector for the passing object.
        // by default the selector the Template namespacespace definition.
        name: '%(namespace)s'
        // parent selector for all template objects. This is a used as a
        // wrapper on your dom. anything within DOM.class will be treated
        // as a template. All DOM nodes with this class will be hidden on
        // load and DOM elements within (to be used as templates) will
        // be cloned for templating use.
        , namespace: '.template'

        // Clone the element from the DOM selector element before use.
        // This is the default use of the Templater to ensure a
        // basic format can be resused without affecting inheritence.
        //
        // If false, the elements on the screen will be altered in place, thusly
        // the namespace `hidden` property should probably be false.
        , clone: true

        // every DOM element with the `namespace` selector will be hidden on
        // load. All hidden children DOM elements are treated as Template
        // entites available for use.
        //
        // This is particularly useful when `clone` is true. As hidden children
        // are cloned and placed on the screen allowing for resuse of the
        // same selector.
        //
        // If hidden is false, all selecable DOM elements wil be seen visible.
        // It may be prudent to set this false, if clone is false
        , hidden: true

        // target element provides the selector to place the template object
        // when cloned from the chosen selector.
        // The target is by default `undefined`, as this value is provided
        // through the API `Template().appendTo('selector')`
        //
        // Passing a target selector initally allows the selector provided
        // to the toObject() method to be omited.
        // Additionally, applying a target can *cache* a
        // target to a selector, providing a permenant
        // endpoint to Template elemetnts
        , target: undefined

        // pass a data object to bind to. Unlike the formatter
        // arguments,
        , data: undefined
    };

    Template = Application.Component(Application.Basic, {
        constructor: function(selector){
            this.selector = selector;
        }
    });

    Application.Template = Template;
    Application.prototype.Template = Template;

    return;

    /*
     <div class="templates hidden">
         <div class="calendar">
             <div class="month-cell" id='{{ id }}'>
                 <div class="date">{{ date }}</div>
             </div>
         </div>
     </div>
    */

    //  Use a DOM template instantly
    var template = new Template('.calendar .month-cell');


    // Define a template based on a DOM template
    app.template.define('monthCell', '.calendar .month-cell');
    // Use a defined Template
    var template = new app.template.monthCell();


    // Application.template.calendarCell('month');
    app.template.define('calendarCell', function(key){
            // 'calendar .month-cell'
        return 'calendar .%(key)s-cell'
    });

    // Application.template.calendarCell('month');
    app.template.define({

        // master template containers.
        // littered throughout your DOM.
        namespace:  'templates'

        // Namespaced DOM entities
        // should be hidden (using CSS)
        , hidden:   true

        // the name of your template, to
        // assign to the Application.template
        // space.
        , name:     'calendar'

    }, {
        day:        '.calendar .dates .day-cell'
        , week:     '.calendar .dates .week-cell'
              //    '.calendar .dates .month-cell'
        , month:    '.calendar .dates .%(key)s-cell'
        , year:     '.calendar .dates .%(key)s-cell'
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
    app.template.define('calendar', '.calendar .dates .%(key)s-view');
                     // 'calendar', '.calendar .dates .month-view'
    // Use a defined Template
    var template = new app.template.calendar('day');
    var template = new app.template.calendar('week');
    var template = new app.template.calendar('month');
    var template = new app.template.calendar('year');


})($);
