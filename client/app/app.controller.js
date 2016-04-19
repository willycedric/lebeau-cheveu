
class AppController {
	constructor(){
		this.menuItems = ['Leboncheveu','catalogue','Blog','Magasin','Connexion/Inscription'];
		this.isTrue = false;
		this.toggle = function (){
			console.log('item clicked','isTrue ',this.isTrue);
			return this.isTrue =!this.isTrue;
		}
	}
}

export {AppController};