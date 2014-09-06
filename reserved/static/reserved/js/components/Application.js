var runApplication = function(){
	(function(){
		var Class = jsface.Class
			, extend = jsface.extend
			, events = {
				ready: []
			}
			, mixins={
				Event: function(){}
			}
			// Has the ready methods been called.
			, _callReady = false

			, globalApplication = null
			;


		Application = Class({
			type: 'Application'
			, Class: Class
			, extend: extend
			, Component: Class
			, constructor: function(name){
				this.name = name || this.type;
				var self = this;
			}

			, template: {
				get: function(selector) {
					// Pick a template from the view. If the template has been used
					// before a cached version may be
					// returned, unless otherwise acclaimed.

					var html = $(selector)[0].outerHTML;
					return html;
				}

				// Create a template to define
				/*
				 Provide a space and a definition of your
				 template.

 				 The `space` is a string or object defining the
 				 functionality of  the template loader. Providing a string
 				 implemnts a function to the global Application.template
 				 object calling a generic template loader, collecting a DOM
 				 element based upon the `definition` selector.
 				 This is optional.

 				 The `definition` is used to select a DOM element from the
 				 `namespace` scope. Any dom element matching the definition
 				 selector will be returned as a Template
 				 Pass a string to match a DOM element within
 				 all `namespace`(".template") instances.
 				 pass an object or function to specify a method
 				 matcher within a parent context.

 				 if the definition is a `function`, it must return
 				 a valid template object.

 				 If an object is provided. The `Application.Template`
 				 implementation will accept a `key` and return a valid
 				 template selector. IF the passed key namr is
 				 not matched within the `definition` object, an error
				 will be raised.

				 */
				, define: function(space, definition){
					var templateLoader = {};

					if( it(space).is('string') ) {
						templateLoader.name = space;
					}
				}
			}
			, mixins: mixins
		});

		Application.Class = Class;
		Application.Component = Class;
		Application.extend = extend;
		Application.mixins = mixins;

		// http://www.collectionsjs.com/
		var CollectionMixin = Application.mixins.CollectionMixin = Application.Class({
			collection: function(){
			}
		})

		var Obj = Application.Component({
			type: 'Basic'
		})

		Application.Basic = Obj;
		Application.prototype.Basic = Obj;

		Application.ready = function(f) {
			if(f !== undefined) {
				events.ready.push(f);
			}
		};

		Application.setGlobal = function(app) {
			/*
			Set the global application into the Application
			context. This should be fetched
			by an application requiring page
			constructs without a user defined app of an Application.

			getGlobal is the antithesis.
			 */
			globalApplication = app
			return globalApplication;
		};

		Application.g = function(){
			return this.getGlobal()
		};

        Application.Str = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            // var name = args.shift()
            return sprintf.apply(this, args);
        }
        Application.prototype.Str = Application.Str

		Application.getGlobal = function(){
			return globalApplication;
		};

		Application.callReady = function() {
			_callReady = true;

			for (var i = 0; i < events.ready.length; i++) {
				// Call function ready method.
				events.ready[i](Application)
			};

			if( window.hasOwnProperty('QUnit')
				&& this.debug === true ) {
				QUnit.start()
			}
		}

		Application.extend = function() {
		    var obj = {},
		        i = 0,
		        il = arguments.length,
		        key;
		    for (; i < il; i++) {
		        for (key in arguments[i]) {
		            if (arguments[i].hasOwnProperty(key)) {
		                obj[key] = arguments[i][key];
		            }
		        }
		    }
		    return obj;
		};

		$(document).ready(function(){
			Application.callReady();
		})
	})()
}

