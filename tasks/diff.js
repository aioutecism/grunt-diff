/*
 * grunt-diff
 * https://github.com/aioutecism/grunt-diff
 *
 * Copyright (c) 2014 aioute Gao
 * Licensed under the MIT license.
 */

'use strict';

var fs     = require('fs');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var chalk  = require('chalk');

var SETTING = {
    hashFile : '.grunt/grunt-diff/hash.json',
};

module.exports = function (grunt) {

    grunt.registerTask('diff:flush', "Flush saved hashes.", function () {
        var me = this;

        if (! fs.existsSync(SETTING.hashFile)) {
            grunt.log.writeln(chalk.gray("Nothing to flush."));
            return;
        }

        fs.unlinkSync(SETTING.hashFile);

        grunt.log.writeln(chalk.green('✔ ') + "All hashes flushed.");
    });

    grunt.registerMultiTask('diff', "Run tasks only when target files change.", function () {
        var me     = this;
        var target = me.target;

        var options = me.options({
            algorithm : 'md5',
            encoding  : 'utf8',
        });

        mkdirp.sync(SETTING.hashFile.replace(/[^\/]+\.json$/, ''));

        var hashes = fs.existsSync(SETTING.hashFile) ?
            grunt.file.readJSON(SETTING.hashFile, 'utf8') : {};

        hashes[target] = hashes[target] || {};

        var src = [];

        if (me.data.refer) {
            var refer = me.data.refer.replace(/:/g, '.');
            var files = grunt.task.normalizeMultiTaskFiles(grunt.config.get(refer));
            files.forEach(function (file) {
                Array.prototype.push.apply(src, file.src);
            });
            me.data.tasks = me.data.tasks || me.data.refer;
        }
        else {
            src = me.filesSrc;
        }

        src = src.filter(function (path) {
            if (! grunt.file.isFile(path)) {
                return false;
            }
            if (! grunt.file.exists(path)) {
                grunt.log.warn('Source file "' + path + '" not found.');
                return false;
            }
            else {
                return true;
            }
        });

        // Check for changes
        var filesChanged = src.filter(function (path) {
            var hash = crypto.createHash(options.algorithm).update(grunt.file.read(path), options.encoding).digest('hex');

            if (hash !== hashes[target][path]) {
                hashes[target][path] = hash;
                return true;
            }
            else {
                return false;
            }
        });

        // Check for removals
        var filesRemoved = [];
        for (var path in hashes[target]) {
            if (!~src.indexOf(path)) {
                delete hashes[target][path];
                filesRemoved.push(path);
            }
        }

        if (! filesChanged.length && ! filesRemoved.length) {
            grunt.log.writeln(chalk.gray("No change."));
            return;
        }

        grunt.task.run(me.data.tasks);

        grunt.log.writeln(
            chalk.yellow("Changes detacted:\n") +
            []
            .concat(filesChanged.map(function (path) {
                return chalk.green(' + ') + path;
            }))
            .concat(filesRemoved.map(function (path) {
                return chalk.red(' - ') + path;
            }))
            .join("\n")
        );

        fs.writeFileSync(SETTING.hashFile, JSON.stringify(hashes), {
            encoding : 'utf8',
        });
    });

};
