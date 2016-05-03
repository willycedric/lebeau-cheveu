import labels from '../../labels.json';
class AppController {
	constructor(){
		this.labels =labels; //Label.init;
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
export {AppController};