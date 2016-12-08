 exports.config = {
     // set to "custom" instead of cucumber.
     framework:'custom',//allow us to include cucumber
     // path relative to the current config file
     frameworkPath:require.resolve('protractor-cucumber-framework'),
     seleniumAddress: 'http://localhost:4444/wd/hub',
     specs:['features/**/*.feature'],
      // relevant cucumber command line options
     cucumberOpts:{
         require:'steps/**/*.steps.js',
         format:'pretty'
     }
 };
