 const hairdresserAccountManager = ($http,$q,API,$log) =>{

 		const availableHaircutCategories =["Cheveux Afro", "Cheveux lisses", "Cheveux bouclés"];
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
 		const updateHairdresserAppointment= (hairdresserId,dayOfWeek,selectedHour,location)=>{
			 console.log("hairdresser Id",hairdresserId );
 				var deferred = $q.defer();
 				$http.put(apiUrl+`${API.dev.hairdresserRoute}`+'/hairdresserAppointment', {hairdresserId:hairdresserId, dayOfWeek:dayOfWeek,selectedHour:selectedHour,location:location})
 				.then(function updateAppointmentSlotSuccessCallback(response){
 					deferred.resolve(response.data);
 				}, function updateAppointmentSlotErrorCallback(err){
 					deferred.reject(err);
 				});
 				return deferred.promise;
 		};

 		/**
 		 * [description]
 		 * @param  {[type]} appointmentId [description]
 		 * @return {[type]}               [description]
 		 */
 		const getAppointmentById = (appointmentId)=>{
 			var deferred = $q.defer();
 			$http.post(apiUrl+`${API.dev.hairdresserRoute}`+'/hairdresserAppointmentId',{appointmentId:appointmentId})
 			.then(function getAppointmentByIdSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function getAppointmentByIdFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to get an appointment by it's Id (err)=> ", err))
 			});
 			return deferred.promise;
 		};

 		/**
 		 * Function allowiing to update the hairdresser booking arrays with a new confirmed appointment
 		 * @param  {[type]} customerFirstNAme [customer first name]
 		 * @param  {[type]} customerLastName  [customer last name]
 		 * @param  {[type]} appointmentDay    [appointment day]
 		 * @param  {[type]} appointmentHour   [appointment hour]
 		 * @param  {[type]} customerLocation   [customer Location]
 		 * @return {[type]}                   [description]
 		 */
 		const updateHairdresserBooking = (apt)=>{
 			var deferred = $q.defer();
 			$http.put(apiUrl+`${API.dev.hairdresserRoute}`+'/hairdresserupdatebooking',apt)
 			.then(function updateHairdresserBookingSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function updateHairdresserBookingFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to update the hairdresser booking array(err)=> ", err))
 			});
 			return deferred.promise;
 		};

 		const deleteHairdresserBooking = (appointmentId)=>{
 			var deferred = $q.defer();
 			$http.delete(apiUrl+`${API.dev.hairdresserRoute}`+'/hairdresserbooking',{params:{id:appointmentId}})
 			.then(function deleteHairdresserSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function deleteHairdresserFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to delete booking array(err)=> ", err))
 			});
 			return deferred.promise;
 		};

 		/**
 		 * Function allowing to remove an appointment canceled by the hairdresser
 		 * @param  {[type]} appointmentId [description]
 		 * @return {[type]}               [description]
 		 */
 		const removeHairdresserAppointement = (appointmentId)=>{
 			var deferred = $q.defer();
 			$http.delete(apiUrl+`${API.dev.hairdresserRoute}`+'/hairdresserupdatebooking',{params:{id:appointmentId}})
 			.then(function removeHairdresserAppointementSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function removeHairdresserAppointementFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to delete the hairdresser appointment (err)=> ", err))
 			});
 			return deferred.promise;
 		};
 		/**
 		 * [description find hairdressers matching the search parameters]
 		 * @param  {[type]} searchParameters [search parameters]
 		 * @return {[type]}                  [list of hairdressers account matching the serach parametes]
 		 */
 		const findHairdressers = (searchParameters)=>{
 			var deferred = $q.defer();
 			$http.post(apiUrl+`${API.dev.hairdresserRoute}`+'/findHairdressers',searchParameters)
 			.then(function findHairdressersSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function findHairdressersFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to find Hairdressers(err)=> ", err))
 			});
 			return deferred.promise;
 		};

 		/**
 		 * [description locked a date&time period]
 		 * @param  {[type]} date         [Locked date]
 		 * @param  {[type]} selectedHour [locked time slot]
 		 * @return {[type]}              [action confirmation ]
 		 */
 		const lockedHairdresserTimeSlot = (date)=>{
 			var deferred = $q.defer();
 			$http.put(apiUrl+`${API.dev.hairdresserRoute}`+'/lockedHairdressertimeslot',{date:date})
 			.then(function lockedHairdresserTimeSlotSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function lockedHairdresserTimeSlotFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to update the hairdresser locked time slot array(err)=> ", err))
 			});
 			return deferred.promise;
 		};

 		/**
 		 * [description]
 		 * @param  {[type]} appointment [description]
 		 * @return {[type]}             [description]
 		 */
 		const  getHairdresserNotYetConfirmedAppointmentNumber = (appointment)=>{
 			var count = 0;
 			angular.forEach(appointment, (apt)=>{
 				if(apt.slotState == 0){
 					count++;
 				}
 			});
 			return count;
 		};

 		/**
 		 * [description]
 		 * @param  {[type]} id            [description]
 		 * @param  {[type]} hairdresserId [description]
 		 * @param  {[type]} reason        [description]
 		 * @param  {[type]} state         [description]
 		 * @return {[type]}               [description]
 		 */
 		const updateAppointmentStateWithReason = (id,hairdresserId,reason, state)=>{
 			var deferred = $q.defer();
 			$http.put(apiUrl+`${API.dev.hairdresserRoute}`+'/updateappointmentstatewithreason',{id:id,hairdresserId:hairdresserId, reason:reason,state:state})
 			.then(function updateAppointmentStateWithReasonSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function updateAppointmentStateWithReasonFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to update the hairdresser appointment state array(err)=> ", err))
 			});
 			return deferred.promise;
 		}
 		/**
 		 * [description]
 		 * @param  {[type]} id    [description]
 		 * @param  {[type]} state [description]
 		 * @return {[type]}       [description]
 		 */
 		const updateAppointmentState = (id,state)=>{
 			var deferred = $q.defer();
 			$http.put(apiUrl+`${API.dev.hairdresserRoute}`+'/updateappointmentstate',{id:id,state:state})
 			.then(function updateAppointmentStateSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function updateAppointmentStateFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to update the hairdresser appointment state array(err)=> ", err))
 			});
 			return deferred.promise;
 		}

 		/**
 		 * [function used to delete an hairdresser account]
 		 * @param  {[type]} id [hairdresser id]
 		 * @return {[type]}    [description]
 		 */
 		const deleteHairdresserAccount = (id)=>{
 			var deferred = $q.defer();
 			$http.delete(apiUrl+`${API.dev.hairdresserRoute}`+'/'+id)
 			.then(function deleteHairdresserSuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function deleHairdresserFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to update the hairdresser appointment state array(err)=> ", err))
 			});
 			return deferred.promise;
 		}

 		const updateHaircutCategory = (data)=>{
 			var deferred = $q.defer();
 			$http.put(apiUrl+`${API.dev.hairdresserRoute}`+'/updatecategory',data)
 			.then(function updateCategorySuccessCallback(response){
 				deferred.resolve(response.data);
 			}, function updateCategoryFailureCallback(err){
 				deferred.reject(new Error("An error occurs when trying to update the hairdresser haircut's category.", err))
 			});
 			return deferred.promise;
 		};

 		return {
 			updateHairdresserAppointment,
 			getAppointmentById,
 			updateHairdresserBooking,
 			removeHairdresserAppointement,
 			findHairdressers,
 			lockedHairdresserTimeSlot,
 			deleteHairdresserBooking,
 			getHairdresserNotYetConfirmedAppointmentNumber,
 			updateAppointmentStateWithReason,
 			updateAppointmentState,
 			deleteHairdresserAccount,
 			availableHaircutCategories,
 			updateHaircutCategory
 		};
 };

hairdresserAccountManager.$inject =['$http','$q','API','$log'];
export {hairdresserAccountManager};