angular.module('services.httpRequestTracker', []);
export const servicesHttpRequestTrackerModule = angular.module('servicesHttpRequestTrackerModule').factory('httpRequestTracker', ['$http', function($http){

  var httpRequestTracker = {};
  httpRequestTracker.hasPendingRequests = function() {
    return $http.pendingRequests.length > 0;
  };

  return httpRequestTracker;
}]);