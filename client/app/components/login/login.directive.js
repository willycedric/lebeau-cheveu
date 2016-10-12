import './login.css';
import {LoginController as controller} from './login.controller';
import template from './login.html';
import $ from 'jquery';

export const loginDirective = ($uibModal)=> {
	 return {
    template:template,
    controller,
    controllerAs:'vm',
    restrict: 'E',
    scope: {},
    link: function(scope, elt, atts, ngModel){
        //scope.instance = atts.instance;
        atts.$observe('instance', function(value){
          console.log('Instance ', value);
        });
        //Login and Register form 
    	$(elt).find('#login-form-link').click(function(evt){
    		evt.preventDefault();
    		$(elt).find("#login-form").delay(100).fadeIn(100);
    		$(elt).find("#register-form").fadeOut(100);
    		$(elt).find("#register-form-link").removeClass('active');
    		$(this).addClass('active');
    	});

    	$(elt).find('#register-form-link').click(function(evt){
    		evt.preventDefault();
    		$(elt).find("#register-form").delay(100).fadeIn(100);
    		$(elt).find("#login-form").fadeOut(100);
    		$(elt).find("#login-form-link").removeClass('active');
    		$(this).addClass('active');
    	});

        $(elt).find('.form').find('input, textarea').on('keyup blur focus', function (e) {  
              var $this = $(this),
                  label = $this.prev('label');
                  if (e.type === 'keyup') {
                        if ($this.val() === '') {
                      label.removeClass('active highlight');
                    } else {
                      label.addClass('active highlight');
                    }
                } else if (e.type === 'blur') {
                    if( $this.val() === '' ) {
                        label.removeClass('active highlight'); 
                        } else {
                        label.removeClass('highlight');   
                        }   
                } else if (e.type === 'focus') {                  
                  if( $this.val() === '' ) {
                        label.removeClass('highlight'); 
                        } 
                  else if( $this.val() !== '' ) {
                        label.addClass('highlight');
                        }
                }
        });

        $(elt).find('.tab a').on('click', function (e) {          
          e.preventDefault();          
          $(this).parent().addClass('active');
          $(this).parent().siblings().removeClass('active');
          
          var target = $(this).attr('href');

          $('.tab-content > div').not(target).hide();
          
          $(target).fadeIn(600);
          
        });

        $(elt).find('.login').on('click', function(evt){
            evt.preventDefault();
            console.log('clicked on the button');
            $uibModalInstance.close('dismiss');
        })



    },
    replace: true,
    data: { transition: 'slide-in'}
  };
};
