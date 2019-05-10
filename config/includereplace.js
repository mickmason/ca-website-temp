module.exports = {
	dist: {
		options: {
			includesDir: '<%= paths.html.includes %>'
		},
		files: [
			{src: '**/*.html', dest: 'www-root/', expand: true, cwd: '<%= paths.html.src %>'}
		]	
	} 	
}