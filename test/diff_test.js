'use strict';

var grunt = require('grunt');

var PATH = {
    actual   : 'tmp',
    expected : 'test/fixtures',
};

exports.diff = {
    setUp: function(done) {
        done();
    },
    single: function(test) {
        var actual, expected;
        test.expect(1);

        actual   = grunt.file.read(PATH.actual + '/single');
        expected = grunt.file.read(PATH.expected + '/single');
        test.equal(actual, expected, 'Single file change detected.');

        test.done();
    },
    pattern: function(test) {
        var actual, expected;
        test.expect(2);

        actual   = grunt.file.read(PATH.actual + '/pattern/1');
        expected = grunt.file.read(PATH.expected + '/pattern/1');
        test.equal(actual, expected, 'Matched file change detected: 1.');

        actual   = grunt.file.read(PATH.actual + '/pattern/2');
        expected = grunt.file.read(PATH.expected + '/pattern/2');
        test.equal(actual, expected, 'Matched file change detected: 2.');

        test.done();
    },
    chained: function(test) {
        var actual, expected;
        test.expect(2);

        actual   = grunt.file.read(PATH.actual + '/chained/1');
        expected = grunt.file.read(PATH.expected + '/pattern/1');
        test.equal(actual, expected, 'Chained file change detected: 1.');

        actual   = grunt.file.read(PATH.actual + '/chained/2');
        expected = grunt.file.read(PATH.expected + '/pattern/2');
        test.equal(actual, expected, 'Chained file change detected: 2.');

        test.done();
    },
    multitask: function(test) {
        var actual, expected;
        test.expect(2);

        expected = grunt.file.read(PATH.expected + '/multitask');

        actual = grunt.file.read(PATH.actual + '/multitask1');
        test.equal(actual, expected, 'First task runned.');

        actual = grunt.file.read(PATH.actual + '/multitask2');
        test.equal(actual, expected, 'Second task runned.');

        test.done();
    },
    refer: function(test) {
        var actual, expected;
        test.expect(2);

        actual   = grunt.file.read(PATH.actual + '/refer/1');
        expected = grunt.file.read(PATH.expected + '/refer/1');
        test.equal(actual, expected, 'Refered file change detected: 1.');

        actual   = grunt.file.read(PATH.actual + '/refer/2');
        expected = grunt.file.read(PATH.expected + '/refer/2');
        test.equal(actual, expected, 'Refered file change detected: 2.');

        test.done();
    },
};
