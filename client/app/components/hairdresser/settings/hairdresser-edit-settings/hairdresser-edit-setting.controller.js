
class HairdressersettingsController {
  constructor(API,$log,Auth,$stateParams,$q,$scope,ModalFactory,hairdresserMAnager,$http,hairdresserResource, AuthToken, $rootScope, $state) {
         var self=this;	 		 
		 self.Auth = Auth;	
		 self.API= API; 
		 self.$q = $q;		 
		 self.$stateParams = $stateParams;	
		 self.$state = $state;	 
		 self.$log =$log;
		 self.$scope =$scope;		 
		 self.ModalFactory  = ModalFactory;
		 self.hairdresserMAnager = hairdresserMAnager;
		 self.$http = $http;
		 self.hairdresserResource = hairdresserResource;
		 self.listOfAvailableCategories=[];
		self.AuthToken =AuthToken;
		self.tempSeletectedHaircuts = [];//contains the list of selected haircuts
		self.listOfAvailableHaircutPrices= [];
		self.isHaircutSelected = false; // whether an haircut is selected by the hairdresser. 
		self.formatedList=[];//
		self.prices = [];
		Array.prototype.indexOfObject = function (property, value) {
			for (var i = 0, len = this.length; i < len; i++) {
				if (this[i][property] === value) return i;
			}
				return -1;
		}
				
		 self.listOfAvailableHaircut =[];

			self.listOfAvailableCustomerType = ["Homme", "Femme", "Mixte"];	
			self.customerType =[];//list of selected customer type
			self.haircutCategory=[];//list of selected haircut category
			self.haircutType = [];
			var init = ()=>{
				//store hairdresser details in the local storage
				self.details = self.AuthToken.getObj('hairdresserDetails')==undefined?self.$stateParams.details:self.AuthToken.getObj('hairdresserDetails');			
				if(self.details){
					//check if a previous version of the hairdresserDetails are already save in the localStorage
					if(self.AuthToken.getObj('hairdresserDetails')){
						self.AuthToken.erase('hairdresserDetails');// delete the previous version
					}
					//store the new version
					self.AuthToken.saveObj('hairdresserDetails', self.details);
				}							
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
				.then( function getAvailableHaircutStylesSuccess(results){					
					self.listOfAvailableHaircut = results.data.map((style)=>{
						if(style.state){
							return style.name;
						}
					});						
					self.listOfAvailableHaircutPrices = results.data.map((style)=>{						
						if(style.state){						
							return style.price;
						}					
					});
				}, function getAvailableHaircutStylesError(err){
					console.error(err.toString());
				});				

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
		if(self.AuthToken.getObj('hairdresserDetails')){
			self.AuthToken.erase('hairdresserDetails');
		}
		self.$state.go('hairdresseraccount');
		//self.$location.path('/hairdresser/account');
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
		var elt = undefined;
		if(!!(parseInt(values.value)+1)){
			var entry = self.listOfAvailableHaircut[parseInt(values.value)];
			if(self.tempSeletectedHaircuts.indexOf(entry)<0){
				self.tempSeletectedHaircuts.push(entry);
				self.displayListOfAvailablePrices(self.tempSeletectedHaircuts,elt);
			}else{
				elt = self.tempSeletectedHaircuts[self.tempSeletectedHaircuts.indexOf(entry)];
				self.tempSeletectedHaircuts.splice(self.tempSeletectedHaircuts.indexOf(entry),1);				
				self.displayListOfAvailablePrices(self.tempSeletectedHaircuts, elt);
			}
		}else{
			if(self.tempSeletectedHaircuts.indexOf(values.value)<0){
				self.tempSeletectedHaircuts.push(values.value);
				self.displayListOfAvailablePrices(self.tempSeletectedHaircuts,elt);
			}else{
				elt = self.tempSeletectedHaircuts[self.tempSeletectedHaircuts.indexOf(values.value)];
				self.tempSeletectedHaircuts.splice(self.tempSeletectedHaircuts.indexOf(values.value),1);
				self.displayListOfAvailablePrices(self.tempSeletectedHaircuts,elt);
			}
		}			
		
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

	updatePreference(prices, listOfSelectedHaircuts){
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
			var temp =[];
			angular.forEach(listOfSelectedHaircuts, function(haircut, index){
				temp.push({
					name:haircut.name,
					price:prices[index]
				});
			});
			data.prices = temp;
			
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
	/**
	 * 
	 * @param {*} listOfSelectedHaircuts 
	 */
	displayListOfAvailablePrices(listOfSelectedHaircuts, elt){		
		var self=this;						
		if(listOfSelectedHaircuts.length > 0 && elt == undefined){
			self.isHaircutSelected = true;	
			angular.forEach(listOfSelectedHaircuts, function(haircut){							
				var ind = self.listOfAvailableHaircut.indexOf(haircut);
				if(ind>=0){
					var obj = {
						name:haircut,
						price: self.listOfAvailableHaircutPrices[ind]
					}				
					if(self.formatedList.indexOfObject('name', haircut)<0){
						self.formatedList.push(obj);
					}
				}
			});
		}else if(elt){
			self.formatedList.splice(self.formatedList.indexOfObject('name', elt),1);
			if(self.formatedList.length <= 0 || listOfSelectedHaircuts.length <=0){
					self.isHaircutSelected =false;
			}
		}else{
			self.isHaircutSelected =false;
			self.formatedList=[];
		}		
	}
	

}//end class
HairdressersettingsController.$inject =['API','$log','Auth','$stateParams','$q','$scope','ModalFactory','hairdresserMAnager','$http','hairdresserResource', 'AuthToken', '$rootScope', '$state'];
export {HairdressersettingsController};