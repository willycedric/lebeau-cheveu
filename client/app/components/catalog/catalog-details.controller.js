

class CatalogDetailCtrl {
  constructor($scope,$rootScope,$q,$route, $location, utility, catalogResource, $log,$stateParams,data) {
  	
    var ctrl = this;
    var deserializeData = function(rep){
       ctrl.catalog = rep.record;
    };
    deserializeData(data);
}
} 

CatalogDetailCtrl.$inject =['$scope','$rootScope','$q','$route', '$location', 'utility', 'catalogResource','$log', '$stateParams','catalog'];
export {CatalogDetailCtrl};
