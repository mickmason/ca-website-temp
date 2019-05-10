module.exports = function(grunt) {

	const tasks = {scope: ['devDependencies', 'dependencies' ]};
  const options = {
		pkg: grunt.file.readJSON('package.json'),
		paths: {
			dist: 'www-root/',
			media: {
				src: 'development/src/media/',
				dest: 'www-root/assets/media/',
				svgs: {
					src: 'development/src/media/icons/*.svg',
					dest: 'www-root/assets/media/svg/bc-icons.svg'
				}
			},
			html: {
				src: 'development/src/html/',
				includes: 'development/src/html/includes/',
				dest: 'www-root/'
			},
			jsFiles: {
				src: ['development/src/js/scripts.js'],
				componentsSrc: 'development/src/js/components/',
				dest: {
					dev: 'www-root/assets/js/',
					dist: 'www-root/assets/js/',
					components: 'www-root/assets/js/components/'
				},
				tempPaths: {
					path: 'development/src/js/temp/',
					min: 'development/src/js/temp/',
					unmin: 'development/src/js/temp/'
				}
			},
			scss: {
				src: 'development/src/sass/style.scss',
				dest: 'www-root/assets/css/style.css',
				printSrc: 'development/src/sass/print.scss',
				printDest: 'www-root/assets/css/print.css' 
			},
			css: {
				style: 'www-root/assets/css/style.css',
				styleMin: 'www-root/assets/css/style.min.css'
			}
		},
		config: { 
			src: 'config/*.js' 
		}
	};
  const configs = require('load-grunt-configs')(grunt, options);
  require('load-grunt-tasks')(grunt, tasks);
  grunt.initConfig(configs);
	
  // Default task(s).
  grunt.registerTask('default', ['server']);
  grunt.registerTask('server', [
    'express',
    'watch'
  ]);
	grunt.registerTask('build', [
		'includereplace',
		'sass',
		'run:postcssbuild',
		'critical',
    'run:jshint',
		'run:babel',
		'run:uglify',
		'concat:dist',
		'cleanup'
  ]);
	grunt.registerTask('cleanup', 'Clean up temporary files', () => {
		grunt.file.delete(options.paths.jsFiles.tempPaths.path, { force: true});
		grunt.file.delete(options.paths.jsFiles.dest.dist+'scripts.js', { force: true});
	});

}