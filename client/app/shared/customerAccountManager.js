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
 		const updateCustomerAppointment = (id,hairdresserId,dayOfWeek, selectedHour,hairdresserUsername,locationIndex)=>{
 				var deferred = $q.defer();
 				$http.put(apiUrl+`${API.dev.customerRoute}`+'/hairdresserAppointment', {id:id,hairdresserId:hairdresserId,dayOfWeek:dayOfWeek,selectedHour:selectedHour,hairdresserUsername:hairdresserUsername, locationIndex:locationIndex})
 				.then(function updateAppointmentSlotSuccessCallback(response){
 					deferred.resolve(response.data);
 				}, function updateAppointmentSlotErrorCallback(err){
 					deferred.reject(err);
 				});
 				return deferred.promise;
 		};
 		/**
 		 * [function allowing to update a customer appointment state]
 		 * @param  {[type]} appointmentId [description]
 		 * @param  {[type]} customerId    [description]
 		 * @return {[type]}               [description]
 		 */
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
 		/**
 		 * [function allowing to remove an appointment before the confirmation phase]
 		 * @param  {[type]} appointmentId [description]
 		 * @param  {[type]} customerId    [description]
 		 * @return {[type]}               [description]
 		 */
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
 		/**
 		 * [function allowing to remove an user appointment with reason]
 		 * @param  {[type]} appointmentId [description]
 		 * @param  {[type]} customerId    [description]
 		 * @param  {[type]} reason        [description]
 		 * @return {[type]}               [description]
 		 */
 		const removeCustomerAppointmentWithReason = (appointmentId,customerId,reason)=>{
 			var deferred = $q.defer();
 			$http.delete(apiUrl+`${API.dev.customerRoute}`+'/removeappointmentwithreason',{params:{appointmentId:appointmentId, customerId:customerId,reason:reason}})
 			.then(function removeCustomerAppointmentWithReasonSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function removeCustomerAppointmentWithReasonErrorCallback(err){
 				deferred.reject(new Error("An error occurs when trying to delete the customer appointment (err)=> ", err))
 			});
 			return deferred.promise;
 		};

 		/**
 		 * [Function allowing to update the customer preferences (location)]
 		 * @param  {[type]} location [user location]
 		 * @return {[type]}          [promise]
 		 */
 		const updateCustomerPreference = (location)=>{
 				var deferred = $q.defer();
 				$http.put(apiUrl+`${API.dev.customerRoute}`+'/updatecustomerpreference', {location:location})
 				.then(function updateCustomerPreferenceSuccessCallback(response){
 					deferred.resolve(response.data);
 				}, function updateCustomerPreferenceErrorCallback(err){
 					deferred.reject(err);
 				});
 				return deferred.promise;
 		};
 		/**
 		 * [description]
 		 * @param  {[type]} message [description]
 		 * @return {[type]}         [description]
 		 */
 		const updateCustomerNotificationState = (message)=>{
 				var deferred = $q.defer();
 				$http.put(apiUrl+`${API.dev.customerRoute}`+'/updatecustomernotification', {message:message})
 				.then(function updateCustomerNotificationStateSuccessCallback(response){
 					deferred.resolve(response.data);
 				}, function updateCustomerNotificationStateErrorCallback(err){
 					deferred.reject(err);
 				});
 				return deferred.promise;
 		};
 		/**
 		 * [description]
 		 * @param  {[type]} id    [description]
 		 * @param  {[type]} state [description]
 		 * @return {[type]}       [description]
 		 */
 		const updateAppointmentState = (id,state) =>{
 			var deferred = $q.defer();
 				$http.put(apiUrl+`${API.dev.customerRoute}`+'/updateappointmentstate', {id:id,state:state})
 				.then(function updateAppointmentStateSuccessCallback(response){
 					deferred.resolve(response.data);
 				}, function updateAppointmentStateErrorCallback(err){
 					deferred.reject(err);
 				});
 				return deferred.promise;
 		}

 		/**
 		 * [description]
 		 * @param  {[type]} id            [description]
 		 * @param  {[type]} hairdresserId [description]
 		 * @param  {[type]} reason        [description]
 		 * @param  {[type]} state         [description]
 		 * @return {[type]}               [description]
 		 */
 		const updateAppointmentStateWithReason = (id,customerId,reason, state)=>{
 			var deferred = $q.defer();
 			$http.put(apiUrl+`${API.dev.customerRoute}`+'/updateappointmentstatewithreason',{id:id,customerId:customerId, reason:reason,state:state})
 			.then(function updateAppointmentStateWithReasonSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function updateAppointmentStateWithReasonFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to update the hairdresser appointment state array(err)=> ", err))
 			});
 			return deferred.promise;
 		}

 		const deleteUserAccount = (id)=>{
 			console.log('user id ', id);
 			var deferred = $q.defer();
 			$http.delete(apiUrl+`${API.dev.customerRoute}`+'/'+id)
 			.then(function deleteCustomerAccountSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function deleteCustomerAccountFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to delete an user account  array(err)=> ", err))
 			});
 			return deferred.promise;
 		};

 		return {
 			updateCustomerAppointment,
 			updateCustomerAppointmentState,
 			removeCustomerAppointmentAndNotify,
 			removeCustomerAppointmentWithReason,
 			updateCustomerPreference,
 			updateCustomerNotificationState,
 			updateAppointmentState,
 			updateAppointmentStateWithReason,
 			deleteUserAccount
 		};
 };

customerAccountManager.$inject =['$http','$q','API','$log'];
export {customerAccountManager};