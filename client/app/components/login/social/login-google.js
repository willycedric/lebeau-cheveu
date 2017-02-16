import {securityServiceModule} from './../../common/security/security';

angular.module('loginSocialGoogleModule', 
  [
  securityServiceModule.name
  ]);
export const  loginSocialGoogleModule = angular.module('loginSocialGoogleModule').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/login/google/callback', {
      resolve: {
        verify: ['$log', '$q', '$location', '$route', 'security', function($log, $q, $location, $route, security){
          var redirectUrl;
          var code = $route.current.params.code || '';
          var promise = security.socialLogin('google', code)
            .then(function(data){
              if(data.success) {
                // redirectUrl = data.defaultReturnUrl || '/account'
                redirectUrl = '/account';
              }
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/login';
              $location.search({}); //remove search params added by passport/google
              $location.path(redirectUrl);
              return $q.reject();
            });
          return promise;
        }]
      },
      reloadOnSearch: false
    })
  ;
}]);
