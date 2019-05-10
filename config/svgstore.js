module.exports = {
	options: {
		prefix: '',
		svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
			viewBox : '0 0 100 100',
				xmlns: 'http://www.w3.org/2000/svg'
		},
		cleanup: true
	},
	default: {
		files: {
			'<%= paths.media.svgs.dest %>': ['<%= paths.media.svgs.src %>'],
		}
	}
}