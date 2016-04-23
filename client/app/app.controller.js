import labels from '../../labels.json';
class AppController {
	constructor(){
		this.menuItems = ['Lebeaucheveu','catalogue','Blog','Magasin','Connexion/Inscription'];
		this.footerMenuItems={
			L_W_USER_GUIDE:'Guide d\'utilisateur',
			L_W_USER_TERMS:'Termes d\'utilisation',
			L_W_NEWS_LETTERS:'News Letter'
		};	
		this.labels =labels;
	}
}
export {AppController};