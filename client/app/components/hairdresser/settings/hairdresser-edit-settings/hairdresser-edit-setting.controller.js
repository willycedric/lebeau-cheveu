
class HairdressersettingsController {
  constructor(API,$log,$location,Auth,$stateParams,$q,$scope,ModalFactory,hairdresserMAnager,$http,hairdresserResource) {
        var self=this;	 		 	 
		 self.$location=$location;
		 self.Auth = Auth;	
		 self.API= API; 
		 self.$q = $q;
		 self.$stateParams = $stateParams;		 
		 self.$log =$log;
		 self.$scope =$scope;		 
		 self.ModalFactory  = ModalFactory;
		 self.hairdresserMAnager = hairdresserMAnager;
		 self.$http = $http;
		 self.hairdresserResource = hairdresserResource;
		 self.listOfAvailableCategories=[];
		//  self.listOfAvailableHaircut =["Vanilles",
		// 							"Tresses (Braids)",
		// 							"Crochet braids",
		// 							"Tissages",
		// 							"Locks ",
		// 							"Coiffures sur cheveux naturels ",
		// 							"Lissages (Brushing, Défrisage)",
		// 							"Extensions de cheveux ",
		// 							"Colorations",
		// 							"Perruque / Lace wig",
		// 							"Shampoing",
		// 							"Nattes collées",
		// 							"Cornrows",
		// 							"Tresses enfants"];
		 self.listOfAvailableHaircut =[];

			self.listOfAvailableCustomerType = ["Homme", "Femme", "Mixte"];	
			self.customerType =[];//list of selected customer type
			self.haircutCategory=[];//list of selected haircut category
			self.haircutType = [];
			var init = ()=>{				
				//Get the list of available Hairtcut categories defined by the administrator
				self.hairdresserResource.getAvailableHaircutCategories()
				.then((result) => {					
					result.data.map((category) => {
						self.listOfAvailableCategories.push(category.name);
					});					
				}, (err) => {
					console.error(err.toString());
				});
				//Get the list of available haircut styles
				self.hairdresserResource.getAvailableHaircutStyles()
				.then( function getAvailableHaircutStylesSuccess(result){
					self.listOfAvailableHaircut = result.data.map((style)=>{
						if(style.state){
							return style.name;
						}
					});
				console.log(JSON.stringify(self.listOfAvailableHaircut, null, 4));
				}, function getAvailableHaircutStylesError(err){
					console.error(err.toString());
				});
				self.details =  self.$stateParams.details;//Object containing hairdresser customer type, haircuts category and performance list				
				if(self.details.customer_type == 0){
					self.customerType.push("Mixte");
				}
				else if(self.details.customer_type==1){
					self.customerType.push("Femme");
				}
				else if(self.details.customer_type==2){
					self.customerType.push("Homme");
				}
				if(self.details.categories.length>0){
					angular.forEach(self.details.categories,(category)=>{
						angular.forEach(self.listOfAvailableCategories, (name)=>{
							if(category.hasOwnProperty("name")){
								if(category.name.toLowerCase() === name.toLowerCase()){
								self.haircutCategory.push(name);
								}
							}			 			
						});				
					});
				 }				
				self.haircutType = self.details.listOfPerformance;//list of selected haircut 
				var data = {
					customerType:self.customerType,
					haircutCategory:self.haircutCategory,
					haircutType:self.haircutType
				};				
			};
			init();						
			
  } //end constructor  	
  	/**
	 * Redirect to hairdresser Account
	 */		
  	goBackToHairdresserAccount(){
		var self=this;
		self.$location.path('/hairdresser/account');
	}

	/**
	 * [displayConfirmationModal Function used to display a confirmation message on error or success]
	 * @param  {[type]} message [message displayed in the modal]
	 * @param  {[type]} flag    [success (true) or error (false) flag]
	 */
	displayConfirmationModal(message,flag){
		var self = this;
		self.ModalFactory.trigger(self,'confirmation-modal.html','hairdresserPreference', function($uibModalInstance,topController){
			this.message = message;
			this.isSuccess=flag;
			this.ok = ()=>{
				//self.$window.location.reload();
				$uibModalInstance.close('close');
			};
		});
	}
	/**
	 * 
	 * @param {*} values 
	 */
	updateSelectionList(values,selectionList,listOfAvailable){		
		var self=this;			
		for(var value in values){			
			if(typeof values[value] == typeof("ABC")){
				var index = selectionList.indexOf(values[value].toUpperCase());				
				if(index==-1){
					selectionList.push(values[value].toUpperCase());
				}
			}else{
				if(selectionList.length!=0){					
					var index = selectionList.indexOf(listOfAvailable[parseInt(values[value])].toUpperCase());					
					if(index>=0){
						selectionList.splice(index,1);
					}					
				}				
			}
		}
	}	
	/**
	 * 
	 */

	updatePreference(){
		var self=this;
		if(self.customerType.length !=0 || self.haircutCategory!=0 || self.haircutType.length!=0){			
			var data = {};
			if(self.customerType.length!=0){				
				//data.customerType = self.customerType;
				if(self.customerType.indexOf("Mixte")>=0){					
					data.customer_type = 0;
				}else if(self.customerType.indexOf("Homme")>=0){
					data.customer_type=2;
				}else if(self.customerType.indexOf("Femme")>=0){
					data.customerType=1;
				}
			}
			if(self.haircutCategory.length!=0){
				data.haircutCategory = self.haircutCategory;
			}
			if(self.haircutType.length!=0){
				data.haircutType = self.haircutType;
			}			
			self.$http.put(`${self.API.dev.homeUrl}`+`${self.API.dev.hairdresserRoute}`+'/setting/preference',{data})
				.then((rep)=>{
					//deserialize(rep.data);					
				}, (err)=>{
					throw new Error(err.toString());
				})
				.finally((rep)=>{					
					self.goBackToHairdresserAccount();
				});
		}else{
			throw new Error("No items selected.");
		}
	}

	/**
	 * 
	 * @param {*} index 
	 * @param {*} selectedList 
	 * @param {*} listOfAvailable 
	 */
	isAlreadySelected(index,selectedList,listOfAvailable){		
		var self=this;
		var found = false;
		try{			
			 found = selectedList.indexOf(listOfAvailable[index])>=0?true:false;
		}catch(err){
			throw new Error(err.toString());
		}				
		return found;			
	}

}//end class
HairdressersettingsController.$inject =['API','$log','$location','Auth','$stateParams','$q','$scope','ModalFactory','hairdresserMAnager','$http','hairdresserResource'];
export {HairdressersettingsController};