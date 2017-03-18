import {securityServiceModule} from './../security/security';
export const servicesCatalogResourceModule = angular.module('servicesCatalogResourceModule', [securityServiceModule.name]).factory('catalogResource', ['$http', '$q', '$log', 'security', function ($http, $q, $log, security) {
  // local variable
  const baseUrl = 'http://localhost:3500/api';
  const catalogUrl = baseUrl + '/catalogs';
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
 
  resource.findCatalogs = function(filters){
    if(angular.equals({}, filters)){
      filters = undefined;
    }
    return $http.get(catalogUrl, { params: filters }).then(processResponse, processError);
  };

  resource.read =function(_id){
    var url = catalogUrl + '/' + _id;
    return $http.get(url).then(processResponse, processError);
  };

  return resource;
}]);
