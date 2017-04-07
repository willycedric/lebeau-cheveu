class HairdresserCatalogController {
	  constructor($location,$log,hairdresserMAnager,$q,$scope,ModalFactory,$timeout,$state,hairdresserResource,$window,utility,haircutCategory,$stateParams,$sce) {
	  	var self=this;
	  	self.$location =$location;
	  	self.$q=$q;
	  	self.hairdresserResource=hairdresserResource;
	  	self.$stateParams = $stateParams;
	  	self.haircutCategory =haircutCategory;
	  	//list of galery entries for the selected haircuts category
	  	self.galeryEntries = [];
	  	
	    // local vars
    var deserializeData = function(){      
      var defered = self.$q.defer();      
	  var promise = self.hairdresserResource.findHaircutCatalog(self.$stateParams.id);
  	  defered.resolve(promise);      
      return defered.promise;
    };

    self.trustSrc = function(src){
			return  $sce.trustAsResourceUrl(src);
		} 

    var init = function(){
    	deserializeData()
    	.then((rep)=>{    		
    		self.category= rep;
    		self.haircutCategory.addCategory(self.category._id);
    		self.hairdresserResource.findGaleryEntries()
    		.then((rep)=>{
    			angular.forEach(rep, function(entry,ind){
    				if(entry.category === self.$stateParams.id){
    					self.galeryEntries.push(entry);
    				}
    			});    			
    		})
    	},(err)=>{
    		throw new Error(err.toString());
    	});
    };
    var closeAlert = function(alert, ind){
      alert.splice(ind, 1);
    };
    //$scope vars
    $scope.detailAlerts = [];
    $scope.deleteAlerts = [];
    $scope.$window =$window;
    //$scope.canSave = utility.canSave;
    //$scope.hasError = utility.hasError;
    //$scope.showError = utility.showError;
    $scope.closeDetailAlert = function(ind){
      closeAlert($scope.detailAlerts, ind);
    };
    $scope.closeDeleteAlert = function(ind){
      closeAlert($scope.deleteAlerts, ind);
    };
    self.update = function(url){
      $scope.detailAlerts = [];
      if(url){
         	 var data = {
	          url: url,
	          categoryId:self.$stateParams.id,
	          type:"url"      
	        };
	        self.hairdresserResource.updateGaleryEntry(data).then(function(result){
	        if(result){
	          //deserializeData(result.data);
	          console.log(result.data);
	          $scope.detailAlerts.push({ type: 'success', msg: 'La photo a été bien enregistrée.'});
	          $window.location.reload();
	        }else{
	          angular.forEach(result.errors, function(err, index){
	            $scope.detailAlerts.push({ type: 'danger', msg: err });
	          });
	        }
	      }, function(x){
	        $scope.detailAlerts.push({ type: 'danger', msg: 'Error updating catalog: ' + x });
	      });
      }else{
          throw new Error("the picture's url must be specified.");
      }      
    };
    $scope.deleteCategory = function(){
      $scope.deleteAlerts =[];
      if(confirm('Are you sure?')){
        adminResource.deleteCatalog($scope.catalog._id).then(function(result){
          if(result.success){
            //redirect to admin catalogs index page
            $location.path('/admin/catalogs');
          }else{
            //error due to server side validation
            angular.forEach(result.errors, function(err, index){
              $scope.deleteAlerts.push({ type: 'danger', msg: err});
            });
          }
        }, function(x){
          $scope.deleteAlerts.push({ type: 'danger', msg: 'Error deleting catalog: ' + x });
        });
      }
    };

    $scope.updateContent = function(content){
        $scope.update(content);
    }

    $scope.deleteContent = function(id,details){
      return adminResource.updateCatalog(id,details);
    };

    $scope.removeContent = function(id){
      ModalFactory.trigger(this, "confirmation.html",function($uibModalInstance,topController){

        this.ok = function(){        
          $log.debug("current id" ,id);
          var data = {
            name: $scope.catalog.name,
            description: $scope.catalog.description,
            isPublished:$scope.catalog.isPublished,
            deletedId:id
          };
          topController.deleteContent(topController.catalog._id,data)
          .then(function(result){
            if(result.success){
               $uibModalInstance.close('OK');
              //topController.triggerSuccessModal('success','entry deleted !');
            }else{
               $uibModalInstance.close('OK');
              //topController.triggerErroModal('error','error during entry deletion!')
            }
          })
          .finally(function(){
            $uibModalInstance.close('OK');
            topController.$window.location.reload();
          });       
          
        };
        this.cancel = function(){
          $uibModalInstance.dismiss('cancel');
        };

        
      });
    };
    //initialize
  init();
	    
};//end constructor
   
}
HairdresserCatalogController.$inject =['$location','$log','hairdresserMAnager','$q','$scope','ModalFactory','$timeout','$state','hairdresserResource','$window','utility','haircutCategory','$stateParams','$sce'];

export {HairdresserCatalogController};


