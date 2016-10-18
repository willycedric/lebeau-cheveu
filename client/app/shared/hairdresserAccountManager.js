 const hairdresserAccountManager = ($http,$q,API,$log) =>{
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
 		const updateAppointmentSlot = (hairdresserId, appointmentId, slotIndex,customerId)=>{
 				var deferred = $q.defer();
 				$http.put(apiUrl+`${API.dev.hairdresserRoute}`+'/hairdresserAppointment', {hairdresserId:hairdresserId, appointmentId:appointmentId,slotIndex:slotIndex,customerId:customerId})
 				.then(function updateAppointmentSlotSuccessCallback(response){
 					$log.debug('no response now');
 				}, function updateAppointmentSlotErrorCallback(err){
 					$log.error('no response');
 				});
 				return deferred.promise;
 		};

 		return {
 			updateAppointmentSlot
 		};
 };

hairdresserAccountManager.$inject =['$http','$q','API','$log'];
export {hairdresserAccountManager};