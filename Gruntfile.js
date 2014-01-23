/*
 * grunt-diff
 * https://github.com/aioutecism/grunt-diff
 *
 * Copyright (c) 2014 aioute Gao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        clean: {
            tests: ['tmp'],
        },

        diff: {
            default_options: {
                options: {
                },
                files: {
                    'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
                },
            },
            custom_options: {
                options: {
                    separator: ': ',
                    punctuation: ' !!!',
                },
                files: {
                    'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
                },
            },
        },

        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['clean', 'diff', 'nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);

};
