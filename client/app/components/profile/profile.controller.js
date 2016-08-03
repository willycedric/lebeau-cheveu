class ProfileController {
  constructor(AuthToken) {

    var token = AuthToken.getToken();
    if(token){
        this.userName= AuthToken.parseToken(token).name;
    }
    

};//end constructor;
}
ProfileController.$inject =['AuthToken'];
export {ProfileController};


