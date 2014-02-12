/*
 * grunt-diff
 * https://github.com/aioutecism/grunt-diff
 *
 * Copyright (c) 2014 aioute Gao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        path : {
            test     : 'test/fixtures',
            tmp      : 'tmp',
            hashFile : '.grunt/grunt-diff/hash.json',
        },

        jshint : {
            all : [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options : {
                jshintrc : '.jshintrc',
            },
        },

        clean : {
            tests : [
                '<%= path.tmp %>',
                '<%= path.hashFile %>',
            ],
        },

        copy : {
            single : {
                src  : '<%= path.test %>/single',
                dest : '<%= path.tmp %>/single',
            },

            pattern : {
                files : [{
                    expand : true,
                    cwd    : '<%= path.test %>/pattern/',
                    src    : [ '**/*' ],
                    dest   : '<%= path.tmp %>/pattern/',
                }],
            },

            chained : {
                files : [{
                    expand : true,
                    cwd    : '<%= path.tmp %>/pattern/',
                    src    : [ '**/*' ],
                    dest   : '<%= path.tmp %>/chained/',
                }],
            },

            multitask1 : {
                src  : '<%= path.test %>/multitask',
                dest : '<%= path.tmp %>/multitask1'
            },
            multitask2 : {
                src  : '<%= path.tmp %>/multitask1',
                dest : '<%= path.tmp %>/multitask2'
            },

            refer : {
                files : [{
                    expand : true,
                    cwd    : '<%= path.test %>/refer/',
                    src    : [ '**/*' ],
                    dest   : '<%= path.tmp %>/refer/',
                }],
            },
        },

        diff : {
            single : {
                src   : '<%= path.test %>/single',
                tasks : [ 'copy:single' ],
            },

            pattern : {
                files : [{
                    expand : true,
                    cwd    : '<%= path.test %>/pattern/',
                    src    : [ '**/*' ],
                }],
                tasks : [ 'copy:pattern' ],
            },

            chained : {
                files : [{
                    expand : true,
                    cwd    : '<%= path.tmp %>/pattern/',
                    src    : [ '**/*' ],
                }],
                tasks : [ 'copy:chained' ],
            },

            multitask : {
                src   : '<%= path.test %>/multitask',
                tasks : [
                    'copy:multitask1',
                    'copy:multitask2',
                ],
            },

            refer : {
                refer : 'copy:refer',
            },

            nonFile : {
                src   : '<%= path.test %>',
                tasks : [],
            },
        },

        nodeunit : {
            tests : [ 'test/*_test.js' ],
        },
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', [
        'clean',
        'diff',
        'nodeunit'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test'
    ]);

};
