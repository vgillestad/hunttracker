var gulp = require('gulp');
var gettext = require('gulp-angular-gettext');

var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var runSequence = require('run-sequence');

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

var useMin = function (src) {
    return gulp.src(src)
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({ empty: true })],
            js: [uglify()],
        }))
        .pipe(gulp.dest('./'));
}

gulp.task('useMinIndex', function () {
    return useMin("./src/index.html");
});

gulp.task('useMinLogin', function () {
    return useMin("./src/login.html");
});

gulp.task('build', function (cb) {
    runSequence(
        ['useMinIndex', 'useMinLogin'],
        cb);
});