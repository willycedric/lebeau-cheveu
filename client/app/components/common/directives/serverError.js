// A simple directive to handle server side form validation
// http://codetunes.com/2013/server-form-validation-with-angular/
 const directivesServerErrorModule = angular.module('directivesServerErrorModule', []);
  directivesServerErrorModule.directive('serverError', [ function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      replace: true,
      link: function (scope, element, attrs, ctrl) {
        element.on('change', function(){
          scope.$apply(function(){
            ctrl.$setValidity('server', true);
          });
        });
      }
    };
  }]);
export {directivesServerErrorModule};