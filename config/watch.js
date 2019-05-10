module.exports = {
      options: { livereload: true },
      sass: {
        files: ['development/**/**/*.scss'],
        //Uncomment the line below and delete the other tasks line to add csslint into the project
        //tasks: ['sass:dist','csslint:strict']
        tasks: ['includereplace:dist', 'sass', 'run:postcssdev']
      },//sass
      scripts: {
				files: ['<%= paths.jsFiles.src %>'],
       	//Uncomment the line below and delete the other "tasks:['uglify:build'] to add JSHint into the project"
       	//tasks: ['jshint','uglify:build']
       	tasks: ['run:jshint', 'concat:dev']
      },//scripts

      htmlcompile: {
        files: ['<%= paths.html.src %>**/*.html'],
        tasks: ['includereplace:dist', 'sass', 'run:postcssdev']
      },//htmlcompile
      media: {
          files: ['<%= paths.media.src %>**/*.*'],
          tasks: ['copy:media']
      },
			svg: {
				  files: ['development/src/media/icons/*.svg'],
          tasks: ['svgstore']
			}
}//watch