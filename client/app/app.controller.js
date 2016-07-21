import labels from '../../labels.json';
class AppController {
	constructor(User){
		this.labels =labels; //Label.init;
		this.logged = User.getLogged();
		console.log("App ", User.getUser(), User.getLogged());
	}
}
var Label = (function(){
	var toggle=true;
	var toggleLanguage = function(){
		var language;
		if(toggle){
			language = labels.french;
		}else{
			language = labels.english
		}
		toggle=!toggle;
		debugger;
		return language;
	};

	var init = function(){
		return toggleLanguage;
	};
	return{
		init:init
	};
})();
AppController.$inject=['User'];
export {AppController};