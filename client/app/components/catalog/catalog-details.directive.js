
//import {CatalogDetailCtrl as controller} from './catalog-details.controller';
import template from './details.tpl.html';
import './details.scss';
import {detailCtrl as controller} from './details.controller';
import $ from 'jquery';

export const catalogDetailsDirective = ()=> {
	 return{
	 	template,
		 controller,
		 controllerAs:'vm',
	 	restrict:'E',
	 	scope: {
	 		images:'=contents',
	 		name:'@name',
	 	},
	    link: function(scope, elt, atts){
	    		var slideIndex = 0;
                $(elt).on('click', '.img-gallery', function(){
                	var n = $(this).closest('.img-gallery').index('.img-gallery');
                	openModal();
                	showSlides(slideIndex = n);
                });

                $(elt).on('click', '.close', function(){
                	closeModal();
                });

                $(elt).on('click', '.prev',function(){
                	plusSlides(-1);
                });

                $(elt).on('click','.next', function(){
                	plusSlides(1);
                });

                $(elt).on('click', '.demo', function(){
                	var n = $(this).closest('.demo').index('.demo');                	
                	currentSlide(n);
                });
                
                function openModal() {
				  document.getElementById('myModal').style.display = "block";
				}

				function closeModal() {
				  document.getElementById('myModal').style.display = "none";
				}

				
				//showSlides(slideIndex);

				function plusSlides(n) {
				  showSlides(slideIndex += n);
				}

				function currentSlide(n) {
				  showSlides(slideIndex = n);
				}

				function showSlides(n) {
				  var i;
				  var slides = document.getElementsByClassName("mySlides");
				  var dots = document.getElementsByClassName("demo");
				  var captionText = document.getElementById("caption");				  
				  if (n >= slides.length) {slideIndex = 0}
				  if (n < 0) {slideIndex = slides.length-1}
				  for (i = 0; i < slides.length; i++) {
				      slides[i].style.display = "none";
				  }
				  for (i = 0; i < dots.length; i++) {
				      dots[i].className = dots[i].className.replace(" active", "");
				  }				  
				  slides[slideIndex].style.display = "block";
				  dots[slideIndex].className += " active";
				  var slideDetail = (slideIndex+1).toString()+"/"+(slides.length).toString();
				  //captionText.innerHTML ="<span class='numbertext'>"+slideDetail+"</pan>"+"     "+dots[slideIndex].alt;
				  
				}

				// Handle keyboard shortcuts
          $(document).keydown(function(e) {
            switch (e.which) {
              case 37: // Left arrow
                plusSlides(-1);
                break;
              case 39: // Right arow
                plusSlides(1);
                break
              case 27: // Escape
                closeModal();
                break;
            }
          });
          return false;
	    },
	 	replace:true
	 };
};



