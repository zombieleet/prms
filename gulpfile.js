const gulp = require("gulp");
const sass = require("gulp-sass");
const gulpPug = require("gulp-pug");

gulp.task("sass", () => {
	return gulp.src("./src/renderer/scss/main.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(gulp.dest("./src/renderer/css/"));
});

gulp.task("pug", () => {
	return gulp.src("./src/renderer/pug/*.pug")
		.pipe(gulpPug({}))
		.pipe(gulp.dest("./src/renderer/html/"));
});


gulp.task("watch", () => {
	gulp.watch("./src/renderer/scss/*.scss", [ "sass" ]);
	gulp.watch("./src/renderer/pug/*.pug", [ "pug" ]);
});


gulp.task("default", [ "sass", "pug", "watch" ]);