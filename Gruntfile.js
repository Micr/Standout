module.exports = function(grunt) {

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	jshint: {
		files: ['Gruntfile.js', 'src/*.js', 'tests/unit/*.js'],
		options: {
			jshintrc: '.jshintrc',
			globals: {
				jQuery: true,
				console: true,
				module: true,
				document: true
			}
		}
	},
	watch: {
		standard: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'qunit'],
			options: {
				livereload: true,
			}
		},
		examplejs: {
			files: ['examples/js/*.js'],
			tasks: ['jshint'],
		},
		exampleall: {
			files: ['examples/**/*'],
			options: {
				livereload: 9000
			}
		}
	},
	qunit: {
		standout: {
			src: ['tests/*.html']
		}
	}
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-qunit');

grunt.registerTask('test', ['jshint', 'qunit']);

grunt.registerTask('default', ['jshint', 'qunit']);

};
