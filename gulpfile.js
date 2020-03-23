"use strict";
//global
var gulp = require("gulp");
var plumber = require("gulp-plumber"); //prevent pipe breaking caused by errors from gulp plugins
var rename = require("gulp-rename");
var del = require("del");
//html
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require('gulp-htmlmin');
//sass-css
var sass = require("gulp-sass");
var sourcemap = require("gulp-sourcemaps"); //saves changes (sass -> css)
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso"); //minimizes css
//js
var uglify = require("gulp-uglify");
//images
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
//sync
var server = require("browser-sync").create(); //creates local server

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("sprite", function () {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include() //makes tag include work (paste svg sprite)
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("js", function () {
  return gulp.src("source/js/**/*.js")
    .pipe(gulp.dest("build/js"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 2}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("svg", function () {
  return gulp.src("source/img/**/*.svg")
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 93}))
    .pipe(gulp.dest("source/img"));
});

gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/js/**",
      "source/*.ico"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("server", function () {
  server.init({ //starts local server with given options
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{sass,scss}", gulp.series("css"));
  gulp.watch("source/img/*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("js", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series("clean", "copy", "css", "sprite", "html", "js"));
gulp.task("start", gulp.series("build", "server"));
