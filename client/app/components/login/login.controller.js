class LoginController {
  constructor($http,API,$window,$q,Auth,$state,$rootScope) {
    var self = this;
    self.url=`${API.url}`;
    
    /**
     * [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
   self.login = (data)=>{
    	Auth.login(data.email,data.password)
            .then(function loginControllerSuccess(data){
                $rootScope.$broadcast('connectionStatechanged',{data:data.user});
                $state.go('home',null,{reload:true});                
            },function loginControllerError(err){
                console.error(err);
            });        
    };
   
    self.addUser = (data, userForm)=>{
        if(userForm.$valid){
            console.log(JSON.stringify(data));
            $http({
                url:self.url+'/api/users',
                method:'POST',
                data:data
            })
            .then( (response)=>{
                console.log(JSON.stringify(response.data));
            },(err)=>{
                console.error(err);
            });
        }
    };

    

  }//End constructor

}

LoginController.$inject = ['$http','API','$window','$q','Auth','$state','$rootScope'];

export {LoginController};


