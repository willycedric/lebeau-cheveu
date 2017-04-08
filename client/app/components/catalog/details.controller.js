class detailCtrl {
    constructor($scope,$q,$route, $location, $log,$stateParams,hairdresserResource,$window) {
        var self=this;  
        self.hairdresserResource=hairdresserResource;
        self.$window =$window;
       var deserializeData = function(data){           
            var urlDetails=[];
             urlDetails= data.split('/');
            const id = urlDetails[3];
            const categoryName = urlDetails[4];
            if(categoryName){
                self.isPublic=false;
            }else{
                self.isPublic=true;
            }           

        };

        this.deletePicture=(content)=>{            
           hairdresserResource.deleteGaleryEntries(content.content._id)
           .finally((rep)=>{
                self.$window.location.reload();
           });
    };
        deserializeData($location.path());    
    }//end constructor

    
} 

detailCtrl.$inject =['$scope','$q','$route', '$location','$log', '$stateParams','hairdresserResource','$window'];
export {detailCtrl};
