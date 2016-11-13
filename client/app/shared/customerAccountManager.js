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
 		const updateCustomerAppointment = (id,hairdresserId,dayOfWeek, selectedHour,hairdresserUsername)=>{
 				var deferred = $q.defer();
 				$http.put(apiUrl+`${API.dev.customerRoute}`+'/hairdresserAppointment', {id:id,hairdresserId:hairdresserId,dayOfWeek:dayOfWeek,selectedHour:selectedHour,hairdresserUsername:hairdresserUsername})
 				.then(function updateAppointmentSlotSuccessCallback(response){
 					deferred.resolve(response.data);
 				}, function updateAppointmentSlotErrorCallback(err){
 					deferred.reject(err);
 				});
 				return deferred.promise;
 		};

 		const updateCustomerAppointmentState = (appointmentId, customerId)=>{
 				var deferred = $q.defer();
 				$http.put(apiUrl+`${API.dev.customerRoute}`+'/hairdresserAppointmentUpdate', {appointmentId:appointmentId,customerId:customerId})
 				.then(function updateAppointmentSlotSuccessCallback(response){
 					deferred.resolve(response.data);
 				}, function updateAppointmentSlotErrorCallback(err){
 					deferred.reject(err);
 				});
 				return deferred.promise;
 		};

 		const removeCustomerAppointmentAndNotify = (appointmentId,customerId)=>{
 			var deferred = $q.defer();
 			$http.delete(apiUrl+`${API.dev.customerRoute}`+'/removeCustomerAppointmentAndNotify',{params:{appointmentId:appointmentId, customerId:customerId}})
 			.then(function removeCustomerAppointmentAndNotifySuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function removeCustomerAppointmentAndNotifyCallback(err){
 				deferred.reject(new Error("An error occurs when trying to delete the customer appointment (err)=> ", err))
 			});
 			return deferred.promise;
 		};

 		return {
 			updateCustomerAppointment,
 			updateCustomerAppointmentState,
 			removeCustomerAppointmentAndNotify
 		};
 };

customerAccountManager.$inject =['$http','$q','API','$log'];
export {customerAccountManager};