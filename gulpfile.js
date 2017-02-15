const gulp = require('gulp');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const rename = require("gulp-rename");
const bump = require("gulp-bump");
const args = require('yargs').argv;
const git = require('gulp-git');
const fs = require('fs');
const runSequence = require('run-sequence');

require('web-component-tester').gulp.init(gulp);

const getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

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

gulp.task('commit-release', () => {
  const { version } = getPackageJson();

  console.warn('-----> Remember to push commit and publish the package <------');

  return gulp.src('./git/*')
    .pipe(git.add({args: '.'}))
    .pipe(git.commit(`Bump version: ${version}`))
    .pipe(git.tag(version, version, err => {
      if (err) throw err;
    }));
});

gulp.task('release', () => {

  const type = args.type;
  const options = {
    type
  };

  return gulp.src(['./package.json', './bower.json'])
  .pipe(bump(options))
  .pipe(gulp.dest('./'));
});

gulp.task('bump', callback => {
  runSequence(
    ['default', 'release'],
    'commit-release',
    callback);
});
