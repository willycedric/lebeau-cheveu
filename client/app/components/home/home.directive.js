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
	    	//console.log("value entered: ",$(elt).find('.location').val());
	    	var secondStepDelay=3000;
	    	var thirdStepDelay=6000;
                //$(elt).find(".carousel").carousel();
                console.log($(elt).find(".carousel").pang());
	    	//first step
	    	$(elt).find(".how-work").on('click', function(evt){
	    		$(this).addClass('hide');
	    		$(elt).find("#how-it-work").addClass('show');
	    		evt.preventDefault();
	    		//first step
	    		firstStep();
	    		//second step
	    		setTimeout(secondStep, secondStepDelay);
	    		//thrid step
	    		setTimeout(thirdStep, thirdStepDelay);
	    	});

	    	/**
	    	 * first step of the "How it work" animation trigered after a click on the "Button How it Work"
	    	 * @return {[type]} [description]
	    	 */
	    	var firstStep = () =>{
	    		$(elt).find('#first-step .step-details').addClass('toggle-opacity');
	    		$(elt).find('#first-step .step-details').addClass('anim1');
	    		$(elt).find("#first-step .step-badge").addClass('anim2');
	    		$(elt).find("#first-step .txt").addClass('show');
	    	};
	    	/**
	    	 * second step trigered after 2s to display the second step of the "How it work" component displayed
	    	 * on the home. It's trigered two seconds after a click on the firt step.
	    	 * @return {[type]} [description]
	    	 */
	    	var secondStep = () =>{
	    		$(elt).find('#second-step .step-details').addClass('toggle-opacity');
	    		$(elt).find('#second-step .step-details').addClass('anim1');
	    		$(elt).find("#second-step .step-badge").addClass('show anim2');
	    		$(elt).find("#second-step .txt").addClass('show');
	    	};

	    	/**
	    	 * third step trigered after 2s to display the second step of the "How it work" component displayed
	    	 * on the home. It's trigered four seconds after a click on the first step.
	    	 * @return {[type]} [description]
	    	 */
	    	var thirdStep = () =>{
	    		$(elt).find('#third-step .step-details').addClass('toggle-opacity');
	    		$(elt).find('#third-step .step-details').addClass('anim1');
	    		$(elt).find("#third-step .step-badge").addClass('show anim2');
	    		$(elt).find("#third-step .txt").addClass('show');
	    	};

	    },
	 	replace:true,
	 	data: { transition: 'slide-in'}
	 };
};
