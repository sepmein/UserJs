/**
 * Created by Spencer on 15/12/23.
 */

var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("build", function () {
    return gulp.src("lib/user.js")
        .pipe(babel())
        .pipe(gulp.dest("src"));
});