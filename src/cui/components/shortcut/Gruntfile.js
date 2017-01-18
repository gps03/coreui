module.exports = function (grunt) {
    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dist: [
                'dist/**/*.*',
            ],
        },

        copy: {
            scripts: {
                expand: true,
                cwd: 'src/js',
                src: ['**/*.*'],
                dest: 'dist/js',
                filter: 'isFile',
            },
            tests: {
                expand: true,
                cwd: 'src/tests',
                src: ['**/*.*'],
                dest: 'dist/tests',
                filter: 'isFile',
            },
            // Copy docs to local dist folder for initial project-level grunt task
            docs: {
                expand: true,
                cwd: 'src/docs',
                src: [
                        '**/*.*',
                        '!**/*.md',
                     ],
                dest: 'dist/docs',
                filter: 'isFile',
            },
            // Copy docs to root folder when using `grunt watch` so they can be viewed in the browser
            docsToRoot: {
                expand: true,
                cwd: 'dist/docs',
                src: [
                        '**/*.*',
                        '!**/*.md',
                     ],
                dest: '../../../../docs/components/shortcut',
                filter: 'isFile',
            },
        },

        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'nested', // Options: nested, compressed
            },

            main: {
                files: {
                    'dist/scss/shortcut.scss': ['src/scss/shortcut.scss']
                },
            },
        },

        // https://github.com/gruntjs/grunt-contrib-jshint
        // Supported options: http://jshint.com/docs/
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                browser: true,
                unused: 'vars',
            },
            files: [
                'src/js/**/*.js',
            ],
        },

        md2html: {
            docs: {
                options: {
                    layout: 'src/cui/docs/src/assets/templates/default.html',
                    highlightjs: {
                        enabled: true,
                        style: 'github',
                        compressStyle: true,
                    },
                    gfm: true,
                },
                files: [{
                    expand: true,
                    cwd: 'src/docs/',
                    src: ['**/*.md'],
                    dest: 'dist/docs',
                    ext: '.html',
                }],
            },
        },

        watch: {
            options: {
                livereload: 35728,
                interrupt: true,
            },

            styles: {
                files: [
                    '*.scss', // Settings file
                    'src/**/*.scss',
                ],
                tasks: [
                    'sass',
                    'copy',
                ],
            },

            scripts: {
                files: [
                    'src/**/*.js',
                ],
                tasks: [
                    'jshint',
                    'copy',
                ],
            },

            docs: {
                files: [
                    'src/docs/**/*.*',
                ],
                tasks: [
                    'md2html',
                    'copy:docs',
                    'copy:docsToRoot',
                ],
            },
        },

        intern: {
            functional: {
                options: {
                    cwd: './',
                    runType: 'runner',
                    config: 'tests/intern',
                    reporters: [ 'Console' ],
                    basePath: './tests/shortcut/functional/',
                    functionalSuites: [
                        'shortcut',
                    ],
                    tunnel: 'NullTunnel',
                    environments: [{
                        browserName: 'chrome',
                    }],
                },
            }
        },
    });

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Load local tasks in the task folder
    grunt.loadTasks('tasks');

    // Default task(s)
    grunt.registerTask('default', ['jshint', 'clean', 'sass', 'md2html', 'copy']);

    // Development
    grunt.registerTask('dev', ['default', 'watch']);
};
