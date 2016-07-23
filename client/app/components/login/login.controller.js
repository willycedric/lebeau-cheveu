class LoginController {
  constructor($http,API,$window,$q,Auth,$state) {
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
                $state.go('profile',{},{reload:true});
            },function loginControllerError(err){
                console.error(err);
            });        
    };

    /*
    self.me = () =>{
        $http({
            url:self.url+'/api/users/me',
            method:'GET'
        }).then(function getMeSuccessCallBack(response){
         //self.user = response.data;
         //User.addUser(response.data);
         console.log(JSON.stringify(self.user));        
        }, function getMeErrorCallBack(err){
            console.error(err);
        });
    };
    */
   
    /**
     * [description]
     * @param  {[type]} data     [description]
     * @param  {[type]} userForm [description]
     * @return {[type]}          [description]
     */
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

    /**
     * [description]
     * @return {[type]} [description]
     */
    self.logout = () =>{
           Auth.logout();
    };

  }//End constructor

}

LoginController.$inject = ['$http','API','$window','$q','Auth','$state'];

export {LoginController};


