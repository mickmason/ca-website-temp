module.exports = {
	const bannerText = '\n/** \n * Big Cat Digital custom CSS \n * Client: <%= pkg.clientName %>\n * Project: <%= pkg.projectName %>\n * Version: <%= pkg.version %>\n * Description: <%= pkg.description %>\n * Copyright <%= pkg.developer %> 2020, <%= grunt.template.licence %>\n * Created by <%= pkg.developer %> * \n **/\n\n'
	plugins: [
		require('autoprefixer'),
		require('cssnano')
		
	]
}