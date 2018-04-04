/**
 * Created by Yuanqiujuan on 2017/10/19.
 */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    fileObj = {},
    curGulpFile;

fileObj = {
    index: {
        dest: 'src/index.js',
        output: 'lib',
        file: 'index.js',
        name: 'index'
    }
};

curGulpFile = 'index';

//压缩无es6的
gulp.task('default', function(){
    gulp.src(fileObj[curGulpFile].dest)
        .pipe(gulp.dest(fileObj[curGulpFile].output))
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify())
        .pipe(gulp.dest(fileObj[curGulpFile].output))
});