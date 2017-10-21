// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var merge = require('merge-stream');
var path = require('path');
var uglify = require('gulp-uglify-es').default;
var stripDebug = require('gulp-strip-debug');
var gulpIf = require('gulp-if');
var rename = require('gulp-rename');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();


// compiles templates and partial templates, then combines them and outputs to templates.js
gulp.task('handlebars', function() {
  var partials = gulp.src(['app/views/partials/*.hbs'])
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
      imports: {
        processPartialName: function(fileName) {
          // Strip the extension and the underscore
          // Escape the output with JSON.stringify
          return JSON.stringify(path.basename(fileName, '.js'));
        }
      }
    }));

  var templates = gulp.src('app/views/*.hbs')
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'OW.templates',
      noRedeclare: true // Avoid duplicate declarations
    }));

  // Output both the partials and the templates as build/js/templates.js
  return merge(partials, templates)
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('app/views'));
});

// Concatenate & Minify JS & CSS
gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    // strips debug and minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', stripDebug()))
    .pipe(gulpIf('*.trans.min.js', babel({
      presets: ['env']
    })))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// optimize images
gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))
});

// copy fonts to dist
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// copy extras to dist
gulp.task('extras', function() {
  return gulp.src('app/*.+(png|xml|ico|json|svg)')
  .pipe(gulp.dest('dist/'))
})

// setup server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

// Watch Files For Changes and reload browser
gulp.task('watch', ['browserSync'], function() {
    gulp.watch('app/*.html', browserSync.reload); 
    gulp.watch('app/views/*.hbs', ['handlebars']); 
    gulp.watch('app/views/partials/*.hbs', ['handlebars']); 
    gulp.watch('app/views/*.js', browserSync.reload);
    gulp.watch('app/js/*.js', browserSync.reload); 
    gulp.watch('app/js/**/*.js', browserSync.reload); 
    gulp.watch('app/css/*.css', browserSync.reload); 
});

// build task
gulp.task('build', function() {
  gulp.run('handlebars'); 
  gulp.run('useref'); 
  gulp.run('fonts'); 
  gulp.run('extras'); 
  gulp.run('images'); 
});

// Default Task
gulp.task('default', ['watch']);


