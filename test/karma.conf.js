module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'dist/bower_components/angular/angular.js',
      'dist/bower_components/angular-route/angular-route.js',
      'dist/bower_components/angular-resource/angular-resource.js',
      'dist/bower_components/angular-animate/angular-animate.js',
      'dist/bower_components/angular-mocks/angular-mocks.js',
      'dist/scripts/bundle.js',
      'test/unit/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome', 'Firefox'],
    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};