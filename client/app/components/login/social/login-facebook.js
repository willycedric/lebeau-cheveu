import {securityServiceModule} from './../../common/security/security';
angular.module('loginSocialFacebookModule',
 [
  securityServiceModule.name
 ]);
export const loginSocialFacebookModule =  angular.module('loginSocialFacebookModule').config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/login/facebook/callback', {
      resolve: {
        verify: ['$log', '$q', '$location', '$route', 'security', function($log, $q, $location, $route, security){
          var redirectUrl;
          var code = $route.current.params.code || '';
          var promise = security.socialLogin('facebook', code)
            .then(function(data){
              if(data.success) {
                // redirectUrl = data.defaultReturnUrl || '/account'
                redirectUrl = '/account';
              }
              return $q.reject();
            })
            .catch(function(){
              redirectUrl = redirectUrl || '/login';
              $location.search({}); //remove search params added by passport/facebook
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
