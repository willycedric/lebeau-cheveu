import './hairdresseraccount.css';
import {HairdresseraccountController as controller} from './hairdresseraccount.controller';
import template from './hairdresseraccount.html';
import $ from 'jquery';
export const hairdresseraccountDirective = ()=> {
	 return{
	 	 template,
		 controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope:{},
		 link: function(scope, elt, atts){
                $(document).ready(function(){              
                     function initializeAutocomplete(id) {
						var element = document.getElementById(id);						
						if (element) {
							var autocomplete = new google.maps.places.Autocomplete(element, { types: ['geocode'] });
                                google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);
                            }
                        }
                        function onPlaceChanged() { 
                                var place = this.getPlace();
                                scope.formatted_address = place.formatted_address;
								scope.address_components= place.address_components;
								scope.longitude = place.geometry.location.lng();
								scope.latitude = place.geometry.location.lat();	
                        }                      
                     initializeAutocomplete('user_input_autocomplete_address3');                 
                });
	    },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
