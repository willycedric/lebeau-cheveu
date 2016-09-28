var gulp    = require('gulp');
var sync    = require('run-sequence');
var browser = require('browser-sync');
var webpack = require('webpack-stream');
var todo    = require('gulp-todoist');
var path    = require('path');
var yargs   = require('yargs').argv;
var tpl     = require('gulp-template');
var rename  = require('gulp-rename');
var fs = require('fs');
var cloudinary = require('cloudinary');

/*
map of paths for using with the tasks below
 */
var paths = {
  entry: 'client/app/app.js',
  app: ['client/app/**/*.{js,css,html}', 'client/styles/**/*.css'],
  js: 'client/app/**/*!(.spec.js).js',
  styl: ['client/app/**/*.css', 'client/style/**/*.css'],
  toCopy: ['client/index.html'],
  uiTemplate:['client/app/**/*.template.html'],
  html: ['client/index.html', 'client/app/**/*.html'],
  dest: 'dist',
  blankTemplates: 'templates/component/*.**'
};

// helper funciton
var resolveToComponents = function(glob){
  glob = glob || '';
  return path.join('client', 'app/components', glob); // app/components/{glob}
};
//parse all files to find TODO instructions and then
//log them to the console
gulp.task('todo', function() {
  return gulp.src(paths.js)
    .pipe(todo({silent: false, verbose: true}));
});

gulp.task('build', ['label'], function() {
  return gulp.src(paths.entry)
    .pipe(webpack(require('./webpack.config')))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('serve', function() {
  browser({
    port: process.env.PORT || 4500,
    open: false,
    ghostMode: false,
    server: {
      baseDir: 'dist'
    }
  });
});

/*
simple task to copy over needed files to dist
 */
gulp.task('copy', function() {
  return gulp.src(paths.toCopy, { base: 'client' })
    .pipe(gulp.dest(paths.dest));
});

/*
  Simple task to copy UI templates files to dist folder
*/
gulp.task('templateCopy', function(){
  return gulp.src(paths.uiTemplate,{base: 'client/app/ui-templates'})
          .pipe(gulp.dest(paths.dest));
});
/**
 * 
 */
gulp.task('label',function(){
    var label =require('./label/labelLoader');//return a promise object
    label.then(function(data){
        try{
          fs.writeFile('labels.json',JSON.stringify(data), function(err){
            if(err) throw err;
          });
        }catch(err){
          console.err(err);
        }
    })
    .catch(function(error){
      console.error(error);
    });
});

/*
task to watch files for changes and call build and copy tasks
 */
gulp.task('watch', function() {
  gulp.watch(paths.app, ['build', browser.reload]);
  gulp.watch(paths.toCopy, ['copy', browser.reload]);
  gulp.watch(paths.uiTemplate, ['templateCopy', browser.reload]);
});

gulp.task('images', function(){s
  var images=['1-1900X600.jpg','3-1900X600.jpg','2-1900X600.png'];
   var imagesDetails=[];
   images.forEach(function(elt){
      require('./utils/uploadImages')(elt)
       .then(function success (result){
        imagesDetails.push({
          url:result.secure_url,
          width:result.width,
          height:result.height
        });
        try{
              fs.writeFile('images.json',JSON.stringify(imagesDetails), function(err){
                if(err) throw err;
              });
            }catch(err){
              console.err(err);
            }
       }, function error(err){
        console.error(err);
       });
   });  
   
});

/**
 * [use to create new angular component]
 * @param  {[type]} ){                      var    cap                            [description]
 * @param  {[type]} parentPath [description]
 * @param  {[type]} name);                   return gulp.src(paths.blankTemplates)                 .pipe(tpl({      name: name,      upCaseName: cap(name)    }))    .pipe(rename(function(path){      path.basename [description]
 * @return {[type]}            [description]
 */
gulp.task('component', function(){
  var cap = function(val){
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  var name = yargs.name;
  var parentPath = yargs.parent || '';
  var destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(paths.blankTemplates)
    .pipe(tpl({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename(function(path){
      path.basename = path.basename.replace('component', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('default', function(done) {
  sync('build', 'copy', 'templateCopy','serve', 'watch', done)
});