/*
It functionality simplifies type checking.
 */
    /*! sprintf.js | Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license */
    ;(function(e) {
        function r(e) {
            return Object.prototype.toString.call(e).slice(8, -1).toLowerCase()
        }

        function i(e, t) {
            for (var n = []; t > 0; n[--t] = e);
            return n.join("")
        }
        var t = function() {
            return t.cache.hasOwnProperty(arguments[0]) || (t.cache[arguments[0]] = t.parse(arguments[0])), t.format.call(null, t.cache[arguments[0]], arguments)
        };
        t.format = function(e, n) {
            var s = 1,
                o = e.length,
                u = "",
                a, f = [],
                l, c, h, p, d, v;
            for (l = 0; l < o; l++) {
                u = r(e[l]);
                if (u === "string") f.push(e[l]);
                else if (u === "array") {
                    h = e[l];
                    if (h[2]) {
                        a = n[s];
                        for (c = 0; c < h[2].length; c++) {
                            if (!a.hasOwnProperty(h[2][c])) throw t('[sprintf] property "%s" does not exist', h[2][c]);
                            a = a[h[2][c]]
                        }
                    } else h[1] ? a = n[h[1]] : a = n[s++]; if (/[^s]/.test(h[8]) && r(a) != "number") throw t("[sprintf] expecting number but found %s", r(a));
                    switch (h[8]) {
                        case "b":
                            a = a.toString(2);
                            break;
                        case "c":
                            a = String.fromCharCode(a);
                            break;
                        case "d":
                            a = parseInt(a, 10);
                            break;
                        case "e":
                            a = h[7] ? a.toExponential(h[7]) : a.toExponential();
                            break;
                        case "f":
                            a = h[7] ? parseFloat(a).toFixed(h[7]) : parseFloat(a);
                            break;
                        case "o":
                            a = a.toString(8);
                            break;
                        case "s":
                            a = (a = String(a)) && h[7] ? a.substring(0, h[7]) : a;
                            break;
                        case "u":
                            a >>>= 0;
                            break;
                        case "x":
                            a = a.toString(16);
                            break;
                        case "X":
                            a = a.toString(16).toUpperCase()
                    }
                    a = /[def]/.test(h[8]) && h[3] && a >= 0 ? "+" + a : a, d = h[4] ? h[4] == "0" ? "0" : h[4].charAt(1) : " ", v = h[6] - String(a).length, p = h[6] ? i(d, v) : "", f.push(h[5] ? a + p : p + a)
                }
            }
            return f.join("")
        }, t.cache = {}, t.parse = function(e) {
            var t = e,
                n = [],
                r = [],
                i = 0;
            while (t) {
                if ((n = /^[^\x25]+/.exec(t)) !== null) r.push(n[0]);
                else if ((n = /^\x25{2}/.exec(t)) !== null) r.push("%");
                else {
                    if ((n = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(t)) === null) throw "[sprintf] huh?";
                    if (n[2]) {
                        i |= 1;
                        var s = [],
                            o = n[2],
                            u = [];
                        if ((u = /^([a-z_][a-z_\d]*)/i.exec(o)) === null) throw "[sprintf] huh?";
                        s.push(u[1]);
                        while ((o = o.substring(u[0].length)) !== "")
                            if ((u = /^\.([a-z_][a-z_\d]*)/i.exec(o)) !== null) s.push(u[1]);
                            else {
                                if ((u = /^\[(\d+)\]/.exec(o)) === null) throw "[sprintf] huh?";
                                s.push(u[1])
                            }
                        n[2] = s
                    } else i |= 2; if (i === 3) throw "[sprintf] mixing positional and named placeholders is not (yet) supported";
                    r.push(n)
                }
                t = t.substring(n[0].length)
            }
            return r
        };
        var n = function(e, n, r) {
            return r = n.slice(0), r.splice(0, 0, e), t.apply(null, r)
        };
        e.sprintf = t, e.vsprintf = n
    })(typeof exports != "undefined" ? exports : window);



    ;var IT = function(){
        // It class set.
        //
        var self = this;
        this._value = undefined;

        /**
         * IT init method, accepting a value to wrap.
         * @param  {*} value Pass an object to determine it's value
         * @return {IT}       and instance of the IT
         */
        var init = function(value) {
            return this.value(value);
        }

        /**
         * apply and return the value to be tested. This is optionally passed
         * through the instance reaction. This is a chained method.
         * value is optional. If a value is passed, `this` is returned, if no
         * parameters are given, the existing value is returned
         */
        this.value = function(val) {

            if(val !== undefined) {
                this._value = val;
                return this;
            }

            return this._value || this;
        }

        this.data = function(val){

            if(val === undefined) {
                return this._value;
            }

            return this;
        }

        this.toString = function(){
            return this.data().toString()
        }

        /*
        Check an element is another type.
        typeString can be string of name type or type.toString

            it.is(typeString, value);

        typeString should be a string name of a basic type.
        value should be your object.

        returned is a boolean.

            // Can accept string name for the type
            it.is('string', 'foo')
            // can accept cased types
            it.is('Boolean', false);
            // Can accept basic type
            it.is(Number, 1)
         */



        return init.apply(this, arguments);

    };

    var it = function(value) {
        /*
        return an IT(value) chain.
         */
        if(value === undefined) {
            return IT;
        }

        var _it = new IT(value);
        return _it;
    }

    IT.implement = function(name, func){
        it[name] = function(){
            return func.apply(IT, arguments)
        }

        IT.prototype[name] = function(typeString, value) {
            var val = this.value() || value;
            return func(typeString, val);
        }

        IT[name] = it[name];
    }

    IT.extend = function(name, func){
        if( typeof(func) == 'function' ) {
            // call the method, with the extension as an arg.
            var val = func.apply(IT, [ IT[name] ]);
            // The extension passed a new entity back.
            if(val !== undefined) {
                it[name] = val
            }
        }

        IT[name] = it[name];
    }

    /*
        Tests the value against the type, returning true or false
        if the value is the same.

        use the primitive or string representation of as the type string:

            it    .is('Array', [])  == true
            it    .is( Array,  [])  == true
            it()  .is('Array', [])  == true
            it()  .is( Array,  [])  == true
            it([]).is('Array')      == true
            it([]).is( Array)       == true
            (IT)  .is('Array')      == true
            (IT)  .is( Array)       == true
     */
    ;(function(){



        var IS = (function() {
            var self = this;

            self._null = function( a )
            {
                return ( a === null );
            };
            self._undefined = function( a )
            {
                return ( self._null( a ) || typeof a == 'undefined' || a === 'undefined' );
            };

            self._string = function ( a )
            {
                return ( ( a instanceof String || typeof a == 'string' ) && !self._undefined( a ) && !self._true( a ) && !self._false( a ) );
            };
            self._number = function( a )
            {
                return ( ( a instanceof Number || typeof a == 'number' ) && !isNaN( a ) );
            };
            self._boolean = function( a )
            {
                return ( a instanceof Boolean || typeof a == 'boolean' || self._true( a ) || self._false( a ) );
            };
            self._object = function( a )
            {
                return ( ( a instanceof Object || typeof a == 'object' ) && !self._null( a ) && !self._jquery( a ) && !self._array( a ) && !self._function( a ) );
            };
            self._array = function ( a )
            {
                return ( a instanceof Array );
            };
            self._function = function( a )
            {
                return ( a instanceof Function || typeof a == 'function' );
            };

            self._jquery = function ( a )
            {
                return ( typeof jQuery != 'undefined' && a instanceof jQuery );
            };

            self._true = function( a )
            {
                return ( a === true || a === 'true' );
            };
            self._false = function( a )
            {
                return ( a === false || a === 'false' );
            };
            self._percentage = function( a )
            {
                return ( self._string( a ) && a.slice( -1 ) == '%' && self._number( parseInt( a.slice( 0, -1 ), 10 ) ) );
            };

            return self;
        }).apply({});


        IT.implement('is', function is(typeString, value) {

            if(typeString === undefined && value === undefined) return undefined;

            if (value === undefined) {
                console.warn('IT.is type checking against an undefined value');
            }

            var typeName;
            if( typeString.hasOwnProperty('name') ) {
                typeName = typeString.name.toLowerCase();
            } else {
                typeName = String(typeString).toLowerCase();
            }

            if( typeName === undefined || typeName.length == 0
                && IS._string(typeString) ) {
                typeName = String(typeString).toLowerCase()
            }


            var val = value;
            if( value instanceof IT && value.hasOwnProperty('value') ) {
                val = value._value;
            }

            if(IS.hasOwnProperty('_' + typeName)) {

                return IS['_' + typeName](val);
            }

            // Extending IS with the additional properties may
            // not be allows. So use three chars from any type

            return typeString === value;
        });

        // it(element).is.number()     // Is element a Number type
        // it(element).is.boolean()    // is boolean type
        // it(element).is.string()     // is string type
        // it(element).is.undefined()  // is undefined
        // it(element).is.object()     // is an object type
        // it(element).is.array()      // is array type
        // it(element).is.function()   // is function

        IT.extend('is', function(ext){
            var is = ext;

            is.bool                          = IS._boolean;
            is.number            = is.num    = IS._number;
            is.string            = is.str    = IS._string;
            is.undefined         = is.undef  = IS._undefined;
            is.object            = is.obj    = IS._object;
            is.array             = is.arr    = IS._array;
            is.fn                = is.fun    = is.func          = IS._function;
        });

    })();

    /*
        Can check for a key in an object

            var obj = {
                bar: 'apples'
            }
            it.has('bar', obj)   == true;

        Can check for an entity in an array

            var arr = ['george', 'huxely', 'will']
            it.has('will', arr)  == true;

        Can check string types:

            var str = 'The worlds tallest colour!'
            it.has('world', str) == true;

     */
    IT.implement('has', function(typeString, value){
        var val = it(value)

        if( val.is(Object) ) {
            return value.hasOwnProperty(typeString);
        } else if( val.is(Array) || val.is(String) ) {
            return value.indexOf(typeString) > -1;
        }
    });

    IT.implement('asserts', function(typeString, value){

    });

    runApplication()
