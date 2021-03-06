module.exports = function(grunt) {
	var target = grunt.option('target') || 'prod';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dist: ['dist'],
			tmp: ['tmp']
		},
		plato: {
			dist: {
				files: {
					'report/output/plato': ['js/**/*.js']
				  }
			}
		},
		replace: {
			dist: {
				src: ['manifest.json'],
				dest: 'tmp/manifest.json',
				replacements: [
					{
						from: '%ext_version%',
						to: '<%= pkg.version %>'
					},
					{
						from: '%ext_name%',
						to: '<%= pkg.name %>'
					},
					{
						from: '%ext_description%',
						to: '<%= pkg.description %>'
					}
				]
			}
		},
		fixmyjs: {
			options: {
				config: '.jshintrc'
			},
			fix: {
				files: [
					{
						expand: true,
						src: ['js/**/*.js'],
						dest: 'tmp/',
						ext: '.js'
					}
				]
			}
		},
		removelogging: {
			prod: {
				src: "tmp/js/**/*.js"
			},
			dev: {}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dev: {
				options: {
					beautify: true,
					compress: false
				},
				files: {
					'dist/js/background-min.js': [
						'tmp/js/background/background.js',
						'tmp/js/background/ctx-menu.js',
						'tmp/js/background/startup.js'
					],
					'dist/js/content-min.js': [
						'tmp/js/content/content.js',
						'tmp/js/content/event-listener.js',
						'tmp/js/xpath-impl/xpath-custom.js',
						'tmp/js/xpath-impl/xpath-moz.js'
					]
				}
			},
			prod: {
				files: {
					'dist/js/background-min.js': [
						'tmp/js/background/background.js',
						'tmp/js/background/ctx-menu.js',
						'tmp/js/background/startup.js'
					],
					'dist/js/content-min.js': [
						'tmp/js/content/content.js',
						'tmp/js/content/event-listener.js',
						'tmp/js/xpath-impl/xpath-custom.js',
						'tmp/js/xpath-impl/xpath-moz.js'
					]
				}
			}
		},
		copy: {
			main: {
				files: [
					{
						expand: false,
						src: ['images/**'],
						dest: 'dist/',
						filter: 'isFile'
					},
					{
						expand: false,
						src: ['_locales/**'],
						dest: 'dist/',
						filter: 'isFile'
					},
					{
						expand: false,
						src: ['tmp/manifest.json'],
						dest: 'dist/manifest.json',
						filter: 'isFile'
					}
				]
			}
		}
	});
	
	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-plato');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-fixmyjs');
	grunt.loadNpmTasks("grunt-remove-logging");
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	

	grunt.registerTask(
		'dist',[
			'clean:dist',
			'replace',
			'fixmyjs',
			'removelogging:' + target,
			'uglify:' + target,
			'copy',
			'clean:tmp'
		]
	);
};