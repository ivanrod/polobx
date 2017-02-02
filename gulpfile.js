const gulp = require('gulp');
const rename = require("gulp-rename");
const babel = require('gulp-babel');

gulp.task('default', () =>
    gulp.src('src/index.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('polobx.js'))
        .pipe(gulp.dest('dist'))
);
