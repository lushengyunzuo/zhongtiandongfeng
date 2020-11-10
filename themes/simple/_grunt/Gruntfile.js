module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*!<%= pkg.name %><%= grunt.template.today("yyyy-mm-dd") %>*/\n'
			},
			build: {
				src: '../js/src/*.src.js',
				dest: '../js/all.min.js'
			}
		},
		less: {
			development: {
				options: {
					//paths: ["assets/css"]
					compress: true,
				},
				files: {
					"../css/all.min.css": "../css/less/main.less"
				}
			}
		},
		watch: {
			less: {
				// We watch and compile less files as normal but don't live reload here 
				files: ['../css/less/*.less'],
				tasks: ['less'],
			},
			js: {
				files: ['../js/src/*.src.js'],
				tasks: ['uglify'],
				//options: {livereload:true}
			},
		}
	});

	// 加载包含 "uglify" 任务的插件。
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// 默认被执行的任务列表。
	grunt.registerTask('default', ['uglify', 'less', 'watch']);

};