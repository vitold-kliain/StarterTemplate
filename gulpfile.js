var gulp         	 = require('gulp'),
		sass         = require('gulp-sass'),
		browserSync  = require('browser-sync'),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify-es').default,
		cleancss     = require('gulp-clean-css'),
		autoprefixer = require('gulp-autoprefixer'),
		imagemin     = require('gulp-imagemin'),
		del          = require('del'),
		clean 		 = require('gulp-clean'),
		cache        = require('gulp-cache');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// online: false, // Work offline without internet connection
		tunnel: true, tunnel: 'tunel-name' // Demonstration page: http://projectname.localtunnel.me
	})
});

function bsReload(done) { browserSync.reload(); done(); };

// Custom Styles
gulp.task('styles', function() {
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass({ outputStyle: 'expanded' }))
	.pipe(concat('styles.min.css'))
	.pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 10 versions']
	}))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

// Scripts & JS Libraries
gulp.task('scripts', function() {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'app/js/common.js'
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

// Code & Reload
gulp.task('code', function() {
	return gulp.src('app/**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

//Imagemin
gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

// Clear cache
gulp.task('clearcache', function () { return cache.clearAll(); });

// Delete folder dist
gulp.task('clean',function() {
	return gulp.src('dist',{read:false}).pipe(clean());
})

// build project
gulp.task('pre-build', function() {
	return gulp.src('app/css/styles.min.css')
	.pipe(gulp.dest('dist/css')),
	gulp.src('app/js/scripts.min.js')
	.pipe(gulp.dest('dist/js')),
	gulp.src('app/*.html')
	.pipe(gulp.dest('dist')),
	gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
});

gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.scss', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('build', gulp.series('clean','pre-build','imagemin','styles','scripts'));
gulp.task('default', gulp.parallel('styles', 'scripts', 'browser-sync', 'watch'));
