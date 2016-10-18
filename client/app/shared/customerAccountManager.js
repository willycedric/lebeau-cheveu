 const customerAccountManager = ($http,$q,API,$log) =>{
 		/**
 		 * Function used to update an appoitment time slote
 		 * @param  {[Schema.Types.ObjectId]} hairdresserId [hairdresser id]
 		 * @param  {[Schema.Types.ObjectId]} appoitmentId  [appointment id]
 		 * @param  {[type]} slotIndex     [time slot index]
 		 * @return {[type]}               [http response]
 		 */
 		/**
 		 * [apiUrl description]
 		 * @type {[type]}
 		 */
		 let apiUrl=`${API.dev.homeUrl}`;
 		const updateCustomerAppointmentSlot = (hairdresserId, appointmentId, slotIndex,dayOfWeek)=>{
 				var deferred = $q.defer();
 				$http.put(apiUrl+`${API.dev.customerRoute}`+'/hairdresserAppointment', {hairdresserId:hairdresserId, appointmentId:appointmentId,slotIndex:slotIndex,dayOfWeek:dayOfWeek})
 				.then(function updateAppointmentSlotSuccessCallback(response){
 					$log.debug('no response now');
 				}, function updateAppointmentSlotErrorCallback(err){
 					$log.error('no response');
 				});
 				return deferred.promise;
 		};

 		return {
 			updateCustomerAppointmentSlot
 		};
 };

customerAccountManager.$inject =['$http','$q','API','$log'];
export {customerAccountManager};