class UploaderController {
  constructor($scope,$log,hairdresserResource,filepickerService) {
  	
	$scope.upload = function(data){
		hairdresserResource.upload(data)
		.then((rep)=>{
			$log.debug(rep);
		},(err)=>{
			$log.error(err);
		});
	};

	/*var fileUpload = document.getElementById('file-upload');

     fileUpload.addEventListener('change', function(event){
    	console.log(event);
    	var file = event.target.files[0];	
    	var formData = new FormData();
    	formData.append('file',file);
    	hairdresserResource.upload(formData)
    	.then((rep)=>{
    		$log.debug(rep);
    	});

    });*/

     $scope.upload = function(){
		filepickerService.pick(
            {
				mimetype: 'image/*',
				language: 'fr',
				services: ['COMPUTER'],
				openTo: 'COMPUTER'
			},
            function(Blob){
				console.log(JSON.stringify(Blob));
				$scope.superhero.picture = Blob;
				$scope.$apply();
			}
        );
	};

	
	}//end constructor

}

UploaderController.$inject=['$scope','$log','hairdresserResource','filepickerService'];
export {UploaderController};


