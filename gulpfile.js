const gulp = require('gulp');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const rename = require("gulp-rename");

require('web-component-tester').gulp.init(gulp);

gulp.task('default', () =>
    gulp.src('src/index.js')
        .pipe(rollup({
          plugins: [
            babel(),
            nodeResolve({
              jsnext: true,
              main: true
            }),
            commonjs({
              include: 'node_modules/**',
              extensions: [ '.js', '.coffee' ],
              ignoreGlobal: false,
              sourceMap: true
            })
          ],
          moduleName: 'createPolobxBehavior'
        }, 'umd'))
        .pipe(rename('polobx.js'))
        .pipe(gulp.dest('dist'))
);
