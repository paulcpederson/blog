module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['./contents/**/*'],
        tasks: ['compass','jshint'],
        options: {
          nospawn: true
        }
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'contents/scss',
          cssDir: 'contents/css'
        }
      }
    },
    jshint: {
      files: ['./*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // Default task(s)
  grunt.registerTask('default', ['watch']);


};