const searchBar = ($http,$q, API)=>{
		let listOfAvailableAfroHaircuts = ["Vanilles",
"Tresses (Braids)",
"Crochet braids",
"Tissages",
"Locks ",
"Coiffures sur cheveux naturels ",
"Lissages (Brushing, Défrisage)",
"Extensions de cheveux ",
"Colorations",
"Perruque / Lace wig",
"Shampoing",
"Nattes collées",
"Cornrows",
"Tresses enfants"];


let listOfAvailableEuropeanHaircuts = ["Vanilles",
"Tresses (Braids)",
"Crochet braids",
"Tissages",
"Locks ",
"Coiffures sur cheveux naturels ",
"Lissages (Brushing, Défrisage)",
"Extensions de cheveux ",
"Colorations",
"Perruque / Lace wig",
"Shampoing",
"Nattes collées",
"Cornrows",
"Tresses enfants"];


let listOfAvailableCurlyHaircuts = ["Vanilles",
"Tresses (Braids)",
"Crochet braids",
"Tissages",
"Locks ",
"Coiffures sur cheveux naturels ",
"Lissages (Brushing, Défrisage)",
"Extensions de cheveux ",
"Colorations",
"Perruque / Lace wig",
"Shampoing",
"Nattes collées",
"Cornrows",
"Tresses enfants"];

let listOfIleDeFranceDepartement = ["91-Essonne","92-Hauts-de-Seine","94-Val-de-Marne","78-Yvelines","75-Paris","77-Seine-et-Marne","93-Seine-Saint-Denis","95-Val-d'Oise"]
let listOfAvailableCategories = ['cheveux afro','cheveux lisses',"cheveux bouclés"];
		
		

		/**
		 * [description]
		 * @return {[Array]} [list of available afro haircuts]
		 */
		 const getListOfavailableAfroHaircuts = () =>{
		 	return listOfAvailableAfroHaircuts;
		 };
		 /**
		  * [getListOfavailableEuropeanHaircuts description]
		  * @type {[array]} 
		  */
		 const getListOfavailableEuropeanHaircuts = ()=>{
		 	return listOfAvailableEuropeanHaircuts;
		 };

		 /**
		  * [getListOfavailableCurlyHaircuts description]
		  * @type {[type]}
		  */
		 const getListOfavailableCurlyHaircuts = ()=>{
		 	return listOfAvailableCurlyHaircuts;
		 };	
		 /**
		  * [description]
		  * @return {[array]} [list of available categories]
		  */
		 const getListOfavailableCategories = () =>{
		 	return listOfAvailableCategories;
		 };

		 return {
		 	getListOfavailableAfroHaircuts,
		 	getListOfavailableEuropeanHaircuts,
		 	getListOfavailableCurlyHaircuts,
		 	getListOfavailableCategories
		 };
};

searchBar.$inject =['$http','$q','API'];
export {searchBar};