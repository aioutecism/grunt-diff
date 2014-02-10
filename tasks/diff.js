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
            JSON.parse(fs.readFileSync(SETTING.hashFile, 'utf8')) : {};

        hashes[target] = hashes[target] || {};

        var filePathes   = [];
        var filesChanged = [];
        var filesRemoved = [];

        // Check for changes
        me.files.forEach(function (f) {
            var src = f.src.filter(function (path) {
                if (! grunt.file.exists(path)) {
                    grunt.log.warn('Source file "' + path + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            src.map(function (path) {
                var hash = crypto.createHash(options.algorithm).update(grunt.file.read(path), options.encoding).digest('hex');

                if (hash === hashes[target][path]) {
                    return;
                }

                hashes[target][path] = hash;
                filesChanged.push(path);
            });

            Array.prototype.push.apply(filePathes, src);
        });

        // Check for removals
        for (var path in hashes[target]) {
            if (!~filePathes.indexOf(path)) {
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
