module.exports = {
	dist: {
		options: {
			base: 'www-root/',
			dimensions: [{
				width: 360,
				height: 640
		  },
		  {
				width: 1366,
				height: 768
		  },
			{
				width: 1440,
				height: 900
			},
			{
				width: 1920,
				height: 1080
			}],
			inline: true
		},
		files: [
			{src: '<%= paths.html.dest %>index.html', dest: '<%= paths.html.dest %>index.html'},
			{src: '<%= paths.html.dest %>projects/projects.html', dest: '<%= paths.html.dest %>projects/projects.html'},
			{src: '<%= paths.html.dest %>projects/meath-project.html', dest: '<%= paths.html.dest %>projects/meath-project.html'},
			{src: '<%= paths.html.dest %>people/people.html', dest: '<%= paths.html.dest %>people/people.html'},
			{src: '<%= paths.html.dest %>people/bryan-profile.html', dest: '<%= paths.html.dest %>people/bryan-profile.html'},
			{src: '<%= paths.html.dest %>practice/practice.html', dest: '<%= paths.html.dest %>practice/practice.html'},
			{src: '<%= paths.html.dest %>practice/uniqueness-sample.html', dest: '<%= paths.html.dest %>practice/uniqueness-sample.html'},
			{src: '<%= paths.html.dest %>two-column.html', dest: '<%= paths.html.dest %>two-column.html'}
		]
	}
}