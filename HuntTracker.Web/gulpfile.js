var gulp = require('gulp');
var gettext = require('gulp-angular-gettext');
var rename = require('gulp-rename');

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