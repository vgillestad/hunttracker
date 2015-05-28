var gulp = require('gulp');
var gettext = require('gulp-angular-gettext');

var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');

gulp.task('pot', function () {
    return gulp.src(['./**/*.html'])
        .pipe(gettext.extract('template.pot'))
        .pipe(gulp.dest('./i18n/po/'));
});

gulp.task('translations', function () {
    return gulp.src('./i18n/po/**/*.po')
        .pipe(gettext.compile())
        .pipe(gulp.dest('./i18n'));
});

gulp.task('build', function () {
    return gulp.src('./src/*.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({ empty: true })],
            js: [uglify()],
            inlinejs: [uglify()],
            inlinecss: [minifyCss(), 'concat']
        }))
        .pipe(gulp.dest('./'));
});