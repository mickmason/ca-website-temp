module.exports = {
  media: {
    files: [
      {expand: true, cwd: '<%= paths.media.src %>', src: ['**/*', '{!svg/*, !icons/*}'], dest: '<%= paths.media.dest %>', filter: 'isFile'}
    ]
  },
	jsComponents: {
    files: [
      {expand: true, cwd: '<%= paths.jsFiles.componentsSrc %>', src: ['**/*.js'], dest: '<%= paths.jsFiles.dest.components %>', filter: 'isFile'}
    ]
  }
}