class UploaderController {
  constructor($scope,$log,hairdresserResource,Upload,Formulator,ModalFactory,securityAuthorization,PhotoUploader, $sce,$window,$stateParams) {
  	
		// upload later on form submit or something similar
	    $scope.submit = function() {
	      if ($scope.form.file.$valid && $scope.file) {
	        $scope.upload($scope.file);
	      }
	    };
	    this.$log=$log;
	    this.securityAuthorization =securityAuthorization;
	    this.PhotoUploader=PhotoUploader;
	    this.$scope =$scope;
	    this.loading = false;
		this.uploadPhoto = null;
		this.croppedPhoto = null;
		this.url="";
		this.name ="Jean-Michel";
		this.type="Mixte";
		this.$window=$window;
		this.hairdresserResource=hairdresserResource;		
		this.$stateParams=$stateParams;		
		
		this.trustSrc = function(src){
			return  $sce.trustAsResourceUrl(src);
		}   

	    $scope.launchModal = ()=>{		    	 
	    	var self=this;  
		     ModalFactory.trigger(self,'uploder.html', 'custom',function($uibModalInstance,topController){  
		     	var same = this;   
	          this.readFileImg = function(files){	          
				  same.uploadPhoto = null;
				  same.myCroppedImage = null;
				  //$scope.user.photo = null;

				  if (files && files.length) {
				    var readImgCallback = function(err, img){
				      same.loading = false;
				      if(err) return $log.error($scope, err);

				      $scope.$apply(function(){
				        same.uploadPhoto = img;
				      });
				    };
				    same.loading = true;

				    Formulator.readImageFile(files[0], readImgCallback);
				  }
				};	          

				this.ok = ()=>{
					
					topController.upload(same, $scope.destination);
					$uibModalInstance.close('OK');
					$log.debug("Modal close");
				}
	          this.cancel = ()=>{
	            $uibModalInstance.dismiss('cancel');
	            $log.log("Modal canceled.");
	          };


	      	});
	   };
      
	   

	
	}//end constructor

		upload(controller,uiDestination){
			var destination = uiDestination==undefined?'profil':uiDestination;
			switch(destination){
				case "profil":
				{
					var self = this;
					if(controller.myCroppedImage){
						controller.loading=true;					

						self.securityAuthorization.requireCurrentUser()
							.then(function(user){
								self.PhotoUploader.updateProfilePhoto(user,controller.myCroppedImage)
								.then(function(rep){											
									self.url=rep.data;										
									self.$window.location.reload();				
								},function(err){
									self.$log.debug(controller,'Error saving photo.');
								})
								.finally(function(){
									controller.loading=false;
								});
							});
						
					}else{
						controller.loading=false;
					}
				}
				break;
				case "galery":
				{
					var self = this;
					if(controller.myCroppedImage){
						controller.loading=true;					
						var data = {
							photo:controller.myCroppedImage,
							type:'file',
							categoryId:self.$stateParams.id
						}						
						self.securityAuthorization.requireCurrentUser()
							.then(function(user){
								self.hairdresserResource.updateGaleryEntry(data)
								.then(function(rep){																			
										self.$window.location.reload();																	
								},function(err){
									throw new Error(err.toString());
								})
								.finally(function(){
									controller.loading=false;
								});
							});
						
					}else{
						controller.loading=false;
					}
				}
				break;
				default:
				throw new Error("the "+destination+" is not handle");
				break;
			}
		}
}

UploaderController.$inject=['$scope','$log','hairdresserResource','Upload','Formulator','ModalFactory','securityAuthorization','PhotoUploader', '$sce','$window','$stateParams'];
export {UploaderController};


