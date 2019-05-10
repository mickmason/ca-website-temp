module.exports = {
	dist: {
		options: {
  		  style: 'expanded',
  		},//options
  		files: {
  		  '<%= paths.scss.printDest %>': '<%= paths.scss.printSrc %>',
  		  '<%= paths.scss.dest %>': '<%= paths.scss.src %>',
  		}//files
	}
}