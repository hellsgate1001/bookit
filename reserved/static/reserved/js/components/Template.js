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

        constructor: function(name, selector){

            if( name !== undefined
                && selector === undefined ) {
                selector = name;
                name = null;
            }
            this.name(name)
            this.selector(selector);
        }


        /*
         The selector defines the DOM sizzle string to define your
         template object. This element will be used as a base
         format (or template) for future use.

         A chain method to enable throughput
         of this variable. If a value is passed, the variable
         is changed and `this` is returned. Calling the method
         without passing a value will return the variable.
         */
        , selector: function selector(value){
            if(value !== undefined) {
                this._selector = value;
                return this;
            }

            return this._selector || space.selector;
        }

        /*
         A Template can be given a name, allowing you to bake
         the template request into the main application.
         Additionally using the name as a future templating
         variable.

         A chain method to enable throughput
         of this variable. If a value is passed, the variable
         is changed and `this` is returned. Calling the method
         without passing a value will return the variable.
         */
        , name: function name(value){
            if(value !== undefined) {
                this._name = value;
                return this;
            }
            return this._name || space.name;
        }

        /*
         A Template can be given a html, allowing you to
         use a HTML string rather than a DOM sizzle selector.
         if no HTML is defined, this is automatically generated
         from the DOM selector.

         A chain method to enable throughput
         of this variable. If a value is passed, the variable
         is changed and `this` is returned. Calling the method
         without passing a value will return the variable.
         */
        , html: function html(value){
            if(value !== undefined) {
                this._html = value;
                return this;
            }
            return this._html || space.html;
        }

        , data: function data(value){
            if(value !== undefined) {
                this._data = value;
                return this;
            }
            return this._data || space.data;
        }

        , target: function target(value){
            if(value !== undefined) {
                this._target = value;
                return this;
            }
            return this._target || space.target;
        }

        , clone: function clone(value){
            if(value !== undefined) {
                this._clone = value;
                return this;
            }
            return this._clone || space.clone;
        }

        , toView: function toView(target, data) {
            // Get the DOM element to push to.
            target = target || this.target();
            data = data || this.data();

            if( this.clone() ) {
                var html = this.toHTMLString();
            }
        }

        , getDOM: function(selector){
            // Pick a dom element off the screen based upon the
            // value provided.
            var $el = $(selector);
            if( $el.length > 0 ) {
                return $el[0];
            }
        }

        , toHTMLString: function(){
            // Convert the current HTML or selector
            // to a copy HTML string and return.
            if( this.selector() ) {
                var dom = this.getDOM(this.selector());
                return dom.outerHTML;
            } else if( this.html() ) {
                return $(this.html())[0].outerHTML
            }
        }

        // Tne element to push the template
        , target: function target(value){
            if(value !== undefined) {
                this._target = value;
                return this;
            }
            return this._target || space.target;
        }
    });

    Application.Template = Template;
    Application.prototype.Template = Template;

    return;
})($);
