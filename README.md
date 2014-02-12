# grunt-diff

> Run tasks only if target file changed.


## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-diff --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-diff');
```


## The "diff" task

### Overview

This task will keep a hash reference of target file and run defined tasks only if file changed.
Similar to [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch), but this one is for deployment.

File hashes will be saved in `.grunt/grunt-diff/hash.json`.
You might like to add `.grunt` to your `.gitignore`.

```js
grunt.initConfig({
  diff : {
    javascript : {
      src   : [ 'lib/*.js' ],
      tasks : [ 'concat', 'uglify' ],
    },
    sass : {
      refer : 'sass:dist',
      tasks : 'sass:dist',
    },
  },
});
```

You can flush file hashes any time by running:
```shell
grunt diff:flush
```


### Options

#### options.algorithm
Type: `String`
Default value: `'md5'`

`algorithm` is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are `'sha1'`, `'md5'`, `'sha256'`, `'sha512'`, etc. On recent releases, `openssl list-message-digest-algorithms` will display the available digest algorithms.

#### options.encoding
Type: `String`
Default value: `'utf8'`

The file encoding.


### Usage Examples

Notice that `targets` are passed to `diff` task in the same order they are written in `Gruntfile`.
Thus allows chained configuration.

```js
grunt.initConfig({
  // Other configs

  diff : {
    single : {
      src   : 'file/to/check',
      tasks : [ 'taskToRun' ],
    },

    pattern : {
      files : [{
        expand : true,
        cwd    : 'path/to/check',
        src    : [ '**/*' ],
      }],
      tasks : [ 'taskToRun' ],
    },

    chained : {
      src   : 'files/generated/by/previous/task',
      tasks : [ 'taskToRun' ],
    },

    multi : {
      src   : 'file/to/check',
      tasks : [
        'taskToRun1',
        'taskToRun2',
      ],
    },

    refer : {
      refer : 'task:target',
      tasks : [ 'taskToRun' ],
      // 'tasks' can be omited when using 'refer'.
      // Defaults to the refered 'task:target'.
    },
  },
});
```


## TODO

 * Improve test coverage


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## Release History

 * 2014-02-10   v0.1.5   Skip non-file paths
 * 2014-02-10   v0.1.3   Default refer tasks
 * 2014-02-10   v0.1.2   Refer to task:target's files
 * 2014-02-10   v0.1.1   Check file removal
 * 2014-02-10   v0.1.0   Release
