import {securityServiceModule} from './../security/security';
export const servicesBlogCategoryResourceModule = angular.module('servicesBlogCategoryResourceModule', [securityServiceModule.name]).factory('blogCategoryResource', ['$http', '$q', '$log', 'security','API', function ($http, $q, $log, security,API) {
  // local variable
  const baseUrl =`${API.dev.homeUrl}`+'/api';
  const blogUrl = baseUrl + '/blog-category';
  var processResponse = function(res){
    return res.data;
  };
  var processError = function(e){
    var msg = [];
    if(e.status)         { msg.push(e.status); }
    if(e.statusText)     { msg.push(e.statusText); }
    if(msg.length === 0) { msg.push('Unknown Server Error'); }
    return $q.reject(msg.join(' '));
  };
  // public api
  var resource = {};
 
  resource.findBlogCategories = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(blogUrl, { params: filters }).then(processResponse, processError);
  };
  return resource;
}]);
