module.exports = function(grunt) {

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    filename: '<%= pkg.filename %>-<%= pkg.version %>'

    , copy: {
        main: {
            files: [
                {
                    expand: true
                    , cwd: 'src/cotton/vendor/required/'
                    , src: ['vendor/jquery-1.11.0.min.js'
                        , 'vendor/jquery.clickout.js'
                        , 'vendor/crel/crel.min.js'
                        , 'vendor/jsface/dist/jsface.all.min.js'
                        , 'vendor/rivets/dist/rivets.min.js'
                        , 'vendor/collection.min.js'
                    ]
                    , dest: 'dist/vendor/'
                }
            ]
        },
    }

    , concat: {
        options: {
            separator: ';'
        }
         , vendor: {
            src: [
                'dist/vendor/**/*'
            ]
            , dest: 'dist/uncompressed/vendor.js'
        }

        , application: {
            src: [
                'components/Application.js'
                , 'components/collection.min.js'
                , 'components/**/*.js'

            ]
            , dest: 'dist/uncompressed/app.js'
        }

        , site: {
            src: [
                'plugins.js'
                , 'main.js'
                , 'venue_calendar.js'

            ]
            , dest: 'dist/uncompressed/site.js'
        }

    }

    , uglify: {
        options: {
            banner: '/*! <%= filename %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        }

        , dist: {
            files: {
                // 'dist/min/vendor.min.js': ['<%= concat.vendor.src %>']
                'dist/min/app.min.js': ['<%= concat.application.src %>']
                , 'dist/min/site.min.js': ['<%= concat.site.src %>']
            }

        }

        // , browser: {
        //     options: {
        //         banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
        //         , compress:
        //         {
        //             drop_console: true
        //         }
        //         , sourceMap: true
        //         , sourceMapName: 'dist/<%= filename %>.map'
        //     }
        //     , files: {
        //         'dist/<%= filename %>.js': ['<%= concat.cottonduck.src %>']
        //     }
        // }
    }

    , browserify: {
        test_bundle: {

            files: {
                'test/vendor-src.js': [
                    '<%= concat.vendor.src %>'
                ]
                , 'test/application.js': [
                    '<%= concat.application.src %>'
                ]
                , 'test/requires.js': [
                    'test/browserify.conf.js'
                ]

            },

            options: {

            }
        }
    // targets here
    }
    , qunit: {
        all: ['test/**/*.html']
    }
    , karma: {
      unit: {
        configFile: 'karma.conf.js'
        , autowatch: true
      }
    }
    , jshint: {
        files: ['<%= concat.application.src %>', '<%= concat.site.src %>']
        ,options: {
            // options here to override JSHint defaults
            globals: {
                jQuery: true,
                console: true,
                module: true,
                document: true,
                // reporter: require('jshint-stylish')
            }
        },
    }
    , watch: {
        files: ['<%= jshint.files %>', 'Gruntfile.js'],
        tasks: ['qunit']
    }
});


// grunt.loadNpmTasks('grunt-karma');

// grunt.loadNpmTasks('grunt-croc-qunit');

//grunt.loadNpmTasks('grunt-docco');
grunt.loadNpmTasks('grunt-contrib-copy');
// grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-qunit');
grunt.loadNpmTasks('grunt-browserify');

grunt.loadNpmTasks('grunt-contrib-watch');

grunt.registerTask('test', ['browserify', 'qunit']);
grunt.registerTask('default', ['copy', 'concat', 'test', 'watch']);
grunt.registerTask('build', ['copy', 'concat', 'uglify']);
grunt.registerTask('deploy', ['build', 'test']);
};
