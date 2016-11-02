import join from './join.html';
class JoinController {
  constructor($uibModal,$log, AuthToken) {
  	
    this.url= "http://res.cloudinary.com/hgtagghpz/image/upload/v1475152779/smile_nucifu.jpg";
    this.islogged=false;
    if(AuthToken.getToken()){
      this.islogged =true;
    }
   
  }//End constructor

}

export {JoinController};


