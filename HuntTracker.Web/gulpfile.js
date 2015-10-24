var gulp = require('gulp');
var gettext = require('gulp-angular-gettext');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var runSequence = require('run-sequence');
var templateCache = require('gulp-angular-templatecache');
var watch = require('gulp-watch');

gulp.task('templates', function () {
    return gulp.src('./src/html/*.tpl.html')
      .pipe(templateCache({ standalone: true }))
      .pipe(gulp.dest('./src/html'));
});

gulp.task('pot', function () {
    return gulp.src(['./**/*.html'])
        .pipe(gettext.extract('template.pot'))
        .pipe(gulp.dest('./src/i18n/po/'));
});

gulp.task('translations', function () {
    return gulp.src('./src/i18n/po/**/*.po')
        .pipe(gettext.compile())
        .pipe(gulp.dest('./src/i18n'));
});

gulp.task('watch', function () {
    return gulp.src('./src/html/*.tpl.html')
        .pipe(watch('./src/html/*.tpl.html'))
        .pipe(gulp.dest('templates'));
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