import {securityServiceModule} from './../security/security';
export const servicesBlogResourceModule = angular.module('servicesBlogResourceModule', [securityServiceModule.name]).factory('blogResource', ['$http', '$q', '$log', 'security', function ($http, $q, $log, security) {
  // local variable
  const baseUrl = 'http://localhost:3500/api';
  const blogUrl = baseUrl + '/blogs';
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
 
  resource.findBlogs = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(blogUrl, { params: filters }).then(processResponse, processError);
  };

  resource.read =function(_id){
    var url = blogUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };

  //get all posts under the same category
  resource.relatedCategory = function(id){
    var url = blogUrl +'/related/'+id;
    return $http.get(url).then(processResponse, processError);
  };

  //get all post created by the same author
  resource.sameAuthor = function(id){
    var url = blogUrl+'/author/'+id;
    return $http.get(url).then(processResponse, processError);
  }

  return resource;
}]);
