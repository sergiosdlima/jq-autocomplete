const { src, dest, series } = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');

const target = 'dist';

var tsProject = typescript.createProject('tsconfig.json');

function clean() {
    return del([target]);
}

function compile() {
    const compiled = tsProject.src().pipe(tsProject());
    compiled.dts.pipe(dest(target));
    return compiled.js.pipe(dest(target));
}

function min() {
    return src(target + '/jq-autocomplete.js')
        .pipe(uglify())
        .pipe(rename('jq-autocomplete.min.js'))
        .pipe(dest(target));
}

function minCss() {
    return src('src/jq-autocomplete.css')
        .pipe(cleanCss())
        .pipe(rename('jq-autocomplete.min.css'))
        .pipe(dest(target));
}

const build = series(
    clean,
    compile,
    min,
    minCss
);

exports.default = build;
