module.exports = function( grunt ){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		'jsmin-sourcemap': {
			all: {
			  /* Source files to concatenate and minify 
			   * (also accepts a string and minimatch items)
			   */
			  src: ['scripts/debugger.js', 'scripts/koch.js'],

			  /* Destination for concatenated/minified JavaScript */
			  dest: 'build/scripts/koch.min.js',

			  /* Destination for sourcemap of minified JavaScript */
			  destMap: 'build/scripts/koch.js.map',
				
			  /* Optional root for all relative URLs */
			  srcRoot: '../'

			  /* Optional cwd to resolve from for all URLs
			   * Converts jquery.js -> some/higher/directory/jquery.js 
			   * during lookup but mapping preserves jquery.js in map file
			   */
			  //cwd: 'some/higher/directory'
			},

			/* Compact format is also accepted */
			//'dest/file.js': ['src/file1.js', 'src/file2.js']
		}
	});
	
	grunt.loadNpmTasks('grunt-jsmin-sourcemap');
};
