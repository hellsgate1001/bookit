
;(function(){

    // Personal scope to keep an eye on reapplying formatters.
    var implemented = [];

    // http://www.collectionsjs.com/
    var FormatterMixin = Application.Class({

        formatters: {
            date: function(value){
                // recieve many arguments to create a string for the
                // format.
                var flattenedString = Array.prototype.slice.call(arguments, 1).join(' ');
                // Be the string or a default.
                format = flattenedString.length > 0 ? flattenedString : 'MMM DD, YYYY';
                return moment(value).format(format);
            }

            , day: function(number){
                return moment.weekdays(number)
            }
            , month: function(number) {
                return moment.months(number)
            }
        }

        , addFormatters: function(){
            var name;

            for( name in this.formatters ) {
               if( this.formatters.hasOwnProperty(name) && implemented.indexOf(name) == -1 ) {
                    if( rivets.formatters[name] ) {
                        throw new Error('Formatter already exists: ' + name)
                    }

                    implemented.push(name);
                    rivets.formatters[name] = this.formatters[name];
                }
            }
        }
    });

    Application.mixins.FormatterMixin = FormatterMixin;
    Application.prototype.mixins.FormatterMixin = FormatterMixin;
    Application.FormatterMixin = FormatterMixin;
})();

;(function($){

    // Configurations for a space object.
    var space = {
        // name selector for the passing object.
        // by default the selector the Template namespacespace definition.
        selector: '%(namespace)s'

        // The name to be pushed into the application parent context
        , name: undefined

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
        type: 'Template'
        /*
         A Template can be called in a number of ways,

            new Template(selector <String>)
            new Template(name <String>, selector <String>)
            new Template(space <Object>)
         */
        , constructor: function(name, selector, app, placeholder){

            if( name !== undefined
                && selector === undefined ) {
                selector = name;
                name = null;
            }

            if( (name !== undefined) && it(name).is('object') ) {
                // a space has been passed, merge is with the space and save.
                this.space(name);
            } else {
                this.name(name)
            }

            this.app = app
            this.selector(selector);
            this.placeholder(placeholder)

        }

        /*
         return a relative copy of the space object, complete with corrected
         overrides.
         Passing an object to the space() method, these methods will be
         baked into the space object
         */
        , space: function(key, value){

            if(arguments.length == 0) {
                return this._space || (this._space = Application.extend({}, space) );
            } else if( arguments.length == 1 ) {
                // passed a string.
                if( it(key).is('string') ) {
                    return (this._space || space)[key]

                } else if( it(key).is('object') ) {
                    // Merge and bake.

                    // Make a new space by duplicating the space
                    // object (current or default) and
                    // baking it back.
                    // The passed `value` is an object merging on top.

                    this._space = Application.extend({}, this._space || space, key);

                }
            } else if ( arguments.length == 2) {
                // user has passed a key value pair. Push this into the
                // changed space.
                var mo = {}
                mo[key] = value;
                this._space = Application.extend({},  this._space || space, mo);
                return this;
            }
        }

        // An internal selector is made after when a selector is needed
        // to find a template. The internalTemplateSelector is a combination
        // of the internal combination of values contatentated with the
        // created selector.
        , internalSelectorTemplate: '%(namespace)s %(selector)s'

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
            var _s = this._selector || space.selector;
            if(value !== undefined) {
                 if( it(value).is('object') ) {
                    return sprintf(_s, value);
                }
                this._selector = value;
                return this;
            }

            if( it(_s).is('string') ) {
                // we can template a string.
                var _selector = sprintf(_s, this.space() );
                // Create the _selector
                return sprintf( this.internalSelectorTemplate
                    , Application.extend({}
                        , this.space()
                        , { selector: _selector })
                    );
            }
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
                // Check if the name has already been changed
                if( this.space('name') != space.name ) {
                    // The name has been changed
                    if( this.app ) {
                        var same = this.app[this.space('name')]() == this;
                        if(same) {
                            this.app[value] = templateReturn(this);
                            // Null not undefined to mark a deletion.
                            this.app[this.space('name')] = null;
                        }
                    }
                }
                // check if a parent exists
                // strip and change the parent if required.
                this.space('name', value);
                return this;
            };

            return this.space('name');
        }

        , namespace: function namespace(value){
            if(value !== undefined) {
                this.space('namespace', value);
                return this;
            }
            return this.space('namespace');
        }

        , hidden: function hidden(value){
            if(value !== undefined) {
                this.space('hidden', value);
                return this;
            }
            return this.space('hidden');
        }

        /**
         * A placeholder object can be set for the outbound template
         * data placeholders. Each placeholder can be overriden from
         * the internal space value, or passed options. If a
         * placeholder is set `null`, the is a required field and
         * must not be null before use.
         */
        , placeholder: function hidden(value){
            if(value !== undefined) {
                this.space('placeholder', value);
                return this;
            }
            return this.space('placeholder');
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
                this.space('html', value);
                return this;
            }

            return this.space('html') || this.toHTMLString();
        }

        , data: function data(value, kv){

            if( kv !== undefined) {
                this._data[value] = kv
                return this;
            };

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

        , toView: function toView(target, data, create) {
            // Get the DOM element to push to.
            target = target || this.target();
            data = data || this.data();
            var node;
            // be false or create;
            create = (create === undefined)?false:create;
            if( this.clone() ) {
                node = this.node(data, create)
            } else {
                // Get or generate a new node based upon all internals.
                node = this.node(data)
            }

            var $node = $( node ).appendTo( target );
            $node.data('template', this)
            return $node;
        }

        // Bake and return a html node; to be used as a single entity
        // for the DOM
        // If data is passed to this method; the data is stored into the
        // data object if the data object is undefined.
        , node: function(data, create){
            create = (create === undefined)? false: create;

            if( this.data() === undefined ){
                this.data(data);
            } else if(data && it(data).is('object') ) {
                // rewrite the node data
                this._data = Application.extend({}, this._data, data);
                // nully.
                this._node = false;
            } else if(data && it(data).is('boolean') ) {
                if( data === true ) {
                    this._node = false;
                }
                // false if create is false;
            }

            // be false if clone() === true or create === true;
            this._node = create? false: this._node;

            // null, undefined, false, 0
            if( !this._node ) {
                console.log("generate new node")
                var s = $( this.toHTMLString( this.data() ) );
                if(s.length >= 1) {
                    this._node = s[0]
                }
            }

            return this._node;
        }

        , getDOM: function(selector){
            // Pick a dom element off the screen based upon the
            // value provided.
            var $el = $(selector);
            if($el.length <= 0) {
                throw new Error('Element does not exist: ' + selector);
                return false;
            }
            if( $el.length > 0 ) {
                return $el[0];
            }
        }

        , toHTMLString: function(data){
            // Convert the current HTML or selector
            // to a copy HTML string and return.
            var html;

            if( this.selector() ) {
                var dom = this.getDOM(this.selector());
                if( it(dom).is('object') ) {
                    html = dom.outerHTML;
                }

            };

            if(html === undefined ){
                html = $(this.space('html'))[0].outerHTML;
            };

            // Fetch the placeholder object, initally provided through the
            // API. This defines options to be set for the template.
            // All options within the application will override the initial
            // placeholder object.
            var placeholder = this.placeholder() || {};
            var d = Application.extend( placeholder , this.data() )

            // check data for null
            var prop;
            data= data || {}
            for (prop in d) {
                if (d.hasOwnProperty(prop)) {
                    if (d[prop] === undefined && (data[prop] === undefined || !(prop in data)) ) {
                        throw new Error('Missing placeholder property: ' + prop);
                    }
                }
            }

            var data = Application.extend(d, data);
            var nhtml = html;

            if( html ) {
                nhtml = sprintf(html, data);
            };

            return nhtml;
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

    /*
     return a function of which returns the initially passed
     template;

     This acts as an easy referer to pass a template method recevier.
     */
    var templateReturn = function (templates, space){
        // return a closed scope function with the template as the
        // scope only.
        var TemplateHook = function TemplateHook(){
            var self = this;

            var init = function(templates, space) {
                this.templates = templates;
                this.space;
                this.hook = this.get;

                if( this.templates.selector
                    && it( this.templates.selector ).is('function') ) {
                    this.hook = this.specialSelector;
                };
            }

            this.specialSelector = function(){
                // Perform handling of the user function;
                if( self.templates
                    && it(self.templates).is('function') ) {
                    var ret = self.templates.apply(this, arguments);
                    if( it(ret).is('string') ) {
                        return new Application.Template(self.space.space, self.space.selector[prop], self.space.app);
                    }
                } else {
                    // debugger;
                    // self.templates.selector({ key: 'day' })
                    var selector = self.get.apply(this, arguments);

                    if( it(selector).is('string') ) {
                        // debugger;
                        console.log("specialSelector", selector);
                    } else {
                        console.log("Selector isn't string... ")
                        selector =  ( (_space) ? _space.selector: undefined) || (self.space? self.space.selector[prop]: selector._selector);
                    }

                    var space = selector.space || (self.space ? self.space.space: false);
                    var app = selector.app || space.app || false;
                    var _space = space;

                    if( self.hasOwnProperty('get') ) {

                        var parent = self.get();

                        if( space === false) {
                            _space = parent.space()
                        };

                        if( app === false) {
                            app = parent.app
                        }
                    }

                    if( it(space).is('function') ) {
                        _space = space();
                    }

                    return new Application.Template(_space, selector, app);
                }
            }
            // serves the template to get.
            this.get = function templateSelector(key){

                if(key !== undefined) {
                    if(key in self.templates) {
                        return self.templates[key];
                    } else {
                        try {
                            var dynamicSelector = self.templates.selector({key: key});
                            return dynamicSelector;
                        } catch(e) {
                            console.error(e.stack)
                            throw new Error(e)

                        }

                    }

                }

                if(self.templates.length == 1) {
                    // return the only template
                    return self.templates[0]
                };

                return self.templates;
            };

            return init.apply(this, arguments);
        }

        // an object containing a template for each key.
        var hook = new TemplateHook(templates);
        return hook;
    };

    var subTemplateReturn = function(space) {
        var spaces = {}
            , prop
            ;

        for (prop in space.selector) {
            spaces[prop] = new Template(space.space, space.selector[prop], space.app);
            spaces[prop].space('key', prop);
        };

        return templateReturn(spaces, spaces);
    };

    var applicationExtender = function(name, selector, options){
        var spacer
            , defines
            // Set of defaults for the template.
            , options
            ;

        if( it(name).is('string') ) {
            spacer = { name: name };
        } else {
            spacer = name;
        }

        // define the new type as placeholders; using the inbound options
        // object to be a configuration for the basic application template
        var _space = Application.extend({ placeholders: options }, space, spacer);
        var parent = Application.prototype.template;
        // Extend the native api

        if(_space.name !== undefined) {
            parent[_space.name] = (function(){

                if( it( this.selector ).is('object') ) {
                    // object selector.
                    var hook = subTemplateReturn(this);
                    hook.get.template = hook;
                    return hook.get;
                 } else if( it( this.selector ).is('function') ) {
                    // object selector.
                    var hook = subTemplateReturn(this);
                    hook.get.template = hook;
                    return hook.get;
                } else {
                    var template = new Template(this.space, this.selector, this.app, this.options);
                    /* Defining a new function to call - this is treturned
                    back to be implemented on the application
                    */
                    var hook = templateReturn(template);
                    hook.hook.template = hook;
                    return hook.hook;
                }
            }).apply({
                // for parental checking. Pass a reference
                // of the parent object. The Template should
                // be able to typecheck against itself for existance
                //
                // pheudocode:
                //      this.app[this.name]() == this;
                app: parent
                , space: _space
                , selector: selector
                , options: options
            })
        }

    }

    Application.prototype.template.define = function(space, definition, options){
        return applicationExtender(space, definition, options)
    }

    Application.Template = Template;
    Application.prototype.Template = Template;

    ModelTemplate = Application.Component([ Application.Template
        , Application.mixins.FormatterMixin
    ], {
        type: 'ModelTemplate'
        , Extends: Template
        , options: {
            /*
             Define the string to detect data values from the HTML element.
             <div rs-value='1' />
             will be detected as a model value upon creation.
             */
            prefix: 'rs'
            // , templateDelimiters: ['{', '}']
        }
        , constructor: function(){
            // Do super.
            this.constructor.$super.apply(this, arguments);
        }

        , data: function(value){
            // write the model if the data changes;
            d = this.constructor.$super.prototype.data.apply(this, arguments);

            if(value !== undefined) {
                this.dataToModel(this._data)
            }

            return d;
        }

        , dataToModel: function(data) {
            // push the data into the model;
            //
            if(!this.model) {
                this.model = {};
            };

            var newdata = Application.extend(this.model, this.data(), data);

            for (var prop in newdata) {
                if (newdata.hasOwnProperty(prop)) {
                    this.model[prop] = newdata[prop]
                }
            }
            return this.model;
        }

        , configure: function(options) {
            // make some basic options for the rivets configuration
            this.options = Application.extend(this.options, options);
            // finalise the model, passing the options (for later reference
            // in the html)
            var model = this.dataToModel(this.options);

            // Call the formatters mixin
            this.addFormatters();

            // configure it.
            rivets.configure(this.options);

            return model;
        }

        , bind: function(dom, configuration){
            if( dom !== undefined && configuration === undefined) {
                // swap.
                // Either
                // bind(config)
                // bind(dom, config)
                configuration = dom;
                dom = this.constructor.$super.prototype.node.apply(this, [configuration]);
            };

            // pass the new configuration to find to.
            // new options are set, the model is writen
            // and rivets is configured
            var model = this.configure(configuration);
            // Perform the bind. to this (a new? node)
            this.view = rivets.bind(dom, model);
            this.model = this.view.models;

            return this.view;
        }

        /* Overwrites the default node() method. When a new node is created;
        bindings are assigned to the model. */
        , toView: function toView(target, data, create) {
            var dom = this.constructor.$super.prototype.toView.apply(this, arguments);
            var view = this.bind(dom, data.options || data);
            return view.els;
        }
    });



    Application.Template = ModelTemplate;
    Application.prototype.Template = ModelTemplate;

    return;
})($);
