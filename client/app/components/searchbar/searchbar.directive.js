import './searchbar.css';
import {SearchbarController as controller} from './searchbar.controller';
import template from './searchbar.html';

export const searchbarDirective = ()=> {
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
                                var place = this.getPlace()								
                                scope.formatted_address = place.formatted_address;
                                //console.log(place);  // Uncomment this line to view the full object returned by Google API.
                                for (var i in place.address_components) {
                                    var component = place.address_components[i];
                                    for (var j in component.types) {  // Some types are ["country", "political"]
                                    var type_element = document.getElementById(component.types[j]);
                                    if (type_element) {
                                        type_element.value = component.long_name;
                                    }
                                    }
                                }
                        }

                        // google.maps.event.addDomListener(window, 'load', function() {
                        // initializeAutocomplete('user_input_autocomplete_address');
                        // });
                     initializeAutocomplete('user_input_autocomplete_address');
                 
                });

	    },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
