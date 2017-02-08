const gulp = require('gulp');
const rollup = require('gulp-better-rollup')
const babel = require('rollup-plugin-babel')
const rename = require("gulp-rename");

gulp.task('default', () =>
    gulp.src('src/index.js')
        .pipe(rollup({
          plugins: [babel()],
          moduleName: 'createPolobxBehavior'
        }, 'umd'))
        .pipe(rename('polobx.js'))
        .pipe(gulp.dest('dist'))
);
