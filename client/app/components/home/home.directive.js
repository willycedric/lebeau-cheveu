import './home.css';
import {HomeController as controller} from './home.controller';
import template from './home.html';
import $ from 'jquery';

export const homeDirective = ()=> {
	 return{
	 	template,
	 	controller,
	 	controllerAs:'vm',
	 	restrict:'E',
	 	scope: {},
	    link: function(scope, elt, atts){
                $(document).ready(function(){  
                  $(".lebeaucheveu-logo").css('left','0');
                  $(".lebeaucheveu-logo").css('margin-top','0');       
                    var scroll_start = 0;
                    var startchange = $(elt).find('#home-start-change');
                    var offset = startchange.offset();
                    console.log('home directive ', offset);
                     if (startchange.length){
                    $(document).scroll(function() { 
                       scroll_start = $(this).scrollTop();
                       if(scroll_start > 40) {
                           //$(".navbar-default").css('background-color', '#f0f0f0');
                           $('.navbar-default').addClass('transparent');
                        } else {
                           //$('.navbar-default').css('background-color', 'transparent');
                           $('.navbar-default').removeClass('transparent');
                        }
                    
                    });
                   }

                     function initializeAutocomplete(id) {
						var element = document.getElementById(id);
						if (element) {
							var autocomplete = new google.maps.places.Autocomplete(element, { types: ['geocode'] });
                                google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);
                            }
                        }
                        function onPlaceChanged() {
                                var place = this.getPlace();
                                scope.data ={};
                                scope.data.formatted_address = place.formatted_address;
                                scope.data.address_components= place.address_components;
								scope.data.longitude = place.geometry.location.lng();
								scope.data.latitude = place.geometry.location.lat();	
                        }
                     initializeAutocomplete('user_input_autocomplete_address');
                 
                });

	    },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
