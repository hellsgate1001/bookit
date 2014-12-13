
;(function(MainApp){

    // Personal scope to keep an eye on reapplying formatters.
    var implemented = [];

    // http://www.collectionsjs.com/
    var FormatterMixin = Application.Class({

        formatters: {
            date: {
                _format: function(){
                    // recieve many arguments to create a string for the
                    // format.
                    var flattenedString = Array.prototype.slice.call(arguments, 1).join(' ');
                    // Be the string or a default.
                    var format = flattenedString.length > 0 ? flattenedString : 'MMM DD, YYYY';
                    return format
                }

                , read: function(value) {
                    var format = this._format.apply(this, arguments)
                    return moment(value).format(format)
                }

                , publish: function(value){
                    var format = this._format.apply(this, arguments);
                    var date = Date.parse( value );

                    return date; //moment(date).format(format);
                }
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

    MainApp.mixins.FormatterMixin = FormatterMixin;
    MainApp.prototype.mixins.FormatterMixin = FormatterMixin;
    MainApp.FormatterMixin = FormatterMixin;

})(Application);

;(function(MainApp){

        // Where to put all the user created templates ready for use
        // within the ready API.
    var userspace   = 'create'
        , viewspace = 'view'
        , staticspace = 'static'
        , parent    = MainApp.prototype.template
        , parentalUserSpace
        , parentalViewSpace
        , parentalStaticSpace
        ;

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

    var integrate = function(App) {

        // Space to put all user defined templates.
        if( !parent[userspace] ) parent[userspace] = {};
        // A location for generated views;
        if( !parent[viewspace] ) parent[viewspace] = {};
        if( !parent[staticspace] ) parent[staticspace] = {};
        // Extend the native api
        parentalUserSpace = parent[userspace];
        parentalViewSpace = parent[viewspace];
        parentalStaticSpace = parent[staticspace];

        this.template.define = applicationExtender;
        this.template.defineStatic = staticApplicationExtender;
        this.template.get = getTemplate;

        // Application.Template = Template;
        // this.Template = Template;
        Application.Template = ModelTemplate;
        this.Template = ModelTemplate;

    }
    /*
     A Template can be called in a number of ways,

        new Template(selector <String>)
        new Template(name <String>, selector <String>)
        new Template(space <Object>)
     */
    Template = Application.Component(Application.Basic, {
        type: 'Template'
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
                var d = Application.extend({} , this.space(), this.data() || {}, { selector: _selector });
                var str = sprintf( this.internalSelectorTemplate, d);
                // Strip a pre space.
                if( str[0] == ' ') return str.slice(1)
                return str;
            }
        }

        , element: function(e){
            // Return the element defines by the selector; this
            // will be the original and not a template or clone element.
            // Altering this element, will result in the bound elements
            // to change.
            if(e !== undefined) {
                this._element = e;
                return this;
            };

            if(this._element === undefined) {
                // never set, lets pick a dynamic one.
                // This is a simple combination of the getDOM
                // and the current selector.
                var element = this.getDOM( this.selector() );
                return element;
            }

            return this._element;
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

            if( value !== undefined ) {

                if( it(value).is('string') ) {
                    return this._data[value]

                } else {
                    this._data = value;
                    return this;
                }
            }

            return this._data || space.data;
        }

        , target: function target(value){
            if(value !== undefined) {
                this._target = value;
                return this;
            }
            var ta = this._target || space.target;

            if( ta === undefined ) {
                return this.element()
            }
            return ta
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
            create = (create === undefined)? false: create;
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
            this._node = create ? false: this._node;

            // null, undefined, false, 0
            if( !this._node ) {
                console.log("generate new node", data.name)
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
    });


    /**
     * A ModelTemplate works in a very similar structure to a Template. The
     * ModelTempalte binds the DOM entity to a `model` object within the
     * class. The closely wrapped `data()` method can care for the model;
     * of which is bound to the in view DOM element.
     *
     * The in view DOM elements can are within `models`.
     *
     * The model template will not generate a new node natually (as like the Template class).
     * Instead the default target is the `element()` or the element targeted with the
     * `selector()`
     *
     * The ModelTemplate does not target the `.template` namespace this
     * has been removed; in favour of a cleaner `selector()` for the modeled
     * object.
     *
     * Usage:
     *      v = new ModelTemplate('.date-input-container')
     *      v.toView({ date: Date.parse('yesterday') })
     *
     *
     *
     * data is wrapped through to the view for
     * clever object updates
     *
     * app.template.view.apples.data('date', Date.parse('yesterday') )
     *
     * If the same template is called again, the data is updated and the template
     * doesnt change.
     *
     * @return {[type]} [description]
     */
    ModelTemplate = Application.Component([ Template
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

            /*
            By overriding the internal data object; rather than an
            internally scoped element; the api easily exposes the overrides the
            model has performed.
             */
            this._data = {
                namespace: ''
            };

            this.constructor.$super.apply(this, arguments);

        }

        /*
         data is wrapped through to the view for
         clever object updates

             app.template.view.apples.data('date', Date.parse('yesterday') )

         If the same template is called again, the data is updated and the template
         doesnt change.

         */
        , data: function(value){
            // write the model if the data changes;
            var d= this.constructor.$super.prototype.data.apply(this, arguments);

            if(value !== undefined) {
                if( this._data.namespace === undefined ) {
                    this._data.namespace = ''
                }

                this.dataToModel(this._data);

                return this;
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
            // Passing an object only, binds the current view element to the data
            // provided. The data Provided is pushed into the view data.
            var dom
                , d
                , view
                ;

            if( arguments.length === 0
                || arguments.length === 1 ) {
                dom = this.element();
                d = target || this.data();
            } else {
                if( this.view !== undefined
                    && create !== true ) {
                    // new data
                    view = this.view
                    for(var k in data) {
                        this.view.models[k]=data[k]
                    }
                } else {

                    dom = this.constructor.$super.prototype.toView.apply(this, arguments);
                    d = data.options || data;
                }

            };

            view = this.view || this.bind(dom, d);
            return view.els;
        }

        , name: function(n){
            var n = this.constructor.$super.prototype.name.apply(this, arguments);
            if( n === null) {
                return this.data('name')
            }
            return n
        }
    });

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
                    // console.log("specialSelector", selector);
                } else {
                    // console.log("Selector isn't string... ")
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
                if(key in self.templates) return self.templates[key];

                try {
                    var dynamicSelector = self.templates.selector({key: key});
                    return dynamicSelector;
                } catch(e) {
                    console.error(e.stack)
                    throw new Error(e)

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
    /*
     return a function of which returns the initially passed
     template;

     This acts as an easy referer to pass a template method recevier.
     */
    var templateReturn = function (templates, space){

        // an object containing a template for each key.
        var hook = new TemplateHook(templates);
        return hook;
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

        if(_space.name !== undefined) {
            var d = {
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
            };

            parentalUserSpace[_space.name] = (function(){

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
            }).apply(d)

            d.method = parentalUserSpace[_space.name];
            return d
        }

        return {
            space: _space
            , parent: parent
            , method: parent[_space.name]
        }

    }

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


    /*
     Generating a new template is useful for implementing model bound copies.
     But you may wish to model bind an already implemented view.
     By defining a static template a single state will be returned
     instaf od a newly generated model.
     */
    var staticApplicationExtender = function(space, definition, options){
        var d = applicationExtender(space, definition, options);
        var defaults = {};

        parentalStaticSpace[d.space.name] = function staticTemplate(name, obj) {
            var template = d.method.apply(this, arguments);
            if( arguments.length == 1 ){
                obj=name;
                name = d.space.name;
            }

            return runTemplate(name, template, obj)
        }

        d.initialize = function(options) {
            var _options = Application.extend({}, options || {}, defaults);
            var template = d.method()
            d.instance = runTemplate(d.space.name, template, _options)
            return d
        }

        d.init = d.initialize

        return d;
    }

    var runTemplate = function(name, view, obj){

        // putting the object into the data (rather than pushing it
        // to the view model) ensures the data can found a little easier.
        // The data is written to the bound view as `model` and changes
        // to data() or model will bind to both.
        view.data(obj);

        // If you were to pass the object to the view, the data
        // is only visible to the bound view `model`, not the
        // Template class `data()`
        view.toView();

        parentalViewSpace[view.selector()] = view;

        if( !(name in parentalViewSpace)  ) {
            // Implement the external name.
            parentalViewSpace[name] = view;
        }

        return view
    }

    /*
     Get a template defined for creation. Passing the name only will return
     the new template method ready to call. Passing additional arguments will
     return a rendered template.

        fooTemplate = app.template.get('foo')
        // => function(){}
        var foo = new fooTemplate('args')
        foo.toView()

        fooTemplate = app.template.get('foo', 'args')
        // => template<Template:foo>
        fooTemplate.toView()

     Pass a selector to the get method to define an instant template, bound to
     optional data. The templated object is edited in place and toView is called
     immediately.

        app.template.get('.selector');
        app.template.get('.selector', { foo: 'bar'});
        // => Template
        app.template.get('.selector', 'name', {})

     If the name passed exists as a static template, the static definition will
     be called and returned.
     If a static definition is found and a secondary name was passsed.

     This gets an already existing 'date' static template, defined as 'apple'
     as a reference and pass the model object:

        app.template.get('date', 'apple', { date: Date.parse('yesterday') })

     */
    var getTemplate = function(name /* args */) {

        // If name is a selector and the selector is not
        // a defined template and the $(selector) exists,
        // wrap the element with a ModelView and store is as a static.
        //
        var template;
        var definition;
        var args = Array.prototype.slice.call(arguments, 1);

        if( name in parentalStaticSpace ) {
            definition = getStatic.apply(this, arguments);
        } else if( name in parentalUserSpace ){
            // template = parentalUserSpace[name].apply(this, args);
            definition = getDefined.apply(this, arguments);
        } else {
            // Passing the name of a useable API defined will return
            // the Template ready for view.
            if( $(name).length == 0 ) {
                console.error('DOM selector', name, 'does not exist');
                return
            }

            definition = getNewly.apply(this, arguments);
        }

        return runTemplate(definition.name, definition.template || definition, args);
    }

    var getStatic = function(name, staticName, obj){
        var o = arguments[1]
        var staticName = arguments[0];
        var template;

        if(arguments.length == 3) {
            // 'string', obj
            o = arguments[2]
            // Replace the `name` of which defined the space within the
            // parentalViewSpace.
            // this ensures if a user has passed a name, it should be defined
            // under new namel not the default for same name space
            staticName = arguments[1];

            // Return the static template.
            if( staticName in parentalViewSpace) {
                return returnDefined(parentalViewSpace[staticName], undefined, name, staticName, o)
                return parentalViewSpace[staticName];
            }
        }

        template = parentalStaticSpace[ staticName ].apply(this, [name, o]);
        return {
            template: template
            , method: parentalStaticSpace[ staticName ]
            , name: name
            , obj: obj
        }

        return returnDefined(template, method, name, staticName, obj)
    }

    var getDefined = function(name, staticName, obj){
        var args = Array.prototype.slice.call(arguments, 1);
        parentalUserSpace[name].apply(this, args);
        return returnDefined(
            parentalUserSpace[name].apply(this, args)
            , parentalUserSpace[name]
            , name
            , staticName
            , args
            )
    }

    var getNewly = function(name, staticName, obj) {
        var obj = arguments[1];
        var _name = name;

        var getFunction = function(name, selector){
            /*
             new Template(selector <String>)
             new Template(name <String>, selector <String>)
             new Template(space <Object>)
             */
            var template= new ModelTemplate(name, selector);
            return template;
        };

        if(arguments.length == 3) {
            obj = arguments[2];
            _name = arguments[1]
        }

        // As this is a selector, only a single model template
        // is implemented.
        if( parentalViewSpace[_name] ) {
            if( obj !== undefined
                && it(obj).is('object') ) {
                parentalViewSpace[_name].data(obj);
            }

            return parentalViewSpace[_name];
        }

        template = new ModelTemplate(name);
        return returnDefined(
            template
            , getFunction
            , name
            , _name
            , obj)
    }

    var returnDefined = function(template, method, name, staticName, obj){
        return {
            template: template
            , method: parentalStaticSpace[ staticName ]
            , name: name
            , obj: obj
        }
    }

    return integrate.call(Application.prototype, MainApp);
})(Application);
