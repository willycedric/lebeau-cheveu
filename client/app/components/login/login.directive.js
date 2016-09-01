import './login.css';
import {LoginController as controller} from './login.controller';
import template from './login.html';
import $ from 'jquery';

export const loginDirective = ()=> {
	 return {
    template,
    controller,
    controllerAs:'vm',
    restrict: 'E',
    scope: {},
    link: function(scope, elt, atts, ngModel){
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
    },
    replace: true,
    data: { transition: 'slide-in'}
  };
};
