var gulp = require("gulp");
var $ = require("gulp-load-plugins")({pattern: ["gulp-*", "gulp.*", "del*", "path*"], lazy: true});

var filenames = {
  appJs: "app.js",
  appCss: "app.css",
  vendorJs: "vendor.js",
  vendorCss: "vendor.css"
};
var outputDir = "../Web/ui";
var paths = {
  src: {
    appIndex: "index.html",
    appTs: "app/**/*.ts",
    appCss: "app/**/*.css",
    appNgTemplates: "app/**/*.html",
    appImages: ["content/images/**"],
    appFonts: [],
    appTsOrder: [
      "**/app.ts",
      "**/*"
    ],
    vendorJs: [
      "node_modules/jquery/dist/jquery.js",
      "node_modules/angular/angular.js",
      "node_modules/angular-ui-router/release/angular-ui-router.js",
      "node_modules/angular-animate/angular-animate.js",
      "node_modules/angular-aria/angular-aria.js",
      "node_modules/angular-material/angular-material.js",
      "node_modules/toastr/build/toastr.min.js"
    ],
    vendorJsOrder: [
      "**/jquery.js",
      "**/angular.js",
      "**/*"
    ],
    vendorCss: [
      "node_modules/angular-material/angular-material.css",
      "node_modules/toastr/build/toastr.css"
    ]
  }
};


gulp.task("clean", function (cb) {
  $.del.sync([outputDir], {
    force: true
  });
  cb();
});


gulp.task("vendorScripts", function () {
  return gulp
      .src(paths.src.vendorJs)
      .pipe($.plumber())
      .pipe($.order(paths.src.vendorJsOrder))
      .pipe($.concat(filenames.vendorJs))
      .pipe(gulp.dest(outputDir));
});

gulp.task("appScripts", function () {
  return gulp
      .src(paths.src.appTs)
      .pipe($.sourcemaps.init())
      .pipe($.plumber())
      //.pipe($.order(paths.src.appTsOrder))
      .pipe($.typescript({
        out: filenames.appJs
      }))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(outputDir));
});

gulp.task("vendorStyles", function () {
  return gulp
      .src(paths.src.vendorCss)
      .pipe($.plumber())
      .pipe($.flatten())
      .pipe($.concat(filenames.vendorCss))
      .pipe(gulp.dest(outputDir));
});

gulp.task("appStyles", function () {
  return gulp
      .src(paths.src.appCss)
      .pipe($.plumber())
      .pipe($.flatten())
      .pipe($.concat(filenames.appCss))
      .pipe(gulp.dest(outputDir));
});

gulp.task("ngTemplates", function () {
  return gulp
      .src(paths.src.appNgTemplates)
      .pipe($.plumber())
      .pipe($.bytediff.start())
      .pipe($.htmlmin({
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,

      }))
      .pipe($.bytediff.stop())
      .pipe($.angularTemplatecache({
        root: "app",
        module: "app"
      }))
      .pipe(gulp.dest(outputDir));
});

gulp.task("images", function () {
  return gulp
      .src(paths.src.appImages)
      .pipe($.plumber())
      .pipe(gulp.dest("../Mobile/images"));
});

gulp.task("fonts", function () {
  return gulp
      .src(paths.src.appFonts)
      .pipe($.plumber())
      .pipe($.flatten())
      .pipe(gulp.dest("../Mobile/fonts"));
});


gulp.task("app", function (cb) {
  $.runSequence("clean", ["vendorScripts", "appScripts", "vendorStyles", "appStyles", "ngTemplates", "images", "fonts"], cb);
});


gulp.task("debug", ["app"], function () {
  var sources = gulp
      .src(["build/**/*"])
      .pipe($.order([
        "vendor/jquery-2.0.3.js",
        "vendor/angular.js",
        "vendor/bootstrap.js",
        "vendor/**/*.*",
        "**/*"], {base: outputDir}));

  return gulp
      .src("app/index.html")
      .pipe($.plumber())
      .pipe($.inject(sources, {
        addRootSlash: false,
        ignorePath: ["app"]
      }))
      .pipe($.embedlr())
      .pipe(gulp.dest(outputDir));
});


gulp.task("watch", ["debug"], function () {
  gulp.watch(paths.src.vendorJs, ['vendorScripts']);
  gulp.watch(paths.src.appTs, ['appScripts']);
  gulp.watch(paths.src.vendorCss, ['vendorStyles']);
  gulp.watch(paths.src.appCss, ['appStyles']);
  gulp.watch(paths.src.appNgTemplates, ['ngTemplates']);
  gulp.watch(paths.src.appImages, ['images']);
});
